import * as vscode from 'vscode';
import { View, ViewRenderer } from '../view';
import * as cs from '../cs';
import { IWireUpCommands } from '../wireUpCommand';

export default class JsonInspectorViewManager implements IWireUpCommands {
	public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.jsonInspector.inspect, async (item: any) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.createOrShow(JsonInspectorView, {
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

class JsonInspectorView extends View {
    public getHtmlForWebview(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('jsoneditor.min.js');
        viewRenderer.addScript('jsonInspector.js');

        viewRenderer.addStyleSheet('webviewStyles.css');
        viewRenderer.addStyleSheet('jsoneditor.min.css');
        viewRenderer.addStyleSheet('jsoneditor.vscode.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderPartialFile('jsonInspector.html');
    }    
    
    public onDidReceiveMessage(instance: JsonInspectorView, message: any): vscode.Event<any> {
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