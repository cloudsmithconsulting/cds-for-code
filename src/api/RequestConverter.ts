import Utilities from "../helpers/Utilities";
import RequestUtilities from "./RequestUtilities";
import { DynamicsWebApi } from "./Types";

export default class RequestConverter {
    /**
     * Converts optional parameters of the request to URL. If expand parameter exists this function is called recursively.
     *
     * @param {Object} request - Request object
     * @param {string} url - URL beginning (with required parameters)
     * @param {string} [joinSymbol] - URL beginning (with required parameters)
     * @param {Object} [config] - DynamicsWebApi config
     * @returns {ConvertedRequestOptions} Additional options in request
     */
    public static convertRequestOptions(request: any, url: string, joinSymbol?: string, config?: any) {
        let headers = {};
        let requestArray = [];
        joinSymbol = Utilities.IsNull(joinSymbol) ? '&' : joinSymbol;

        if (request) {
            if (request.navigationProperty) {
                url += '/' + request.navigationProperty;

                if (request.navigationPropertyKey) {
                    var navigationKey = request.navigationPropertyKey;
                    url += '(' + navigationKey + ')';
                }

                if (request.navigationProperty === 'Attributes') {
                    if (request.metadataAttributeType) {
                        url += '/' + request.metadataAttributeType;
                    }
                }
            }

            if (request.select && request.select !== null && request.select.length) {
                if (request.select.length === 1 && request.select[0].endsWith('/$ref')) {
                    url += '/' + request.select[0];
                }
                else {
                    if (request.select[0].startsWith('/')) {
                        if (request.navigationProperty === null) {
                            url += request.select.shift();
                        }
                        else {
                            request.select.shift();
                        }
                    }

                    //check if anything left in the array
                    if (request.select.length) {
                        requestArray.push('$select=' + request.select.join(','));
                    }
                }
            }

            if (request.filter) {
                const removeBracketsFromGuidReg = /[^"']{([\w\d]{8}[-]?(?:[\w\d]{4}[-]?){3}[\w\d]{12})}(?:[^"']|$)/g;
                let filterResult = request.filter;
                let m, regex;

                //fix bug 2018-06-11
                while ((m = removeBracketsFromGuidReg.exec(filterResult)) !== null) {
                    if (m.index === removeBracketsFromGuidReg.lastIndex) {
                        regex.lastIndex++;
                    }

                    const replacement = m[0].endsWith(')') ? ')' : ' ';
                    filterResult = filterResult.replace(m[0], ' ' + m[1] + replacement);
                }

                requestArray.push("$filter=" + encodeURIComponent(filterResult));
            }

            if (request.savedQuery) {
                requestArray.push("savedQuery=" + request.savedQuery);
            }

            if (request.userQuery) {
                requestArray.push("userQuery=" + request.userQuery);
            }

            if (request.count) {
                requestArray.push("$count=" + request.count);
            }

            if (request.top && request.top > 0) {
                requestArray.push("$top=" + request.top);
            }

            if (request.orderBy && request.orderBy !== null && request.orderBy.length) {
                requestArray.push("$orderby=" + request.orderBy.join(','));
            }

            const prefer = RequestUtilities.buildPreferHeader(request, config);

            if (prefer.length) {
                headers['Prefer'] = prefer;
            }

            if (request.ifmatch && request.ifmatch !== null && request.ifnonematch && request.ifnonematch !== null) {
                throw new Error('Either one of request.ifmatch or request.ifnonematch parameters should be used in a call, not both.');
            }

            if (request.ifmatch) {
                headers['If-Match'] = request.ifmatch;
            }

            if (request.ifnonematch) {
                headers['If-None-Match'] = request.ifnonematch;
            }

            if (request.impersonate) {
                headers['MSCRMCallerID'] = request.impersonate;
            }

            if (request.token) {
                headers['Authorization'] = 'Bearer ' + request.token;
            }

            if (request.duplicateDetection) {
                headers['MSCRM.SuppressDuplicateDetection'] = 'false';
            }

            if (request.noCache) {
                headers['Cache-Control'] = 'no-cache';
            }

            if (request.mergeLabels) {
                headers['MSCRM.MergeLabels'] = 'true';
            }

            if (request.contentId) {
                if (!request.contentId.startsWith('$')) {
                    headers['Content-ID'] = request.contentId;
                }
            }

            if (request.expand && request.expand.length) {
                if (typeof request.expand === 'string') {
                    requestArray.push('$expand=' + request.expand);
                }
                else {
                    const expandRequestArray = [];

                    for (let i = 0; i < request.expand.length; i++) {
                        if (request.expand[i].property) {
                            const expandConverted = RequestConverter.convertRequestOptions(request.expand[i], null, ";");
                            let expandQuery = expandConverted.query;

                            if (expandQuery && expandQuery.length) {
                                expandQuery = "(" + expandQuery + ")";
                            }

                            expandRequestArray.push(request.expand[i].property + expandQuery);
                        }
                    }

                    if (expandRequestArray.length) {
                        requestArray.push("$expand=" + expandRequestArray.join(","));
                    }
                }
            }
        }

        return { url: url, query: requestArray.join(joinSymbol), headers: headers };
    }

    /**
     * Converts a request object to URL link
     *
     * @param {Object} request - Request object
     * @param {Object} [config] - DynamicsWebApi config
     * @returns {ConvertedRequest} Converted request
     */
    public static convertRequest(request:any, config:DynamicsWebApi.Config) {
        let baseUrl = `api/data/v${config.webApiVersion}/`;
        let url = '';
        let result;

        if (!request.url) {
            if (request.collection) {
                url = request.collection;

                if (request.contentId) {
                    if (request.contentId.startsWith('$')) {
                        url = request.contentId + '/' + url;
                    }
                }

                //add alternate key feature
                if (request.key) {
                    request.key = request.key;
                }
                else if (request.id) {
                    request.key = request.id;
                }

                if (request.key) {
                    url += "(" + request.key + ")";
                }
            }

            url = baseUrl + url;

            if (request._additionalUrl) {
                if (url) {
                    url += '/';
                }

                url += request._additionalUrl;
            }

            result = RequestConverter.convertRequestOptions(request, url, '&', config);

            if (request.fetchXml) {
                result.url += "?fetchXml=" + encodeURIComponent(request.fetchXml);
            }
            else {
                if (result.query) {
                    result.url += "?" + result.query;
                }
            }
        }
        else {
            url = request.url.replace(config.webApiUrl, '');
            result = RequestConverter.convertRequestOptions(request, url, '&', config);
        }

        if (request.hasOwnProperty('async') && request.async !== null) {
            result.async = request.async;
        }
        else {
            result.async = true;
        }

        return { url: result.url, headers: result.headers, async: result.async };
    }
}
