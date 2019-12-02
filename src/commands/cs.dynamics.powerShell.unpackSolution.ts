import * as vscode from 'vscode';
import * as cs from '../cs';
import * as FileSystem from '../core/io/FileSystem';
import * as path from 'path';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import Quickly from '../core/Quickly';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import { Utilities } from '../core/Utilities';
import SolutionMap from '../components/Solutions/SolutionMap';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import ExtensionContext from '../core/ExtensionContext';
import GlobalStateCredentialStore from '../core/security/GlobalStateCredentialStore';
import { Credential } from '../core/security/Types';

/**
 * This command can be invoked by the Command Palette and packs a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, folder?:string, solution?:any, toolsPath?:string, logFile?:string, mappingFile?:string, templateResourceCode?:string, includeResourceFiles?:boolean, allowDelete:boolean = true) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.getConfigurationValue<string>(cs.dynamics.configuration.tools.sdkInstallPath);
	const coreToolsRoot = !Utilities.$Object.isNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
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
	if (Utilities.$Object.isNullOrEmpty(folder)) {
		vscode.window.showInformationMessage("You must select a workspace folder to unpack a solution.");

			return; 
	}

	// If we're asked to unpack into a path with the solution name, use the parent, as this script will already do so.
	if (folder.endsWith(solution.uniquename) || folder.endsWith(solution.uniquename + "/") || folder.endsWith(solution.uniquename + "\\")) { 
		folder = path.join(folder, "../");
	}
	
	FileSystem.makeFolderSync(folder);
	
	toolsPath = toolsPath || coreToolsRoot;
	if (Utilities.$Object.isNull(toolsPath)) { return; }

	if (Utilities.$Object.isNullOrEmpty(logFile)) { 
		if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
			logFile = path.join(ExtensionContext.Instance.globalStoragePath, `/logs/unpack-${solution}-${Utilities.String.dateAsFilename()}`);
		}
	}

	const splitUrl = Utilities.String.noTrailingSlash(config.webApiUrl).split("/");
	let orgName;
	let serverUrl;

	if (config.type === DynamicsWebApi.ConfigType.OnPremises) {
		orgName = splitUrl[splitUrl.length - 1];
		serverUrl = config.webApiUrl.replace(orgName, "");
	} else {
		orgName = config.orgName;
		serverUrl = config.webApiUrl;
	}

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
				.if(() => Credential.isCredential(config.credentials), c => {
					c.text(`-Credential (New-Object System.Management.Automation.PSCredential ("`)
					 .credential(config.credentials, GlobalStateCredentialStore.Instance, creds => creds.username.toString())
					 .text(`", (ConvertTo-SecureString "`)
					 .credential(config.credentials, GlobalStateCredentialStore.Instance, creds => creds.password.toString())
					 .text(`" -AsPlainText -Force))) `);
				})
				.if(() => !Utilities.$Object.isNullOrEmpty(mappingFile), c => c.text(` -MapFile "${mappingFile}"`))
				.if(() => !Utilities.$Object.isNullOrEmpty(logFile), c => c.text(` -LogFile "${logFile}"`))
				.if(() => !Utilities.$Object.isNullOrEmpty(templateResourceCode), c => c.text(` -TemplateResourceLanguageCode "${templateResourceCode}"`))
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