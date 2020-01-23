import * as path from 'path';
import * as cs from "../cs";
import * as vscode from 'vscode';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import Quickly, { WorkspaceFileItem } from '../core/Quickly';
import ExtensionContext from "../core/ExtensionContext";
import TerminalManager, { TerminalCommand } from '../components/Terminal/SecureTerminal';
import { Utilities } from '../core/Utilities';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import GlobalStateCredentialStore from '../core/security/GlobalStateCredentialStore';
import * as Security from "../core/security/Types";
import ScriptDownloader from '../components/WebDownloaders/ScriptDownloader';
import logger from '../core/framework/Logger';

/**
 * This command can be invoked by the Command Pallette or external sources and generates .Net code
 * using CrmSvcUtil.exe (included with the Dynamics365 SDK)
 * @export run command function
 * @param {CdsWebApi.Config} [config] Optional web API connection to use when generating entities.
 * @param {string} [folder] Optional folder to store entitiy code in
 * @param {string} [outputFileName] Optional filename to use when generating entities
 * @param {string} [namespace] Optional namespace for generated output
 * @returns Promise with output from terminal command running CrmSvcUtil.exe
 */
export default async function run(config?:CdsWebApi.Config, folder?:string, outputFileName?: string, namespace?: string) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.getConfigurationValue<string>(cs.cds.configuration.tools.sdkInstallPath);
	const coreToolsRoot = !Utilities.$Object.isNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn("Configuration not chosen, command cancelled");
		return; 
	}

	if (!folder && !outputFileName) {
		const chosenItem:WorkspaceFileItem = await Quickly.pickWorkspaceAny(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the destination where generated code will go", undefined, true);

		if (!chosenItem) {
			logger.warn("Workspace file/folder not chosen, command cancelled");
			return; 
		}

		if (chosenItem.itemType === vscode.FileType.Directory) {
			folder = chosenItem.fsPath;
		} else if (chosenItem.itemType === vscode.FileType.File) {
			folder = path.dirname(chosenItem.fsPath);
			outputFileName = path.basename(chosenItem.fsPath);
		}
	}

	folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder to use when generating code");
	if (Utilities.$Object.isNullOrEmpty(folder)) { 
		logger.warn("Workspace folder not chosen, command cancelled");
		return; 
	}

	if (Utilities.$Object.isNullOrEmpty(outputFileName)) {
		const choice = await Quickly.pickWorkspaceFile(vscode.Uri.file(folder), "Choose the filename to use when generating code", undefined, true, [ ".cs", ".vb" ]);

		if (choice) {
			outputFileName = path.basename(choice);
			folder = path.dirname(choice);
		}
	}

	if (Utilities.$Object.isNullOrEmpty(outputFileName)) { 
		logger.warn("Workspace file not chosen, command cancelled");
		return; 
	}

	namespace = namespace || await Quickly.ask("Enter the namespace for the generated code", undefined, path.basename(folder));

	logger.log("Checking to see if the CRM SDK is installed");
	await ScriptDownloader.installCdsSdk();
	
	// build a powershell terminal
	logger.log("Generating entity code");
	return TerminalManager.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "\\Scripts\\"))
		.then(async terminal => {
			return await terminal.run(new TerminalCommand(`.\\Generate-XrmEntities.ps1 `)
				.text(`-ToolsPath ${coreToolsRoot} `)
				.text(`-Url "${Utilities.String.withTrailingSlash(config.webApiUrl)}XRMServices/2011/Organization.svc" `)
				.if(() => Security.Credential.isCredential(config.credentials), c => {
					c.text(`-Username "`)
					 .credential(config.credentials, GlobalStateCredentialStore.Instance, creds => creds.username.toString())
					 .text(`" -Password "`)
					 .credential(config.credentials, GlobalStateCredentialStore.Instance, creds => creds.password.toString())
					 .text(`" `)
					 .if(() => Security.Credential.isWindowsCredential(config.credentials), c2 => {
						 c2.text(` -Domain "`)
						   .credential(config.credentials, GlobalStateCredentialStore.Instance, creds2 => (<Security.WindowsCredential>creds2).domain.toString())
						   .text(`" `);
					 });
				})
				.text(`-Path "${folder}" `)
				.text(`-OutputFile "${outputFileName}" `)
				.text(!Utilities.$Object.isNull(namespace) ? `-Namespace "${namespace}" ` : ''));
		});
}