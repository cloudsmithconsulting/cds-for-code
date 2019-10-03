import * as vscode from 'vscode';
import * as path from 'path';

export default class GenerateEntitiesCommand {
    public static wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // setup configurations
        const crmSdkRoot = config.get('crmSdkRootPath') as string;
        // set core tools root
        const coreToolsRoot = path.join(crmSdkRoot, 'CoreTools');

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.generateDynamicsEntitiesCommand', () => { // Match name of command to package.json command
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
    
                            // setup the command text
                            const commandToExecute = `& .\\CrmSvcUtil.exe `
                                + `/url:http://crmserver/test/XRMServices/2011/Organization.svc `
                                + `/username:missioncommand `
                                + `/password:$mokingTir33 `.replace('$', '`$') // $ is a problem in powershell
                                + `/domain:CONTOSO `
                                + `/namespace:CloudSmith.Dynamics365.SampleTests `
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

    private static showAndReturnTerminal(cwd: string): vscode.Terminal {
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