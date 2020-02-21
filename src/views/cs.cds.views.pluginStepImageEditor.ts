import * as vscode from 'vscode';
import { View, BridgeCommunicationMethod } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import ApiRepository from '../repositories/apiRepository';
import Dictionary from '../core/types/Dictionary';
import Quickly from '../core/Quickly';
import ExtensionContext from '../core/ExtensionContext';
import MetadataRepository from '../repositories/metadataRepository';
import CdsExplorer, { CdsTreeEntry } from './cs.cds.viewContainers.cdsExplorer';

export default async function openView(sdkmessageprocessingstepid: string, pluginStepImage?: any, config?: CdsWebApi.Config, treeEntry?: CdsTreeEntry): Promise<View> {
    const view = View.show(PluginStepImageEditor, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Configure Plugin Step Image - Dynamics 365 CE',
        type: cs.cds.views.pluginStepImageEditor,
        preserveFocus: false,
        onReady: view => view.setInitialState(sdkmessageprocessingstepid, pluginStepImage, config, treeEntry)
    });

    return view;
}

class PluginStepImageEditor extends View {
    private config: CdsWebApi.Config;
    private treeEntry: CdsTreeEntry;
    private edit: boolean = false;

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
                if (this.treeEntry) {
                    CdsExplorer.Instance.refresh(this.edit && this.treeEntry.parent ? this.treeEntry.parent : this.treeEntry);
                }

                Quickly.inform(`${pluginStepImage.name} was saved.`);
                this.dispose();
            })
            .catch(err => {
                this.postMessage({ command: 'error', message: err.message });
                console.error(err);
            });
    }
   
    async setInitialState(sdkmessageprocessingstepid: string, pluginStepImage?: any, config?: CdsWebApi.Config, treeEntry?: CdsTreeEntry) {
        this.config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
        if (!this.config) { return; }

        this.treeEntry = treeEntry;

        const api = new ApiRepository(config);
        const metaApi = new MetadataRepository(config);

        if (pluginStepImage) {
            this.edit = true;
        }

        const step = await api.retrievePluginStep(sdkmessageprocessingstepid);
        const metadataId = await metaApi.retrieveEntityMetadataId(step.sdkmessagefilterid.primaryobjecttypecode);
        const attributes = await metaApi.retrieveAttributes(metadataId);

        const viewModel = {
            attributes,
            pluginStepImage
        };

        this.postMessage({ command: 'load', viewModel, sdkmessageprocessingstepid });
    }
}