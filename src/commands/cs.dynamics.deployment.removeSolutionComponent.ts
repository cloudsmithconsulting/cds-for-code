import * as vscode from 'vscode';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import ApiRepository from '../repositories/apiRepository';
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from "../core/ExtensionContext";

/**
 * This command can be invoked by the Command Palette or the Dynamics TreeView and removes a solution component from a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:DynamicsWebApi.Config, solution?:any, componentId?:string, componentType?:CdsSolutions.SolutionComponent): Promise<any> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
	if (!config) { return; }

	solution = solution || await Quickly.pickCdsSolution(config, "Choose a solution", true);
	if (!solution) { return; }

	if (Utilities.$Object.IsNullOrEmpty(componentType)) {
		componentType = await Quickly.pickCdsSolutionComponentType("Choose a component to remove", [
			CdsSolutions.SolutionComponent.Entity,
			CdsSolutions.SolutionComponent.OptionSet,
			CdsSolutions.SolutionComponent.PluginAssembly,
			CdsSolutions.SolutionComponent.WebResource,
			CdsSolutions.SolutionComponent.Workflow
		]);

		if (Utilities.$Object.IsNullOrEmpty(componentType)) { return; }
	}
	
	if (Utilities.$Object.IsNullOrEmpty(componentId)) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, solution, componentType, "Choose a component to remove");
		if (!pickResponse) { return; }

		componentId = pickResponse.componentId;
	}

	const api = new ApiRepository(config);

	return api.removeSolutionComponent(solution, componentId, componentType)
		.then(() => solution)
		.catch(error => vscode.window.showErrorMessage(`Could not remove ${componentType.toString()} from solution.  The error returned was: ${error && error.message ? error.message : error}`));
}