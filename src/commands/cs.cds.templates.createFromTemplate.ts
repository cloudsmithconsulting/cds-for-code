import * as vscode from 'vscode';
import ExtensionConfiguration from "../core/ExtensionConfiguration";
import * as cs from "../cs";
import Quickly from "../core/Quickly";
import { TemplateItem, TemplateType } from "../components/Templates/Types";
import * as FileSystem from "../core/io/FileSystem";
import * as p from 'path';
import logger from "../core/framework/Logger";
import TemplateManager from "../components/Templates/TemplateManager";

/**
 * Command creates a folder or item in your workspace and restores a template from the catalog to it.
 * This command can be invoked by the Command Palette or in a folder context menu on the explorer view.
 *
 * @export command module
 * @this TemplateManager instance that manages this command.
 * @param {vscode.Uri} [destinationUri] supplied by vscode's contribution on file/explorer.
 * @returns void
 */
export default async function run(this: TemplateManager, destinationUri?: vscode.Uri, type?:TemplateType, template?:TemplateItem): Promise<void> {
    let path:string;

    if (template && !type) {
        type = template.type;
    }

    type = type || await Quickly.pickEnum<TemplateType>(TemplateType, "What kind of template would you like to create?");
    if (!type) {
        logger.warn(`Command: ${cs.cds.templates.createFromTemplate} Template not chosen, command cancelled`);
        return; 
    }

    template = template || await Quickly.pickTemplate("Choose a template that you would like to create.", type);
    if (!template) {
        logger.warn(`Command: ${cs.cds.templates.createFromTemplate} Template not chosen, command cancelled`);
        return;
    }

    if (!destinationUri || !destinationUri.fsPath || !FileSystem.exists(destinationUri.fsPath)) {
        switch (type) {
            case TemplateType.ProjectTemplate:
                path = await Quickly.pickWorkspaceFolder(destinationUri, "Select the template folder");
                break;
            case TemplateType.ItemTemplate:
                const fileItem = await Quickly.pickWorkspaceAny(destinationUri, "Select the template item");
                path = fileItem.fsPath;

                if (fileItem.itemType === vscode.FileType.Directory) {
                    const filename = await Quickly.ask("What would you like to call the file that is created?");
                    if (!filename) { return; }

                    path = `${p.join(path, filename + p.extname(template.location))}`;
                } else {
                    path = fileItem.fsPath;
                }

                break;
        }
    } else {
        path = destinationUri.fsPath;
    }

    if (!path) {
        Quickly.error("You must select a workspace and folder before you can create a templated project or item", false, "Try Again", () => { vscode.commands.executeCommand(cs.cds.templates.createFromTemplate, destinationUri, type); }, "Cancel");
        logger.warn(`Command: ${cs.cds.templates.createFromTemplate} Path not chosen, command cancelled`);

        return;
    }

    if (type === TemplateType.ItemTemplate && p.extname(path).length === 0) {
        const filename = await Quickly.ask("What would you like to call the file that is created?");
        if (!filename) { return; }

        path = `${p.join(path, filename + p.extname(template.location))}`;
    }

    // load latest configuration
    ExtensionConfiguration.updateConfiguration(cs.cds.configuration.templates._namespace);

    // create project
    this.createFromFilesystem(path, type, template).then(
        (context) => {
            if (template && !context.userCanceled) {
                logger.info(`Command: ${cs.cds.templates.createFromTemplate} Template ${template.displayName} created in workspace: ${path}`);
                Quickly.inform(`Created ${template.type === TemplateType.ProjectTemplate ? "project" : "item"} from template '${template.displayName}'`);
            } else if (context.userCanceled) {
                logger.info(`Command: ${cs.cds.templates.createFromTemplate} Template ${template.displayName} execution canceled`);
                Quickly.inform(`Canceled ${template.type === TemplateType.ProjectTemplate ? "project" : "item"} creation from template '${template.displayName}'`);
            }
        },
        (reason: any) => {
            Quickly.error(`Failed to create items from the template in '${path}': ${reason}`, false, "Try Again", () => { this.createTemplate(destinationUri); }, "Cancel");
        }
    );
}