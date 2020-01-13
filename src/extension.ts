// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cs from './cs';

import ExtensionContext from './core/ExtensionContext';
import Telemetry from './core/framework/Telemetry';
import TemplateManager from './components/Templates/TemplateManager';
import SolutionManager from './components/Solutions/SolutionManager';
import SolutionMap from './components/Solutions/SolutionMap';
import VisualStudioProjectCommands from './components/DotNetCore/DotNetProjectManager';
import WebResourceManager from './components/Solutions/WebResourceManager';
import IconDownloader from './components/WebDownloaders/IconDownloader';
import ScriptDownloader from './components/WebDownloaders/ScriptDownloader';
import CodeGenerationManager from './components/CodeGeneration/CodeGenerationManager';
import TerminalManager from './components/Terminal/SecureTerminal';
import ViewManager from './views/ViewManager';
import CdsExplorer from './views/cs.cds.viewContainers.cdsExplorer';
import TemplateExplorer from './views/cs.cds.viewContainers.templateExplorer';

let extensionContext: ExtensionContext;

export async function activate(context: vscode.ExtensionContext) {
	// Force initialization of our decorators by building an array of their types, which.
	// tslint:disable-next-line: no-unused-expression
	[
		IconDownloader, ScriptDownloader, CodeGenerationManager, SolutionMap, WebResourceManager, SolutionManager, 
		VisualStudioProjectCommands, TemplateManager, ViewManager, Telemetry, CdsExplorer, TemplateExplorer,
		TerminalManager
	];

	extensionContext = new ExtensionContext(context);
	extensionContext.activate(cs.cds.extension.productId);

	return context.subscriptions;
}

// this method is called when your extension is deactivated
export function deactivate() { 
	extensionContext.deactivate(cs.cds.extension.productId);
}
