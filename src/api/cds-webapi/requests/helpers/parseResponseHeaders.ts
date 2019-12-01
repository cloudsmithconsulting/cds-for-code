/**
 * Parses headers supplied in OData responses and normalizes them into a key/value pairs
 * @export
 * @param {string} headerString that needs to be parsed
 * @returns {{ [key:string]:string }} representing structured key/value pairs of header data
 */
export default function parseResponseHeaders(headerString:string): { [key:string]:string } {
    let headers = {};
    
    if (!headerString) {
        return headers;
    }
    
    const headerPairs = headerString.split('\u000d\u000a');
    
    for (let i = 0, ilen = headerPairs.length; i < ilen; i++) {
        const headerPair = headerPairs[i];
        const index = headerPair.indexOf('\u003a\u0020');

        if (index > 0) {
            headers[headerPair.substring(0, index)] = headerPair.substring(index + 2);
        }
    }

    return headers;
}