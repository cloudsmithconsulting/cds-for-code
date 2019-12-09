import * as Security from "./Types";
import * as adal from "adal-node";
import * as ErrorParser from '../ErrorParser';
import { Utilities } from "../Utilities";
import GlobalStateCredentialStore from "./GlobalStateCredentialStore";
import Quickly from "../Quickly";

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

export default async function authenticate(connectionId: string, credential:Security.ICredential, resource?:string): Promise<AuthenticationResult> {
    if (Security.Credential.isCdsOnlineUserCredential(credential)) {
        return await performCdsOnlineAuthenticate(connectionId, <Security.CdsOnlineCredential>credential, resource);
    } else if (Security.Credential.isAzureAdClientCredential(credential)) {
        return await performAzureAdClientAuthenticate(connectionId, <Security.AzureAdClientCredential>credential);
    } else if (Security.Credential.isAzureAdUserCredential(credential)) {
        return await performAzureAdUserAuthenticate(connectionId, <Security.AzureAdUserCredential>credential);
    } else if (Security.Credential.isWindowsCredential(credential)) {
        return await performWindowsAuthenticate(connectionId, <Security.WindowsCredential>credential);
    } else if (Security.Credential.isOauthCredential(credential)) {
        return await performOAuthAuthenticate(connectionId, <Security.OAuthCredential>credential);
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
    const authorityUri = `${Utilities.String.noTrailingSlash(credential.authority)}/${credential.tenant}`;
    const decrypted = credential.isSecure ? decryptCredential(credential, connectionId) : credential;
    const context = new adal.AuthenticationContext(authorityUri, false);

    return new Promise<AuthenticationResult>((resolve, reject) => {
        context.acquireTokenWithUsernamePassword(
            resource || decrypted.resource.toString(), 
            decrypted.username.toString(), 
            decrypted.password.toString(), 
            decrypted.clientId.toString(),
            (error, response) => {
                if (error) {
                    const exception = ErrorParser.parseAdalError(error);
                    if (exception.type === 'interaction_required') {
                        Quickly.inform("Your credentials use multi-factor authentication.  You will need to authenticate interactively.");
                    } else {
                        reject(exception);    
                        resolve({ success: false, error: exception });
                    }
                } else {
                    resolve({ success: true, response });
                }
        });
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