import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from './cs';
import ExtensionConfiguration from './helpers/ExtensionConfiguration';
import { IWireUpCommands } from './wireUpCommand';
import DynamicsTreeView from './dynamicsTreeView';

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
                    folders.forEach(folder => {
                        // we only support the file system right now
                        if (folder.uri.scheme === "file") {
                            // hold on to the current root path
                            const rootPath = folder.uri.fsPath;

                            DynamicsTreeView.Instance.getOrgConnections()
                                .then(connections => {
                                    // map to array for options in  pick list
                                    const options = connections.map(c => c.webApiUrl);
                                    // ask which connection we are using
                                    vscode.window.showQuickPick(options)
                                        .then(value => {
                                            const index = connections.findIndex(c => c.webApiUrl === value);
                                            const connection: DynamicsWebApi.Config = connections[index];

                                            const powerShellFilePath = path.join(rootPath, 'Get-XrmSolution.ps1');
                                            const connectionString = `AuthType=AD;Url=${connection.webApiUrl};Username=${connection.username};Password=${connection.password};Domain=${connection.domain}`;
                                            let Path: string; //will be filled in below
                                            let OutputFileName = null; //will be filled in below
                                            let Namespace = null; //will be filled in below

                                            // Variables to help execuate PowerShell Commands
                                            const ConnectionString = connectionString;
                                            vscode.window.showWorkspaceFolderPick({
                                                placeHolder: 'Path'
                                            })
                                            .then(folder => {
                                                Path = folder.name;
                                                
                                                vscode.window.showInputBox({
                                                    prompt: 'Please enter the output file name',
                                                    value: 'XrmEntities.cs'
                                                }).then(value => {
                                                    OutputFileName = value;

                                                    vscode.window.showInputBox({
                                                        prompt: 'Please enter the namespace for the generated code',
                                                        value: 'XrmEntities'
                                                    }).then(value => {
                                                        Namespace = value;

                                                        // setup the command text
                                                        const commandToExecute = `${powerShellFilePath} `
                                                            + `-ConnectionString ${ConnectionString}`
                                                            + `-Path ${Path} `
                                                            + `-OutputFile ${OutputFileName} `
                                                            + `-Namespace ${Namespace} `;
                                
                                                        // build a powershell terminal
                                                        const terminal = GenerateEntitiesCommand.showAndReturnTerminal(coreToolsRoot);
                                                        // execute the command
                                                        terminal.sendText(commandToExecute);
                                                    });
                                                });
                                            });
                                        });
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