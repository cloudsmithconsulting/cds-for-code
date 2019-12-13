function throwParameterError(functionName:string, parameterName: string, type?: string) {
    throw new Error(type
        ? functionName + " requires the " + parameterName + " parameter to be of type " + type
        : functionName + " requires the " + parameterName + " parameter.");
}

export function handleErrorResponse(req:any) {
    ///<summary>
    /// Private function return an Error object to the errorCallback
    ///</summary>
    ///<param name="req" type="XMLHttpRequest">
    /// The XMLHttpRequest response that returned an error.
    ///</param>
    ///<returns>Error</returns>
    throw new Error("Error: " + req.status + ": " + req.message);
}

export function parameterCheck(parameter: any | undefined, functionName: string, parameterName: string, type?: string): any {
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
        throwParameterError(functionName, parameterName, type);
    }

    return <any>parameter;
}

export function stringParameterCheck(parameter: string | undefined, functionName: string, parameterName: string): string {
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
        throwParameterError(functionName, parameterName, "String");
    }

    return <string>parameter;
}

export function arrayParameterCheck(parameter: any[] | undefined, functionName: string, parameterName: string): any[] {
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
        throwParameterError(functionName, parameterName, "Array");
    }

    return <any[]>parameter;
}

export function stringOrArrayParameterCheck(parameter: any[] | string | undefined, functionName: string, parameterName: string): any[] | string {
    if (!(parameter instanceof Array) && typeof parameter !== "string") {
        throwParameterError(functionName, parameterName, "String or Array");
    }

    if (parameter instanceof Array) {
        return <any[]>parameter;
    } else {
        return <string>parameter;
    }
}

export function numberParameterCheck(parameter: number | string | undefined, functionName: string, parameterName: string): number | undefined {
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

        throwParameterError(functionName, parameterName, "Number");
    }
}

export function boolParameterCheck(parameter: boolean | undefined, functionName: string, parameterName: string): boolean {
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
        throwParameterError(functionName, parameterName, "Boolean");
    }

    return <boolean>parameter;
}

export function guidParameterCheck(parameter: string | undefined, functionName: string, parameterName: string): string | undefined {
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

    if (!parameter) { return; }
    
    try {
        const matches = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter);
        const match = matches && matches.length > 0 ? matches[0] : undefined;

        return match;
    }
    catch (error) {
        throwParameterError(functionName, parameterName, "GUID String");
    }
}

export function keyParameterCheck(parameter: any | undefined, functionName: string, parameterName: string) {
    try {
        stringParameterCheck(parameter, functionName, parameterName);

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
                if (alternateKeys[i] && alternateKeys[i] !== null) {
                    const alternateMatches = /^[\w\d\_]+\=('[^\'\r\n]+'|\d+)$/i.exec(alternateKeys[i]);
                    const alternateMatch = alternateMatches && alternateMatches.length > 0 ? alternateMatches[0] : undefined;
                }
            }
        }

        return alternateKeys.join(',');
    }
    catch (error) {
        throwParameterError(functionName, parameterName, "String representing GUID or Alternate Key");
    }
}

export function callbackParameterCheck(callbackParameter: any | undefined, functionName: string, parameterName: string): any {
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
        throwParameterError(functionName, parameterName, "Function");
    }
}

export function batchIncompatible(functionName: string, isBatch: boolean): boolean {
    if (isBatch) {
        isBatch = false;
        throw new Error(functionName + " cannot be used in a BATCH request.");
    }

    return isBatch;
}

export function batchNotStarted(isBatch: boolean): void {
    if (!isBatch) {
        throw new Error("Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly.");
    }
}

export function handleHttpError(parsedError: any, parameters?: any): Error {
    let error: any = new Error();

    if (parsedError) {
        Object.keys(parsedError).forEach(k => {
            error[k] = parsedError[k];
        });
    }

    if (parameters) {
        Object.keys(parameters).forEach(k => {
            error[k] = parameters[k];
        });
    }

    return error;
}
