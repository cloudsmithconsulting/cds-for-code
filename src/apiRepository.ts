import * as vscode from 'vscode';
import { ConnectionOptions, AuthenticationType } from './Dynamics/DynamicsRequest';
import dynamics, { Dynamics } from './Dynamics/Dynamics';

export default class ApiRepository
{
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.getSolutionsCommand', () => { // Gets a list of solutions according to a given connection profile.
                //TODO: fix this to take an actual connection parameter.
                var options = new ConnectionOptions();

                options.authType = AuthenticationType.Windows;
                options.domain = "CONTOSO";
                options.username = "Administrator";
                options.password = "p@ssw0rd1";
                options.serverUrl = "http://win-a6ljo0slrsh/test/";

                var api = new ApiRepository(options);
                
                return api.retrieveSolutions();
            })
        );
    }

    public constructor (connectionOptions:ConnectionOptions)
    {
        this.webapi = dynamics(connectionOptions); 
    }

    private webapi: Dynamics;

    public async retrieveSolutions() : Promise<any[]> {
        let q = this.webapi.query('solution', 'solutions').orderBy("name");
        
        return await this.webapi.fetch(q);
    }
}