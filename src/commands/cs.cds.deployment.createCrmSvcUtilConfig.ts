import * as cs from "../cs";
import * as FileSystem from '../core/io/FileSystem';
import * as vscode from 'vscode';
import * as path from 'path';
import TemplateManager from "../components/Templates/TemplateManager";
import ViewManager from "../views/ViewManager";
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import Quickly from "../core/Quickly";
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/framework/Logger";
import Xml from "../core/io/Xml";
import CodeGenerationManager from "../components/CodeGeneration/CodeGenerationManager";

/**
 * This command can be invoked by the by either the file explorer view or the CDS Explorer
 * and can create a blank crmsvcutil.exe.config file or open an existing one up in the editor.
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(this: CodeGenerationManager, config?: CdsWebApi.Config, defaultUri?: vscode.Uri) {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.deployment.createCrmSvcUtilConfig} Organization not chosen, command cancelled`);
		return; 
	}

	const stats = defaultUri ? await FileSystem.stats(defaultUri.fsPath) : undefined;
	
    defaultUri = (stats && !stats.isDirectory() ? defaultUri : undefined) || await Quickly.pickWorkspaceFile(defaultUri, "Choose a config file to create or edit", undefined, true, [ "*.config" ]).then(r => vscode.Uri.file(r));
	if (!defaultUri) { 
		logger.warn(`Command: ${cs.cds.deployment.createCrmSvcUtilConfig} Config file not chosen, command cancelled`);
		return; 
	}

    if (defaultUri && !FileSystem.exists(defaultUri.fsPath)) {
        const template = await TemplateManager.getSystemTemplate("crmsvcutil.config.xml");
        const configFile = await template.apply(undefined, { });
	
		FileSystem.makeFolderSync(path.dirname(defaultUri.fsPath));
		FileSystem.writeFileSync(defaultUri.fsPath, configFile);
    }

	const xml = await Xml.parseFile(defaultUri.fsPath);
	const viewModel = this.parseXml(xml);
	
    await ViewManager.openSvcUtilConfiguration(config);
}