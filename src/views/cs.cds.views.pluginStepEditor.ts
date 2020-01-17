import * as cs from '../cs';
import { View, BridgeCommunicationMethod } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import ApiRepository from '../repositories/apiRepository';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import Quickly from '../core/Quickly';
import async = require('async');
import Dictionary from '../core/types/Dictionary';
import ExtensionContext from '../core/ExtensionContext';

export default async function openView(pluginAssemblyId:string, config?: CdsWebApi.Config, step?: any): Promise<View> {
    const view = View.show(PluginStepEditor, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Configure Plugin Step - Dynamics 365 CE',
        type: cs.cds.views.pluginStepEditor,
        preserveFocus: false,
        bridge: BridgeCommunicationMethod.Ipc,
        onReady: view => view.setInitialState(pluginAssemblyId, config, step)
    });

    return view;
}

class PluginStepEditor extends View {
    private config: CdsWebApi.Config;

    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('materialize.js');
        viewRenderer.addScript('plugin-step-editor.js');

        viewRenderer.addStyleSheet("materialize.vscode.css");
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('plugin-step-editor.html');
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
   
    async setInitialState(pluginAssemblyId:string, config?: CdsWebApi.Config, step?: any) {
        this.config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
        if (!this.config) { return; }

        const api = new ApiRepository(this.config);

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