import * as cs from "../cs";
import * as vscode from 'vscode';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from "../core/ExtensionContext";

/**
 * This command can be invoked by the Command Palette or the Dynamics TreeView and adds a solution component to a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, solution?:any, componentId?:string, componentType?:DynamicsWebApi.SolutionComponent, addRequiredComponents?:boolean, doNotIncludeSubcomponents?:boolean, componentSettings?:string): Promise<any> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
	if (!config) { return; }

	solution = solution || await Quickly.pickCdsSolution(config, "Choose a solution", true);
	if (!solution) { return; }

	componentType = componentType || await Quickly.pickCdsSolutionComponentType("Choose a component to add", [
		DynamicsWebApi.SolutionComponent.Entity,
		DynamicsWebApi.SolutionComponent.OptionSet,
		DynamicsWebApi.SolutionComponent.PluginAssembly,
		DynamicsWebApi.SolutionComponent.WebResource,
		DynamicsWebApi.SolutionComponent.Workflow
	]);
	if (!componentType) { return; }
	
	if (Utilities.$Object.IsNullOrEmpty(componentId)) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, solution, componentType, "Choose a component to add");
		if (!pickResponse) { return; }

		componentId = pickResponse.componentId;
	}

	addRequiredComponents = addRequiredComponents || await Quickly.pickBoolean("Add all dependent components?", "Yes", "No");
	doNotIncludeSubcomponents = doNotIncludeSubcomponents || !await Quickly.pickBoolean("Include subcomponents?", "Yes", "No");

	const api = new ApiRepository(config);

	return api.addSolutionComponent(solution, componentId, componentType, addRequiredComponents, doNotIncludeSubcomponents, componentSettings)
		.then(() => solution)
		.catch(error => Quickly.error(
			`Could not add ${componentType.toString()} to solution.  The error returned was: ${error.message}`, 
			undefined, 
			"Retry", 
			() => vscode.commands.executeCommand(cs.dynamics.deployment.addSolutionComponent, config, solution, componentId, componentType)));
}