import { GetRootQuery, Query } from "../Query/Query";
import GetQueryXml from "../Query/QueryXml";
import { DynamicsHeaders, DefaultWebApiVersion } from "./Dynamics";
import * as httpntlm from "httpntlm";
import fetch from "node-fetch";
import { DynamicsFunction } from "./Model/FunctionMetadata";
import { Utilities } from "./Utilities";
import { DynamicsAction } from "./Model/ActionMetadata";

export enum AuthenticationType
{
    Windows = 1,
    OAuth = 2
}

export class ConnectionOptions {
    authType: AuthenticationType = AuthenticationType.OAuth;
    username?: string;
    password?: string;
    domain?: string;
    workstation?: string;
    accessToken?: string;
    serverUrl: string = "";
    webApiVersion: string = DefaultWebApiVersion;
}

export async function dynamicsBoundAction<T>(connectionOptions: ConnectionOptions, entitySetName: string, id: string, dynamicsAction: DynamicsAction, headers?: any, parameters?: any): Promise<T> {
    return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${entitySetName}(${Utilities.TrimGuid(id)})/${dynamicsAction}`, 'POST', parameters, headers);
}

export async function dynamicsUnboundAction<T>(connectionOptions: ConnectionOptions, dynamicsAction: DynamicsAction, headers?: any, parameters?: any): Promise<T> {
    return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${dynamicsAction}`, 'POST', parameters, headers);
}

export async function dynamicsBoundFunction<T>(connectionOptions: ConnectionOptions, entitySetName: string, id: string, dynamicsFunction: DynamicsFunction, headers?: any, parameters?: any): Promise<T> {
    return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${entitySetName}(${Utilities.TrimGuid(id)})/${dynamicsFunction}${Utilities.BuildFunctionParameters(parameters)}`, 'GET', undefined, headers);
}

export async function dynamicsUnboundFunction<T>(connectionOptions: ConnectionOptions, dynamicsFunction: DynamicsFunction, headers?: any, parameters?: any): Promise<T> {
    return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${dynamicsFunction}${Utilities.BuildFunctionParameters(parameters)}`, 'GET', undefined, headers);
}

export async function dynamicsQuery<T>(connectionOptions: ConnectionOptions, query: Query, maxRowCount?: number, headers?: any): Promise<T[]> {
    const dataQuery = GetRootQuery(query);

    if (!dataQuery.EntityPath) {
        throw new Error('dynamicsQuery requires a Query object with an EntityPath');
    }

    return await dynamicsQueryUrl<T>(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${dataQuery.EntityPath}`, query, maxRowCount, headers);
}

export async function dynamicsQueryUrl<T>(connectionOptions: ConnectionOptions, dynamicsEntitySetUrl: string, query: Query, maxRowCount?: number, headers?: any): Promise<T[]> {
    const querySeparator = (dynamicsEntitySetUrl.indexOf('?') > -1 ? '&' : '?');

    return await request<T[]>(connectionOptions, `${dynamicsEntitySetUrl}${querySeparator}fetchXml=${escape(GetQueryXml(query, maxRowCount))}`, 'GET', undefined, headers);
}

export async function dynamicsGetRequest<T>(connectionOptions: ConnectionOptions, dynamicsEntitySetUrl: string, headers?: any): Promise<T> {
    return await request<T>(connectionOptions, dynamicsEntitySetUrl, 'GET', undefined, headers);
}

export async function dynamicsSave(connectionOptions: ConnectionOptions, entitySetName: string, data: any, id?: string, headers?: any): Promise<string> {
    if (id) {
        return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${entitySetName}(${Utilities.TrimGuid(id)})`, 'PATCH', data, headers);
    }
    else {
        return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${entitySetName}()`, 'POST', data, headers);
    }
}

export async function request<T>(connectionOptions: ConnectionOptions, url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: any, headers?: any): Promise<T> {
    let callUrl: string = connectionOptions.serverUrl;

    if (callUrl.endsWith("/"))
    {
        callUrl = callUrl.substr(0, callUrl.length - 1);
    }

    callUrl = `${callUrl}${url}`;

    //TODO: fetch if we can.
    if (connectionOptions.authType === AuthenticationType.Windows)
    {
        return new Promise((resolve, reject) =>
        {
            console.log(`[HTTP]: ${callUrl} (${headers ? headers.length : 0} headers / ${body ? body.length : 0} bytes)`);

            httpntlm[method.toLowerCase()]({
                url: callUrl,
                username: connectionOptions.username,
                password: connectionOptions.password,
                workstation: connectionOptions.workstation || '',
                domain: connectionOptions.domain || '',
                body: body,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    ...DynamicsHeaders,
                    ...headers
                }
            }, function (err, res){
                if (err) 
                { 
                    console.error(err);
    
                    reject(err);
                }
               
                const json = JSON.parse(res.body);

                if (json.error)
                {
                    console.error(json.error.message);

                    reject (json.error.message);
                }
                else if (json.ExceptionMessage)
                {
                    console.error(json.ExceptionMessage);

                    reject (`The service call returned HTTP ${json.ErrorCode} - ${json.ExceptionMessage}`);
                }
                else
                {
                    resolve(Utilities.FormatDynamicsResponse(json));
                }
            });
        });
    }
    else
    {
        return fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${connectionOptions.accessToken}`,
                'Content-Type': 'application/json; charset=utf-8',
                ...DynamicsHeaders,
                ...headers
            },
            body: body
        })
            .then(response => response.json())
            .then(data => Utilities.FormatDynamicsResponse(data));
    }
}