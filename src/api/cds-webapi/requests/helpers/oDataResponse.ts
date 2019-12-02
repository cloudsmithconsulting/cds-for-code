import parseResponse from './parseResponse';
import ErrorHelper from '../../helpers/ErrorHelper';

export default function oDataResponse(uri: string, data: any, response: any, responseParams: any, successCallback: (response:any) => void, errorCallback: (error:any) => void) {
    switch (response.statusCode) {
        case 200: // Success with content returned in response body.
        case 201: // Success with content returned in response body.
        case 204: // Success with no content returned in response body.
        case 304: {// Success with Not Modified
            successCallback({
                data: parseResponse(data, response.headers, responseParams),
                headers: response.headers,
                status: response.statusCode
            });

            break;
        }
        default: // All other statuses are error cases.
            let internalError;

            try {
                const errorParsed = parseResponse(data, response.headers, responseParams);

                if (Array.isArray(errorParsed)) {
                    errorCallback(errorParsed);
                    break;
                }

                internalError = errorParsed.hasOwnProperty('error') && errorParsed.error
                    ? errorParsed.error
                    : { message: errorParsed.Message };

            } catch (e) {
                if (data.length > 0) {
                    internalError = { message: data };
                }
                else {
                    internalError = { message: e.message || e };
                }
            }

            errorCallback(ErrorHelper.handleHttpError(internalError, { uri, status: response.statusCode, statusMessage: response.statusMessage }));

            break;
    }
}