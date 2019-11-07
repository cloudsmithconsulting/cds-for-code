// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cs from './cs';
// config
import ExtensionConfiguration from './config/ExtensionConfiguration';
import ConnectionViewManager from './views/ConnectionView';
import GenerateEntities from './commands/generateEntities';
import PowerShellLoader from './commands/powerShellLoader';
import DynamicsTreeView from './views/DynamicsTreeView';
import PackDynamicsSolution from './commands/packDynamicsSolution';
import UnpackDynamicsSolution from './commands/unpackDynamicsSolution';
import JsonInspectorViewManager from './views/JsonInspectorView';
import ProjectTemplatesPlugin from './ProjectTemplatesPlugin';
import DynamicsTerminal from './views/DynamicsTerminal';
import IconLoader from './commands/iconLoader';
import AddSolutionComponent from './commands/addSolutionComponent';
import RemoveSolutionComponent from './commands/removeSolutionComponent';
import PluginStepViewManager from './views/pluginStepView';
import RegisterPluginAssembly from './commands/registerPluginAssembly';
import SvcUtilConfigViewManager from './views/svcUtilConfigView';
import SolutionMap from './config/SolutionMap';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// *****************
// More on activation events can be found here: https://code.visualstudio.com/api/references/activation-events#Start-up
// *****************
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[CloudSmith]: extension:activate');
	
	ExtensionConfiguration.extensionPath = context.extensionPath;
	
	// load and check extension configuration
	const toolsConfig = ExtensionConfiguration.getConfiguration(cs.dynamics.configuration.tools._namespace);
	const templatesConfig = ExtensionConfiguration.getConfiguration(cs.dynamics.configuration.templates._namespace);

	// Setup any scripts that require tools configuration, then templating.
	[   // our views
		new DynamicsTreeView(),
		new ConnectionViewManager(),
		new JsonInspectorViewManager(),
		new SvcUtilConfigViewManager(),
		new DynamicsTerminal(),
		new PluginStepViewManager(),
		
		// our commands
		new PowerShellLoader(),
		new IconLoader(),
		new GenerateEntities(),
		new SolutionMap(),
		new PackDynamicsSolution(),
		new UnpackDynamicsSolution(),
		new AddSolutionComponent(),
		new RemoveSolutionComponent(),
		new RegisterPluginAssembly()
	].forEach(c => c.wireUpCommands(context, toolsConfig));

	[   // templating engine.
		new ProjectTemplatesPlugin(context)
	].forEach(c => c.wireUpCommands(context, templatesConfig));
}

// this method is called when your extension is deactivated
export function deactivate() { }