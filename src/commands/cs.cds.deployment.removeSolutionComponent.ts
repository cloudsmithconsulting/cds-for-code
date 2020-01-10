import * as vscode from 'vscode';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import ApiRepository from '../repositories/apiRepository';
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from "../core/ExtensionContext";
import logger from '../core/framework/Logger';

/**
 * This command can be invoked by the Command Palette or the Dynamics TreeView and removes a solution component from a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:CdsWebApi.Config, solution?:any, componentId?:string, componentType?:CdsSolutions.SolutionComponent): Promise<any> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) {
		logger.warn("Organization not chosen, command cancelled");
		return; 
	}

	solution = solution || await Quickly.pickCdsSolution(config, "Choose a solution", true);
	if (!solution) {
		logger.warn("Solution not chosen, command cancelled");
		return; 
	}

	if (Utilities.$Object.isNullOrEmpty(componentType)) {
		componentType = await Quickly.pickCdsSolutionComponentType("Choose a component to remove", [
			CdsSolutions.SolutionComponent.Entity,
			CdsSolutions.SolutionComponent.OptionSet,
			CdsSolutions.SolutionComponent.PluginAssembly,
			CdsSolutions.SolutionComponent.WebResource,
			CdsSolutions.SolutionComponent.Workflow
		]);

		if (Utilities.$Object.isNullOrEmpty(componentType)) { 
			logger.warn("Component type not chosen, command cancelled");
			return; 
		}
	}
	
	if (Utilities.$Object.isNullOrEmpty(componentId)) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, solution, componentType, "Choose a component to remove");
		if (!pickResponse) { 
			logger.warn("Component not chosen, command cancelled");
			return; 
		}

		componentId = pickResponse.componentId;
	}

	const api = new ApiRepository(config);

	logger.info(`Removing ${componentId} from ${solution.uniquename}`);

	return await api.removeSolutionComponent(solution, componentId, componentType)
		.then(() => solution)
		.catch(error => Quickly.error(`Could not remove ${componentType.toString()} from solution.  The error returned was: ${error && error.message ? error.message : error}`));
}