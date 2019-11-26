import * as vscode from 'vscode';
import * as cs from '../cs';
import IBuildCommands from '../core/CommandBuilder';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import QuickPicker from '../core/QuickPicker';
import Utilities from '../core/Utilities';

export default class PublishCustomizations implements IBuildCommands {
    public buildCommands(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        
        context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.deployment.publishCustomizations, async (config?: DynamicsWebApi.Config, components?:{type:DynamicsWebApi.SolutionComponent, id:string}[]) => {
            
            config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
            if (!config) { return; }

            // this operation might run long, we need a longer timeout here
            config.timeout = (1000 * 30); // 30 seconds

            const api = new ApiRepository(config);

            if (!components) {
                await api.publishAllXml();
                await QuickPicker.inform('All customizations published successfully');
            } else {
                let parameterXml:string = "<importexportxml><webresources>";
                
                components.forEach(c => {
                    if (c.type === DynamicsWebApi.SolutionComponent.WebResource) {
                        parameterXml += `<webresource>{${Utilities.TrimGuid(c.id)}}</webresource>`;
                    }
                });
                
                parameterXml += "</webresources></importexportxml>";

                await api.publishXml(parameterXml);

                await QuickPicker.inform("Components were published successfully");
            }

        }));
    }
}
