import * as Parameters from '../helpers/Parameters';

export default function handleResponse(request: any, data: any, response: any, responseParams: any, successCallback: (response:any) => void, errorCallback: (error:any) => void) {
    switch (response.statusCode) {
        case 200: // Success with content returned in response body.
        case 201: // Success with content returned in response body.
        case 204: // Success with no content returned in response body.
        case 304: {// Success with Not Modified
            successCallback({
                data: data,
                headers: response.headers,
                status: response.statusCode
            });

            break;
        }
        default: // All other statuses are error cases.
            let error;

            try {
                const raw = data;
                let json;
                
                try { json = JSON.parse(raw); } catch (error) { }

                if (json) {
                    error = json.error || json.message || json.response || json;
                } else {
                    error = raw;
                }

                errorCallback(Parameters.handleHttpError(error, { uri: request.toString(), status: response.statusCode, statusMessage: response.statusMessage }));
            }  catch (e) {
                if (data.length > 0) {
                    error = { message: data };
                }
                else {
                    error = { message: e.message || e };
                }
            }

            errorCallback(Parameters.handleHttpError(error, { uri: request.toString(), status: response.statusCode, statusMessage: response.statusMessage }));

            break;
    }
}