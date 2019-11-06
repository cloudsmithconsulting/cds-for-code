import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../cs';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import QuickPicker from '../helpers/QuickPicker';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import Utilities from '../helpers/Utilities';
import IWireUpCommands from '../wireUpCommand';
import SolutionMap from '../config/SolutionMap';
import { DynamicsWebApi } from '../api/Types';
import * as FileSystem from "../helpers/FileSystem";

export default class UnpackDynamicsSolutionCommand implements IWireUpCommands {
	public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration){
		this.workspaceConfiguration = config;
		
		context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.powerShell.unpackSolutionFromExplorer, async (item:any) => {
				vscode.commands.executeCommand(cs.dynamics.powerShell.unpackSolution, item.config, undefined, item.context);
			}),

			vscode.commands.registerCommand(cs.dynamics.powerShell.unpackSolution, async (config?:DynamicsWebApi.Config, folder?:string, solution?:any, toolsPath?:string) => { // Match name of command to package.json command
                // setup configurations
                const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
                const coreToolsRoot = !Utilities.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
				const map = SolutionMap.loadFromWorkspace(context);

				config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				solution = solution || await QuickPicker.pickDynamicsSolution(config, "Choose a Solution to unpack", true);
				if (!solution) { return; }

				if (!folder && map) {
					const mapping = map.getPath(config.orgId, solution.solutionid);

					if (mapping && mapping.path) {
						folder = mapping.path;
					}
				} 

				folder = folder || await QuickPicker.pickWorkspaceRoot(workspaceFolder ? workspaceFolder.uri : undefined, "Choose a folder where the solution will be unpacked", true);
				if (Utilities.IsNullOrEmpty(folder)) {
					vscode.window.showInformationMessage("You must have at least one workspace open to unpack solutions.");

					 return; 
				}
				
				FileSystem.MakeFolderSync(folder);
				
				toolsPath = toolsPath || coreToolsRoot;
				if (Utilities.IsNull(toolsPath)) { return; }

				const splitUrl = Utilities.RemoveTrailingSlash(config.webApiUrl).split("/");
				const orgName = config.domain ? splitUrl[splitUrl.length - 1] : config.orgName;
				let serverUrl = config.domain ? config.webApiUrl.replace(orgName, "") : config.webApiUrl;

				if (serverUrl.endsWith("//")) {
					serverUrl = serverUrl.substring(0, serverUrl.length - 1);
				}

				return DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Scripts\\"))
					.then(terminal => { 
						return terminal.run(new TerminalCommand(`.\\Get-XrmSolution.ps1 `)
							.text(`-ServerUrl "${serverUrl}" `)
							.text(`-OrgName "${orgName}" `)
							.text(`-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `)
							.text(`-Path "${folder}" `)
							.text(`-ToolsPath "${toolsPath}" `)
							.text(`-Credential (New-Object System.Management.Automation.PSCredential ("${config.username}", (ConvertTo-SecureString "`)
							.sensitive(`${Utilities.PowerShellSafeString(config.password)}`)
							.text(`" -AsPlainText -Force))) `))
							.then(tc => { 
									map.map(config.orgId, solution.solutionid, path.join(folder, solution.uniquename));
									map.saveToWorkspace(context);
							});
					});
			})
		);
	}
}
