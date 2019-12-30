import * as vscode from 'vscode';
import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import DiscoveryRepository from '../repositories/discoveryRepository';
import Dictionary from '../core/types/Dictionary';

export default class NewWorkspaceViewManager implements IContributor {
    private static _initialized:boolean = false;

    async showWelcomeExperience() {
        if (!NewWorkspaceViewManager._initialized) {
            const showWelcome:boolean = ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.explorer.showWelcomeExperience);

            if (showWelcome) {
                await vscode.commands.executeCommand(cs.cds.controls.newWorkspace.open);
            }

            NewWorkspaceViewManager._initialized = true;
        }
    }

	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        let view;

        context.subscriptions.push(
            vscode.commands.registerCommand(cs.cds.controls.newWorkspace.open, (showLoadingMessage:boolean = false) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                view = View.show(NewWorkspaceView, {
                    icon: './resources/images/cloudsmith-logo-only-50px.png',
                    title: 'Welcome to Dynamics 365 for Code',
                    type: cs.cds.views.newWorkspaceView,
                    preserveFocus: true
                });

                view.postMessage({ 
                    command: "load", 
                    parameters: {
                        showWelcomeExperience: ExtensionConfiguration.getConfigurationValue(cs.cds.configuration.explorer.showWelcomeExperience),
                        connections: DiscoveryRepository.getOrgConnections(context)
                    }});

                return view;
            }) // <-- no semi-colon, comma starts next command registration
            , vscode.commands.registerCommand(cs.cds.controls.newWorkspace.showLoadingMessage, async () => {
                if (!view) {
                    view = await vscode.commands.executeCommand(cs.cds.controls.newWorkspace.open, true);                    
                } else {
                    view.postMessage({ command: "showLoadingMessage" });
                }
            })
            , vscode.commands.registerCommand(cs.cds.controls.newWorkspace.hideLoadingMessage, async () => {
                if (!view) {
                    view = await vscode.commands.executeCommand(cs.cds.controls.newWorkspace.open, false);
                } else {
                    view.postMessage({ command: "hideLoadingMessage" });
                }
            })
        );

        //this.showWelcomeExperience();
    }
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
            { key: 'openConnectionView', value: message => vscode.commands.executeCommand(cs.cds.controls.dynamicsTreeView.editConnection) }
         ]);
    }
}