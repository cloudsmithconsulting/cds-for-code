import * as vscode from 'vscode';
import { View, ViewRenderer } from '../core/types/View';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import ApiRepository from '../repositories/apiRepository';
import { DynamicsWebApi } from '../http/Types';
import Quickly from '../core/Quickly';
import async = require('async');

export default class PluginStepViewManager implements IContributor {
	public contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.pluginStep.open, async (pluginAssemblyId:string, step?: any, config?:DynamicsWebApi.Config) => { // Match name of command to package.json command
                // Run command code
                config = config || await Quickly.pickCdsOrganization(context, "Choose a Dynamics 365 Organization", true);
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
                    // entityTypeCodes: async function(callback) {
                    //     callback(null, await api.retrieveEntityTypeCodes());
                    // },
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

    private save(step :any) {
        const api = new ApiRepository(this.config);
        api.upsertPluginStep(step)
            .then(() => this.dispose())
            .catch(err => {
                this.panel.webview.postMessage({ command: 'error', message: err.message });
                console.error(err);
            });
    }
    
    public onDidReceiveMessage(instance: PluginStepView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'save':                
                instance.save(message.step);
                return;
        }
    }

    public setInitialState(viewModel: any, config: DynamicsWebApi.Config) {
        this.config = config;
        this.panel.webview.postMessage({ command: 'load', viewModel });
    }
}