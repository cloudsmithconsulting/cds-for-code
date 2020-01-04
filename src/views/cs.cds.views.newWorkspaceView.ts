import * as vscode from 'vscode';
import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import DiscoveryRepository from '../repositories/discoveryRepository';
import Dictionary from '../core/types/Dictionary';
import ExtensionContext from '../core/ExtensionContext';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';

const _initialized:boolean = false;

async function showWelcomeExperience() {
    if (!this._initialized) {
        const showWelcome:boolean = ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.explorer.showWelcomeExperience);

        if (showWelcome) {
            await vscode.commands.executeCommand(cs.cds.controls.newWorkspace.open);
        }

        this._initialized = true;
    }
}

export default async function openView(config?: CdsWebApi.Config): Promise<View> {
    const view = View.show(NewWorkspaceView, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Welcome to Dynamics 365 for Code',
        type: cs.cds.views.newWorkspaceView,
        preserveFocus: true,
        onReady: view => view.setInitialState(config)
    });

    return view;
}
  
class NewWorkspaceView extends View {
    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('materialize.js');
        viewRenderer.addScript('new-workspace.js');

        viewRenderer.addStyleSheet("materialize.vscode.css");
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('new-workspace.html');
    }    

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([
            { key: 'updateWelcomeExperienceConfig', value: message => ExtensionConfiguration.setConfigurationValue(cs.cds.configuration.explorer.showWelcomeExperience, message.value) },
            { key: 'openConnectionView', value: message => vscode.commands.executeCommand(cs.cds.controls.cdsExplorer.editConnection) }
         ]);
    }

    setInitialState() { 
        this.postMessage({ 
            command: "load", 
            parameters: {
                showWelcomeExperience: ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.explorer.showWelcomeExperience),
                connections: DiscoveryRepository.getOrgConnections(ExtensionContext.Instance)
            }});
    }
}