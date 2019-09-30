// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import axios from 'axios';
import { SSL_OP_CISCO_ANYCONNECT } from 'constants';
import { error } from 'console';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// *****************
// More on activation events can be found here: https://code.visualstudio.com/api/references/activation-events#Start-up
// *****************
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[CloudSmith]: extension:activate');

	const terminalName = 'CloudSmith: Dynamics PowerShell';
	// load extension configuration
	const config = vscode.workspace.getConfiguration('cloudSmith');
	const crmSdkRoot = config.get('crmSdkRootPath') as string;

	// get the svcutil path from configuration
	if (!crmSdkRoot
		|| crmSdkRoot === undefined 
		|| crmSdkRoot.length === 0) {
			vscode.window.showErrorMessage(
				`The configuration setting cloudSmith.crmSdkRootPath was invalid or not set.`
			);
		}

	// set core tools root
	const coreToolsRoot = `${crmSdkRoot}\\CoreTools`;

	async function downloadScripts(folder:string)
	{
		if (!fs.existsSync(folder)) 
		{ 
			console.log(`[CloudSmith] Creating folder '${folder}' as it does not exist.`);
			fs.mkdirSync(folder); 
		}

		const folders = await vscode.workspace.fs.readDirectory(vscode.Uri.file(folder));

		if (!fs.existsSync(folder + "/Deploy-XrmSolution.ps1"))
		{
			downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Deploy-XrmSolution.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Generate-XrmEntities.ps1"))
		{
			downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Generate-XrmEntities.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Get-XrmSolution.ps1"))
		{
			downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Get-XrmSolution.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Install-Sdk.ps1"))
		{
			downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Install-Sdk.ps1"), folder);
		}
		
		if (!fs.existsSync(folder + "/Install-XrmToolbox.ps1"))
		{
			downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Install-XrmToolbox.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/Setup-EasyRepro.ps1"))
		{
			downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/Setup-EasyRepro.ps1"), folder);
		}

		if (!fs.existsSync(folder + "/runonce-script.ps1"))
		{
			downloadScript(vscode.Uri.parse("https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/CloudSmith.Dynamics365.SampleScripts/runonce-script.ps1"), folder);
		}
	}

	async function downloadScript(file:vscode.Uri, folder:string)
	{	
		return axios.request({
			responseType: 'arraybuffer',
			url: file.toString(),
			method: 'get',
			headers: {
				'Content-Type': 'text/plain',
			},
		}).then((result: { data: any; }) => {
			var filename = file.fsPath.toString().replace(/^.*[\\\/]/, '');
			const outputFilename = folder + "\\" + filename;
			fs.writeFileSync(outputFilename, result.data);
			return outputFilename;
		});
	}

	async function connectToCrmUsingAxois(url:vscode.Uri)
	{
		return axios.request({
			responseType: 'json',
			url: url.toString() + "/api/discovery/v8.0/Instances",
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				'Accepts': 'application/json'
			},
		}).then((result: { data: any; }) => {
			console.log(result);
		}).catch((error) => {
			console.log(error);
		});
	}

	async function connectToCrmUsingHttpNtlm(url:vscode.Uri)
	{
		var httpntlm = require('httpntlm');

		httpntlm.get({
			method: "GET",
			url: url.toString() + "/api/discovery/v8.0/Instances",
			username: "Administrator",
			password: "p@ssw0rd1",
			domain: "contoso"
		}, function (error: any, response: { headers: any; body: any; })
		{
			if (error) {
				return error;
			}

			console.log(response.headers);
			console.log(response.body);
		});
	}

	function connectToCrmUsingAxios(url:vscode.Uri)
	{
		var ntlm = require('httpntlm').ntlm;
		const axios = require('axios');

		const https = require('https');
		const httpsAgent = new https.Agent({ keepAlive: true });

		const client = axios.create({
		    httpsAgent,
		    agent: httpsAgent,
		    withCredentials: true,
		    shouldKeepAlive: true,
		    keepAlive: true,
		    keepAliveMsecs: 3000,
		    maxRedirects: 0,
		    'Access-Control-Allow-Origin': '*',
		});

		var options = {
			url: url.toString() + "/api/discovery/v8.0/Instances",
			username: "Administrator",
			password: "pass@w0rd1",
			workstation: '',
			domain: "contoso"
		};
		
		client.interceptors.response.use(
		    (response: any) => {
		        return response;
		    },
		    (err: { response: any; config: { headers: { [x: string]: any; }; }; }) => {
				const error = err.response;
				
				if (error.status === 401 && error.headers['www-authenticate'] && error.headers['www-authenticate'] === 'Negotiate, NTLM' && !err.config.headers['X-retry']) 
				{
					// TYPE 1 MESSAGE
					return sendType1Message();
				} 
				else if (error.status === 401 && error.headers['www-authenticate'] && error.headers['www-authenticate'].substring(0,4) === 'NTLM' ) 
				{
					// TYPE 2 MESSAGE PARSE ANS TYPE 3 MESSAGE SEND
					return sendType3Message(error.headers['www-authenticate']);
				}

	        	return err;
	    	},

		);

		client.interceptors.request.use((request: any) => {
		    return request;
		});

		const sendType1Message = () => {
		    var type1msg = ntlm.createType1Message(options);

			return client({
				method: 'get',
				url: options.url,
				headers:{
					'Connection' : 'keep-alive',
					'Authorization': type1msg
				},
			});
		};

		const sendType3Message = (token: string) => {
			var type2msg = ntlm.parseType2Message(token, (err: any) => { console.log(err); });
			var type3msg = ntlm.createType3Message(type2msg, options);

			return client({
				method: 'get',
				url: options.url,
				headers:{
					'X-retry' : 'false',
					'Connection' : 'Close',
					'Authorization': type3msg
				}}
			);
		};


		client({
			method: 'get',
			url: options.url,
		}).then((response: any) => {
			console.log(response);
		})
		.catch((error: any) => {
			console.log(error);
		});		
	}

	// Invoke donwloadScripts.
	downloadScripts(context.globalStoragePath);
	//connectToCrmUsingAxois(vscode.Uri.parse("http://win-a6ljo0slrsh"));
	//connectToCrmUsingHttpNtlm(vscode.Uri.parse("http://win-a6ljo0slrsh/"));
	connectToCrmUsingAxios(vscode.Uri.parse("http://win-a6ljo0slrsh"));

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	function showAndReturnTerminal(cwd: string) : vscode.Terminal {
		//see if our terminal is open all ready
		const index = vscode.window.terminals.findIndex(t => t.name === terminalName);
		if (index === -1) { 
			// index wasn't found, return new terminal
			const result = vscode.window.createTerminal({
				name: terminalName,
				// make sure we get powershell
				shellPath: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
				cwd // current working directory
			});
			// show it
			result.show();
			// return it
			return result;
		}
		// get terminal with name at index
		const result = vscode.window.terminals[index];
		// change cwd
		result.sendText(`cd ${cwd}`);
		// show it
		result.show();
		// return it
		return result;
	}

	// They will all get pushed into these subscriptions using an ...items spread
	context.subscriptions.push(

		vscode.commands.registerCommand('cloudSmith.addEntry', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showInformationMessage(
				'cloudSmith.addEntry'
			);
		}) // <-- no semi-colon, comma starts next command registration

		, vscode.commands.registerCommand('cloudSmith.deleteEntry', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showInformationMessage(
				'cloudSmith.deleteEntry'
			);
		}) // <-- no semi-colon, comma starts next command registration

		, vscode.commands.registerCommand('cloudSmith.editEntry', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showInformationMessage(
				'cloudSmith.editEntry'
			);
		}) // <-- no semi-colon, comma starts next command registration

		, vscode.commands.registerCommand('cloudSmith.refreshEntry', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showInformationMessage(
				'cloudSmith.refreshEntry'
			);
		}) // <-- no semi-colon, comma starts next command registration

		, vscode.commands.registerCommand('cloudSmith.unpackDynamicsSolutionCommand', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showInformationMessage(
				'cloudSmith.unpackDynamicsSolutionCommand'
			);
		}) // <-- no semi-colon, comma starts next command registration

		, vscode.commands.registerCommand('cloudSmith.deployDynamicsSolutionCommand', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showInformationMessage(
				'cloudSmith.deployDynamicsSolutionCommand'
			);
		}) // <-- no semi-colon, comma starts next command registration

		, vscode.commands.registerCommand('cloudSmith.generateDynamicsEntitiesCommand', () => { // Match name of command to package.json command
			// get root path of vscode workspace
			const folders = vscode.workspace.workspaceFolders;
			// see if we have anything open
			if (folders !== undefined) {
				// loop through open root workspace folders
				folders.forEach(folder => {
					// we only support the file system right now
					if (folder.uri.scheme === "file") {
						// hold on to the current root path
						const rootPath = folder.uri.fsPath;

						// setup the code file path to be generated
						const codeFilePath = `${rootPath}\\XrmEntities.cs`;

						// setup the command text
						const commandToExecute = `& .\\CrmSvcUtil.exe `
							+ `/url:http://crmserver/test/XRMServices/2011/Organization.svc `
							+ `/username:missioncommand `
							+ `/password:$mokingTir33 `.replace('$', '`$') // $ is a problem in powershell
							+ `/domain:CONTOSO `
							+ `/namespace:CloudSmith.Dynamics365.SampleTests `
							+ `/out:${codeFilePath}`;

						// build a powershell terminal
						const terminal = showAndReturnTerminal(coreToolsRoot);
						// execute the command
						terminal.sendText(commandToExecute);
					}
				});
			}
		}) // <-- no semi-colon, comma starts next command registration

		, vscode.commands.registerCommand('cloudSmith.downloadDynamicsScriptsCommand', () => { // Downloads scripts from the Internet.
			let uri = vscode.Uri.parse(context.globalStoragePath);
			const folders = vscode.workspace.fs.readDirectory(uri);
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }

// TreeViewDataProvider
// function aNodeWithIdTreeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
// 	return {
// 		getChildren: [],
// 		getParent: null,
// 		getTreeItem: null
// 	};
// }
