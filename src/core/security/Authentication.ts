import * as Security from "./Types";
import * as adal from "adal-node";
import * as crypto from 'crypto';
import * as opn from 'opn';
import * as ErrorParser from '../ErrorParser';
import * as cs from '../../cs';
import { Utilities } from "../Utilities";
import GlobalStateCredentialStore from "./GlobalStateCredentialStore";
import Quickly from "../Quickly";
import * as express from 'express';
import { Server } from "http";
import logger from "../Logger";
import Telemetry from "../Telemetry";

export type AuthenticationResult = {
    success: boolean,
    response?: any,
    isMFA?: boolean,
    error?: AuthenticationError,
    credentials?: Security.ICredential
};

export class AuthenticationError extends Error {
    type: string;
    httpStatus?: number;
    httpResponse?: any;
}

export default async function authenticate(key: string, credential: Security.ICredential, resource?: string, options?: any): Promise<AuthenticationResult> {
    if (Security.Credential.isCdsOnlineUserCredential(credential)) {
        return await performCdsOnlineAuthenticate(key, <Security.CdsOnlineCredential>credential, resource, options);
    } else if (Security.Credential.isAzureAdClientCredential(credential)) {
        return await performAzureAdClientAuthenticate(key, <Security.AzureAdClientCredential>credential, resource, options);
    } else if (Security.Credential.isAzureAdUserCredential(credential)) {
        return await performAzureAdUserAuthenticate(key, <Security.AzureAdUserCredential>credential, resource, options);
    } else if (Security.Credential.isWindowsCredential(credential)) {
        return await performWindowsAuthenticate(key, <Security.WindowsCredential>credential);
    } else if (Security.Credential.isOauthCredential(credential)) {
        return await performOAuthAuthenticate(key, <Security.OAuthCredential>credential, resource, options);
    }

    const error = new AuthenticationError("There is no authentication provide configured that can perform authentication against the supplied credentials.");
    error.type = 'no_provider_found';

    return { success: false, error };
}

function decryptCredential<T extends Security.ICredential>(credential: T, storeKey: string, store?: Security.CredentialStore): T {
    store = store || GlobalStateCredentialStore.Instance;

    return store.decrypt<T>(storeKey, credential, Security.SecureOutput.String);
}

function encryptCredential<T extends Security.ICredential>(credential: T, storeKey: string, keepDecrypted?: string[], store?: Security.CredentialStore): string {
    store = store || GlobalStateCredentialStore.Instance;

    return store.store(credential, storeKey, keepDecrypted);
}

async function performCdsOnlineAuthenticate(connectionId: string, credential: Security.CdsOnlineCredential, resource?: string, options?: any): Promise<AuthenticationResult> {
    const decrypted = credential.isSecure || Security.SecureItem.isSecure(credential.password) ? decryptCredential(credential, connectionId) : credential;
    const authority = decrypted.authority || Security.CdsOnlineCredential.defaultAuthority;
    const tenant = decrypted.tenant || Security.CdsOnlineCredential.defaultTenant;
    const clientId = decrypted.clientId.toString() || Security.CdsOnlineCredential.defaultClientId;

    const authorityUri = `${Utilities.String.noTrailingSlash(authority)}/${tenant}`;
    const context = new adal.AuthenticationContext(authorityUri, false);

    if (options) { context.options = options; }

    resource = resource || decrypted.resource.toString();

    return await performAdalAuthentication(authority, tenant, clientId, undefined, resource, context, credential, decrypted);
}

async function performAzureAdClientAuthenticate(connectionId: string, credential: Security.AzureAdClientCredential, resource?: string, options?: any): Promise<AuthenticationResult> {
    const decrypted = credential.isSecure || Security.SecureItem.isSecure(credential.password) ? decryptCredential(credential, connectionId) : credential;
    const authority = decrypted.authority || Security.CdsOnlineCredential.defaultAuthority;
    const clientId = decrypted.clientId.toString();
    const clientSecret = decrypted.clientSecret.toString();    
    const context = new adal.AuthenticationContext(authority, false);

    if (options) { context.options = options; }

    resource = resource || decrypted.resource.toString();

    return await performAdalAuthentication(authority, undefined, clientId, clientSecret, resource, context, credential, decrypted);
}

async function performAzureAdUserAuthenticate(connectionId: string, credential: Security.AzureAdUserCredential, resource?: string, options?: any): Promise<AuthenticationResult> {
    const decrypted = credential.isSecure || Security.SecureItem.isSecure(credential.password) ? decryptCredential(credential, connectionId) : credential;
    const authority = decrypted.authority || Security.CdsOnlineCredential.defaultAuthority;
    const clientId = decrypted.clientId.toString();
    const clientSecret = decrypted.clientSecret.toString();    
    const context = new adal.AuthenticationContext(authority, false);

    if (options) { context.options = options; }

    resource = resource || decrypted.resource.toString();

    return await performAdalAuthentication(authority, undefined, clientId, clientSecret, resource, context, credential, decrypted);
}

async function performWindowsAuthenticate(connectionId: string, credential: Security.WindowsCredential): Promise<AuthenticationResult> {
    let message: string;

    return { success: true };
}

async function performOAuthAuthenticate(connectionId: string, credential: Security.OAuthCredential, resource?: string, options?: any): Promise<AuthenticationResult> {
    const decrypted = credential.isSecure || Security.SecureItem.isSecure(credential.refreshToken) ? decryptCredential(credential, connectionId) : credential;
    const authority = Security.CdsOnlineCredential.defaultAuthority;
    const clientId = Security.CdsOnlineCredential.defaultClientId;
    const tenant = Security.CdsOnlineCredential.defaultTenant;
    const context = new adal.AuthenticationContext(authority, false);

    if (options) { context.options = options; }

    resource = resource || Security.CdsOnlineCredential.defaultResource;

    return await performAdalAuthentication(authority, tenant, clientId, undefined, resource, context, credential, decrypted);
}

async function performAdalAuthentication(authority: string, tenant: string, clientId: string, clientSecret: string, resource: string, context: adal.AuthenticationContext, credential: Security.OAuthCredential, decrypted: Security.OAuthCredential): Promise<AuthenticationResult> {
    return await new Promise<AuthenticationResult>((resolve, reject) => {
        const callback = async (error, response) => {
            if (error) {
                const exception = ErrorParser.parseAdalError(error);

                if (exception.type === 'interaction_required') {
                    logger.log(`Auth: Multi-factor authentication (MFA) required, starting browser request`);

                    Quickly.inform("Your credentials use multi-factor authentication.  You will need to authenticate interactively.");

                    if (decrypted.onInteractiveLogin) {
                        decrypted.onInteractiveLogin({ success: false, error: exception });
                    }
                    
                    authority = (<any>decrypted).authority || authority;
                    tenant = (<any>decrypted).tenant || tenant;
                    clientId = (<any>decrypted).clientId.toString() || clientId;
                
                    const port = 3999;
                    const redirectUri = `http://localhost:${port}/getAToken`;
                    let extraQueryStringParams: string = "";

                    if (decrypted.username.toString().indexOf("@") > -1) {
                        extraQueryStringParams = "&domain_hint=" + decrypted.username.toString().split("@")[1];
                    }

                    let mfaAuthUrl = `${Utilities.String.noTrailingSlash(authority)}${tenant ? '/' + Utilities.String.noTrailingSlash(tenant) : ""}`
                        + `/oauth2/authorize?response_type=code&client_id=${clientId}`
                        + `&redirect_uri=${redirectUri}`
                        + `&state=<state>&resource=${resource}`
                        + extraQueryStringParams;

                    if (clientSecret) {
                        mfaAuthUrl += `&client_secret=${clientSecret}`;
                    }

                    // create a state token
                    const generatedToken = await new Promise<string>((resolveToken, rejectToken) => {
                        crypto.randomBytes(48, function (ex, buf) {
                            if (ex) {
                                rejectToken(ex);
                            }

                            // generate our token
                            var token = buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
                            
                            resolveToken(token);
                        });
                    });

                    const app: express.Application = express();
                    let server: Server;
                    
                    app.get('/auth', (req, res) => {
                        res.cookie('authstate', generatedToken);

                        // make the auth
                        const authorizationUrl = mfaAuthUrl.replace(/<state>/, generatedToken);
                        
                        res.redirect(authorizationUrl);
                    });
                    
                    app.get('/getAToken', (req, res) => {
                        if (req.cookies && req.cookies.authstate !== req.query.state) {
                            res.send('error: state does not match');
                        }

                        logger.log(`Auth: Multi-factor authentication (MFA) completed and authorization code received`);

                        context.acquireTokenWithAuthorizationCode(req.query.code, redirectUri, resource, clientId, null, (err, response) => {
                            if (err) {
                                const innerException = ErrorParser.parseAdalError(err);

                                res.send(innerException.message);
                                
                                // shut down express stuff
                                app.removeAllListeners();
                                server.close();
                                // reject our promise here
                                reject(innerException);
                            }
                            else {
                                const result: AuthenticationResult = { success: true, response };

                                logger.log(`Auth: Auth code converted to token successfully`);

                                if (credential.onAuthenticate) {
                                    credential.onAuthenticate(result);
                                } else {
                                    credential.accessToken = (<adal.TokenResponse>result.response).accessToken;
                                    credential.refreshToken = (<adal.TokenResponse>result.response).refreshToken;
                                }

                                credential.isMultiFactorAuthentication = true;

                                result.credentials = credential;

                                res.send(`<html><head><title>Authentication complete</title></head><body><script>window.self.close();</script></body></html>`);
                                
                                if (credential.storeKey) {
                                    GlobalStateCredentialStore.Instance.store(credential, credential.storeKey, [ "accessToken", "isMultiFactorAuthentication", "resource" ]);
                                }

                                // shut down express stuff
                                app.removeAllListeners();
                                server.close();

                                // resolve our promise here
                                resolve(result);
                            }
                        });
                    });

                    server = app.listen(port, function () {
                        opn(`http://localhost:${port}/auth`);
                    });
                }
                else {
                    Telemetry.Instance.error(exception);
                    Telemetry.Instance.sendTelemetry(cs.cds.telemetryEvents.loginFailure, { 
                        authority, 
                        tenant, 
                        clientId, 
                        resource, 
                        username: decrypted.username.toString(), 
                        errorMessage: exception.message, 
                        errorType: exception.type, 
                        errorStatus: exception.httpStatus.toString() });
                    reject(exception);
                }
            }
            else {
                const result: AuthenticationResult = { success: true, response };

                logger.log(`Auth: Authentication successful`);

                if (credential.onAuthenticate) {
                    credential.onAuthenticate(result);
                } else {
                    credential.accessToken = result.response.accessToken;
                    credential.refreshToken = result.response.refreshToken;
                }
                
                credential.isMultiFactorAuthentication = false;

                result.credentials = credential;

                if (credential.storeKey) {
                    GlobalStateCredentialStore.Instance.store(credential, credential.storeKey, [ "accessToken", "isMultiFactorAuthentication", "resource" ]);
                }

                resolve(result);
            }
        };

        let refreshToken = decrypted.refreshToken ? decrypted.refreshToken.toString() : undefined;
        
        if (refreshToken) {
            logger.log(`Auth: Refresh token found, invoking call to acquire auth token`);
            // If this errors, re-attempt this with username/password, as our refresh token has expired.
            context.acquireTokenWithRefreshToken(refreshToken, clientId, resource, callback);
        } else {
            logger.log(`Auth: No refresh token found, invoking authentication with username/password`);

            context.acquireTokenWithUsernamePassword(resource, decrypted.username.toString(), decrypted.password.toString(), clientId, callback);
        }
    });
}