import * as vscode from 'vscode';
import * as cs from '../cs';
import * as fs from 'fs';
import * as path from 'path';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import Quickly from '../core/Quickly';
import TerminalManager, { TerminalCommand } from '../components/Terminal/SecureTerminal';
import { Utilities } from '../core/Utilities';
import SolutionMap from '../components/Solutions/SolutionMap';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import SolutionFile from '../components/SolutionXml/SolutionFile';
import ExtensionContext from '../core/ExtensionContext';
import GlobalStateCredentialStore from '../core/security/GlobalStateCredentialStore';
import { Credential } from '../core/security/Types';
import ScriptDownloader from '../components/WebDownloaders/ScriptDownloader';
import logger from '../core/framework/Logger';

/**
 * This command can be invoked by the Command Palette and packs a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:CdsWebApi.Config, folder?:string, solution?:any, toolsPath?:string, logFile?:string, mappingFile?:string, includeResourceFiles?:boolean, solutionPath?:string, managed?:boolean) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.getConfigurationValueOrDefault<string>(cs.cds.configuration.tools.sdkInstallPath, path.join(ExtensionContext.Instance.globalStoragePath, "Sdk"));
	const coreToolsRoot = !Utilities.$Object.isNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
	const solutionMap:SolutionMap = await SolutionMap.loadFromWorkspace();

	if (solution && config && !folder) {
		if (solutionMap.hasSolutionMap(solution.solutionid, config.orgId))					 {
			folder = solutionMap.getBySolutionId(solution.solutionid, config.orgId)[0].path;
		}
	}

	folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder containing the solution to pack", true);
	if (Utilities.$Object.isNullOrEmpty(folder)) { 
		logger.warn("Folder not chosen, command cancelled");
		return; 
	}
	
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) {
		logger.warn("Organization not chosen, command cancelled");
		return; 
	}

	if (!solution) {
		let solutionFolder = folder;
		let solutionFile = path.join(solutionFolder, "Other/Solution.xml");

		if (!fs.existsSync(solutionFile)) { 
			solution = await Quickly.pickCdsSolution(config, "Choose a Dynamics 365 Solution to pack", true);

			if (!solution) {
				logger.warn("Solution not chosen, command cancelled");
				return; 
			}
		}

		if (fs.existsSync(solutionFile)) {
			const solutionFileXml:SolutionFile = await SolutionFile.from(solutionFile);
			
			if (!solutionFileXml.isValid) {
				logger.error(`The solution file ${solutionFile} is not a valid Dynamics 365 solution manifest.`);
				Quickly.error(`The solution file ${solutionFile} is not a valid Dynamics 365 solution manifest.`); 

				return;
			}

			solution = await solutionFileXml.uniqueName;
		} 
		else {
			return;
		}
	}

	toolsPath = toolsPath || coreToolsRoot;
	if (Utilities.$Object.isNull(toolsPath)) { return; }

	managed = managed || false;

	const publishXml = await Quickly.pickBoolean("Do you also wish to publish your customizations?", "Yes", "No");

	if (Utilities.$Object.isNullOrEmpty(logFile)) { 
		if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
			logFile = path.join(ExtensionContext.Instance.globalStoragePath, `/logs/deploy-${typeof solution === "string" ? solution : solution.uniquename}-${Utilities.String.dateAsFilename()}`);
		}
	}

	const splitUrl = Utilities.String.noTrailingSlash(config.webApiUrl).split("/");
	let orgName;
	let serverUrl;

	if (config.type === CdsWebApi.ConfigType.OnPremises) {
		orgName = splitUrl[splitUrl.length - 1];
		serverUrl = config.webApiUrl.replace(orgName, "");
	} else {
		orgName = config.orgName;
		serverUrl = config.webApiUrl;
	}

	if (serverUrl.endsWith("//")) {
		serverUrl = serverUrl.substring(0, serverUrl.length - 1);
	}
	
	await ScriptDownloader.installCdsSdk();

	return await TerminalManager.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "\\Scripts\\"))
		.then(async terminal => { 
			return await terminal.run(new TerminalCommand(`.\\Deploy-XrmSolution.ps1 `)
				.text(`-ServerUrl "${serverUrl}" `)
				.text(`-OrgName "${orgName}" `)
				.text(`-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `)
				.text(`-Path "${folder}" `)
				.text(`-ToolsPath "${toolsPath}" `)
				.if(() => Credential.isCredential(config.credentials), c => {
					c.text(`-Credential (New-Object System.Management.Automation.PSCredential ("`)
					 .credential(config.credentials, GlobalStateCredentialStore.Instance, creds => creds.username.toString())
					 .text(`", (ConvertTo-SecureString "`)
					 .credential(config.credentials, GlobalStateCredentialStore.Instance, creds => Utilities.String.powerShellSafe(creds.password.toString(), '"'))
					 .text(`" -AsPlainText -Force))) `);
				})
				.if(() => !Utilities.$Object.isNullOrEmpty(mappingFile), c => c.text(` -MapFile "${mappingFile}"`))
				.if(() => !Utilities.$Object.isNullOrEmpty(logFile), c => c.text(` -LogFile "${logFile}"`))
				.if(() => includeResourceFiles, c => c.text(` -IncludeResourceFiles`))
				.if(() => !Utilities.$Object.isNullOrEmpty(solutionPath), c => c.text(` -SaveSolution "${solutionPath}"`))
				.if(() => managed, c => c.text(` -Managed`)))
				.then(() => {
					if (logFile) {
						vscode.workspace.openTextDocument(logFile)
							.then(d => vscode.window.showTextDocument(d));	
					}
				})
				.then(async () => {
					if (publishXml) {
						vscode.commands.executeCommand(cs.cds.deployment.publishCustomizations, config);
					}
				});
		});
}