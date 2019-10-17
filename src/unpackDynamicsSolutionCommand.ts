import * as vscode from 'vscode';
import * as path from 'path';
import GenerateEntitiesCommand from './generateEntitiesCommand';

export class UnpackDynamicsSolutionCommand {
    public static wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration){
	const crmSdkRoot = config.get('crmSdkRootPath') as string;
	// set core tools root
	const coreToolsRoot = path.join(crmSdkRoot, 'CoreTools');

	context.subscriptions.push(
		vscode.commands.registerCommand('cloudSmith.unpackDynamicsSolutionCommand', () => { // Match name of command to package.json command
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
						const codeFilePath = path.join(rootPath, 'Get-XrmSolution.ps1');

						// setup the command text
						const commandToExecute = `.\\Get-XrmSolution.ps1 `
							+ `-ServerUrl ${ServerUrl}`
							+ `-OrgName ${OrgName}`
							+ `-SolutionName ${SolutionName}`
							+ `-Path ${Path}`
							+ `-ToolsPath ${ToolsPath}`
							+ `-Credential ${Credential}`
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
}
