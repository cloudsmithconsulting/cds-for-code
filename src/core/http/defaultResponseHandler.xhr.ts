import * as Parameters from '../helpers/Parameters';

export default function oDataResponse(request: any, data: any, response: any, responseParams: any, successCallback: (response:any) => void, errorCallback: (error:any) => void) {
    if (request.readyState === 4) {
        switch (request.status) {
            case 200: // Success with content returned in response body.
            case 201: // Success with content returned in response body.
            case 204: // Success with no content returned in response body.
            case 304: {// Success with Not Modified
                const responseHeaders = request.getAllResponseHeaders();
                const responseData = request.responseText;
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
                    const raw = request.responseText;
                    let json;
                    
                    try { json = JSON.parse(raw); } catch (error) { }

                    if (json) {
                        error = json.error || json.message || json.response || json;
                    } else {
                        error = raw;
                    }

                    errorCallback(Parameters.handleHttpError(error, {
                        status: request.status,
                        statusText: request.statusText
                    }));
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