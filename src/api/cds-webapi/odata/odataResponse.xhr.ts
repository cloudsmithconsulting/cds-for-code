import parseResponse from './parseResponse';
import parseResponseHeaders from './parseResponseHeaders';
import * as Parameters from '../../../core/helpers/Parameters';

export default function oDataResponse(request: any, data: any, response: any, responseParams: any, successCallback: (response:any) => void, errorCallback: (error:any) => void) {
    if (request.readyState === 4) {
        switch (request.status) {
            case 200: // Success with content returned in response body.
            case 201: // Success with content returned in response body.
            case 204: // Success with no content returned in response body.
            case 304: {// Success with Not Modified
                const responseHeaders = parseResponseHeaders(request.getAllResponseHeaders());
                const responseData = parseResponse(request.responseText, responseHeaders, responseParams);
                response = {
                    data: responseData,
                    headers: responseHeaders,
                    status: request.status
                };

                successCallback(response);
                break;
            }
            default: // All other statuses are error cases.
                let error;

                try {
                    const errorParsed = parseResponse(request.responseText, parseResponseHeaders(request.getAllResponseHeaders()), responseParams);

                    if (Array.isArray(errorParsed)) {
                        errorCallback(errorParsed);

                        break;
                    }

                    error = errorParsed.error;
                } catch (e) {
                    if (request.response.length > 0) {
                        error = { message: request.response };
                    }
                    else {
                        error = { message: "Unexpected Error" };
                    }
                }

                errorCallback(Parameters.handleHttpError(error, {
                    status: request.status,
                    statusText: request.statusText
                }));

                break;
        }

        request = null;
        responseParams.length = 0;
    }
}