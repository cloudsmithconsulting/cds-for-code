import { GetRootQuery, Query } from "../Query/Query";
import GetQueryXml from "../Query/QueryXml";
import { DynamicsHeaders, DefaultWebApiVersion } from "./Dynamics";
import * as httpntlm from "httpntlm";
import fetch from "node-fetch";

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

export async function dynamicsRequest<T>(connectionOptions: ConnectionOptions, dynamicsEntitySetUrl: string, headers?: any): Promise<T> {
    return await request<T>(connectionOptions, dynamicsEntitySetUrl, 'GET', undefined, headers);
}

export async function dynamicsSave(connectionOptions: ConnectionOptions, entitySetName: string, data: any, id?: string, headers?: any): Promise<string> {
    if (id) {
        return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${entitySetName}(${trimId(id)})`, 'PATCH', data, headers);
    }
    else {
        return await request(connectionOptions, `/api/data/${connectionOptions.webApiVersion}/${entitySetName}()`, 'POST', data, headers);
    }
}

export function formatDynamicsResponse(data: any): any {
    var items = []; 
    if (data && data.error) {
        throw new Error(data.error);
    }
    if (data && data.value) {
        data = data.value;
    }
    if (!Array.isArray(data)) {
        return formatDynamicsResponse([data])[0];
    }
    if (data) {
        for (var item of data) {
            let row:any = {};

            for (let key in item) {
                var name: string = key;

                if (name.indexOf('@odata') === 0) {
                    continue;
                }

                if (name.indexOf('transactioncurrencyid') > -1) {
                    continue;
                }

                if (name.indexOf('@') > -1) {
                    name = name.substring(0, name.indexOf('@'));

                    if (name.indexOf('_') === 0) {
                        name = name.slice(1, -6);
                    }
                    
                    name += "_formatted";
                }
                else if (name.indexOf('_') === 0) {
                    name = name.slice(1, -6);
                }

                if (name.indexOf('_x002e_') > -1) {
                    var obj = name.substring(0, name.indexOf('_x002e_'));
                    name = name.substring(name.indexOf('_x002e_') + 7);

                    if (!row[obj]) {
                        row[obj] = {};
                    }
                    row[obj][name] = item[key];
                }
                else {
                    row[name] = item[key];
                }
            }
            items.push(row);
        }
    }
    return items;
}

async function request<T>(connectionOptions: ConnectionOptions, url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: any, headers?: any): Promise<T> {
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
                    resolve(formatDynamicsResponse(json));
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
            .then(data => formatDynamicsResponse(data));
    }
}

function trimId(id: string) {
    return (id || '').replace(/{|}/g, '');
}