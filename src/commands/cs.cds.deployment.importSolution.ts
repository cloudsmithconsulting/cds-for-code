import * as cs from "../cs";
import * as vscode from 'vscode';
import * as FileSystem from '../core/io/FileSystem';
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import Quickly from "../core/Quickly";
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/framework/Logger";
import ApiRepository from "../repositories/apiRepository";

export type ImportSolutionOptions = {
    OverwriteUnmanagedCustomizations: boolean,
    PublishWorkflows: boolean,
    ConvertToManaged?: boolean,
    SkipProductUpdateDependencies?: boolean,
    HoldingSolution?: boolean
};

/**
 * This command can be invoked by the by either the file explorer view or the Dynamics TreeView
 * and can compare two copies of a web resource.
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?: CdsWebApi.Config, solutionFile?: vscode.Uri, options?: ImportSolutionOptions): Promise<any> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
    if (!config) { 
		logger.warn(`Command: ${cs.cds.deployment.importSolution} Organization not chosen, command cancelled`);
		return; 
	}

    solutionFile = solutionFile || <vscode.Uri>(await Quickly.pickAnyFile(vscode.workspace?.workspaceFolders[0]?.uri, false, 'Import solution', { 'Solution files': [ '*.zip' ] } ));
	if (!solutionFile) { 
		logger.warn(`Command: ${cs.cds.deployment.importSolution} Solution file not chosen, command cancelled`);
		return; 
	}

    config.timeout = 120 * 1000;
    const api = new ApiRepository(config);

    options = options || {
        OverwriteUnmanagedCustomizations: true,
        PublishWorkflows: true
    };

    logger.info(`Command: ${cs.cds.deployment.importSolution} Import job started`);
    const importId = await api.importSolution(FileSystem.readFileSync(solutionFile.fsPath, { encoding: 'base64' }), options);
    
    logger.info(`Command: ${cs.cds.deployment.importSolution} Import job ${importId} complete`);
    return importId;
}