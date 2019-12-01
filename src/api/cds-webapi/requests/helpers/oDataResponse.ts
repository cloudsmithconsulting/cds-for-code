import parseResponse from './parseResponse';
import ErrorHelper from '../../helpers/ErrorHelper';

export default function oDataResponse(rawData: any, response: any, responseParams: any, successCallback: any, errorCallback: any) {
    switch (response.statusCode) {
        case 200: // Success with content returned in response body.
        case 201: // Success with content returned in response body.
        case 204: // Success with no content returned in response body.
        case 304: {// Success with Not Modified
            successCallback({
                data: parseResponse(rawData, response.headers, responseParams),
                headers: response.headers,
                status: response.statusCode
            });

            break;
        }
        default: // All other statuses are error cases.
            let internalError;

            try {
                const errorParsed = parseResponse(rawData, response.headers, responseParams);

                if (Array.isArray(errorParsed)) {
                    errorCallback(errorParsed);
                    break;
                }

                internalError = errorParsed.hasOwnProperty('error') && errorParsed.error
                    ? errorParsed.error
                    : { message: errorParsed.Message };

            } catch (e) {
                if (rawData.length > 0) {
                    internalError = { message: rawData };
                }
                else {
                    internalError = { message: e.message || e };
                }
            }

            errorCallback(ErrorHelper.handleHttpError(internalError, { status: response.statusCode, statusMessage: response.statusMessage }));

            break;
    }
}