import { AuthenticationError } from "./security/Authentication";

export function parseAdalError(error: Error): AuthenticationError {
    const parts = error.message.split("{");
    const text = parts.length >= 1 ? parts.splice(0, 1)[0] : '';
    let object: any = {}; 
    
    if (parts.length >= 1) {
        try { 
            object = JSON.parse("{" + parts.join("{"));
        } catch (err) {}
    }

    const authError = new AuthenticationError(object.error_description || error.message);
    const status = text.match(/\d{3}/);

    authError.httpStatus = status && status.length > 0 ? Number.parseInt(status[0]) : -1;
    authError.httpResponse = object;
    authError.stack = error.stack;

    switch (text) {
        case "Server returned an unknown AccountType: undefined":
            authError.type = 'auth_failed';
            authError.message = "The credentials supplied were invalid and could not be authenticated.";

            break;
        default:
            authError.type = object && object.error ? object.error : "unknown";

            break;
    }
    
    return authError;
}