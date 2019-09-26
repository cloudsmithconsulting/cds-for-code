// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// *****************
// More on activation events can be found here: https://code.visualstudio.com/api/references/activation-events#Start-up
// *****************
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[CloudSmith]: extension:activate');

	// load extension configuration
	const config = vscode.workspace.getConfiguration('cloudSmith');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

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
			// get the svcutil path from configuration
			const svcUtilPath = config.get('crmSvcUtilPath') as string;
			if (!svcUtilPath
				|| svcUtilPath === undefined 
				|| svcUtilPath.length === 0) {
					throw new Error('The crmSvcUtilPath was not configured in settings.');
				}

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
						const terminal = vscode.window.createTerminal({
							name: "CloudSmith: Dynamics PowerShell",
							// make sure we get powershell
							shellPath: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
							cwd: svcUtilPath
						});
						// show it and execute the command
						terminal.show();
						terminal.sendText(commandToExecute);
					}
				});
			}
		}) // <-- no semi-colon, comma starts next command registration

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
