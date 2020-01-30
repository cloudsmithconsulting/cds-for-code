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
import CodeGenerationManager from '../components/CodeGeneration/CodeGenerationManager';

/**
 * This command can be invoked by the Command Pallette or external sources and generates .Net code
 * using CrmSvcUtil.exe (included with the Dynamics365 SDK)
 * @export run command function
 * @param {CdsWebApi.Config | string} [config] Optional web API connection to use when generating entities, or a string containing a connection string
 * @param {string} [folder] Optional folder to store entitiy code in
 * @param {string} [outputFileName] Optional filename to use when generating entities
 * @param {string} [namespace] Optional namespace for generated output
 * @returns Promise with output from terminal command running CrmSvcUtil.exe
 */
export default async function run(this: CodeGenerationManager, config?: CdsWebApi.Config | string, folder?: string, outputFileName?: string, namespace?: string) {
	// setup configurations
	const sdkInstallPath = ExtensionConfiguration.getConfigurationValueOrDefault<string>(cs.cds.configuration.tools.sdkInstallPath, path.join(ExtensionContext.Instance.globalStoragePath, "Sdk"));
	const coreToolsRoot = !Utilities.$Object.isNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

	if (!config) {
		const connectionChoice = await Quickly.pick("Would you like to connect to CDS using an existing connection or a connection string?", "Existing Connection", "Connection String");

		if (connectionChoice.label === "Existing Connection") {
			config = await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
		} else {
			config = (await Quickly.ask("Enter the connection string use when connecting to CDS", "AuthType=Office365; ServiceUri=https://orgname.crm.dynamics.com; Username=username; Password=password")).toString();
		}
	}

	if (!config) { 
		logger.warn("Configuration not chosen, command cancelled");
		return; 
	}

	if (!folder && !outputFileName) {
		const chosenItem: WorkspaceFileItem = await Quickly.pickWorkspaceAny(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the destination where generated code will go", undefined, true);

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
			let returnPromise: Promise<TerminalCommand>;

			if (typeof config !== 'string') {
				const typedConfig = <CdsWebApi.Config>config;

				returnPromise = terminal.run(new TerminalCommand(`.\\Generate-XrmEntities.ps1 `)
					.text(`-ToolsPath ${coreToolsRoot} `)
					.text(`-Url "${Utilities.String.withTrailingSlash(typedConfig.webApiUrl)}XRMServices/2011/Organization.svc" `)
					.if(() => !typedConfig.credentials, c => c.text(`-Interactive `))
					.if(() => Security.Credential.isCredential(typedConfig.credentials), c => {
						c.text(`-Username "`)
						 .credential(typedConfig.credentials, GlobalStateCredentialStore.Instance, creds => creds.username.toString())
						 .text(`" -Password "`)
						 .credential(typedConfig.credentials, GlobalStateCredentialStore.Instance, creds => creds.password.toString())
						 .text(`" `)
						 .if(() => Security.Credential.isWindowsCredential(typedConfig.credentials), c2 => {
							 c2.text(` -Domain "`)
							   .credential(typedConfig.credentials, GlobalStateCredentialStore.Instance, creds2 => (<Security.WindowsCredential>creds2).domain.toString())
							   .text(`" `);
						 });
					})
					.text(`-Path "${folder}" `)
					.text(`-OutputFile "${outputFileName}" `)
					.text(!Utilities.$Object.isNull(namespace) ? `-Namespace "${namespace}" ` : ''));
			} else {
				returnPromise = terminal.run(new TerminalCommand(`.\\Generate-XrmEntities.ps1 `)
					.text(`-ToolsPath ${coreToolsRoot} `)
					.text(`-ConnectionString "`)
					.sensitive(<string>config)
					.text(`" -Path "${folder}" `)
					.text(`-OutputFile "${outputFileName}" `)
					.text(!Utilities.$Object.isNull(namespace) ? `-Namespace "${namespace}" ` : ''));
			}

			return await returnPromise
				.then(async result => { 
					if (result && result.output.indexOf("Invalid Login Information : An unsecured or incorrectly secured fault was received from the other party.") !== -1) {
						await Quickly.askToRetry('CrmSvcUtil returned a fault attempting to login with the credentials supplied.  Would you like to retry with an interactive login?', 
							async () => { 
								return terminal.run(new TerminalCommand(`.\\Generate-XrmEntities.ps1 `)
									.text(`-ToolsPath ${coreToolsRoot} `)
									.text(`-Path "${folder}" `)
									.text(`-OutputFile "${outputFileName}" `)
									.text(!Utilities.$Object.isNull(namespace) ? `-Namespace "${namespace}" ` : '')
									.text(`-Interactive `));
							},
							"Yes", "No");
					} else {
						return result;
					}
				});
		});
}