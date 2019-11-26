import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../cs';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import QuickPicker, { WorkspaceFileItem } from '../core/QuickPicker';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import Utilities from '../core/Utilities';
import IBuildCommands from '../core/CommandBuilder';
import { DynamicsWebApi } from '../api/Types';

export default class GenerateEntitiesCommand implements IBuildCommands {
    public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public buildCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = config;

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.controls.explorer.generateEntityCodeToFile, async (file?:vscode.Uri, ...arg2:any) => {
                vscode.commands.executeCommand(cs.dynamics.powerShell.generateEntities, undefined, path.dirname(file.fsPath), path.basename(file.fsPath), undefined);
            })
            ,vscode.commands.registerCommand(cs.dynamics.controls.explorer.generateEntityCodeToFolder, async (folder?:vscode.Uri, ...arg2:any) => {
                vscode.commands.executeCommand(cs.dynamics.powerShell.generateEntities, undefined, folder.fsPath, undefined, undefined);
            })
            ,vscode.commands.registerCommand(cs.dynamics.powerShell.generateEntities, async (config?:DynamicsWebApi.Config, folder?:string, outputFileName?: string, namespace?: string) => { 
                // setup configurations
                const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
                const coreToolsRoot = !Utilities.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

                config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

                if (!folder && !outputFileName) {
                    const chosenItem:WorkspaceFileItem = await QuickPicker.pickWorkspaceAny(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the destination where generated code will go", undefined, true);

                    if (chosenItem.itemType === vscode.FileType.Directory) {
                        folder = chosenItem.fsPath;
                    } else if (chosenItem.itemType === vscode.FileType.File) {
                        folder = path.dirname(chosenItem.fsPath);
                        outputFileName = path.basename(chosenItem.fsPath);
                    }
                }

                folder = folder || await QuickPicker.pickWorkspaceFolder(workspaceFolder ? workspaceFolder.uri : undefined, "Choose the folder to use when generating code");
                if (Utilities.IsNullOrEmpty(folder)) { return; }

                outputFileName = outputFileName || await QuickPicker.pickWorkspaceFile(vscode.Uri.file(folder), "Choose the filename to use when generating code");
                if (Utilities.IsNullOrEmpty(outputFileName)) { return; }

                namespace = namespace || await QuickPicker.ask("Enter the namespace for the generated code", undefined, path.dirname(folder));
                if (Utilities.IsNullOrEmpty(namespace)) { return; }

                // build a powershell terminal
                return DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Scripts\\"))
                    .then(async terminal => {
                        return await terminal.run(new TerminalCommand(`.\\Generate-XrmEntities.ps1 `)
                            .text(`-ToolsPath ${coreToolsRoot} `)
                            .text(`-Url "${Utilities.EnforceTrailingSlash(config.webApiUrl)}XRMServices/2011/Organization.svc" `)
                            .text(`-Username "${config.username}" -Password "`)
                            .sensitive(`${Utilities.PowerShellSafeString(config.password)}`)
                            .text(`" `)
                            .text((config.domain ? `-Domain "${config.domain}" ` : ''))
                            .text(`-Path "${folder}" `)
                            .text(`-OutputFile "${outputFileName}" `)
                            .text(!Utilities.IsNull(namespace) ? `-Namespace "${namespace}" ` : ''));
                    });
            })
        );
    }


}