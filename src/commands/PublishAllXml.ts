import * as vscode from 'vscode';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import QuickPicker from '..//helpers/QuickPicker';

export default class PublishAllXml implements IWireUpCommands {
    public wireUpCommands(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        
        context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.deployment.publishAllXml, async (config?: DynamicsWebApi.Config) => {
            
            config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
            if (!config) { return; }

            // this operation might run long, we need a longer timeout here
            config.timeout = (1000 * 30); // 30 seconds

            const api = new ApiRepository(config);
            await api.publishAllXml();
            QuickPicker.inform('All customizations published successfully');
        
        }));
    }
}
