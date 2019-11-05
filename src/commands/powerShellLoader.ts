import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as cs from '../cs';
import fetch from 'node-fetch';
import IWireUpCommands from '../wireUpCommand';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import Utilities from '../helpers/Utilities';
import GlobalState from '../config/GlobalState';
import ProjectTemplatesPlugin from "../ProjectTemplatesPlugin";
import * as FileSystem from "../helpers/FileSystem";

export default class PowerShellLoader implements IWireUpCommands {
    public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
		//GlobalState.Instance(context).PowerShellScriptVersion = null;

		// do this immediately
        PowerShellLoader.runScriptCheck(context);

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.extension.downloadRequiredScripts, () => { // Downloads scripts from the Internet.
                PowerShellLoader.runScriptCheck(context, config);
            })
        );
    }

    private static runScriptCheck(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
		// get local storage folder
		const scriptsFolder = path.join(context.globalStoragePath, "/scripts/");
		const appsFolder = path.join(context.globalStoragePath, "/tools/");
		
		// Checks to see if folder exist
		FileSystem.MakeFolderSync(scriptsFolder);
		FileSystem.MakeFolderSync(appsFolder);

		const appsToFetch = [
			"releases/download/beta/CloudSmith.Dynamics365.AssemblyScanner.zip",
			"releases/download/beta/CloudSmith.Dynamics365.SamplePlugin.v8.0.zip",
			"releases/download/beta/CloudSmith.Dynamics365.SamplePlugin.v8.1.zip",
			"releases/download/beta/CloudSmith.Dynamics365.SamplePlugin.v8.2.zip",
			"releases/download/beta/CloudSmith.Dynamics365.SamplePlugin.v9.0.zip"
		];

		// Array that stores script names
		const scriptsToFetch = [
			"CloudSmith.Dynamics365.SampleScripts/Deploy-XrmSolution.ps1",
			"CloudSmith.Dynamics365.SampleScripts/Generate-XrmEntities.ps1",
			"CloudSmith.Dynamics365.SampleScripts/Get-XrmSolution.ps1",
			"CloudSmith.Dynamics365.SampleScripts/Install-Sdk.ps1",
			"CloudSmith.Dynamics365.SampleScripts/Install-XrmToolbox.ps1",
			"CloudSmith.Dynamics365.SampleScripts/Setup-EasyRepro.ps1",
			"CloudSmith.Dynamics365.SampleScripts/runonce-script.ps1"
		];

		const remoteFolderPath:string = Utilities.EnforceTrailingSlash(ExtensionConfiguration.getConfigurationValue(cs.dynamics.configuration.tools.updateSource));
		const updateChannel:string = ExtensionConfiguration.getConfigurationValue(cs.dynamics.configuration.tools.updateChannel);
		
		return this.checkVersion(remoteFolderPath, updateChannel)
			.then(version => {
				if (version === -1) {
					vscode.window.showErrorMessage(`The Dynamics 365 extension could not check for updates in the ${updateChannel} channel.  Please check the configuration updateSource and updateChannel to ensure they are set correctly.`);

					return;
				}

				const currentVersion = GlobalState.Instance(context).PowerShellScriptVersion;
				const templateManager = new ProjectTemplatesPlugin(context);

				// For loop to iterate through the array of scripts
				for (var i = 0; i < scriptsToFetch.length; i++ ) {
					// hold the file name for this iteration
					const fileName = scriptsToFetch[i];
					// uri containing remote file location
					const remoteFilePath = `${remoteFolderPath}${fileName}`;
					// local file location
					const localFilePath = path.join(scriptsFolder, path.basename(fileName));
					// see if file exists & if our current version is less than the new version.
					if ((!fs.existsSync(localFilePath))
						|| (!currentVersion || parseFloat(currentVersion.toString()) < version))
					{
						// file doesn't exist, get it from remote location
						PowerShellLoader.downloadScript(remoteFilePath, localFilePath)
							.then(localPath => {
								vscode.window.showInformationMessage(
									`${fileName} PowerShell script downloaded`
								);

								return localPath;
							}).then(localPath => {
								if (localPath.endsWith("Install-Sdk.ps1")) {
									const sdkInstallPath = ExtensionConfiguration.getConfigurationValue<string>(cs.dynamics.configuration.tools.sdkInstallPath);

									if (!fs.existsSync(sdkInstallPath)) {
										fs.mkdirSync(sdkInstallPath);
									}

									DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Scripts\\"))
										.then(terminal => { 
											terminal.run(new TerminalCommand(`.\\Install-Sdk.ps1 `)
												.text(`-Path ${sdkInstallPath} `));
									});
								}
							}).then(() => {
								GlobalState.Instance(context).PowerShellScriptVersion = version;
							});
					}
				}

				// For loop to iterate through the array of "apps"
				for (var j = 0; j < appsToFetch.length; j++ ) {
					// hold the file name for this iteration
					const fileName = appsToFetch[j];
					// uri containing remote file location
					const remoteFilePath = `https://github.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/${fileName}`;
					// local file location
					const localFilePath = path.join(appsFolder, path.basename(fileName));
					// see if file exists & if our current version is less than the new version.
					if ((!fs.existsSync(localFilePath))
						|| (!currentVersion || parseFloat(currentVersion.toString()) < version))
					{
						// file doesn't exist, get it from remote location
						PowerShellLoader.downloadZip(remoteFilePath, localFilePath)
							.then(async localPath => {
								let extractPath = localPath.replace(path.extname(localPath), "");

								// Sample projects are templates
								if (path.basename(fileName).startsWith("CloudSmith.Dynamics365.Sample")) {
									extractPath = path.join(await templateManager.getTemplatesDir(), path.basename(fileName).replace(path.extname(fileName), ""));
								}

								return { zipFile: localPath, extractPath };
							})
							.then(options => {
								FileSystem.Unzip(options.zipFile, options.extractPath)
									.then(count => vscode.window.showInformationMessage(`${count} items extracted from ${options.zipFile} into ${options.extractPath}`));
							})
							.then(() => {
								GlobalState.Instance(context).PowerShellScriptVersion = version;
							});
					}
				}
			});
    }

	//TODO: remove dependence on fetch.
    private static downloadScript(remoteFilePath: string, localFilePath: string): Promise<string> {
        return fetch(remoteFilePath, {
            method: 'get',
            headers: {
                'Accepts': 'text/plain'
			}
        })
		.then(res => res.text())
		.then(body => {
			fs.writeFileSync(localFilePath, body);

			return localFilePath;
        })
        .catch(err => {
			console.error(err);

			return "";
		});
	}

	//TODO: remove dependence on fetch.
	private static downloadZip(remoteFilePath: string, localFilePath: string): Promise<string> {
		return fetch(remoteFilePath, {
			method: 'get',
			headers: {
				'Accepts': 'application/zip'
			}
		})
		.then(res => res.buffer())
		.then(body => {
			fs.writeFileSync(localFilePath, body);

			return localFilePath;
		})
		.catch(err => {
			console.error(err);

			return "";
		});
	}
	
	//TODO: remove dependence on fetch.
    private static checkVersion(remoteFilePath: string, channel: string): Promise<number> {
        return fetch(`${Utilities.EnforceTrailingSlash(remoteFilePath)}${channel}.version`, {
            method: 'get',
            headers: {
                'Accepts': 'text/plain'
			}
        })
		.then(res => res.text())
		.then(text => parseFloat(text))
        .catch(err => {
			console.error(err);

			return -1;
		});
	}
}