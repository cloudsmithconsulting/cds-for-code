import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as cs from '../cs';
import fetch from 'node-fetch';
import IWireUpCommands from '../wireUpCommand';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import DynamicsTerminal from '../views/DynamicsTerminal';
import Utilities from '../helpers/Utilities';
import GlobalState from '../config/GlobalState';

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
		const folder = path.join(context.globalStoragePath, "/scripts/");
		
		// Checks to see if folder exist
		if (!fs.existsSync(folder)) {
			console.log(`[CloudSmith] Creating folder '${folder}' as it does not exist.`);
			// first check if ext dir exists
			if (!fs.existsSync(context.globalStoragePath)) {
				fs.mkdirSync(context.globalStoragePath);
			}
			fs.mkdirSync(folder);
		}

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
		
		this.checkVersion(remoteFolderPath, updateChannel)
			.then(version => {
				if (version === -1) {
					vscode.window.showErrorMessage(`The Dynamics 365 extension could not check for updates in the ${updateChannel} channel.  Please check the configuration updateSource and updateChannel to ensure they are set correctly.`);

					return;
				}

				const currentVersion = GlobalState.Instance(context).PowerShellScriptVersion;

				// For loop to iterate through the array
				for (var i = 0; i < scriptsToFetch.length; i++ ) {
					// hold the file name for this iteration
					const fileName = scriptsToFetch[i];
					// uri containing remote file location
					const remoteFilePath = `${remoteFolderPath}${fileName}`;
					// local file location
					const localFilePath = path.join(folder, fileName.replace("CloudSmith.Dynamics365.SampleScripts/", ""));
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
							})
							.then(localPath => {
								if (localPath.endsWith("Install-Sdk.ps1")) {
									const sdkInstallPath = ExtensionConfiguration.getConfigurationValue<string>(cs.dynamics.configuration.tools.sdkInstallPath);

									if (!fs.existsSync(sdkInstallPath)) {
										fs.mkdirSync(sdkInstallPath);
									}

									const commandToExecute = `.\\Scripts\\Install-Sdk.ps1 `
										+ `-Path ${sdkInstallPath} `;
									const terminal = DynamicsTerminal.showTerminal(context.globalStoragePath);

									// execute the command
									terminal.sendText(commandToExecute);
								}
							});
					}

					GlobalState.Instance(context).PowerShellScriptVersion = version;
				}
			});
    }

	//TODO: remove dependence on fetch.
    private static downloadScript(remoteFilePath: string, localFilePath: string): Promise<string> {
        return fetch(remoteFilePath, {
            method: 'get',
            headers: {
                'Content-Type': 'text/plain',
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
    private static checkVersion(remoteFilePath: string, channel: string): Promise<number> {
        return fetch(`${Utilities.EnforceTrailingSlash(remoteFilePath)}${channel}.version`, {
            method: 'get',
            headers: {
                'Content-Type': 'text/plain',
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