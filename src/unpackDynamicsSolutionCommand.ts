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

						// Variables to help execuate PowerShell Commands
						const ServerUrl = null;
						const OrgName = null;
						const SolutionName = null;
						const Path = null;
						const ToolsPath = null;
						const Credential = null;
						const Username = "missioncommand";
						const Password = "$mokingTir33";
						const Domain = "CONTOSO";
						const Namespace = "CloudSmith.Dynamics365.SampleTests";

						// setup the command text
						const commandToExecute = `${codeFilePath} `
							+ `-ServerUrl "${ServerUrl}/test/XRMServices/2011/Organization.svc" `
							+ `-OrgName ${OrgName} `
							+ `-SolutionName ${SolutionName} `
							+ `-Path ${Path} `
							+ `-ToolsPath ${ToolsPath} `
							+ `-Credential ${Credential} `
							+ `-Username:${Username} `
							+ `-Password:${Password} `.replace('$', '`$') // $ is a problem in powershell
							+ `-Domain:${Domain} `
							+ `-Namespace:${Namespace} `
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
