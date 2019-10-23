import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from './cs';
import ExtensionConfiguration from './helpers/ExtensionConfiguration';
import { IWireUpCommands } from './wireUpCommand';
import DynamicsTreeView from './dynamicsTreeView';
import { Utilities } from './helpers/Utilities';

export default class GenerateEntitiesCommand implements IWireUpCommands {
    public wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // setup configurations
        const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(config, cs.dynamics.configuration.sdkInstallPath);
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
                                // setup other variables
                                const ConnectionString = `AuthType=AD;Url=${connection.webApiUrl};Username=${connection.username};Password=${connection.password};Domain=${connection.domain}`;
                                const powerShellFilePath = path.join(context.globalStoragePath, 'Generate-XrmEntities.ps1');
                                // setup the command text
                                const commandToExecute = `${powerShellFilePath} `
                                + `-ToolsPath ${coreToolsRoot} `
                                + `-ConnectionString ${ConnectionString} `
                                + `-Path ${Path} `
                                + `-OutputFile ${OutputFileName} `
                                + `-Namespace ${Namespace} `;
                                // build a powershell terminal
                                const terminal = GenerateEntitiesCommand.showAndReturnTerminal(coreToolsRoot);
                                // execute the command
                                terminal.sendText(commandToExecute);
                            });
                        }
                    });
                }
            })
        );
    }

    public static showAndReturnTerminal(cwd: string): vscode.Terminal {
        const terminalName = 'CloudSmith: Dynamics PowerShell';
		//see if our terminal is open all ready
		const index = vscode.window.terminals.findIndex(t => t.name === terminalName);
		if (index === -1) {
			// index wasn't found, return new terminal
			const result = vscode.window.createTerminal({
				name: terminalName,
				// make sure we get powershell
				shellPath: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
				cwd // current working directory
			});
			// show it
			result.show();
			// return it
			return result;
		}
		// get terminal with name at index
		const result = vscode.window.terminals[index];
		// change cwd
		result.sendText(`cd ${cwd}`);
		// show it
		result.show();
		// return it
		return result;
	}
}