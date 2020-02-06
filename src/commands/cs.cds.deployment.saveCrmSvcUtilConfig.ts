import * as cs from "../cs";
import * as FileSystem from '../core/io/FileSystem';
import * as vscode from 'vscode';
import * as path from 'path';
import TemplateManager from "../components/Templates/TemplateManager";
import ViewManager from "../views/ViewManager";
import Quickly from "../core/Quickly";
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/framework/Logger";
import Xml from "../core/io/Xml";
import CodeGenerationManager from "../components/CodeGeneration/CodeGenerationManager";

/**
 * This command can be invoked by the CDS for Code CodeGenerationManager or another extension
 * and can write a CrmSvcUtil.exe.config file to a specified location.
 * @export run command function, this is the default binding that will be invoked with the command.
 * @param {CodeGenerationManager} this is a manager that handles code generation tasks (helpers)
 * @param {any} [config] indicating the view model to use containing the configuration
 * @param {vscode.Uri} [defaultUri] location of where the crmsvcutil.exe.config file should be created/modified
 * @returns void
 */
export default async function run(this: CodeGenerationManager, config: any, defaultUri?: vscode.Uri) {
	if (!config) { 
		logger.warn(`Command: ${cs.cds.deployment.saveCrmSvcUtilConfig} Configuration not supplied, command cancelled`);
		return; 
	}

    defaultUri = defaultUri || config.options?.fsPath ? vscode.Uri.file(config.options.fsPath) : await Quickly.pickWorkspaceFile(undefined, "Choose a config file to edit", undefined, false, [ "*.config" ]).then(r => vscode.Uri.file(r));
	if (!defaultUri) { 
		logger.warn(`Command: ${cs.cds.deployment.saveCrmSvcUtilConfig} Config file not chosen, command cancelled`);
		return; 
	}

    if (defaultUri && !FileSystem.exists(defaultUri.fsPath)) {
		logger.warn(`Command: ${cs.cds.deployment.saveCrmSvcUtilConfig} Configuration not supplied, command cancelled`);
		return; 
    }

	const xml = await Xml.parseFile(defaultUri.fsPath);
	const newXml = this.saveConfig(config, xml);

	FileSystem.writeFileSync(defaultUri.fsPath, await Xml.createXml(newXml));
}