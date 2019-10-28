import * as vscode from 'vscode';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import QuickPicker from '../helpers/QuickPicker';
import Utilities from '../helpers/Utilities';

export default class RemoveSolutionComponent implements IWireUpCommands {
    public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public wireUpCommands(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = wconfig;

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.removeSolutionComponent, async (config?:DynamicsWebApi.Config, solution?:any, componentId?:string, componentType?:DynamicsWebApi.SolutionComponent):Promise<any> => { 
				config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				solution = solution || await QuickPicker.pickDynamicsSolution(config, "Choose a solution", true);
				if (!solution) { return; }

                if (Utilities.IsNullOrEmpty(componentId)) { return; }
                if (Utilities.IsNullOrEmpty(componentType)) { return; }

                const api = new ApiRepository(config);

                return api.removeSolutionComponent(solution, componentId, componentType)
                    .then(() => solution);
            })
        );
    }


}