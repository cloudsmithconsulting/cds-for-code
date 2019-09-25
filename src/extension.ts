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

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// They will all get pushed into these subscriptions using an ...items spread
	context.subscriptions.push(
		
		// CloudSmith VSCode Command
		vscode.commands.registerCommand('cloudsmith.tellThemHowWeFeelCommand', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showInformationMessage(
				'CloudSmith <3 VSCode!'
			);
		}) // <-- no semi-colon, comma starts next command registration

		// Tell Time Command
		,vscode.commands.registerCommand('cloudsmith.tellTimeCommand', () => { // Match name of command to package.json command
			// Run command code
			vscode.window.showWarningMessage(
				`The time is ${new Date().toLocaleTimeString()}!`
			);
		}) // <-- no semi-colon, comma starts next command registration

	);
}

// this method is called when your extension is deactivated
export function deactivate() {}

// TreeViewDataProvider
// function aNodeWithIdTreeDataProvider(): vscode.TreeDataProvider<{ key: string }> {
// 	return {
// 		getChildren: [],
// 		getParent: null,
// 		getTreeItem: null
// 	};
// }
