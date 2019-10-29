import * as path from 'path';
import * as vscode from 'vscode';
import * as cs from '../cs';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import QuickPicker from '../helpers/QuickPicker';
import DynamicsTerminal from '../views/DynamicsTerminal';
import Utilities from '../helpers/Utilities';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';

export default class GenerateEntitiesCommand implements IWireUpCommands {
    public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = config;

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.powerShell.generateEntities, async (config?:DynamicsWebApi.Config, folder?:string, outputFileName?: string, namespace?: string) => { 
                // setup configurations
                const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(this.workspaceConfiguration, cs.dynamics.configuration.tools.sdkInstallPath);
                const coreToolsRoot = !Utilities.IsNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'CoreTools') : null;
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

                config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				folder = folder || (<vscode.Uri>await QuickPicker.pickAnyFolder(workspaceFolder ? workspaceFolder.uri : undefined, false, "Choose the folder where to generated code will go")).fsPath;
                if (Utilities.IsNullOrEmpty(folder)) { return; }

                outputFileName = outputFileName || await QuickPicker.ask("Enter the output file name", undefined, "XrmEntities.cs");
                if (Utilities.IsNullOrEmpty(outputFileName)) { return; }

                namespace = namespace || await QuickPicker.ask("Enter the namespace for the generated code", undefined, "XrmEntities");
                if (Utilities.IsNullOrEmpty(namespace)) { return; }

                // build a powershell terminal
                DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Scripts\\"))
                    .then(terminal => {
                        terminal.sendText(`.\\Generate-XrmEntities.ps1 `
                            + `-ToolsPath ${coreToolsRoot} `
                            + `-Url "${Utilities.EnforceTrailingSlash(config.webApiUrl)}XRMServices/2011/Organization.svc" `
                            + `-Username "${config.username}" `
                            + `-Password "${Utilities.PowerShellSafeString(config.password)}" `
                            + (config.domain ? `-Domain "${config.domain}" ` : '')
                            + `-Path "${folder}" `
                            + `-OutputFile "${outputFileName}" `
                            + (!Utilities.IsNull(namespace) ? `-Namespace "${namespace}" ` : ''), true);
                    });
            })
        );
    }


}