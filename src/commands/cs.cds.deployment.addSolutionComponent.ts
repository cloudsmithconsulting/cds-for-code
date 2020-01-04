import * as cs from "../cs";
import * as vscode from 'vscode';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import ApiRepository from '../repositories/apiRepository';
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/Logger";

/**
 * This command can be invoked by the Command Palette or the Dynamics TreeView and adds a solution component to a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?:CdsWebApi.Config, solution?:any, componentId?:string, componentType?:CdsSolutions.SolutionComponent, addRequiredComponents?:boolean, doNotIncludeSubcomponents?:boolean, componentSettings?:string): Promise<any> {
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

	componentType = componentType || await Quickly.pickCdsSolutionComponentType("Choose a component to add", [
		CdsSolutions.SolutionComponent.Entity,
		CdsSolutions.SolutionComponent.OptionSet,
		CdsSolutions.SolutionComponent.PluginAssembly,
		CdsSolutions.SolutionComponent.WebResource,
		CdsSolutions.SolutionComponent.Workflow
	]);
	if (!componentType) { 
		logger.warn("Component Type not chosen, command cancelled");
		return; 
	}
	
	if (Utilities.$Object.isNullOrEmpty(componentId)) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, solution, componentType, "Choose a component to add");
		if (!pickResponse) { 
			logger.warn("Component not chosen, command cancelled");
			return; 
		}

		componentId = pickResponse.componentId;
	}

	addRequiredComponents = addRequiredComponents || await Quickly.pickBoolean("Add all dependent components?", "Yes", "No");
	doNotIncludeSubcomponents = doNotIncludeSubcomponents || !await Quickly.pickBoolean("Include subcomponents?", "Yes", "No");

	const api = new ApiRepository(config);

	logger.info(`Adding ${componentId} to ${solution.uniquename}`);

	return await api.addSolutionComponent(solution, componentId, componentType, addRequiredComponents, doNotIncludeSubcomponents, componentSettings)
		.then(() => solution)
		.catch(error => Quickly.error(
			`Could not add ${componentType.toString()} to solution.  The error returned was: ${error.message}`, 
			undefined, 
			"Retry", 
			() => vscode.commands.executeCommand(cs.cds.deployment.addSolutionComponent, config, solution, componentId, componentType)));
}