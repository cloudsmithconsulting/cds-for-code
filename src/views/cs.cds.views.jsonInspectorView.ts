import * as vscode from 'vscode';
import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import Dictionary from '../core/types/Dictionary';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import Quickly from '../core/Quickly';
import ExtensionContext from '../core/ExtensionContext';
import MetadataRepository from '../repositories/metadataRepository';
import ApiRepository from '../repositories/apiRepository';

export default async function openView(config: CdsWebApi.Config, itemType: string, item: any) { 
    // Run command code
    //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
    const view = View.show(JsonObjectView, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Object inspector',
        type: cs.cds.views.jsonInspectorView,
        preserveFocus: false,
        onReady: view => view.setInitialState(config, itemType, item)
    });

    return view;
}

class JsonObjectView extends View {
    private config: CdsWebApi.Config;

    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('jsoneditor.min.js');
        viewRenderer.addScript('jsonInspectorView.js');

        viewRenderer.addStyleSheet('webviewStyles.css');
        viewRenderer.addStyleSheet('jsoneditor.min.css');
        viewRenderer.addStyleSheet('jsoneditor.vscode.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('jsonInspector.html');
    }    

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([ ]);
    }

    get queries(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([
            { 
                key: "Solution", value: async (id: string) => {
                    const api = new ApiRepository(this.config);
                    return await api.retrieveSolution(id);
                } 
            },
            { 
                key: "Entity", value: async (id: string) => {
                    const api = new MetadataRepository(this.config);
                    return await api.retrieveEntityByKey(id, null);
                } 
            },
            { 
                key: "OptionSet", value: async (id: string) => {
                    const api = new MetadataRepository(this.config);
                    return await api.retrieveOptionSet(id);
                } 
            },
            { 
                key: "WebResource", value: async (id: string) => {
                    const api = new ApiRepository(this.config);
                    return await api.retrieveWebResource(id);
                } 
            },
            { 
                key: "Process", value: async (id: string) => {
                    const api = new ApiRepository(this.config);
                    return await api.retrieveProcess(id);
                } 
            },
            { 
                key: "Form", value: async (id: string) => {
                    const api = new MetadataRepository(this.config);
                    return await api.retrieveForm(id);
                } 
            },
            { 
                key: "View", value: async (id: string) => {
                    const api = new MetadataRepository(this.config);
                    return await api.retrieveView(id);
                } 
            },
            { 
                key: "Chart", value: async (id: string) => {
                    const api = new MetadataRepository(this.config);
                    return await api.retrieveChart(id);
                } 
            },
            { 
                key: "Dashboard", value: async (id: string) => {
                    const api = new MetadataRepository(this.config);
                    return await api.retrieveForm(id);
                } 
            },
            { 
                key: "PluginStep", value: async (id: string) => {
                    const api = new ApiRepository(this.config);
                    return await api.retrievePluginStep(id);
                } 
            }
        ]);
    }

    get entityIdentifers(): Dictionary<string, string> {
        return new Dictionary<string, string>([
            { key: "Solution", value: "solutionid" },
            { key: "Entity", value: "MetadataId" },
            { key: "OptionSet", value: "MetadataId" },
            { key: "WebResource", value: "webresourceid" },
            { key: "Process", value: "workflowid" },
            { key: "Form", value: "formid" },
            { key: "View", value: "savedqueryid" },
            { key: "Chart", value: "savedqueryvisualizationid" },
            { key: "Dashboard", value: "formid" },
            { key: "PluginStep", value: "sdkmessageprocessingstepid" }
        ]);
    }

    async setInitialState(config: CdsWebApi.Config, itemType: string, item: any) {
        this.config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
        if (!this.config) { return; }

        const query = this.queries.get(itemType);
        const id = item[this.entityIdentifers.get(itemType)];
        if (query && id?.length > 0) {
            item = await query(id);
        }

        if (item) {
            this.postMessage({ command: 'inspect', message: item });
        }
    }
}