import { GetRootQuery, Query } from "../Query/Query";
import GetQueryXml from "../Query/QueryXml";
import { DefaultMaxRecords, DynamicsHeaders } from "./Dynamics";
import { formatDynamicsResponse, ConnectionOptions, AuthenticationType } from "./DynamicsRequest";
import * as httpntlm from "httpntlm";
import fetch from "node-fetch";

export interface DynamicsBatch {
    execute(): Promise<any[] | undefined>;
    request(query: Query, maxRowCount?: number): DynamicsBatch;
    requestAll(queries: Query[]): DynamicsBatch;
    requestAllUrls(urls: string[]): DynamicsBatch;
    saveEntity(entitySetName: string, data: any, id?: string): DynamicsBatch & {
        createRelatedEntity(entitySetName: string, data: any, navigationPropertyName: string): void
    };
}

export function dynamicsBatch(connectionOptions: ConnectionOptions, headers?: any): DynamicsBatch {
    return new Batch(connectionOptions, headers);
}

export function dynamicsBatchRequest<T = any>(connectionOptions: ConnectionOptions, ...url: string[]): Promise<T[] | undefined> {
    const batch = new Batch(connectionOptions);
    batch.requestAllUrls(url);
    
    return batch.execute();
}

export function dynamicsBatchQuery<T = any>(connectionOptions: ConnectionOptions, ...query: Query[]): Promise<T[] | undefined> {
    const batch = new Batch(connectionOptions);
    batch.requestAll(query);

    return batch.execute();
}

interface BatchRequest {
    entitySetName?: string;
    entitySetQuery?: string;
    entityId?: string;
    entityData?: any;
    relatedChange?: BatchRequest;
    relatedPropertyName?: string;
}

class Batch implements DynamicsBatch {
    private Changes: BatchRequest[];
    private RelatedChanges: BatchRequest[];
    private ConnectionOptions!: ConnectionOptions;

    constructor(private options: ConnectionOptions, private headers?: any) {
        this.ConnectionOptions = options;
        this.Changes = [];
        this.RelatedChanges = [];
    }

    async execute() {
        const results = await Batch.requestBatch(this.ConnectionOptions, `/api/data/${this.ConnectionOptions.webApiVersion}/$batch`, this.Changes, this.headers);

        if (this.RelatedChanges.length > 0) {
            for (let change of this.RelatedChanges) {
                if (change !== undefined && change.relatedChange)
                {
                    let changeIndex = this.Changes.indexOf(change.relatedChange);
                    let relatedId = results !== undefined ? results[changeIndex] : undefined;
                    change.entityData[`${change.relatedPropertyName}@odata.bind`] = `${change.relatedChange.entitySetName}(${Batch.trimId(relatedId)})`;
                }
            }
        
            const related = await Batch.requestBatch(this.ConnectionOptions, `/api/data/${this.ConnectionOptions.webApiVersion}/$batch`, this.RelatedChanges, this.headers);
        
            return results !== undefined ? results.concat(related) : undefined;
        }
        else {
            return results;
        }
    }

    requestAllUrls(urls: string[]) {
        this.Changes.push.apply(this.Changes, urls.map(entitySetQuery => ({ entitySetQuery })));
        
        return this;
    }

    requestAll(queries: Query[]) {
        this.Changes.push.apply(queries.map(query => {
            const dataQuery = GetRootQuery(query);
            this.request(query);
        
            return {
                entitySetName: dataQuery.EntityPath,
                entitySetQuery: `fetchXml=${escape(GetQueryXml(query))}`
            };
        }));
        
        return this;
    }

    request(query: Query, maxRowCount: number = DefaultMaxRecords) {
        const dataQuery = GetRootQuery(query);
        if (!dataQuery.EntityPath) {
            throw new Error('dynamicsBatch request requires a Query object with an EntityPath');
        }
        this.Changes.push({
            entitySetName: dataQuery.EntityPath,
            entitySetQuery: `fetchXml=${escape(GetQueryXml(query, maxRowCount))}`
        });
        return this;
    }

    deleteEntity(entitySetName: string, id: string) {
        this.Changes.push({
            entitySetName: entitySetName,
            entityId: id,
            entityData: 'DELETE'
        });
        return this;
    }

    saveEntity(entitySetName: string, data: any, id?: string) {
        this.Changes.push({
            entitySetName: entitySetName,
            entityId: id,
            entityData: data
        });
        return this;
    }

    createRelatedEntity(entitySetName: string, data: any, navigationPropertyName: string) {
        let lastChange = this.Changes[this.Changes.length - 1];
        if (!lastChange || lastChange.entityData === 'DELETE') { throw new Error('createRelatedEntity relies on the previous change which was not found in the batch.'); }
        if (lastChange.entityId) {
            data[`${navigationPropertyName}@odata.bind`] = `${lastChange.entitySetName}(${lastChange.entityId})`;
            this.Changes.push({
                entitySetName: entitySetName,
                entityData: data
            });
        }
        else {
            this.RelatedChanges.push({
                entitySetName: entitySetName,
                entityData: data,
                relatedChange: lastChange,
                relatedPropertyName: navigationPropertyName
            });
        }
    }

    static requestBatch(connectionOptions: ConnectionOptions, url: string, requests: BatchRequest[], headers?: any): Promise<any[] | undefined> {
        let callUrl: string = connectionOptions.serverUrl;

        if (callUrl.endsWith("/"))
        {
            callUrl = callUrl.substr(0, callUrl.length - 1);
        }
    
        callUrl = `${callUrl}${url}`;

        const batchId = Batch.createId();

        if (connectionOptions.authType === AuthenticationType.Windows)
        {
            return new Promise((resolve, reject) =>
            {
                httpntlm.post({
                    url: callUrl,
                    username: connectionOptions.username,
                    password: connectionOptions.password,
                    workstation: connectionOptions.workstation || '',
                    domain: connectionOptions.domain || '',
                    body: Batch.formatBatchRequest(connectionOptions, batchId, requests),
                    headers: {
                        'Content-Type': `multipart/mixed;boundary=batch_${batchId}`,
                        ...DynamicsHeaders,
                        ...headers
                    }
                }, function (err, res){
                    if (err) 
                    { 
                        console.error(err);
        
                        reject(err);
                    }

                    resolve(Batch.formatBatchResponse(res.responseText));
                });
            });   
        }
        else
        {
            return fetch(callUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/mixed;boundary=batch_${batchId}`,
                    'Authorization': connectionOptions.accessToken,
                    ...DynamicsHeaders,
                    ...headers
                },
                body: Batch.formatBatchRequest(connectionOptions, batchId, requests)
            })
                .then(response => Batch.formatBatchResponse(response.text()));
        }
    }

    static formatBatchRequest(connectionOptions:ConnectionOptions, batchId: string, changes: BatchRequest[]) {
        let batchBody = [];
        let requestBody = [];
        let changeNumber = 1;
        let changesetId = Batch.createId();
        batchBody.push(`--batch_${batchId}`);
        batchBody.push(`Content-Type: multipart/mixed;boundary=changeset_${changesetId}`);
        batchBody.push('');
        for (let change of changes) {
            if (change.entitySetQuery) {
                requestBody.push(`--batch_${batchId}`);
                requestBody.push('Content-Type: application/http');
                requestBody.push('Content-Transfer-Encoding:binary');
                requestBody.push('');
                if (change.entitySetName) {
                    requestBody.push(`GET ${encodeURI(`/api/data/${connectionOptions.webApiVersion}/${change.entitySetName}?${change.entitySetQuery}`)} HTTP/1.1`);
                }
                else {
                    requestBody.push(`GET ${encodeURI(change.entitySetQuery)} HTTP/1.1`);
                }
                requestBody.push('Accept: application/json');
                requestBody.push('Prefer: odata.include-annotations="OData.Community.Display.V1.FormattedValue"');
                requestBody.push('');
            }
            else {
                batchBody.push(`--changeset_${changesetId}`);
                batchBody.push('Content-Type: application/http');
                batchBody.push('Content-Transfer-Encoding:binary');
                batchBody.push(`Content-ID: ${changeNumber++}`);
                batchBody.push('');
                batchBody.push(`${change.entityId ? 'PATCH' : 'POST'} ${encodeURI(`/api/data/${connectionOptions.webApiVersion}/${change.entitySetName}(${Batch.trimId(change.entityId)})`)} HTTP/1.1`);
                batchBody.push('Content-Type: application/json;type=entry');
                batchBody.push('');
                batchBody.push(JSON.stringify(change.entityData));
            }
        }
        batchBody.push(`--changeset_${changesetId}--`);
        batchBody.push(requestBody.join('\n'));
        batchBody.push(`--batch_${batchId}--`);
        return batchBody.join('\n');
    }

    static formatBatchResponse(responseText: Promise<string>): Promise<any[] | undefined> {
        return responseText.then(response => {
            if (response) {
                if (response.indexOf('"innererror"') > -1
                    || response.indexOf('HTTP/1.1 500 Internal Server Error') > -1
                    || response.indexOf('HTTP/1.1 400 Bad Request') > -1) {
                    throw new Error('Batch Request Error: ' + response);
                }
                else {
                    let data = [];
                    let responses = response.split('--changesetresponse');
                    for (let response of responses) {
                        let contentId = ((/Content-ID:\s?(.*)\b/g).exec(response) || []).slice(1)[0];
                        let entityId = ((/OData-EntityId:[^(]*\((.*)\)/g).exec(response) || []).slice(1)[0];
                        data[contentId - 1] = entityId;
                    }
                    let requests = response.split('--batchresponse');
                    for (let request of requests) {
                        //TODO: determine better way of identifying request responses
                        if (request.indexOf('OData.Community.Display.V1.FormattedValue') > -1) {
                            let responseIndex = request.indexOf('{');
                            let json = request.substring(responseIndex);
                            let item = JSON.parse(json);
                            data.push(formatDynamicsResponse(item));
                        }
                    }
                    return data;
                }
            }
        });
    }

    static createId() {
        return 'id' + Math.random().toString(16).slice(2);
    }

    static trimId(id: string | undefined) {
        if (id !== undefined)
        {
            return (id || '').replace(/{|}/g, '');
        }

        return undefined;
    }
}