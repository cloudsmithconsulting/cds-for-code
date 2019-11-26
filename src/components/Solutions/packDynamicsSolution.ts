import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as fs from 'fs';
import * as path from 'path';
import ExtensionConfiguration from '../../core/ExtensionConfiguration';
import Quickly from '../../core/Quickly';
import DynamicsTerminal, { TerminalCommand } from '../../views/DynamicsTerminal';
import Utilities from '../../core/Utilities';
import IContributor from '../../core/CommandBuilder';
import SolutionMap from './SolutionMap';
import { DynamicsWebApi } from '../../webapi/Types';
import WorkspaceState from '../Configuration/WorkspaceState';
import SolutionFile from '../SolutionXml/SolutionFile';

export default class PackDynamicsSolutionCommand implements IContributor {
	public workspaceConfiguration:vscode.WorkspaceConfiguration;

	public contribute (context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
		this.workspaceConfiguration = config;

		// now wire a command into the context
		context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.packSolutionFromFolder, async (folder?:vscode.Uri, ...arg2:any) => {
				vscode.commands.executeCommand(cs.dynamics.powerShell.packSolution, undefined, folder.fsPath);
			}),

			vscode.commands.registerCommand(cs.dynamics.powerShell.packSolution, async (config?:DynamicsWebApi.Config, folder?:string, solution?:any, toolsPath?:string, logFile?:string, mappingFile?:string, includeResourceFiles?:boolean, solutionPath?:string, managed?:boolean) => { // Match name of command to package.json command
                // setup configurations
                const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
                const coreToolsRoot = !Utilities.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
				const solutionMap:SolutionMap = WorkspaceState.Instance(context).SolutionMap;

				if (solution && config && !folder) {
					if (solutionMap.hasSolutionMap(solution.solutionid, config.orgId))					 {
						folder = solutionMap.getBySolutionId(solution.solutionid, config.orgId)[0].path;
					}
				}

				folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder containing the solution to pack", true);
				if (Utilities.IsNullOrEmpty(folder)) { return; }
				
				config = config || await Quickly.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				if (!solution) {
					let solutionFolder = folder;
					let solutionFile = path.join(solutionFolder, "Other/Solution.xml");

					if (!fs.existsSync(solutionFile)) { 
						solution = await Quickly.pickDynamicsSolution(config, "Choose a Dynamics 365 Solution to pack", true);

						if (!solution) { return; }
					}

					if (fs.existsSync(solutionFile)) {
						const solutionFileXml:SolutionFile = await SolutionFile.from(solutionFile);
						
						if (!solutionFileXml.isValid) {
							vscode.window.showErrorMessage(`The solution file ${solutionFile} is not a valid Dynamics 365 solution manifest.`); 

							return;
						}

						solution = await solutionFileXml.uniqueName;
					} 
					else {
						return;
					}
				}

				toolsPath = toolsPath || coreToolsRoot;
				if (Utilities.IsNull(toolsPath)) { return; }

				managed = managed || false;

				const publishXml = await Quickly.pickBoolean("Do you also wish to publish your customizations?", "Yes", "No");

				if (Utilities.IsNullOrEmpty(logFile)) { 
					if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
						let dateString = new Date().toISOString();
						dateString = dateString.substr(0, dateString.length - 5);
						dateString = dateString.replace("T","-").replace(":","").replace(":", "");
	
						logFile = path.join(context.globalStoragePath, `/logs/deploy-${solution}-${dateString}.log`); 
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
						return await terminal.run(new TerminalCommand(`.\\Deploy-XrmSolution.ps1 `)
							.text(`-ServerUrl "${serverUrl}" `)
							.text(`-OrgName "${orgName}" `)
							.text(`-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `)
							.text(`-Path "${folder}" `)
							.text(`-ToolsPath "${toolsPath}" `)
							.text(`-Credential (New-Object System.Management.Automation.PSCredential ("${config.username}", (ConvertTo-SecureString "`)
							.sensitive(`${Utilities.PowerShellSafeString(config.password)}`)
							.text(`" -AsPlainText -Force))) `)
							.if(() => !Utilities.IsNullOrEmpty(mappingFile), c => c.text(` -MapFile "${mappingFile}"`))
							.if(() => !Utilities.IsNullOrEmpty(logFile), c => c.text(` -LogFile "${logFile}"`))
							.if(() => includeResourceFiles, c => c.text(` -IncludeResourceFiles`))
							.if(() => !Utilities.IsNullOrEmpty(solutionPath), c => c.text(` -SaveSolution "${solutionPath}"`))
							.if(() => managed, c => c.text(` -Managed`)))
							.then(() => {
								if (logFile) {
									vscode.workspace.openTextDocument(logFile)
										.then(d => vscode.window.showTextDocument(d));	
								}
							})
							.then(async () => {
								if (publishXml) {
									vscode.commands.executeCommand(cs.dynamics.deployment.publishCustomizations, config);
								}
							});
					});
			})
		);
	}
}