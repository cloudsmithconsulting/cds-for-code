import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../cs';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import QuickPicker from '../core/QuickPicker';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import Utilities from '../core/Utilities';
import IBuildCommands from '../core/CommandBuilder';
import SolutionMap from '../components/SolutionMap/SolutionMap';
import { DynamicsWebApi } from '../api/Types';
import * as FileSystem from "../core/FileSystem";

export default class UnpackDynamicsSolutionCommand implements IBuildCommands {
	public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public buildCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration){
		this.workspaceConfiguration = config;
		
		context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.controls.dynamicsTreeView.unpackSolution, async (item:any) => {
				vscode.commands.executeCommand(cs.dynamics.powerShell.unpackSolution, item.config, undefined, item.context);
			}),

			vscode.commands.registerCommand(cs.dynamics.controls.explorer.unpackSolutionToFolder, async (folder?:vscode.Uri, ...arg2:any) => {
				vscode.commands.executeCommand(cs.dynamics.powerShell.unpackSolution, undefined, folder.fsPath);
			}),

			vscode.commands.registerCommand(cs.dynamics.powerShell.unpackSolution, async (config?:DynamicsWebApi.Config, folder?:string, solution?:any, toolsPath?:string, logFile?:string, mappingFile?:string, templateResourceCode?:string, includeResourceFiles?:boolean, allowDelete:boolean = true) => { // Match name of command to package.json command
                // setup configurations
                const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
                const coreToolsRoot = !Utilities.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
				const map:SolutionMap = SolutionMap.loadFromWorkspace(context);

				config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				solution = solution || await QuickPicker.pickDynamicsSolution(config, "Choose a Solution to unpack", true);
				if (!solution) { return; }

				if (map) {
					const mapping = map.getBySolutionId(solution.solutionid, config.orgId);

					if (mapping && mapping.length > 0 && mapping[0].path && !folder) {
						folder = mapping[0].path;
					}

					if (folder && folder.endsWith(solution.uniquename)) {
						folder = path.join(folder, "..");
					}
				} 

				folder = folder || await QuickPicker.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose a folder where the solution will be unpacked", true, true);
				if (Utilities.IsNullOrEmpty(folder)) {
					vscode.window.showInformationMessage("You must select a workspace folder to unpack a solution.");

					 return; 
				}

				// If we're asked to unpack into a path with the solution name, use the parent, as this script will already do so.
				if (folder.endsWith(solution.uniquename) || folder.endsWith(solution.uniquename + "/") || folder.endsWith(solution.uniquename + "\\")) { 
					folder = path.join(folder, "../");
				}
				
				FileSystem.makeFolderSync(folder);
				
				toolsPath = toolsPath || coreToolsRoot;
				if (Utilities.IsNull(toolsPath)) { return; }

				if (Utilities.IsNullOrEmpty(logFile)) { 
					if ((await QuickPicker.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
						let dateString = new Date().toISOString();
						dateString = dateString.substr(0, dateString.length - 5);
						dateString = dateString.replace("T","-").replace(":","").replace(":", "");
	
						logFile = path.join(context.globalStoragePath, `/logs/unpack-${solution.uniquename}-${dateString}.log`); 
					}
				}

				const splitUrl = Utilities.RemoveTrailingSlash(config.webApiUrl).split("/");
				const orgName = config.domain ? splitUrl[splitUrl.length - 1] : config.orgName;
				let serverUrl = config.domain ? config.webApiUrl.replace(orgName, "") : config.webApiUrl;

				if (serverUrl.endsWith("//")) {
					serverUrl = serverUrl.substring(0, serverUrl.length - 1);
				}

				return DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Scripts\\"))
					.then(async terminal => { 
						return await terminal.run(new TerminalCommand(`.\\Get-XrmSolution.ps1 `)
							.text(`-ServerUrl "${serverUrl}" `)
							.text(`-OrgName "${orgName}" `)
							.text(`-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `)
							.text(`-Path "${folder}" `)
							.text(`-ToolsPath "${toolsPath}" `)
							.text(`-Credential (New-Object System.Management.Automation.PSCredential ("${config.username}", (ConvertTo-SecureString "`)
							.sensitive(`${Utilities.PowerShellSafeString(config.password)}`)
							.text(`" -AsPlainText -Force)))`)
							.if(() => !Utilities.IsNullOrEmpty(mappingFile), c => c.text(` -MapFile "${mappingFile}"`))
							.if(() => !Utilities.IsNullOrEmpty(logFile), c => c.text(` -LogFile "${logFile}"`))
							.if(() => !Utilities.IsNullOrEmpty(templateResourceCode), c => c.text(` -TemplateResourceLanguageCode "${templateResourceCode}"`))
							.if(() => includeResourceFiles, c => c.text(` -IncludeResourceFiles`))
							.if(() => allowDelete, c => c.text(` -AllowDelete`)))
							.then(tc => { 
								map.map(config.orgId, solution.solutionid, path.join(folder, solution.uniquename));
								map.saveToWorkspace(context);
							}).then(() => {
								if (logFile) {
									vscode.workspace.openTextDocument(logFile)
										.then(d => vscode.window.showTextDocument(d));	
								}
							});
					});
			})
		);
	}
}
