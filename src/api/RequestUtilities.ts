import Utilities from "../helpers/Utilities";

export default class RequestUtilities
{
    public static convertToBatch(requests:any[]):any {
        const batchBoundary = 'dwa_batch_' + Utilities.NewGuid();
    
        let batchBody = [];
        let currentChangeSet = null;
        let contentId = 100000;
    
        for (var i = 0; i < requests.length; i++) {
            const request = requests[i];
            const isGet = request.method === 'GET';
    
            if (isGet && currentChangeSet) {
                //end current change set
                batchBody.push('\n--' + currentChangeSet + '--');
    
                currentChangeSet = null;
                contentId = 100000;
            }
    
            if (!currentChangeSet) {
                batchBody.push('\n--' + batchBoundary);
    
                if (!isGet) {
                    currentChangeSet = 'changeset_' + Utilities.NewGuid();
                    batchBody.push('Content-Type: multipart/mixed;boundary=' + currentChangeSet);
                }
            }
    
            if (!isGet) {
                batchBody.push('\n--' + currentChangeSet);
            }
    
            batchBody.push('Content-Type: application/http');
            batchBody.push('Content-Transfer-Encoding: binary');
    
            if (!isGet) {
                const contentIdValue = request.headers.hasOwnProperty('Content-ID')
                    ? request.headers['Content-ID']
                    : ++contentId;
    
                batchBody.push('Content-ID: ' + contentIdValue);
            }
    
            if (!request.path.startsWith("$")) {
                batchBody.push('\n' + request.method + ' ' + request.config.webApiUrl + request.path + ' HTTP/1.1');
            }
            else {
                batchBody.push('\n' + request.method + ' ' + request.path + ' HTTP/1.1');
            }
    
            if (isGet) {
                batchBody.push('Accept: application/json');
            }
            else {
                batchBody.push('Content-Type: application/json');
            }
    
            for (let key in request.headers) {
                if (key === 'Authorization' || key === 'Content-ID') {
                    continue;
                }
    
                batchBody.push(key + ': ' + request.headers[key]);
            }
    
            if (!isGet && request.data && request.data.length) {
                batchBody.push('\n' + request.data);
            }
        }
    
        if (currentChangeSet) {
            batchBody.push('\n--' + currentChangeSet + '--');
        }
    
        batchBody.push('\n--' + batchBoundary + '--');
    
        return { boundary: batchBoundary, body: batchBody.join('\n') };
    }

    public static buildPreferHeader(request:any, config:any):string {
        let returnRepresentation = request.returnRepresentation;
        let includeAnnotations = request.includeAnnotations;
        let maxPageSize = request.maxPageSize;
    
        let prefer;
    
        if (request.prefer && request.prefer.length) {
            prefer = request.prefer;

            if (typeof prefer === "string") {
                prefer = prefer.split(',');
            }

            for (let i in prefer) {
                const item = prefer[i].trim();

                if (item === 'return=representation') {
                    returnRepresentation = true;
                }
                else if (item.startsWith("odata.include-annotations=")) {
                    includeAnnotations = item.replace('odata.include-annotations=', '').replace(/"/g,'');
                }
                else if (item.startsWith("odata.maxpagesize=")) {
                    maxPageSize = item.replace('odata.maxpagesize=', '').replace(/"/g, '');
                }
            }
        }
    
        prefer = [];
    
        if (config) {
            if (returnRepresentation === null) {
                returnRepresentation = config.returnRepresentation;
            }
            includeAnnotations = includeAnnotations ? includeAnnotations : config.includeAnnotations;
            maxPageSize = maxPageSize ? maxPageSize : config.maxPageSize;
        }
    
        if (returnRepresentation) {
            prefer.push('return=representation');
        }
    
        if (includeAnnotations) {
            prefer.push('odata.include-annotations="' + includeAnnotations + '"');
        }
    
        if (maxPageSize && maxPageSize > 0) {
            prefer.push('odata.maxpagesize=' + maxPageSize);
        }
    
        return prefer.join(',');
    }

    public static getFetchXmlPagingCookie(pageCookies:string, currentPageNumber:number):any {
        pageCookies = pageCookies ? pageCookies : "";
        currentPageNumber = currentPageNumber ? currentPageNumber : 1;
    
        //get the page cokies
        pageCookies = unescape(unescape(pageCookies));
    
        const info = /pagingcookie="(<cookie page="(\d+)".+<\/cookie>)/.exec(pageCookies);
    
        if (info !== null) {
            var page = parseInt(info[2]);

            return {
                cookie: info[1].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '\'').replace(/\'/g, '&' + 'quot;'),
                page: page,
                nextPage: page + 1
            };
        } else {
            //http://stackoverflow.com/questions/41262772/execution-of-fetch-xml-using-web-api-dynamics-365 workaround
            return {
                cookie: "",
                page: currentPageNumber,
                nextPage: currentPageNumber + 1
            };
        }
    }
}
