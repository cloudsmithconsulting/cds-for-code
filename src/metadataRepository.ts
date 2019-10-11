import * as vscode from 'vscode';
import { ConnectionOptions, AuthenticationType } from './Dynamics/DynamicsRequest';
import dynamicsMetdata, { DynamicsMetadata } from './Dynamics/DynamicsMetadata';
import dynamics, { Dynamics  } from './Dynamics/Dynamics';
import { QueryOperator } from './Query/Query';
import { EntityMetadata } from './Dynamics/Model/EntityMetadata';

export default class MetadataRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        return;
    }

    private options:ConnectionOptions;

    public constructor (connectionOptions:ConnectionOptions)
    {
        this.options = connectionOptions;
        this.metadataApi = dynamicsMetdata(connectionOptions); 
        this.webApi = dynamics(connectionOptions);
    }

    private metadataApi: DynamicsMetadata;
    private webApi: Dynamics;

    public async retrieveEntities(solutionId?:string) : Promise<EntityMetadata[]>
    {
        if (solutionId)
        {
            const components = await this.webApi
                .query("solutioncomponent", "solutioncomponents")
                .where("componenttype", QueryOperator.Equals, 1)        // Entity
                .where("solutionid", QueryOperator.Equals, solutionId);

            //TODO: Fix this.
            return this.metadataApi.entities().then(data => this.flatten(data));
        }
        else
        {
            return this.metadataApi.entities();
        }
    }

    private flatten(values: any[]): any[] {
        return [].concat(...values);
    }
}