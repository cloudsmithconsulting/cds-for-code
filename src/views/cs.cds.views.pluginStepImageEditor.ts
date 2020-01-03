import * as vscode from 'vscode';
import { View, BridgeCommunicationMethod } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import ApiRepository from '../repositories/apiRepository';
import Dictionary from '../core/types/Dictionary';
import Quickly from '../core/Quickly';

export default async function openView(context: vscode.ExtensionContext, sdkmessageprocessingstepid: string, pluginStepImage: any, config?: DynamicsWebApi.Config): Promise<View> {
    const view = View.show(PluginStepImageEditor, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Configure Plugin Step Image - Dynamics 365 CE',
        type: cs.cds.views.pluginStepImageEditor,
        preserveFocus: false,
        bridge: BridgeCommunicationMethod.Ipc,
        onReady: view => view.setInitialState(context, sdkmessageprocessingstepid, pluginStepImage, config)
    });

    return view;
}

class PluginStepImageEditor extends View {
    config: DynamicsWebApi.Config;

    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('materialize.js');
        viewRenderer.addScript('plugin-step-image-editor.js');
        
        viewRenderer.addStyleSheet("materialize.vscode.css");
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('plugin-step-image-editor.html');
    }    

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([
            { key: 'save', value: message => this.save(message.pluginStepImage) }
         ]);
    }
    
    private save(pluginStepImage: any) {
        const api = new ApiRepository(this.config);
        
        api.upsertPluginStepImage(pluginStepImage)
            .then(() => {
                Quickly.inform(`${pluginStepImage.name} was saved.`);
                this.dispose();
            })
            .catch(err => {
                this.postMessage({ command: 'error', message: err.message });
                console.error(err);
            });
    }
   
    async setInitialState(context: vscode.ExtensionContext, sdkmessageprocessingstepid: string, viewModel: any, config: DynamicsWebApi.Config) {
        config = config || await Quickly.pickCdsOrganization(context, "Choose a CDS Organization", true);
        if (!config) { return; }
        this.config = config;
        this.postMessage({ command: 'load', viewModel, sdkmessageprocessingstepid });
    }
}