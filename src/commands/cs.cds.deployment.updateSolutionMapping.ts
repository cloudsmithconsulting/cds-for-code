import * as vscode from "vscode";
import * as FileSystem from '../core/io/FileSystem';
import * as path from 'path';
import { DynamicsWebApi } from "../api/cds-webapi/DynamicsWebApi";
import { Utilities } from "../core/Utilities";
import Quickly from "../core/Quickly";
import SolutionWorkspaceMapping from '../components/Solutions/SolutionWorkspaceMapping';
import SolutionMap from '../components/Solutions/SolutionMap';
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/Logger";

/**
 * This command can be invoked by the Command Palette or CDS Explorer View and removes a solution mapping from the local workspace
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(item?: SolutionWorkspaceMapping, config?: DynamicsWebApi.Config, folder?: string): Promise<SolutionWorkspaceMapping[]> {
	let solutionId;
	let organizationId;
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

	if (item) { 
		organizationId = item.organizationId;
		solutionId = item.solutionId;
	} 

	if (!organizationId) {
		config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
		if (!config) { 
			logger.warn("Configuration not chosen, command cancelled");
			return; 
		}
	
		organizationId = config.orgId;
	}

	if (!solutionId) {
		let solution = await Quickly.pickCdsSolution(config, "Choose a Solution to map to the local workspace", true);
		if (!solution) { 
			logger.warn("Solution not chosen, command cancelled");
			return; 
		}

		solutionId = solution.solutionid;
	}

	folder = folder || await Quickly.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose a workplace folder containing solution items.");
	if (Utilities.$Object.isNullOrEmpty(folder)) { 
		logger.warn("Folder not chosen, command cancelled");
		return; 
	}
	
	const map = await SolutionMap.loadFromWorkspace();
	item = item || map.hasSolutionMap(solutionId, organizationId) ? map.getBySolutionId(solutionId, organizationId)[0] : null;
	
	if (item && item.path && item.path !== folder) {
		// If we're moving into a new folder that's not called the solution name, let's add it (assuming you didn't just rename it).
		if (!folder.endsWith(path.basename(item.path)) 
			&& (item.path.indexOf("\\") === -1 || item.path.substring(0, item.path.lastIndexOf("\\")) !== folder.substring(0, folder.lastIndexOf("\\"))) 
			&& (item.path.indexOf("/") === -1 || item.path.substring(0, item.path.lastIndexOf("/")) !== folder.substring(0, folder.lastIndexOf("/")))) {
			folder = path.join(folder, path.basename(item.path));
		}

		if (item.path !== folder) {
			if (FileSystem.exists(item.path)) {
				logger.info(`Copying contents of ${item.path} into ${folder}`);

				await FileSystem.copyFolder(item.path, folder)
					.then(() => FileSystem.deleteFolder(item.path));
			}
		}
	}

	logger.info(`Updating and saving solution map for ${folder}`);

	map.map(organizationId, solutionId, folder);
	map.saveToWorkspace(ExtensionContext.Instance);

	return map.getByPath(folder, organizationId);
}