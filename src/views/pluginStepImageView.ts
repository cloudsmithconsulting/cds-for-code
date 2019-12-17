import * as vscode from 'vscode';
import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import ApiRepository from '../repositories/apiRepository';
import Dictionary from '../core/types/Dictionary';
import Quickly from '../core/Quickly';
import { CdsSolutions } from '../api/CdsSolutions';

export default class PluginStepImageViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, wsConfig?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.pluginStepImage.open, (sdkmessageprocessingstepid: string, pluginStepImage: any, config?: DynamicsWebApi.Config) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = PluginStepImageView.show(PluginStepImageView, {
                    icon: './resources/images/cloudsmith-logo-only-50px.png',
                    title: 'Configure Plugin Step Image - Dynamics 365 CE',
                    type: cs.dynamics.views.pluginStepImageView,
                    alwaysNew: true
                });

                view.setInitialState(sdkmessageprocessingstepid, pluginStepImage, config);
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class PluginStepImageView extends View {
    config: DynamicsWebApi.Config;

    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('pluginStepImageView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('plugin-step-image.html');
    }    

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([
            { key: 'save', value: message => this.save(message.pluginStepImage) }
         ]);
    }
    
    private save(pluginStepImage: any) {
        const api = new ApiRepository(this.config);
        
        api.upsertPluginStepImage(pluginStepImage)
            .then(async result => {
                const solution = await Quickly.pickCdsSolution(this.config, "Choose a dynamics 365 Solution", true);
                if (solution) {
                    await api.addSolutionComponent(solution, 
                        pluginStepImage.sdkmessageprocessingstepimageid, 
                        CdsSolutions.SolutionComponent.SdkMessageProcessingStepImage, 
                        true,
                        false);
                }
            })
            .then(() => this.dispose())
            .catch(err => {
                this.postMessage({ command: 'error', message: err.message });
                console.error(err);
            });
    }
   
    setInitialState(sdkmessageprocessingstepid: string, viewModel: any, config: DynamicsWebApi.Config) {
        this.config = config;
        this.postMessage({ command: 'load', viewModel, sdkmessageprocessingstepid });
    }
}