// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cs from './cs';
// config
import ExtensionConfiguration from './core/ExtensionConfiguration';
import ViewManager from './views/ViewManager';
import TemplateManager from './components/Templates/TemplateManager';
import DynamicsTerminal from './views/DynamicsTerminal';
import SolutionManager from './components/Solutions/SolutionManager';
import SolutionMap from './components/Solutions/SolutionMap';
import VisualStudioProjectCommands from './components/DotNetCore/DotNetProjectManager';
import TemplateExplorer from './views/TemplateExplorer';
import WebResourceManager from './components/Solutions/WebResourceManager';
import ExtensionContext from './core/ExtensionContext';
import IconDownloader from './components/WebDownloaders/IconDownloader';
import ScriptDownloader from './components/WebDownloaders/ScriptDownloader';
import CodeGenerationManager from './components/CodeGeneration/CodeGenerationManager';
import Telemetry from './core/Telemetry';
import CdsExplorer from './views/cs.cds.viewContainers.cdsExplorer';

let extensionContext: ExtensionContext;

export async function activate(context: vscode.ExtensionContext) {
	// Force initialization of our decorators by building an array of their classes.
	// tslint:disable-next-line: no-unused-expression
	[ IconDownloader, ScriptDownloader, CodeGenerationManager, SolutionMap, WebResourceManager, SolutionManager, VisualStudioProjectCommands, TemplateManager, ViewManager, Telemetry, CdsExplorer ];

	extensionContext = new ExtensionContext(context);

	// load and check extension configuration
	const toolsConfig = ExtensionConfiguration.getConfiguration(cs.cds.configuration.tools._namespace);

	// Setup any scripts that require tools configuration, then templating.
	[   // our views
		new TemplateExplorer(),
		new DynamicsTerminal(),
	].forEach(c => c.contribute(context, toolsConfig));
	
	extensionContext.activate(cs.cds.extension.productId, toolsConfig);

	return context.subscriptions;
}

// this method is called when your extension is deactivated
export function deactivate() { 
	extensionContext.deactivate(cs.cds.extension.productId);
}
