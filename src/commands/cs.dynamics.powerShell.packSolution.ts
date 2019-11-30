import * as vscode from 'vscode';
import * as cs from '../cs';
import * as fs from 'fs';
import * as path from 'path';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import Quickly from '../core/Quickly';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import { Utilities } from '../core/Utilities';
import SolutionMap from '../components/Solutions/SolutionMap';
import { DynamicsWebApi } from '../http/Types';
import WorkspaceState from '../components/Configuration/WorkspaceState';
import SolutionFile from '../components/SolutionXml/SolutionFile';
import ExtensionContext from '../core/ExtensionContext';

/**
 * This command can be invoked by the Command Palette and packs a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, folder?:string, solution?:any, toolsPath?:string, logFile?:string, mappingFile?:string, includeResourceFiles?:boolean, solutionPath?:string, managed?:boolean) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.getConfigurationValue<string>(cs.dynamics.configuration.tools.sdkInstallPath);
	const coreToolsRoot = !Utilities.$Object.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
	const solutionMap:SolutionMap = WorkspaceState.Instance(ExtensionContext.Instance).SolutionMap;

	if (solution && config && !folder) {
		if (solutionMap.hasSolutionMap(solution.solutionid, config.orgId))					 {
			folder = solutionMap.getBySolutionId(solution.solutionid, config.orgId)[0].path;
		}
	}

	folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder containing the solution to pack", true);
	if (Utilities.$Object.IsNullOrEmpty(folder)) { return; }
	
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
	if (!config) { return; }

	if (!solution) {
		let solutionFolder = folder;
		let solutionFile = path.join(solutionFolder, "Other/Solution.xml");

		if (!fs.existsSync(solutionFile)) { 
			solution = await Quickly.pickCdsSolution(config, "Choose a Dynamics 365 Solution to pack", true);

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
	if (Utilities.$Object.IsNull(toolsPath)) { return; }

	managed = managed || false;

	const publishXml = await Quickly.pickBoolean("Do you also wish to publish your customizations?", "Yes", "No");

	if (Utilities.$Object.IsNullOrEmpty(logFile)) { 
		if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
			logFile = path.join(ExtensionContext.Instance.globalStoragePath, `/logs/deploy-${solution}-${Utilities.String.dateAsFilename()}`);
		}
	}

	const splitUrl = Utilities.String.RemoveTrailingSlash(config.webApiUrl).split("/");
	const orgName = config.domain ? splitUrl[splitUrl.length - 1] : config.orgName;
	let serverUrl = config.domain ? config.webApiUrl.replace(orgName, "") : config.webApiUrl;

	if (serverUrl.endsWith("//")) {
		serverUrl = serverUrl.substring(0, serverUrl.length - 1);
	}
	
	return DynamicsTerminal.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "\\Scripts\\"))
		.then(async terminal => { 
			return await terminal.run(new TerminalCommand(`.\\Deploy-XrmSolution.ps1 `)
				.text(`-ServerUrl "${serverUrl}" `)
				.text(`-OrgName "${orgName}" `)
				.text(`-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `)
				.text(`-Path "${folder}" `)
				.text(`-ToolsPath "${toolsPath}" `)
				.text(`-Credential (New-Object System.Management.Automation.PSCredential ("${config.username}", (ConvertTo-SecureString "`)
				.sensitive(`${Utilities.String.PowerShellSafeString(config.password)}`)
				.text(`" -AsPlainText -Force))) `)
				.if(() => !Utilities.$Object.IsNullOrEmpty(mappingFile), c => c.text(` -MapFile "${mappingFile}"`))
				.if(() => !Utilities.$Object.IsNullOrEmpty(logFile), c => c.text(` -LogFile "${logFile}"`))
				.if(() => includeResourceFiles, c => c.text(` -IncludeResourceFiles`))
				.if(() => !Utilities.$Object.IsNullOrEmpty(solutionPath), c => c.text(` -SaveSolution "${solutionPath}"`))
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
}