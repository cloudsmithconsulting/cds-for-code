import * as Security from "./Types";
import * as adal from "adal-node";
import { Utilities } from "../Utilities";
import GlobalStateCredentialStore from "./GlobalStateCredentialStore";

export type AuthenticationResult = {
    success: boolean,
    message: string
};

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

    return { success: false, message: "There is no authentication provide configured that can perform authentication against the supplied credentials." };
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
                    reject(error);    
                    resolve({ success: false, message: error && error.message ? error.message : ""});
                } else {
                    resolve({ success: true, message: response.toString() });
                }
        });
    });
}

async function performAzureAdClientAuthenticate(connectionId: string, credential:Security.AzureAdClientCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true, message };
}

async function performAzureAdUserAuthenticate(connectionId: string, credential:Security.AzureAdUserCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true, message };
}

async function performWindowsAuthenticate(connectionId: string, credential:Security.WindowsCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true, message };
}

async function performOAuthAuthenticate(connectionId: string, credential:Security.OAuthCredential): Promise<AuthenticationResult> {
    let message:string;

    return { success: true, message };
}