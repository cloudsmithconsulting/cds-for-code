import * as vscode from 'vscode';
import { View, ViewRenderer } from '../core/webui/View';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';

export default class JsonObjectViewManager implements IContributor {
	contribute(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.jsonInspector.inspect, async (item: any) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.show(JsonObjectView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: 'Object inspector',
                    viewType: cs.dynamics.views.jsonInspectorView
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
    public init(viewRenderer: ViewRenderer): string {
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
    
    public onDidReceiveMessage(instance: JsonObjectView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'default':                
                return;
        }
    }

    public setInitialState(item?: any) {
        if (item) {
            this.panel.webview.postMessage({ command: 'inspect', message: item });
        }
    }
}