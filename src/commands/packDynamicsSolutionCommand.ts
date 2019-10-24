import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../cs';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import { QuickPicker } from '../helpers/QuickPicker';
import { Terminal } from '../helpers/Terminal';
import { Utilities } from '../helpers/Utilities';
import { IWireUpCommands } from '../wireUpCommand';

export class PackDynamicsSolutionCommand implements IWireUpCommands {
	public workspaceConfiguration:vscode.WorkspaceConfiguration;

	public wireUpCommands (context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
		this.workspaceConfiguration = config;

		// now wire a command into the context
		context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.powerShell.packSolution, async (config?:DynamicsWebApi.Config, folder?:string, solutionName?:string, toolsPath?:string, managed?:boolean) => { // Match name of command to package.json command
                // setup configurations
                const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
                const coreToolsRoot = !Utilities.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

				config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				if (!solutionName) {
					const solution = await QuickPicker.pickDynamicsSolution(config, "Choose a solution to update", true);

					if (!solution) { return; } else { solutionName = solution.uniquename; }
				}

				folder = folder || await QuickPicker.pickWorkspacePath(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder containing the solution to pack", true);
				if (Utilities.IsNullOrEmpty(folder)) { return; }

				toolsPath = toolsPath || coreToolsRoot;
				if (Utilities.IsNull(toolsPath)) { return; }

				managed = managed || false;

				const splitUrl = Utilities.RemoveTrailingSlash(config.webApiUrl).split("/");
				const orgName = config.domain ? splitUrl[splitUrl.length - 1] : config.orgName;
				let serverUrl = config.domain ? config.webApiUrl.replace(orgName, "") : config.webApiUrl;

				if (serverUrl.endsWith("//")) {
					serverUrl = serverUrl.substring(0, serverUrl.length - 1);
				}
				
				// setup the command text
				const commandToExecute = `.\\Deploy-XrmSolutions.ps1 `
					+ `-ServerUrl "${serverUrl}" `
					+ `-OrgName "${orgName}" `
					+ `-SolutionName "${solutionName}" `
					+ `-Path "${folder}" `
					+ `-ToolsPath "${toolsPath}" `
					+ `-Credential (New-Object System.Management.Automation.PSCredential (“${config.username}”, (ConvertTo-SecureString “${Utilities.PowerShellSafeString(config.password)}” -AsPlainText -Force))) `
					+ (managed ? `-Managed ` : '');

				// build a powershell terminal
				const terminal = Terminal.showTerminal(context.globalStoragePath);

				// execute the command
				terminal.sendText(commandToExecute);
			})
		);
	}
}