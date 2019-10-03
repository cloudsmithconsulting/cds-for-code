// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// config
import CloudSmithConfig from './cloudSmithConfig';
import ConnectionView from './connectionView';
import GenerateEntitiesCommand from './generateEntitiesCommand';
import PowerShellLoader from './powerShellLoader';
import DynamicsTreeView from './dynamicsTreeView';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// *****************
// More on activation events can be found here: https://code.visualstudio.com/api/references/activation-events#Start-up
// *****************
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[CloudSmith]: extension:activate');
	
	// load and check extension configuration
	const config = CloudSmithConfig.checkConfig();

	// wire up views
	DynamicsTreeView.wireUpCommands(context);
	ConnectionView.wireUpCommands(context);

	// wire up commands via import object
	PowerShellLoader.wireUpCommands(context);
	GenerateEntitiesCommand.wireUpCommands(context, config);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	// They will all get pushed into these subscriptions using an ...items spread
	context.subscriptions.push(
		vscode.commands.registerCommand('cloudSmith.unpackDynamicsSolutionCommand', () => { // Match name of command to package.json command
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
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }