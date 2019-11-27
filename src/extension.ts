// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cs from './cs';
// config
import ExtensionConfiguration from './core/ExtensionConfiguration';
import ConnectionViewManager from './views/ConnectionView';
import CodeGenerationManager from './components/CodeGeneration/CodeGenerationManager';
import ScriptDownloader from './components/WebDownloaders/ScriptDownloader';
import DynamicsTreeView from './views/DynamicsTreeView';
import JsonObjectViewManager from './views/JsonObjectView';
import TemplateManager from './components/Templates/TemplateManager';
import DynamicsTerminal from './views/DynamicsTerminal';
import IconLoader from './components/WebDownloaders/IconDownloader';
import SolutionManager from './components/Solutions/SolutionManager';
import PluginStepViewManager from './views/PluginStepView';
import SvcUtilConfigViewManager from './views/ServiceUtilityConfigurationView';
import SolutionMap from './components/Solutions/SolutionMap';
import NewWorkspaceViewManager from './views/NewWorkspaceView';
import VisualStudioProjectCommands from './components/DotNetCore/DotNetProjectManager';
import TemplateTreeView from './views/TemplatesTreeView';
import PluginStepImageViewManager from './views/PluginStepImageView';
import WebResourceManager from './components/Solutions/WebResourceManager';
import ExtensionContext from './core/ExtensionContext';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// *****************
// More on activation events can be found here: https://code.visualstudio.com/api/references/activation-events#Start-up
// *****************
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[CloudSmith]: extension:activate');

	// We initialize this as it's a psuedo-singleton... no Internals here :)
	// tslint:disable-next-line: no-unused-expression
	new ExtensionContext(context);
	
	// load and check extension configuration
	const toolsConfig = ExtensionConfiguration.getConfiguration(cs.dynamics.configuration.tools._namespace);
	const templatesConfig = ExtensionConfiguration.getConfiguration(cs.dynamics.configuration.templates._namespace);

	// Setup any scripts that require tools configuration, then templating.
	[   // our views
		new DynamicsTreeView(),
		new TemplateTreeView(),
		new ConnectionViewManager(),
		new JsonObjectViewManager(),
		new SvcUtilConfigViewManager(),
		new DynamicsTerminal(),
		new PluginStepViewManager(),
		new PluginStepImageViewManager(),
		new NewWorkspaceViewManager(),
		
		// our commands
		new ScriptDownloader(),
		new IconLoader(),
		new CodeGenerationManager(),
		new SolutionMap(),
		new WebResourceManager(context),
		new SolutionManager(),
		new VisualStudioProjectCommands()
	].forEach(c => c.contribute(context, toolsConfig));

	[   // templating engine.
		new TemplateManager(context)
	].forEach(c => c.contribute(context, templatesConfig));
}

// this method is called when your extension is deactivated
export function deactivate() { }