import { GetRootQuery, Query } from "../Query/Query";
import GetQueryXml from "../Query/QueryXml";
import { DynamicsHeaders, WebApiVersion } from "./Dynamics";
import { Ntlm } from "../ntlm/ntlm";
import fetch from "node-fetch";
import { connect } from "http2";

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
}

export function authenticate(connectionOptions: ConnectionOptions): string
{
    let returnValue:string = "";

    if (connectionOptions.authType === AuthenticationType.Windows)
    {
        let ntlm = new Ntlm();
        const type1Message = ntlm.createType1Message(2, connectionOptions.workstation, connectionOptions.serverUrl);

        fetch(connectionOptions.serverUrl, {
            method: "HEAD",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': type1Message.header(),
                'Connection': 'keep-alive',
                ...DynamicsHeaders
            }
        })
        .then(response => response.headers.get('www-authenticate'))
        .then((auth) => {
            if (!auth) {
                throw new Error('Stage 1 NTLM handshake failed.');
            }
        
            const type2Message = ntlm.decodeType2Message(auth);

            if (!connectionOptions.username)
            {
                connectionOptions.username = "";
            }

            if (!connectionOptions.password)
            {
                connectionOptions.password = "";
            }

            let type3Message = ntlm.createType3Message(type1Message, type2Message, connectionOptions.username, connectionOptions.password, connectionOptions.workstation, connectionOptions.serverUrl, undefined, undefined);

            if (type3Message)
            {
                returnValue = type3Message.header();
                console.log(`NTLM authentication to ${connectionOptions.serverUrl} completed as ${connectionOptions.username}.`);
            }
        })
        .catch(response => {
            if (!response.Ok)
            {
                throw new Error(response.responseText);
            }
        });
    }

    return returnValue;
}

export function dynamicsQuery<T>(connectionOptions: ConnectionOptions, query: Query, maxRowCount?: number, headers?: any): Promise<T[]> {
    const dataQuery = GetRootQuery(query);

    if (!dataQuery.EntityPath) {
        throw new Error('dynamicsQuery requires a Query object with an EntityPath');
    }

    if (!connectionOptions.accessToken)
    {
        connectionOptions.accessToken = authenticate(connectionOptions);
    }

    return dynamicsQueryUrl<T>(connectionOptions, `/api/data/${WebApiVersion}/${dataQuery.EntityPath}`, query, maxRowCount, headers);
}

export function dynamicsQueryUrl<T>(connectionOptions: ConnectionOptions, dynamicsEntitySetUrl: string, query: Query, maxRowCount?: number, headers?: any): Promise<T[]> {
    const querySeparator = (dynamicsEntitySetUrl.indexOf('?') > -1 ? '&' : '?');

    if (!connectionOptions.accessToken)
    {
        connectionOptions.accessToken = authenticate(connectionOptions);
    }

    return request<T[]>(connectionOptions, `${dynamicsEntitySetUrl}${querySeparator}fetchXml=${escape(GetQueryXml(query, maxRowCount))}`, 'GET', undefined, headers);
}

export function dynamicsRequest<T>(connectionOptions: ConnectionOptions, dynamicsEntitySetUrl: string, headers?: any): Promise<T> {
    if (!connectionOptions.accessToken)
    {
        connectionOptions.accessToken = authenticate(connectionOptions);
    }

    return request<T>(connectionOptions, dynamicsEntitySetUrl, 'GET', undefined, headers);
}

export function dynamicsSave(connectionOptions: ConnectionOptions, entitySetName: string, data: any, id?: string, headers?: any): Promise<string> {
    if (!connectionOptions.accessToken)
    {
        connectionOptions.accessToken = authenticate(connectionOptions);
    }

    if (id) {
        return request(connectionOptions, `/api/data/${WebApiVersion}/${entitySetName}(${trimId(id)})`, 'PATCH', data, headers);
    }
    else {
        return request(connectionOptions, `/api/data/${WebApiVersion}/${entitySetName}()`, 'POST', data, headers);
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

function request<T>(connectionOptions: ConnectionOptions, url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: any, headers?: any): Promise<T> {
    if (!connectionOptions.accessToken)
    {
        connectionOptions.accessToken = authenticate(connectionOptions);
    }

    let callUrl: string = connectionOptions.serverUrl;

    if (callUrl.endsWith("/"))
    {
        callUrl = callUrl.substr(0, callUrl.length - 1);
    }

    callUrl = `${callUrl}${url}`;

    return fetch(callUrl, {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': connectionOptions.accessToken,
            ...DynamicsHeaders,
            ...headers
        },
        body: body
    })
        .then(response => response.json())
        .then(data => formatDynamicsResponse(data));
}

function trimId(id: string) {
    return (id || '').replace(/{|}/g, '');
}