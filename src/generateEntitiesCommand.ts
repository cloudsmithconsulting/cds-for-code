import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from './cs';
import ExtensionConfiguration from './helpers/ExtensionConfiguration';
import { IWireUpCommands } from './wireUpCommand';
import DynamicsTreeView from './dynamicsTreeView';
import { Utilities } from './helpers/Utilities';
import { Terminal } from './helpers/Terminal';

export default class GenerateEntitiesCommand implements IWireUpCommands {
    public wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // setup configurations
        const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(config, cs.dynamics.configuration.tools.sdkInstallPath);
        // set core tools root
        const coreToolsRoot = path.join(sdkInstallPath, 'CoreTools');

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.powerShell.generateEntities, () => { // Match name of command to package.json command
                // get root path of vscode workspace
                const folders = vscode.workspace.workspaceFolders;
                // see if we have anything open
                if (folders !== undefined) {
                    // loop through open root workspace folders
                    folders.forEach(async workspaceFolder => {
                        // we only support the file system right now
                        if (workspaceFolder.uri.scheme === "file") {
                            // hold on to the current root path
                            const workspaceUri = workspaceFolder.uri;
                            // get the connections
                            const connections = await DynamicsTreeView.Instance.getOrgConnections();
                            // map to array for options in  pick list
                            const options = connections.map(c => c.webApiUrl);
                            // pick which org url you want to run against
                            const url = await vscode.window.showQuickPick(options);
                            // find the index for this url
                            const index = connections.findIndex(c => c.webApiUrl === url);
                            // if nothing just return
                            if (index === -1) { return; }
                            // set the selected connection config
                            const connection: DynamicsWebApi.Config = connections[index];
                            // get the path to generate the file in
                            vscode.window.showOpenDialog({
                                canSelectFolders: true,
                                canSelectFiles: false,
                                canSelectMany: false,
                                defaultUri: workspaceUri
                            }).then(async pathUris => {
                                // collect the selected path uri
                                const Path = pathUris[0].fsPath;
                                // get the output file name
                                const OutputFileName = await vscode.window.showInputBox({
                                    prompt: 'Please enter the output file name',
                                    value: 'XrmEntities.cs'
                                });
                                // get the namespace
                                const Namespace = await vscode.window.showInputBox({
                                    prompt: 'Please enter the namespace for the generated code',
                                    value: 'XrmEntities'
                                });

                                // setup the command text
                                const commandToExecute = `.\\Generate-XrmEntities.ps1 `
                                + `-ToolsPath ${coreToolsRoot} `
                                + `-Url "${Utilities.EnforceTrailingSlash(connection.webApiUrl)}XRMServices/2011/Organization.svc" `
                                + `-Username "${connection.username}" `
                                + `-Password "${connection.password}" `
                                + (connection.domain ? `-Domain "${connection.domain}" ` : '')
                                + `-Path "${Path}" `
                                + `-OutputFile "${OutputFileName}" `
                                + (!Utilities.IsNull(Namespace) ? `-Namespace "${Namespace}" ` : '');

                                // build a powershell terminal
                                const terminal = Terminal.showTerminal(context.globalStoragePath);
                                // execute the command
                                terminal.sendText(commandToExecute);
                            });
                        }
                    });
                }
            })
        );
    }


}