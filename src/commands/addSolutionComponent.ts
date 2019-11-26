import * as vscode from 'vscode';
import * as cs from '../cs';
import IContributor from '../core/CommandBuilder';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import QuickPicker from '../core/QuickPicker';
import Utilities from '../core/Utilities';

export default class AddSolutionComponent implements IContributor {
    workspaceConfiguration:vscode.WorkspaceConfiguration;

    contribute(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
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
                    const pickResponse = await QuickPicker.pickDynamicsSolutionComponent(config, solution, componentType, "Choose a component to add");
                    if (!pickResponse) { return; }

                    componentId = pickResponse.componentId;
                }

                addRequiredComponents = addRequiredComponents || await QuickPicker.pickBoolean("Add all dependent components?", "Yes", "No");
                doNotIncludeSubcomponents = doNotIncludeSubcomponents || !await QuickPicker.pickBoolean("Include subcomponents?", "Yes", "No");

                const api = new ApiRepository(config);

                return api.addSolutionComponent(solution, componentId, componentType, addRequiredComponents, doNotIncludeSubcomponents, componentSettings)
                    .then(() => solution)
                    .catch(error => QuickPicker.error(
                        `Could not add ${componentType.toString()} to solution.  The error returned was: ${error.message}`, 
                        undefined, 
                        "Retry", 
                        () => vscode.commands.executeCommand(cs.dynamics.deployment.addSolutionComponent, config, solution, componentId, componentType)));
            })
        );
    }


}