import { View } from '../core/webui/View';
import { ViewRenderer } from "../core/webui/ViewRenderer";
import * as cs from '../cs';
import Dictionary from '../core/types/Dictionary';
import Quickly from '../core/Quickly';

export default async function openView(item: any): Promise<View> {
    const view = View.show(SvcUtilConfigView, {
        icon: './resources/images/cloudsmith-logo-only-50px.png',
        title: 'Configure entity code generation - CDS',
        type: cs.cds.views.svcUtilConfigView,
        onReady: view => view.setInitialState(item)
    });

    return view;
}

class SvcUtilConfigView extends View {
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
            { key: 'save', value: message => this.save(message.svcUtilConfig) }
         ]);
    }

    private save(svcUtilConfig :any) {
        Quickly.inform(`SvcUtil Configuration was saved.`);
        this.dispose();
    }

    setInitialState(viewModel?: any) {
        this.postMessage({ command: 'load', message: viewModel });
    }
}