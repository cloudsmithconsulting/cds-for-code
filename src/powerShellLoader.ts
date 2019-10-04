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
		const folder = context.globalStoragePath;
		
		// Array that stores folder locations
		var array = [
			"/Deploy-XrmSolution.ps1",
			"/Generate-XrmEntities.ps1",
			"/Get-XrmSolution.ps1",
			"/Install-Sdk.ps1",
			"/Install-XrmToolbox.ps1",
			"/Setup-EasyRepro.ps1",
			"/runonce-script.ps1"
		];

		// Checks to see if folder exist
		if (!fs.existsSync(folder)) {
			console.log(`[CloudSmith] Creating folder '${folder}' as it does not exist.`);
			fs.mkdirSync(folder);
		}

		// For loop to iterate through the array
		for (var i = 0; i < array.length; i++ )
		{
			if (!fs.existsSync(folder + array[i]))
			{
				PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts" + array[i]), folder);
			}
		}
/*
        if (!fs.existsSync(folder)) {
			console.log(`[CloudSmith] Creating folder '${folder}' as it does not exist.`);
			fs.mkdirSync(folder);
		}

		if (!fs.existsSync(folder + "/Deploy-XrmSolution.ps1")) {
			PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Deploy-XrmSolution.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Generate-XrmEntities.ps1")) {
			PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Generate-XrmEntities.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Get-XrmSolution.ps1")) {
			PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Get-XrmSolution.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Install-Sdk.ps1")) {
			PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Install-Sdk.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Install-XrmToolbox.ps1")) {
			PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Install-XrmToolbox.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Setup-EasyRepro.ps1")) {
			PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Setup-EasyRepro.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/runonce-script.ps1")) {
			PowerShellLoader.downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/runonce-script.ps1"), folder);
		}
		*/
    }

    private static downloadScript(file: vscode.Uri, folder: string) {
        return fetch(file.toString(), {
            method: 'get',
            headers: {
                'Content-Type': 'text/plain',
                'Accepts': 'text/plain'
			}
        })
        .then(res => {
            const body = res.text();
            var filename = file.fsPath.toString().replace(/^.*[\\\/]/, '');
			const outputFilename = folder + "\\" + filename;
			fs.writeFileSync(outputFilename, body);
			return outputFilename;
        })
        .catch(err => console.error(err));
	}
}