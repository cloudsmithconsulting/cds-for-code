import * as vscode from 'vscode';
import { DynamicsWebApi } from "./DynamicsWebApi/DynamicsWebApi";

export default class ApiRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.getSolutionsCommand', () => { // Gets a list of solutions according to a given connection profile.
                //TODO: fix this to take an actual connection parameter.
                const options:DynamicsWebApi.Config = {
                    domain: "CONTOSO",
                    username: "Administrator",
                    password: "p@ssw0rd1",
                    webApiUrl: "http://win-oi4mlu9323r/test/",
                    webApiVersion: "9.0"
                };

                const api = new ApiRepository(options);
                
                return api.retrieveSolutions();
            })
        );
    }

    private config:DynamicsWebApi.Config;

    public constructor (config:DynamicsWebApi.Config)
    {
        this.config = config;
        this.webapi = new DynamicsWebApi(config);
    }

    private webapi: DynamicsWebApi;

    public async whoAmI() : Promise<any>
    {
        return await this.webapi.executeUnboundFunction('WhoAmI');
    }

    public async retrieveSolutions<T>() : Promise<T[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "solutions",
            filter: "isvisible -eq true",
            orderBy: ["uniquename"]
        };

        let response = await this.webapi.retrieveAllRequest(request);

        return response;
    }

    public async retrievePluginAssemblies<T>(solutionId:string) : Promise<T[]> {
        let request:DynamicsWebApi.RetrieveMultipleRequest = {
            collection: "pluginassemblies",
            filter: "ishidden eq false" + (solutionId ? ` and SolutionId eq "${solutionId}"` : ""),
            orderBy: ["uniquename"]
        };

        return await this.webapi.retrieveAllRequest(request);
    }
}