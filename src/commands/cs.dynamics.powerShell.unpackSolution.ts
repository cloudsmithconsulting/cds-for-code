import * as vscode from 'vscode';
import * as cs from '../cs';
import * as FileSystem from '../core/io/FileSystem';
import * as path from 'path';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import Quickly from '../core/Quickly';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import { Utilities } from '../core/Utilities';
import SolutionMap from '../components/Solutions/SolutionMap';
import { DynamicsWebApi } from '../webapi/Types';
import ExtensionContext from '../core/ExtensionContext';

/**
 * This command can be invoked by the Command Palette and packs a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, folder?:string, solution?:any, toolsPath?:string, logFile?:string, mappingFile?:string, templateResourceCode?:string, includeResourceFiles?:boolean, allowDelete:boolean = true) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
	const coreToolsRoot = !Utilities.$Object.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
	const map:SolutionMap = SolutionMap.loadFromWorkspace(ExtensionContext.Instance);

	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
	if (!config) { return; }

	solution = solution || await Quickly.pickCdsSolution(config, "Choose a Solution to unpack", true);
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

	folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose a folder where the solution will be unpacked", true, true);
	if (Utilities.$Object.IsNullOrEmpty(folder)) {
		vscode.window.showInformationMessage("You must select a workspace folder to unpack a solution.");

			return; 
	}

	// If we're asked to unpack into a path with the solution name, use the parent, as this script will already do so.
	if (folder.endsWith(solution.uniquename) || folder.endsWith(solution.uniquename + "/") || folder.endsWith(solution.uniquename + "\\")) { 
		folder = path.join(folder, "../");
	}
	
	FileSystem.makeFolderSync(folder);
	
	toolsPath = toolsPath || coreToolsRoot;
	if (Utilities.$Object.IsNull(toolsPath)) { return; }

	if (Utilities.$Object.IsNullOrEmpty(logFile)) { 
		if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
			logFile = path.join(ExtensionContext.Instance.globalStoragePath, `/logs/unpack-${solution}-${Utilities.String.dateAsFilename()}`);
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
			return await terminal.run(new TerminalCommand(`.\\Get-XrmSolution.ps1 `)
				.text(`-ServerUrl "${serverUrl}" `)
				.text(`-OrgName "${orgName}" `)
				.text(`-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `)
				.text(`-Path "${folder}" `)
				.text(`-ToolsPath "${toolsPath}" `)
				.text(`-Credential (New-Object System.Management.Automation.PSCredential ("${config.username}", (ConvertTo-SecureString "`)
				.sensitive(`${Utilities.String.PowerShellSafeString(config.password)}`)
				.text(`" -AsPlainText -Force)))`)
				.if(() => !Utilities.$Object.IsNullOrEmpty(mappingFile), c => c.text(` -MapFile "${mappingFile}"`))
				.if(() => !Utilities.$Object.IsNullOrEmpty(logFile), c => c.text(` -LogFile "${logFile}"`))
				.if(() => !Utilities.$Object.IsNullOrEmpty(templateResourceCode), c => c.text(` -TemplateResourceLanguageCode "${templateResourceCode}"`))
				.if(() => includeResourceFiles, c => c.text(` -IncludeResourceFiles`))
				.if(() => allowDelete, c => c.text(` -AllowDelete`)))
				.then(tc => { 
					map.map(config.orgId, solution.solutionid, path.join(folder, solution.uniquename));
					map.saveToWorkspace(ExtensionContext.Instance);
				}).then(() => {
					if (logFile) {
						vscode.workspace.openTextDocument(logFile)
							.then(d => vscode.window.showTextDocument(d));	
					}
				});
		});

}