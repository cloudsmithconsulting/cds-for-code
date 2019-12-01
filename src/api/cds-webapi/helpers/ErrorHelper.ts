export default class ErrorHelper {
    private static throwParameterError(functionName:string, parameterName: string, type?: string) {
        throw new Error(type
            ? functionName + " requires the " + parameterName + " parameter to be of type " + type
            : functionName + " requires the " + parameterName + " parameter.");
    }

    static handleErrorResponse(req:any) {
        ///<summary>
        /// Private function return an Error object to the errorCallback
        ///</summary>
        ///<param name="req" type="XMLHttpRequest">
        /// The XMLHttpRequest response that returned an error.
        ///</param>
        ///<returns>Error</returns>
        throw new Error("Error: " + req.status + ": " + req.message);
    }

    static parameterCheck(parameter: any | undefined, functionName: string, parameterName: string, type?: string): any {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Object">
        /// The parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if ((typeof parameter === "undefined") || parameter === null || parameter === "") {
            this.throwParameterError(functionName, parameterName, type);
        }

        return <any>parameter;
    }

    static stringParameterCheck(parameter: string | undefined, functionName: string, parameterName: string): string {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (parameter && typeof parameter !== "string" && parameter !== "") {
            this.throwParameterError(functionName, parameterName, "String");
        }

        return <string>parameter;
    }

    static arrayParameterCheck(parameter: any[] | undefined, functionName: string, parameterName: string): any[] {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (parameter && !(parameter instanceof Array)) {
            this.throwParameterError(functionName, parameterName, "Array");
        }

        return <any[]>parameter;
    }

    static stringOrArrayParameterCheck(parameter: any[] | string | undefined, functionName: string, parameterName: string): any[] | string {
        if (!(parameter instanceof Array) && typeof parameter !== "string") {
            this.throwParameterError(functionName, parameterName, "String or Array");
        }

        if (parameter instanceof Array) {
            return <any[]>parameter;
        } else {
            return <string>parameter;
        }
    }

    static numberParameterCheck(parameter: number | string | undefined, functionName: string, parameterName: string): number {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Number">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (parameter && typeof parameter !== "number") {
            if (typeof parameter === "string" && parameter) {
                if (!isNaN(parseFloat(parameter))) {
                    return <number>parseFloat(parameter);
                }
            }

            this.throwParameterError(functionName, parameterName, "Number");
        }
    }

    static boolParameterCheck(parameter: boolean | undefined, functionName: string, parameterName: string): boolean {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Boolean">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter !== "boolean") {
            this.throwParameterError(functionName, parameterName, "Boolean");
        }

        return <boolean>parameter;
    }

    static guidParameterCheck(parameter: string | undefined, functionName: string, parameterName: string): string {
        ///<summary>
        /// Private function used to check whether required parameter is a valid GUID
        ///</summary>
        ///<param name="parameter" type="String">
        /// The GUID parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        /// <returns type="String" />

        try {
            var match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)[0];

            return match;
        }
        catch (error) {
            this.throwParameterError(functionName, parameterName, "GUID String");
        }
    }

    static keyParameterCheck(parameter: any | undefined, functionName: string, parameterName: string) {
        try {
            ErrorHelper.stringParameterCheck(parameter, functionName, parameterName);

            //check if the param is a guid
            const match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter);

            if (match) {
                return match[0];
            }

            //check the alternate key
            let alternateKeys = parameter.split(',');

            if (alternateKeys.length) {
                for (var i = 0; i < alternateKeys.length; i++) {
                    alternateKeys[i] = alternateKeys[i].trim().replace('"', "'");
                    // tslint:disable-next-line: no-unused-expression
                    /^[\w\d\_]+\=('[^\'\r\n]+'|\d+)$/i.exec(alternateKeys[i])[0];
                }
            }

            return alternateKeys.join(',');
        }
        catch (error) {
            this.throwParameterError(functionName, parameterName, "String representing GUID or Alternate Key");
        }
    }

    static callbackParameterCheck(callbackParameter: any | undefined, functionName: string, parameterName: string): any {
        ///<summary>
        /// Private function used to check whether required callback parameters are functions
        ///</summary>
        ///<param name="callbackParameter" type="Function">
        /// The callback parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (callbackParameter && typeof callbackParameter !== "function") {
            this.throwParameterError(functionName, parameterName, "Function");
        }
    }

    static batchIncompatible(functionName: string, isBatch: boolean): boolean {
        if (isBatch) {
            isBatch = false;
            throw new Error(functionName + " cannot be used in a BATCH request.");
        }

        return isBatch;
    }

    static batchNotStarted(isBatch: boolean): void {
        if (!isBatch) {
            throw new Error("Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly.");
        }
    }

    static handleHttpError(parsedError: any, parameters?: any): Error {
        let error = new Error();

        Object.keys(parsedError).forEach(k => {
            error[k] = parsedError[k];
        });

        if (parameters) {
            Object.keys(parameters).forEach(k => {
                error[k] = parameters[k];
            });
        }

        return error;
    }
}