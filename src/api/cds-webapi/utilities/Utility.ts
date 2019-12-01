import buildFunctionParameters from './buildFunctionParameters';
import getFetchXmlPagingCookie from './getFetchXmlPagingCookie';
import convertToReferenceObject, { ReferenceObject } from './convertToReferenceObject';
import { Utilities } from "../../../core/Utilities";

export default class Utility {
    /**
     * Builds parametes for a funciton. Returns '()' (if no parameters) or '([params])?[query]'
     *
     * @param {Object} [parameters] - Function's input parameters. Example: { param1: "test", param2: 3 }.
     * @returns {string}
     */
    static buildFunctionParameters:(parameters:any) => string = buildFunctionParameters.bind(Utility);

    /**
     * Parses a paging cookie returned in response
     *
     * @param {string} pageCookies - Page cookies returned in @Microsoft.Dynamics.CRM.fetchxmlpagingcookie.
     * @param {number} currentPageNumber - A current page number. Fix empty paging-cookie for complex fetch xmls.
     * @returns {{cookie: "", number: 0, next: 1}}
     */
    static getFetchXmlPagingCookie:(pageCookies: string, currentPageNumber: number) => { cookie: string, page: number, nextPage: number } = getFetchXmlPagingCookie.bind(Utility);

    /**
     * Converts a response to a reference object
     *
     * @param {Object} responseData - Response object
     * @returns {ReferenceObject}
     */
    static convertToReferenceObject:(responseData:Object) => ReferenceObject = convertToReferenceObject.bind(Utility);

    /**
     * Checks whether the value is JS Null.
     * @param {Object} value
     * @returns {boolean}
     */
    static isNull:(value: any) => boolean = Utilities.$Object.IsNull.bind(Utility);

    static generateUUID:() => string = Utilities.Guid.newGuid.bind(Utility);

    static getXrmContext(): Xrm.GlobalContext {
        if (typeof GetGlobalContext !== 'undefined') {
            return GetGlobalContext();
        }
        else {
            if (typeof Xrm !== 'undefined') {
                //d365 v.9.0
                if (!this.isNull(Xrm.Utility) && !this.isNull(Xrm.Utility.getGlobalContext)) {
                    return Xrm.Utility.getGlobalContext();
                }
                else if (!this.isNull(Xrm.Page) && !this.isNull(Xrm.Page.context)) {
                    return Xrm.Page.context;
                }
            }
        }
    
        throw new Error('Xrm Context is not available. In most cases, it can be resolved by adding a reference to a ClientGlobalContext.js.aspx. Please refer to MSDN documentation for more details.');
    }
    
    static getClientUrl(): string {
        const context = this.getXrmContext();
        let clientUrl = context.getClientUrl();
    
        if (clientUrl.match(/\/$/)) {
            clientUrl = clientUrl.substring(0, clientUrl.length - 1);
        }

        return clientUrl;
    }
    
    static initWebApiUrl(version: string): string {
        return this.getClientUrl() + '/api/data/v' + version + '/';
    }

    static getXrmInternal(): any { 
        //todo: Xrm.Internal namespace is not supported
        return typeof Xrm !== "undefined" ? (<any>Xrm).Internal : null;
    }

    static getXrmUtility(): Xrm.Utility | undefined {
        return typeof Xrm !== "undefined" ? Xrm.Utility : undefined;
    }
}