import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from './cs';
import ExtensionConfiguration from './ExtensionConfiguration';
import { IWireUpCommands } from './wireUpCommand';

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
    
                            // setup the code file path to be generated
                            const codeFilePath = path.join(rootPath, 'XrmEntities.cs');
    
                            // Variables to help execuate PowerShell Commands
                            const ConnectionString = null;
                            const Path = null;
                            const ToolsPath = null;
                            const Namespace = null;
                            const Username = "missioncommand";
                            const Password = "$mokingTir33";
                            const Domain = "CONTOSO";

                            // setup the command text
                            const commandToExecute = `${codeFilePath} `
                                + `-ConnectionString ${ConnectionString}`
                                + `-Path ${Path} `
                                + `-OutputFile ${codeFilePath} `
                                + `-ToolsPath ${ToolsPath}`
                                + `-Namespace ${Namespace} `
                                + `-Username:${Username} `
                                + `-Password:${Password} `.replace('$', '`$') // $ is a problem in powershell
                                + `-Domain:${Domain} `
                                + `/out:${codeFilePath}`;
    
                            // build a powershell terminal
                            const terminal = GenerateEntitiesCommand.showAndReturnTerminal(coreToolsRoot);
                            // execute the command
                            terminal.sendText(commandToExecute);
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