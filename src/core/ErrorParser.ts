import { AuthenticationError } from "./security/Authentication";

export function parseAdalError(error: Error): AuthenticationError {
    const parts = error.message.split("{");
    const text = parts.length > 1 ? parts.splice(0, 1)[0] : '';
    const object = parts.length >= 1  ? JSON.parse("{" + parts.join("{")) : {};
    const authError = new AuthenticationError(object.error_description || error.message);
    const status = text.match(/\d{3}/);

    authError.type = object && object.error ? object.error : "unknown";
    authError.httpStatus = status.length > 0 ? Number.parseInt(status[0]) : -1;
    authError.httpResponse = object;
    authError.stack = error.stack;
    
    return authError;
}