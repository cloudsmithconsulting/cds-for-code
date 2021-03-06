import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as vscode from 'vscode';
import * as cs from '../cs';
import Dictionary from '../core/types/Dictionary';
import Quickly from '../core/Quickly';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import ExtensionContext from '../core/ExtensionContext';
import MetadataRepository from '../repositories/metadataRepository';
import async = require('async');
import ApiRepository from '../repositories/apiRepository';

export default async function openView(config?: CdsWebApi.Config, viewModel?: any): Promise<View> {
    const view = View.show(SvcUtilConfigView, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Configure entity code generation - CDS',
        type: cs.cds.views.svcUtilConfigView,
        onReady: view => view.setInitialState(config, viewModel)
    });

    return view;
}

class SvcUtilConfigView extends View {
    private config: CdsWebApi.Config;
    
    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('materialize.js');
        viewRenderer.addScript('svcutil-config.js');
        
        viewRenderer.addStyleSheet("materialize.vscode.css");
        viewRenderer.addStyleSheet('webviewStyles.css');
        
        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');
        
        // return rendered html
        return viewRenderer.renderFile('svcutil-config.html');
    }    

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([
            { key: 'save', value: message => this.save(message.config) },
            { key: 'retrieveListForAttribute', value: message => this.retrieveAttributes(message.entityKey, message.targetElem) }
         ]);
    }

    private async retrieveAttributes(entityKey: string, targetElem: string) {
        const metaApi = new MetadataRepository(this.config);
        const attributes = await metaApi.retrieveAttributes(entityKey);
        // set the initial state
        this.postMessage({ command: 'updateAttributes', attributes, targetElem });
    }

    private async save(config: any) {        
        await vscode.commands.executeCommand(cs.cds.deployment.saveCrmSvcUtilConfig, config);
        
        Quickly.inform(`CrmSvcUtil Configuration was saved.`);

        this.dispose();            
    }

    async setInitialState(config?: CdsWebApi.Config, viewModel?: any) {
        this.config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
        if (!this.config) { return; }

        viewModel = viewModel || {};

        const metaApi = new MetadataRepository(this.config);
        const webApi = new ApiRepository(this.config);

        async.parallel({
            entities: async function(callback) {
                callback(null, await metaApi.retrieveEntities());
            },
            // attributes: async function(callback) {
            //     callback(null, await metaApi.retrieveAttributes(undefined));
            // },
            optionsets: async function(callback) {
                callback(null, await metaApi.retrieveOptionSets());
            },
            solutions: async function(callback) {
                const solutions = await webApi.retrieveSolutions();
                callback(null, solutions.filter(i => !i.ismanaged && i.isvisible));
            }
        }, (error: any, taskResults: any) => {
            if (error) {
                Quickly.error(error.message);
                return;
            }
            
            viewModel.entities = taskResults.entities;
            viewModel.optionsets = taskResults.optionsets;
            viewModel.solutions = taskResults.solutions;

            // set the initial state
            this.postMessage({ command: 'load', viewModel });
        });
    }
}