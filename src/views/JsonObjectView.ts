import * as vscode from 'vscode';
import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import Dictionary from '../core/types/Dictionary';

export default class JsonObjectViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.cds.controls.jsonInspector.inspect, async (item: any) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.show(JsonObjectView, {
                    icon: './resources/images/cloudsmith-logo-only-50px.png',
                    title: 'Object inspector',
                    type: cs.cds.views.jsonInspectorView
                });

                // only do this if we are editing
                if (item) {
                    view.setInitialState(item);
                }
            }) // <-- no semi-colon, comma starts next command registration
        );
    }
}

class JsonObjectView extends View {
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

    setInitialState(item?: any) {
        if (item) {
            this.postMessage({ command: 'inspect', message: item });
        }
    }
}