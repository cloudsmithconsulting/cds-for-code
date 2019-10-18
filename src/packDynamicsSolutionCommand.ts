import * as vscode from 'vscode';
import * as path from 'path';
import GenerateEntitiesCommand from './generateEntitiesCommand';
import * as cs from './cs';
import { IWireUpCommands } from './wireUpCommand';

export class PackDynamicsSolutionCommand implements IWireUpCommands {
	public wireUpCommands (context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
	// setup configurations
	const crmSdkRoot = config.get('sdkInstallPath') as string;
	// set core tools root
	const coreToolsRoot = path.join(crmSdkRoot, 'CoreTools');

	// now wire a command into the context
	context.subscriptions.push(
		vscode.commands.registerCommand(cs.dynamics.powerShell.packSolution, () => { // Match name of command to package.json command
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
						const codeFilePath = path.join(rootPath, 'Deploy-XrmSolutions.ps1');

						// Variables to help execuate PowerShell Commands
						const ServerURL = null;
						const OrgName = null;
						const SolutionName = null;
						const Path = null;
						const ToolsPath = null;
						const Credential = null;
						const Managed = null;
						const Username = "missioncommand";
						const Password = "$mokingTir33";
						const Domain = "CONTOSO";
						const Namespace = "CloudSmith.Dynamics365.SampleTests";

						// setup the command text
						const commandToExecute = `${codeFilePath} `
							+ `-ServerUrl "${ServerURL}/XRMServices/2011/Organization.svc" `
							+ `-OrgName ${OrgName}`
							+ `-SolutionName ${SolutionName}`
							+ `-Path ${Path}`
							+ `-ToolsPath ${ToolsPath}`
							+ `-Credential ${Credential}`
							+ `-Managed ${Managed}`
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