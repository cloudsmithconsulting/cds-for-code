import * as vscode from 'vscode';
import { View, BridgeCommunicationMethod } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import ApiRepository from '../repositories/apiRepository';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import Quickly from '../core/Quickly';
import async = require('async');
import Dictionary from '../core/types/Dictionary';

export default async function openView(context: vscode.ExtensionContext, pluginAssemblyId:string, config?: DynamicsWebApi.Config, step?: any): Promise<View> {
    const view = View.show(PluginStepEditor, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Configure Plugin Step - Dynamics 365 CE',
        type: cs.dynamics.views.pluginStepEditor,
        preserveFocus: false,
        bridge: BridgeCommunicationMethod.Ipc,
        onReady: view => view.setInitialState(context, pluginAssemblyId, config, step)
    });

    return view;
}

class PluginStepEditor extends View {
    private config: DynamicsWebApi.Config;

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
            .then(() => {
                Quickly.inform(`${step.name} was saved.`);
                this.dispose();
            })
            .catch(err => {
                this.postMessage({ command: 'error', message: err.message });
                console.error(err);
            });
    }
   
    async setInitialState(context: vscode.ExtensionContext, pluginAssemblyId:string, config?: DynamicsWebApi.Config, step?: any) {
        config = config || await Quickly.pickCdsOrganization(context, "Choose a Dynamics 365 Organization", true);
        if (!config) { return; }
        this.config = config;

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
            if (error) {
                Quickly.error(error.message);
                return;
            }
            // set the initial state
            this.postMessage({ command: 'load', viewModel });
        });
    }
}