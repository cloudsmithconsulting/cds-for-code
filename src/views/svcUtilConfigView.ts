import * as vscode from 'vscode';
import { View, ViewRenderer } from '../view';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';

export default class SvcUtilConfigViewManager implements IWireUpCommands {
	public wireUpCommands(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        context.subscriptions.push(

            vscode.commands.registerCommand(cs.dynamics.controls.svcUtilConfig.configure, async (item: any) => { // Match name of command to package.json command
                // Run command code
                //const viewFileUri = vscode.Uri.file(`${context.extensionPath}/resources/webViews/connectionView.html`);
                const view = View.createOrShow(SvcUtilConfigView, {
                    extensionPath: context.extensionPath,
                    iconPath: './resources/images/cloudsmith-logo-only-50px.png',
                    viewTitle: 'Configure entity code generation - Dynamics 365 CE',
                    viewType: cs.dynamics.views.svcUtilConfigView
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
    public getHtmlForWebview(viewRenderer: ViewRenderer): string {
        // add script and css assets
        viewRenderer.addScript('tabs.js');
        viewRenderer.addScript('crmSvcUtilConfigView.js');
        viewRenderer.addStyleSheet('webviewStyles.css');

        // add image assets
        viewRenderer.addImage('cloudsmith-logo-only-50px.png');

        // return rendered html
        return viewRenderer.renderPartialFile('svcutil-config.html');
    }    
    
    public onDidReceiveMessage(instance: SvcUtilConfigView, message: any): vscode.Event<any> {
        switch (message.command) {
            case 'default':                
                return;
        }
    }

    public setInitialState(item?: any) {
        if (item) {
            this.panel.webview.postMessage({ command: 'configure', message: item });
        }
    }
}