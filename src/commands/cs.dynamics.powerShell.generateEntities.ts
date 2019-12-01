import * as path from 'path';
import * as cs from "../cs";
import * as vscode from 'vscode';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import Quickly, { WorkspaceFileItem } from '../core/Quickly';
import ExtensionContext from "../core/ExtensionContext";
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import { Utilities } from '../core/Utilities';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import GlobalStateCredentialStore from '../core/security/GlobalStateCredentialStore';

/**
 * This command can be invoked by the Command Pallette or external sources and generates .Net code
 * using CrmSvcUtil.exe (included with the Dynamics365 SDK)
 * @export run command function
 * @param {DynamicsWebApi.Config} [config] Optional web API connection to use when generating entities.
 * @param {string} [folder] Optional folder to store entitiy code in
 * @param {string} [outputFileName] Optional filename to use when generating entities
 * @param {string} [namespace] Optional namespace for generated output
 * @returns Promise with output from terminal command running CrmSvcUtil.exe
 */
export default async function run(config?:DynamicsWebApi.Config, folder?:string, outputFileName?: string, namespace?: string) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.getConfigurationValue<string>(cs.dynamics.configuration.tools.sdkInstallPath);
	const coreToolsRoot = !Utilities.$Object.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
	if (!config) { return; }

	if (!folder && !outputFileName) {
		const chosenItem:WorkspaceFileItem = await Quickly.pickWorkspaceAny(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the destination where generated code will go", undefined, true);

		if (chosenItem.itemType === vscode.FileType.Directory) {
			folder = chosenItem.fsPath;
		} else if (chosenItem.itemType === vscode.FileType.File) {
			folder = path.dirname(chosenItem.fsPath);
			outputFileName = path.basename(chosenItem.fsPath);
		}
	}

	folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder to use when generating code");
	if (Utilities.$Object.IsNullOrEmpty(folder)) { return; }

	outputFileName = outputFileName || await Quickly.pickWorkspaceFile(vscode.Uri.file(folder), "Choose the filename to use when generating code");
	if (Utilities.$Object.IsNullOrEmpty(outputFileName)) { return; }

	namespace = namespace || await Quickly.ask("Enter the namespace for the generated code", undefined, path.dirname(folder));
	if (Utilities.$Object.IsNullOrEmpty(namespace)) { return; }

	// build a powershell terminal
	return DynamicsTerminal.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "\\Scripts\\"))
		.then(async terminal => {
			return await terminal.run(new TerminalCommand(`.\\Generate-XrmEntities.ps1 `)
				.text(`-ToolsPath ${coreToolsRoot} `)
				.text(`-Url "${Utilities.String.EnforceTrailingSlash(config.webApiUrl)}XRMServices/2011/Organization.svc" `)
				.text(`-Username "${config.credentials.username}" -Password "`)
				.sensitive(`${Utilities.String.PowerShellSafeString(config.credentials.decrypt(GlobalStateCredentialStore.Instance))}`)
				.text(`" `)
				.text((config.domain ? `-Domain "${config.domain}" ` : ''))
				.text(`-Path "${folder}" `)
				.text(`-OutputFile "${outputFileName}" `)
				.text(!Utilities.$Object.IsNull(namespace) ? `-Namespace "${namespace}" ` : ''));
		});
}