import * as FileSystem from '../core/io/FileSystem';
import SolutionWorkspaceMapping from '../components/Solutions/SolutionWorkspaceMapping';
import SolutionMap from '../components/Solutions/SolutionMap';
import logger from '../core/framework/Logger';

/**
 * This command can be invoked by the Command Palette or CDS Explorer View and removes a solution mapping from the local workspace
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(this: SolutionMap, item?: SolutionWorkspaceMapping): Promise<boolean> {
	const map = await SolutionMap.loadFromWorkspace();
	let returnValue = false;

	if (!item) { 
		map.clear();
	} else {
		if (item && item.path) {
			if (FileSystem.exists(item.path)) {
				returnValue = true;
				logger.log(`Deleting folder ${item.path}`);
				await FileSystem.deleteFolder(item.path);
			}
		}

		const itemIndex = map.mappings.indexOf(item);

		if (itemIndex > -1) {
			map.mappings.slice(itemIndex, 1);
		}
	}
	
	logger.log(`Saving new mappings to workspace`);
	map.saveToWorkspace();

	return returnValue;
}