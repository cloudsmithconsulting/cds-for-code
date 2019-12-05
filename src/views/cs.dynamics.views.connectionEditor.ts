import * as vscode from 'vscode';
import * as cs from '../cs';
import { View, ViewRenderer, BridgeCommunicationMethod } from '../core/webui/View';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import DiscoveryRepository from '../repositories/discoveryRepository';
import ExtensionContext from '../core/ExtensionContext';

let view: CdsConnectionEditor;

export default async function openView(config?: DynamicsWebApi.Config): Promise<View> {
    view = View.show(CdsConnectionEditor, {
        extensionPath: ExtensionContext.Instance.extensionPath,
        iconPath: './resources/images/cloudsmith-logo-only-50px.png',
        viewTitle: (config && config.name) ? `Edit CDS Connection - ${config.name}` : 'New CDS Connection',
        viewType: cs.dynamics.views.connectionEditor,
        preserveFocus: false,
        bridgeType: BridgeCommunicationMethod.Ipc
    });

    view.setInitialState(config);

    return view;
}

class CdsConnectionEditor extends View {
    init(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('materialize.js');
        viewRenderer.addScript('connection-editor.js');

        viewRenderer.addStyleSheet("materialize.vscode.css");

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('connection-editor.html');
    } 
    
    private save(config: DynamicsWebApi.Config) {
        // set a timeout if it doesn't exist
        config.timeout = config.timeout || (1000 * 3); // 3 seconds
        // construct the api repo
        const api = new DiscoveryRepository(config);
        
        // try a discovery request
        api.retrieveOrganizations()
            .then(() => {
                // success, add it to connection window
                vscode.commands.executeCommand(cs.dynamics.controls.dynamicsTreeView.addConnection, config)
                .then(() => {
                    this.dispose();
                });
            })
            .catch(err => {
                this.panel.webview.postMessage({ command: 'error', message: err.message });
            });
    }
    
    onDidReceiveMessage(instance: CdsConnectionEditor, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'save':
                instance.save(message.settings);
                return;
        }
    }

    setInitialState(config?: DynamicsWebApi.Config) {
        if (config) {
            this.panel.webview.postMessage({ command: 'load', message: config });
        } else {
            this.panel.webview.postMessage({ command: "load" });
        }
    }
}