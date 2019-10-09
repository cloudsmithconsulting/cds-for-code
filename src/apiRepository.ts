import * as vscode from 'vscode';
import { ConnectionOptions, AuthenticationType } from './Dynamics/DynamicsRequest';
import dynamics, { Dynamics } from './Dynamics/Dynamics';
import { QueryOperator } from './Query/Query';
import { connect } from 'tls';
import { url } from 'inspector';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';

export default class ApiRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.getSolutionsCommand', () => { // Gets a list of solutions according to a given connection profile.
                //TODO: fix this to take an actual connection parameter.
                const options = new ConnectionOptions();

                options.authType = AuthenticationType.Windows;
                options.domain = "CONTOSO";
                options.username = "Administrator";
                options.password = "p@ssw0rd1";
                options.serverUrl = "http://win-a6ljo0slrsh/test/";
                options.webApiVersion = "v8.2";         // Defaults to latest.

                const api = new ApiRepository(options);
                
                return api.retrieveSolutions();
            })
        );
    }

    private options:ConnectionOptions;

    public constructor (connectionOptions:ConnectionOptions)
    {
        this.options = connectionOptions;
        this.webapi = dynamics(connectionOptions); 
    }

    private webapi: Dynamics;

    public retrieveSolutions<T>() : Promise<T[]> {
        let q = this.webapi.query('solution', 'solutions').orderBy("uniquename");
        
        return this.webapi.fetch(q);
    }

    public retrievePluginAssemblies<T>(solutionId:string = undefined) : Promise<T[]> {
        let q = this.webapi.query('pluginassembly', 'pluginassemblies');
        
        if (solutionId)
        {
            q = q.where("SolutionId", QueryOperator.Equals, solutionId);
        }

        return this.webapi.fetch(q);
    }
}