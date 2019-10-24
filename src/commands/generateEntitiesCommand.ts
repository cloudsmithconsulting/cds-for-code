import * as path from 'path';
import { TS } from 'typescript-linq/TS';
import * as vscode from 'vscode';
import * as cs from '../cs';
import ExtensionConfiguration from '../config/ExtensionConfiguration';
import QuickPickOption from '../helpers/QuickPicker';
import { Terminal } from '../helpers/Terminal';
import { Utilities } from '../helpers/Utilities';
import DiscoveryRepository from '../repositories/discoveryRepository';
import { IWireUpCommands } from '../wireUpCommand';

export default class GenerateEntitiesCommand implements IWireUpCommands {
    public wireUpCommands(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // setup configurations
        const sdkInstallPath = ExtensionConfiguration.parseConfigurationValue<string>(config, cs.dynamics.configuration.tools.sdkInstallPath);
        // set core tools root
        const coreToolsRoot = path.join(sdkInstallPath, 'CoreTools');
        const workspaceFolder = vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.powerShell.generateEntities, async (config?:DynamicsWebApi.Config, path?:string, outputFileName?: string, namespace?: string) => { // Match name of command to package.json command
                config = config || await DiscoveryRepository.getOrgConnections(context)
                    .then(orgs => new TS.Linq.Enumerator(orgs).select(org => new QuickPickOption(org.name, org.webApiUrl, undefined, org)).toArray())
                    .then(options => vscode.window.showQuickPick(options, { placeHolder: "Choose a Dynamics 365 Organization", canPickMany: false, ignoreFocusOut: true}))
                    .then(chosen => chosen.context);
                if (!config) { return; }

                path = path || await vscode.window
                    .showOpenDialog({canSelectFolders: true, canSelectFiles: false, canSelectMany: false, defaultUri: workspaceFolder.uri})
                    .then(async pathUris => pathUris[0].fsPath);
                if (Utilities.IsNullOrEmpty(path)) { return; }

                outputFileName = outputFileName || await vscode.window
                    .showInputBox({ prompt: 'Please enter the output file name', value: 'XrmEntities.cs' })
                    .then(chosen => chosen);
                if (Utilities.IsNullOrEmpty(outputFileName)) { return; }
                

                namespace = namespace || await vscode.window
                    .showInputBox({ prompt: 'Please enter the namespace for the generated code', value: 'XrmEntities' })
                    .then(chosen => chosen);
                if (Utilities.IsNullOrEmpty(namespace)) { return; }

                // setup the command text
                const commandToExecute = `.\\Generate-XrmEntities.ps1 `
                    + `-ToolsPath ${coreToolsRoot} `
                    + `-Url "${Utilities.EnforceTrailingSlash(config.webApiUrl)}XRMServices/2011/Organization.svc" `
                    + `-Username "${config.username}" `
                    + `-Password "${Utilities.PowerShellSafeString(config.password)}" `
                    + (config.domain ? `-Domain "${config.domain}" ` : '')
                    + `-Path "${path}" `
                    + `-OutputFile "${outputFileName}" `
                    + (!Utilities.IsNull(namespace) ? `-Namespace "${namespace}" ` : '');

                // build a powershell terminal
                const terminal = Terminal.showTerminal(context.globalStoragePath);
                // execute the command
                terminal.sendText(commandToExecute);
            })
        );
    }


}