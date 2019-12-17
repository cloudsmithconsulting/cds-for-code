import * as vscode from 'vscode';
import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import ApiRepository from '../repositories/apiRepository';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import Quickly from '../core/Quickly';
import async = require('async');
import Dictionary from '../core/types/Dictionary';
import { CdsSolutions } from '../api/CdsSolutions';

export default class PluginStepViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.pluginStep.open, async (pluginAssemblyId:string, step?: any, config?:DynamicsWebApi.Config) => { // Match name of command to package.json command
                // Run command code
                config = config || await Quickly.pickCdsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.show(PluginStepView, {
                    icon: './resources/images/cloudsmith-logo-only-50px.png',
                    title: 'Configure Plugin Step - Dynamics 365 CE',
                    type: cs.dynamics.views.pluginStepView,
                    alwaysNew: true
                }); // always new

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
                }, (error: any, viewModel: any) => {
                    // set the initial state
                    view.setInitialState(viewModel, config);
                });
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class PluginStepView extends View {
    config: DynamicsWebApi.Config;

    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('pluginStepView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('plugin-step.html');
    }

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([
            { key: 'save', value: message => this.save(message.step) }
         ]);
    }

    private save(step :any) {
        const api = new ApiRepository(this.config);
        api.upsertPluginStep(step)
            .then(() => this.dispose())
            .catch(err => {
                this.postMessage({ command: 'error', message: err.message });
                console.error(err);
            });
    }
   
    setInitialState(viewModel: any, config: DynamicsWebApi.Config) {
        this.config = config;
        this.postMessage({ command: 'load', viewModel });
    }
}