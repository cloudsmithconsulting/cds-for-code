import Utilities from "../core/Utilities";
import RequestUtilities from "./RequestUtilities";

export default class ResponseUtilities
{
    private static dateReviver(key:string, value:string) {
        ///<summary>
        /// Private function to convert matching string values to Date objects.
        ///</summary>
        ///<param name="key" type="String">
        /// The key used to identify the object property
        ///</param>
        ///<param name="value" type="String">
        /// The string value representing a date
        ///</param>
        let a;

        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(value);
            
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }

        return value;
    }

    public static getFormattedKeyValue(keyName:string, value:any):any {
        let newKey = null;

        if (keyName.indexOf('@') !== -1) {
            const format = keyName.split('@');
            const format0 = format.length > 0 ? format[0] : null;
            const format1 = format.length > 1 ? format[1] : null;

            try
            {
                switch (format1) {
                    case 'odata.context':
                        newKey = 'oDataContext';
                        
                        break;
                    case 'odata.count':
                        newKey = 'oDataCount';
                        value = value !== null ? parseInt(value) : 0;

                        break;
                    case 'odata.nextLink':
                        newKey = 'oDataNextLink';
                        
                        break;
                    case 'OData.Community.Display.V1.FormattedValue':
                        newKey = format0 + '_Formatted';
                        
                        break;
                    case 'Microsoft.Dynamics.CRM.associatednavigationproperty':
                        newKey = format0 + '_NavigationProperty';
                        
                        break;
                    case 'Microsoft.Dynamics.CRM.lookuplogicalname':
                        newKey = format0 + '_LogicalName';

                        break;
                }
            }
            catch (error)
            {
                console.error(error);
                throw error;
            }
        }
    
        return [newKey, value];
    }
    
    /**
     *
     * @param {any} object - parsed JSON object
     * @param {any} parseParams - parameters for parsing the response
     * @returns {any} parsed batch response
     */
    public static parseData(object:any, parseParams?:any) {
        if (parseParams) {
            if (parseParams.isRef && object["@odata.id"] !== null) {
                return Utilities.ConvertToReferenceObject(object);
            }
    
            if (parseParams.toCount) {
                return this.getFormattedKeyValue('@odata.count', object['@odata.count'])[1] || 0;
            }
        }
    
        const keys = Object.keys(object);
    
        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];
    
            if (object[currentKey] !== null && object[currentKey].constructor === Array) {
                for (let j = 0; j < object[currentKey].length; j++) {
                    object[currentKey][j] = this.parseData(object[currentKey][j]);
                }
            }
    
            //parse formatted values
            let formattedKeyValue = this.getFormattedKeyValue(currentKey, object[currentKey]);

            if (formattedKeyValue[0]) {
                object[formattedKeyValue[0]] = formattedKeyValue[1];
            }
    
            //parse aliased values
            if (currentKey.indexOf('_x002e_') !== -1) {
                const aliasKeys = currentKey.split('_x002e_');
    
                if (!object.hasOwnProperty(aliasKeys[0])) {
                    object[aliasKeys[0]] = { _dwaType: 'alias' };
                }
                //throw an error if there is already a property which is not an 'alias'
                else if (
                    typeof object[aliasKeys[0]] !== 'object' ||
                    typeof object[aliasKeys[0]] === 'object' && !object[aliasKeys[0]].hasOwnProperty('_dwaType')) {
                    throw new Error('The alias name of the linked entity must be unique!');
                }
    
                object[aliasKeys[0]][aliasKeys[1]] = object[currentKey];
    
                //aliases also contain formatted values
                formattedKeyValue = this.getFormattedKeyValue(aliasKeys[1], object[currentKey]);

                if (formattedKeyValue[0]) {
                    object[aliasKeys[0]][formattedKeyValue[0]] = formattedKeyValue[1];
                }
            }
        }
    
        if (parseParams) {
            if (parseParams.hasOwnProperty('pageNumber') && object['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'] !== null) {
                object.PagingInfo = RequestUtilities.getFetchXmlPagingCookie(object['@Microsoft.Dynamics.CRM.fetchxmlpagingcookie'], parseParams.pageNumber);
            }
        }
    
        return object;
    }
    
    //partially taken from https://github.com/emiltholin/google-api-batch-utils
    /**
     * @param {string} response - response that needs to be parsed
     * @param {Array} parseParams - parameters for parsing the response
     * @param {Number} [requestNumber] - number of the request
     * @returns {any} parsed batch response
     */
    public static parseBatchResponse(response:string, parseParams?:any[], requestNumber:number = 0): any {
        // Not the same delimiter in the response as we specify ourselves in the request,
        // so we have to extract it.
        const delimiter = response.substr(0, response.indexOf('\r\n'));
        const batchResponseParts = response.split(delimiter);
        // The first part will always be an empty string. Just remove it.
        batchResponseParts.shift();
        // The last part will be the "--". Just remove it.
        batchResponseParts.pop();
    
        requestNumber = requestNumber || 0;
    
        let result = [];

        for (let i = 0; i < batchResponseParts.length; i++) {
            let batchResponse = batchResponseParts[i];

            if (batchResponse.indexOf('--changesetresponse_') > -1) {
                batchResponse = batchResponse.trim();
                const batchToProcess = batchResponse.substring(batchResponse.indexOf('\r\n') + 1).trim();
    
                result = result.concat(ResponseUtilities.parseBatchResponse(batchToProcess, parseParams, requestNumber));
            }
            else {
                const responseData = batchResponse.substring(batchResponse.indexOf("{"), batchResponse.lastIndexOf("}") + 1);
    
                if (!responseData) {
                    if (/Content-Type: text\/plain/i.test(batchResponse)) {
                        const plainContentReg = /\w+$/gi.exec(batchResponse.trim());
                        const plainContent = plainContentReg && plainContentReg.length ? plainContentReg[0] : undefined;
    
                        //check if a plain content is a number or not
                        result.push(isNaN(<any>plainContent) ? plainContent : parseInt(plainContent));
                    }
                    else
                        if (parseParams.length && parseParams[requestNumber] && parseParams[requestNumber].hasOwnProperty('valueIfEmpty')) {
                            result.push(parseParams[requestNumber].valueIfEmpty);
                        }
                        else {
                            const entityUrl = /OData-EntityId.+/i.exec(batchResponse);
    
                            if (entityUrl && entityUrl.length) {
                                result.push(/([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl[0])[1]);
                            }
                            else {
                                result.push(undefined);
                            }
                        }
                }
                else {
                    result.push(ResponseUtilities.parseData(JSON.parse(responseData, ResponseUtilities.dateReviver), parseParams[requestNumber]));
                }
            }
    
            requestNumber++;
        }
    
        return result;
    }
    
    /**
     *
     * @param {string} response - response that needs to be parsed
     * @param {Array} responseHeaders - response headers
     * @param {Array} parseParams - parameters for parsing the response
     * @returns {any} parsed response
     */
    public static parseResponse(response, responseHeaders, parseParams) {
        var parseResult = undefined;
        if (response.length) {
            if (response.indexOf('--batchresponse_') > -1) {
                var batch = ResponseUtilities.parseBatchResponse(response, parseParams);
    
                parseResult = parseParams.length === 1 && parseParams[0].convertedToBatch
                    ? batch[0]
                    : batch;
            }
            else {
                parseResult = ResponseUtilities.parseData(JSON.parse(response, ResponseUtilities.dateReviver), parseParams[0]);
            }
        }
        else {
            if (parseParams.length && parseParams[0].hasOwnProperty('valueIfEmpty')) {
                parseResult = parseParams[0].valueIfEmpty;
            }
            else
                if (responseHeaders['OData-EntityId'] || responseHeaders['odata-entityid']) {
                    var entityUrl = responseHeaders['OData-EntityId']
                        ? responseHeaders['OData-EntityId']
                        : responseHeaders['odata-entityid'];
    
                    var guidResult = /([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})\)$/i.exec(entityUrl);
    
                    if (guidResult) {
                        parseResult = guidResult[1];
                    }
                }
        }
    
        return parseResult;
    }    
}
