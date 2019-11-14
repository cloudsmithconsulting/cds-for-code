import * as vscode from 'vscode';
import { View, ViewRenderer } from '../view';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import ApiRepository from '../repositories/apiRepository';
import { DynamicsWebApi } from '../api/Types';
import QuickPicker from '../helpers/QuickPicker';
import async = require('async');

export default class PluginStepViewManager implements IWireUpCommands {
	public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.pluginStep.open, async (pluginAssemblyId:string, step?: any, config?:DynamicsWebApi.Config) => { // Match name of command to package.json command
                // Run command code
                config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.createOrShow(PluginStepView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: 'Configure Plugin Step - Dynamics 365 CE',
                    viewType: cs.dynamics.views.pluginStepView
                }, true); // always new

                const api = new ApiRepository(config);

                async.parallel({
                    entityTypeCodes: async function(callback) {
                        callback(null, await api.retrieveEntityTypeCodes());
                    },
                    pluginTypes: async function(callback) {
                        callback(null, await api.retrievePluginTypes(pluginAssemblyId));
                    },
                    sdkMessageFilters: async function(callback) {
                        callback(null, await api.retrieveSdkMessageFilters());
                    },
                    sdkMessages: async function(callback) {
                        callback(null, await api.retrieveSdkMessages());
                    },
                    users: async function(callback) {
                        callback(null, await api.retrieveSystemUsers());
                    },
                    step: async function(callback) {
                        if (!step) {
                            callback(null);
                            return;
                        }
                        callback(null, await api.retrievePluginStep(step.sdkmessageprocessingstepid));
                    }
                }, function(error: any, viewModel: any) {
                    // set the initial state
                    view.setInitialState(viewModel, config);
                });
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class PluginStepView extends View {
    public config: DynamicsWebApi.Config;

    public getHtmlForWebview(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('pluginStepView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderPartialFile('plugin-step.html');
    }

    private saveSdkMessageProcessingStep(step :any) {
        const api = new ApiRepository(this.config);
        api.upsertPluginStep(step);
    }
    
    public onDidReceiveMessage(instance: PluginStepView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'saveSdkMessageProcessingStep':                
                instance.saveSdkMessageProcessingStep(message.settings);
                return;
        }
    }

    public setInitialState(viewModel: any, config: DynamicsWebApi.Config) {
        this.config = config;
        this.panel.webview.postMessage({ command: 'load', viewModel });
    }
}