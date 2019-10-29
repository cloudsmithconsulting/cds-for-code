import * as vscode from 'vscode';
import { View, ViewRenderer } from '../view';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';

export default class PluginStepViewManager implements IWireUpCommands {
	public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.pluginStep.open, async (step: any) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.createOrShow(PluginStepView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: 'Configure Plugin Step - Dynamics 365 CE',
                    viewType: cs.dynamics.views.pluginStepView
                });

                // only do this if we are editing
                if (step) {
                    view.setInitialState(step);
                }
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class PluginStepView extends View {
    public getHtmlForWebview(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('pluginStepView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderPartialFile('plugin-step.html');
    }    
    
    public onDidReceiveMessage(instance: PluginStepView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'saveSdkMessageProcessingStep':                
                return;
        }
    }

    public setInitialState(step: any) {
        this.panel.webview.postMessage({ command: 'load', step });
    }
}