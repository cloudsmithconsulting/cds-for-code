import * as Security from "./Types";
import * as adal from "adal-node";
import * as ErrorParser from '../ErrorParser';
import { Utilities } from "../Utilities";
import GlobalStateCredentialStore from "./GlobalStateCredentialStore";
import Quickly from "../Quickly";
import TokenCache, { TokenType } from "./TokenCache";

export type AuthenticationResult = {
    success: boolean,
    response?: any,
    isMFA?: boolean,
    error?: AuthenticationError
};

export class AuthenticationError extends Error {
    type: string;
    httpStatus?: number;
    httpResponse?: any;
}

export default async function authenticate(key: string, credential:Security.ICredential, resource?:string): Promise<AuthenticationResult> {
    if (Security.Credential.isCdsOnlineUserCredential(credential)) {
        return await performCdsOnlineAuthenticate(key, <Security.CdsOnlineCredential>credential, resource);
    } else if (Security.Credential.isAzureAdClientCredential(credential)) {
        return await performAzureAdClientAuthenticate(key, <Security.AzureAdClientCredential>credential);
    } else if (Security.Credential.isAzureAdUserCredential(credential)) {
        return await performAzureAdUserAuthenticate(key, <Security.AzureAdUserCredential>credential);
    } else if (Security.Credential.isWindowsCredential(credential)) {
        return await performWindowsAuthenticate(key, <Security.WindowsCredential>credential);
    } else if (Security.Credential.isOauthCredential(credential)) {
        return await performOAuthAuthenticate(key, <Security.OAuthCredential>credential);
    }

    const error = new AuthenticationError("There is no authentication provide configured that can perform authentication against the supplied credentials.");
    error.type = 'no_provider_found';

    return { success: false, error };
}

function decryptCredential<T extends Security.ICredential>(credential:T, storeKey:string, store?:Security.CredentialStore): T {
    store = store || GlobalStateCredentialStore.Instance;

    return store.decrypt<T>(storeKey, credential, Security.SecureOutput.String);
}

async function performCdsOnlineAuthenticate(connectionId: string, credential:Security.CdsOnlineCredential, resource?: string): Promise<AuthenticationResult> {
    const decrypted = credential.isSecure ? decryptCredential(credential, connectionId) : credential;
    const authority = decrypted.authority || Security.CdsOnlineCredential.defaultAuthority;
    const tenant = decrypted.tenant || Security.CdsOnlineCredential.defaultTenant;
    const clientId = decrypted.clientId || Security.CdsOnlineCredential.defaultClientId;

    const authorityUri = `${Utilities.String.noTrailingSlash(authority)}/${tenant}`;
    const context = new adal.AuthenticationContext(authorityUri, false);

    resource = resource || decrypted.resource.toString();

    return await new Promise<AuthenticationResult>((resolve, reject) => {
        const callback = (error, response) => { 
            if (error) {
                const exception = ErrorParser.parseAdalError(error);

                if (exception.type === 'interaction_required') {
                    Quickly.inform("Your credentials use multi-factor authentication.  You will need to authenticate interactively.");
                } else {
                    reject(exception);    
                    resolve({ success: false, error: exception });
                }
            } else {
                const result = { success: true, response };

                if (decrypted.onAuthenticate) {
                    decrypted.onAuthenticate(result);
                } else {
                    decrypted.accessToken = result.response.accessToken;
                    decrypted.refreshToken = result.response.refreshToken;
                }

                TokenCache.Instance.addToken(TokenType.AccessToken, resource, result.response.accessToken);
                TokenCache.Instance.addToken(TokenType.RefreshToken, resource, result.response.refreshToken);

                resolve(result);
            }
        };

        let refreshToken = decrypted.refreshToken ? decrypted.refreshToken.toString() : undefined;
        refreshToken = refreshToken || TokenCache.Instance.getToken(TokenType.RefreshToken, resource);

        if (refreshToken) {
            // If this errors, re-attempt this with username/password, as our refresh token has expired.
            context.acquireTokenWithRefreshToken(
                refreshToken, 
                clientId, 
                resource, 
                callback);
        } else {
            context.acquireTokenWithUsernamePassword(
                resource, 
                decrypted.username.toString(), 
                decrypted.password.toString(), 
                clientId,
                callback);
        }


    });
}

async function performAzureAdClientAuthenticate(connectionId: string, credential:Security.AzureAdClientCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true };
}

async function performAzureAdUserAuthenticate(connectionId: string, credential:Security.AzureAdUserCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true };
}

async function performWindowsAuthenticate(connectionId: string, credential:Security.WindowsCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true };
}

async function performOAuthAuthenticate(connectionId: string, credential:Security.OAuthCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true };
}