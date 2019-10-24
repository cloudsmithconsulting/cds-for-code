// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cs from './cs';
// config
import ExtensionConfiguration from './helpers/ExtensionConfiguration';
import ConnectionViewManager from './views/connectionView';
import GenerateEntitiesCommand from './commands/generateEntitiesCommand';
import PowerShellLoader from './commands/powerShellLoader';
import DynamicsTreeView from './views/dynamicsTreeView';
import { PackDynamicsSolutionCommand } from './commands/packDynamicsSolutionCommand';
import { UnpackDynamicsSolutionCommand } from './commands/unpackDynamicsSolutionCommand';
import JsonInspectorViewManager from './views/jsonInspectorView';
import ProjectTemplatesPlugin from './ProjectTemplatesPlugin';

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
	const toolsConfig = ExtensionConfiguration.getConfiguration(cs.dynamics.configuration.tools._namespace);
	const templatesConfig = ExtensionConfiguration.getConfiguration(cs.dynamics.configuration.templates._namespace);

	// Setup any scripts that require tools configuration, then templating.
	[   // our views
		new DynamicsTreeView(),
		new ConnectionViewManager(),
		new JsonInspectorViewManager(),
		
		// our commands
		new PowerShellLoader(),
		new GenerateEntitiesCommand(),
		new PackDynamicsSolutionCommand(),
		new UnpackDynamicsSolutionCommand()
	].forEach(c => c.wireUpCommands(context, toolsConfig));

	[   // templating engine.
		new ProjectTemplatesPlugin(context)
	].forEach(c => c.wireUpCommands(context, templatesConfig));
}

// this method is called when your extension is deactivated
export function deactivate() { }