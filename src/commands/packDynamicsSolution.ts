import * as vscode from 'vscode';
import * as cs from '../cs';
import * as fs from 'fs';
import * as path from 'path';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import QuickPicker, { QuickPickOption } from '../helpers/QuickPicker';
import DynamicsTerminal from '../views/DynamicsTerminal';
import Utilities from '../helpers/Utilities';
import IWireUpCommands from '../wireUpCommand';
import SolutionMap from '../config/SolutionMap';
import XmlParser from '../helpers/XmlParser';
import { TS } from 'typescript-linq/TS';
import { DynamicsWebApi } from '../api/Types';

export default class PackDynamicsSolutionCommand implements IWireUpCommands {
	public workspaceConfiguration:vscode.WorkspaceConfiguration;

	public wireUpCommands (context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
		this.workspaceConfiguration = config;

		// now wire a command into the context
		context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.powerShell.packSolutionFromExplorer, async (folder?:vscode.Uri, arg2?:any) => {
				vscode.commands.executeCommand(cs.dynamics.powerShell.packSolution, undefined, folder.fsPath);
			}),

			vscode.commands.registerCommand(cs.dynamics.powerShell.packSolution, async (config?:DynamicsWebApi.Config, folder?:string, solution?:any, toolsPath?:string, managed?:boolean) => { // Match name of command to package.json command
                // setup configurations
                const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
                const coreToolsRoot = !Utilities.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

				folder = folder || await QuickPicker.pickWorkspacePath(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder containing the solution to pack", true);
				if (Utilities.IsNullOrEmpty(folder)) { return; }
				
				config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				if (!solution) {
					let solutionFolder = folder;
					let solutionFile = path.join(solutionFolder, "Other/Solution.xml");

					if (!fs.existsSync(solutionFile)) { 
						solutionFile = ''; 

						const solutionMap:SolutionMap = await SolutionMap.read();
						const solutionFolders = new TS.Linq.Enumerator(solutionMap.mappings)
							.where(m => m.path.startsWith(folder))
							.select(m => new QuickPickOption(m.path, null))
							.toArray();
	
						if (solutionFolders && solutionFolders.length > 0) {
							if (solutionFolders.length > 1) {
								let pickValue = await QuickPicker.pick("Choose the folder containing the solution to pack", ...solutionFolders);
	
								if (pickValue) { solutionFolder = pickValue.label; } else { return; }
							} else { 
								solutionFolder = solutionFolders[0].label; 
							}
	
							folder = solutionFolder;
							solutionFile = path.join(solutionFolder, "Other/Solution.xml");
						}
					}

					if (fs.existsSync(solutionFile)) {
						const solutionFileObject = await XmlParser.parseFile(solutionFile);
						
						if (!solutionFileObject 
							|| !solutionFileObject.ImportExportXml 
							|| !solutionFileObject.ImportExportXml.SolutionManifest 
							|| solutionFileObject.ImportExportXml.SolutionManifest.length === 0 
							|| !solutionFileObject.ImportExportXml.SolutionManifest[0].UniqueName) {
							vscode.window.showErrorMessage(`The solution file ${solutionFile} is not a valid Dynamics 365 solution manifest.`); 

							return;
						}

						solution = solutionFileObject.ImportExportXml.SolutionManifest[0].UniqueName.toString();
					} 
					else {
						return;
					}
				}

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
				const commandToExecute = `.\\Deploy-XrmSolution.ps1 `
					+ `-ServerUrl "${serverUrl}" `
					+ `-OrgName "${orgName}" `
					+ `-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `
					+ `-Path "${folder}" `
					+ `-ToolsPath "${toolsPath}" `
					+ `-Credential (New-Object System.Management.Automation.PSCredential (“${config.username}”, (ConvertTo-SecureString “${Utilities.PowerShellSafeString(config.password)}” -AsPlainText -Force))) `
					+ (managed ? `-Managed ` : '');

				// build a powershell terminal
				const terminal = DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Scripts\\"));

				// execute the command
				terminal.sendText(commandToExecute);
			})
		);
	}
}