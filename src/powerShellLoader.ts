import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

export default class PowerShellLoader {
    public static wireUpCommands(context: vscode.ExtensionContext) {
        // do this immediately
        PowerShellLoader.runScriptCheck(context);

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand('cloudSmith.downloadDynamicsScriptsCommand', () => { // Downloads scripts from the Internet.
                PowerShellLoader.runScriptCheck(context);
            })
        );
    }

    private static runScriptCheck(context: vscode.ExtensionContext) {
		// get local storage folder
		const folder = context.globalStoragePath;
		
		// Checks to see if folder exist
		if (!fs.existsSync(folder)) {
			console.log(`[CloudSmith] Creating folder '${folder}' as it does not exist.`);
			fs.mkdirSync(folder);
		}

		// Array that stores script names
		var scriptsToFetch = [
			"Deploy-XrmSolution.ps1",
			"Generate-XrmEntities.ps1",
			"Get-XrmSolution.ps1",
			"Install-Sdk.ps1",
			"Install-XrmToolbox.ps1",
			"Setup-EasyRepro.ps1",
			"runonce-script.ps1"
		];

		// For loop to iterate through the array
		for (var i = 0; i < scriptsToFetch.length; i++ )
		{
			// hold the file name for this iteration
			const fileName = scriptsToFetch[i];
			// uri containing remote file location
			const remoteFilePath = `https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/${fileName}`;
			// local file location
			const localFilePath = path.join(folder, fileName);
			// see if file exists
			if (!fs.existsSync(localFilePath))
			{
				// file doesn't exist, get it from remote location
				PowerShellLoader.downloadScript(remoteFilePath, localFilePath)
					.then(localPath => {
						vscode.window.showInformationMessage(
							`${fileName} PowerShell script downloaded`
						);
					});
			}
		}
    }

    private static downloadScript(remoteFilePath: string, localFilePath: string) {
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
		});
	}
}