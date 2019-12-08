import * as vscode from 'vscode';
import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import Dictionary from '../core/types/Dictionary';

export default class SvcUtilConfigViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.svcUtilConfig.configure, async (item: any) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.show(SvcUtilConfigView, {
                    icon: './resources/images/cloudsmith-logo-only-50px.png',
                    title: 'Configure entity code generation - Dynamics 365 CE',
                    type: cs.dynamics.views.svcUtilConfigView
                });

                // only do this if we are editing
                if (item) {
                    view.setInitialState(item);
                }
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class SvcUtilConfigView extends View {
    construct(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('tabs.js');
        viewRenderer.addScript('crmSvcUtilConfigView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderFile('svcutil-config.html');
    }    

    get commands(): Dictionary<string, Function> {
        return new Dictionary<string, Function>([ ]);
    }

    setInitialState(item?: any) {
        if (item) {
            this.postMessage({ command: 'configure', message: item });
        }
    }
}