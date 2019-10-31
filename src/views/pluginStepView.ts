import * as vscode from 'vscode';
import { View, ViewRenderer } from '../view';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import ApiRepository from '../../out/repositories/apiRepository';
import { DynamicsWebApi } from '../api/Types';

export default class PluginStepViewManager implements IWireUpCommands {
	public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.pluginStep.open, async (step?: any, config?:DynamicsWebApi.Config) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.createOrShow(PluginStepView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: 'Configure Plugin Step - Dynamics 365 CE',
                    viewType: cs.dynamics.views.pluginStepView
                });

                if (config) {
                    const api = new ApiRepository(config);
                    const entityTypeCodes = await api.retrieveEntityTypeCodes();
                    const sdkMessages = await api.retrieveSdkMessages();
                    const sdkMessageDetails = step ? await api.retrieveSdkMessageDetails(step.sdkmessageid.sdkmessageid) : null;
                    const viewModel = {
                        entityTypeCodes,
                        sdkMessageDetails,
                        sdkMessages,
                        step
                    };
                    view.setInitialState(viewModel);
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

    public setInitialState(viewModel: any) {
        this.panel.webview.postMessage({ command: 'load', viewModel });
    }
}