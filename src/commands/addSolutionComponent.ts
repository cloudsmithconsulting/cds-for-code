import * as vscode from 'vscode';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import QuickPicker from '../helpers/QuickPicker';
import Utilities from '../helpers/Utilities';

export default class AddSolutionComponent implements IWireUpCommands {
    public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public wireUpCommands(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = wconfig;

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.addSolutionComponent, async (config?:DynamicsWebApi.Config, solution?:any, componentId?:string, componentType?:DynamicsWebApi.SolutionComponent, addRequiredComponents?:boolean, doNotIncludeSubcomponents?:boolean, componentSettings?:string):Promise<any> => { 
				config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				solution = solution || await QuickPicker.pickDynamicsSolution(config, "Choose a solution", true);
				if (!solution) { return; }

                componentType = componentType || await QuickPicker.pickDynamicsSolutionComponentType("Choose a component to add", [
                    DynamicsWebApi.SolutionComponent.Entity,
                    DynamicsWebApi.SolutionComponent.OptionSet,
                    DynamicsWebApi.SolutionComponent.PluginAssembly,
                    DynamicsWebApi.SolutionComponent.WebResource,
                    DynamicsWebApi.SolutionComponent.Workflow
                ]);
                if (!componentType) { return; }
                
                if (Utilities.IsNullOrEmpty(componentId)) { 
                    componentId = await QuickPicker.pickDynamicsSolutionComponent(config, undefined, componentType, "Choose a component to add");

                    if (Utilities.IsNullOrEmpty(componentId)) { return; }
                }

                addRequiredComponents = addRequiredComponents || await QuickPicker.pickBoolean("Add all dependent components?", "Yes", "No");
                doNotIncludeSubcomponents = doNotIncludeSubcomponents || !await QuickPicker.pickBoolean("Include subcomponents?", "Yes", "No");

                const api = new ApiRepository(config);

                return api.addSolutionComponent(solution, componentId, componentType, addRequiredComponents, doNotIncludeSubcomponents, componentSettings)
                    .then(() => solution)
                    .catch(error => vscode.window.showErrorMessage(`Could not add ${componentType.toString()} to solution.  The error returned was: ${error.message}`));
            })
        );
    }


}