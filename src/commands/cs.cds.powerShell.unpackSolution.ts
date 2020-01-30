import * as vscode from 'vscode';
import * as cs from '../cs';
import * as FileSystem from '../core/io/FileSystem';
import * as path from 'path';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import Quickly from '../core/Quickly';
import TerminalManager, { TerminalCommand } from '../components/Terminal/SecureTerminal';
import { Utilities } from '../core/Utilities';
import SolutionMap from '../components/Solutions/SolutionMap';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import ExtensionContext from '../core/ExtensionContext';
import ScriptDownloader from '../components/WebDownloaders/ScriptDownloader';
import logger from '../core/framework/Logger';
import { ExportSolutionOptions } from './cs.cds.deployment.exportSolution';
import SolutionManager from '../components/Solutions/SolutionManager';

/**
 * This command can be invoked by the Command Palette and packs a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(this: SolutionManager, config?: CdsWebApi.Config, folder?: string, solution?: any, toolsPath?: string, logFile?: string, mappingFile?: string, templateResourceCode?: string, includeResourceFiles?: boolean, allowDelete: boolean = true) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.getConfigurationValueOrDefault<string>(cs.cds.configuration.tools.sdkInstallPath, path.join(ExtensionContext.Instance.globalStoragePath, "Sdk"));
	const coreToolsRoot = !Utilities.$Object.isNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
	const map:SolutionMap = await SolutionMap.loadFromWorkspace();

	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.powerShell.unpackSolution} Organization not chosen, command cancelled`);
		return; 
	}

	solution = solution || await Quickly.pickCdsSolution(config, "Choose a Solution to unpack", true);
	if (!solution) { 
		logger.warn(`Command: ${cs.cds.powerShell.unpackSolution} Solution not chosen, command cancelled`);
		return; 
	}

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
		logger.warn(`Command: ${cs.cds.powerShell.unpackSolution} Workspace not chosen, command cancelled`);
		return; 
	}

	// If we're asked to unpack into a path with the solution name, use the parent, as this script will already do so.
	if (folder.endsWith(solution.uniquename) || folder.endsWith(solution.uniquename + "/") || folder.endsWith(solution.uniquename + "\\")) { 
		folder = path.join(folder, "../");
	}
	
	FileSystem.makeFolderSync(folder);
	
	toolsPath = toolsPath || coreToolsRoot;
	if (Utilities.$Object.isNull(toolsPath)) { 
		logger.warn("Tools path not set, command cancelled");
		return; 
	}

	if (Utilities.$Object.isNullOrEmpty(logFile)) { 
		if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
			logFile = path.join(ExtensionContext.Instance.globalStoragePath, `/logs/unpack-${typeof solution === "string" ? solution : solution.uniquename}-${Utilities.String.dateAsFilename()}`);
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

	const solutionLocation = path.join(folder, `${solution.uniquename}_temp.zip`);
	const solutionExportOptions: ExportSolutionOptions = {
		SolutionName: solution.uniquename,
		Managed: false,
		ExportIsvConfig: true,
		ExportExternalApplications: true
	};

	logger.log(`Command: ${cs.cds.powerShell.unpackSolution} Checking to see if CDS SDK is installed`);
	await ScriptDownloader.installCdsSdk();	

	logger.log(`Command: ${cs.cds.powerShell.unpackSolution} Exporting solution`);
	const result = await vscode.commands.executeCommand(
		cs.cds.deployment.exportSolution, 
		config, 
		solution, 
		vscode.Uri.file(solutionLocation), 
		solutionExportOptions,
		false);

	if (!result) {
		logger.log(`Command: ${cs.cds.powerShell.unpackSolution} Export cancelled, exiting command invocation`);

		return;
	}

	return await TerminalManager.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "\\Scripts\\"))
		.then(async terminal => { 
			return await terminal.run(new TerminalCommand(`.\\Get-XrmSolution.ps1 `)
				.text(`-SolutionFile "${solutionLocation}" `)
				.text(`-SolutionName "${typeof(solution) === 'string' ? solution : solution.uniquename}" `)
				.text(`-Path "${folder}" `)
				.text(`-ToolsPath "${toolsPath}" `)
				.if(() => !Utilities.$Object.isNullOrEmpty(mappingFile), c => c.text(` -MapFile "${mappingFile}"`))
				.if(() => !Utilities.$Object.isNullOrEmpty(logFile), c => c.text(` -LogFile "${logFile}"`))
				.if(() => !Utilities.$Object.isNullOrEmpty(templateResourceCode), c => c.text(` -TemplateResourceLanguageCode "${templateResourceCode}"`))
				.if(() => includeResourceFiles, c => c.text(` -IncludeResourceFiles`))
				.if(() => allowDelete, c => c.text(` -AllowDelete`)))
				.then(async tc => { 
					map.map(config.orgId, solution.solutionid, path.join(folder, solution.uniquename));
					await map.saveToWorkspace();

					return tc;
				}).then(tc => {
					if (logFile) {
						vscode.workspace.openTextDocument(logFile)
							.then(d => vscode.window.showTextDocument(d));	
					}

					return tc;
				});
		})
		.then(result => {
			logger.log(`Command: ${cs.cds.powerShell.unpackSolution} Deleting zipped solution file`);

			FileSystem.deleteItem(solutionLocation);

			return result;
		});

}