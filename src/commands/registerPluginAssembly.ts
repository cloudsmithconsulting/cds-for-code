import * as vscode from 'vscode';
import * as cs from '../cs';
import * as FileSystem from '../core/io/FileSystem';
import IContributor from '../core/CommandBuilder';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import * as path from 'path';
import { TS } from 'typescript-linq';
import VisualStudioProjectCommands from './visualStudioProjectCommands';
import { Octicon } from "../core/Octicon";
import QuickPicker, { QuickPickOption } from '../core/QuickPicker';

export default class RegisterPluginAssembly implements IContributor {
    public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public contribute(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = wconfig;

        // now wire a command into the context
        context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.registerPluginFile, async (file?:vscode.Uri, ...arg2:any) => {
				vscode.commands.executeCommand(cs.dynamics.deployment.registerPluginAssembly, undefined, undefined, file);
			}),

            vscode.commands.registerCommand(cs.dynamics.deployment.registerPluginAssembly, async (config?:DynamicsWebApi.Config, pluginAssembly?:any, file?:vscode.Uri, solution?:any):Promise<any> => { 
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
                let defaultFolder = workspaceFolder ? workspaceFolder.uri : undefined;

                if (file) {
                    if (FileSystem.stats(file.fsPath).isDirectory()) {
                        defaultFolder = file;
                        file = undefined;
                    } else {
                        // If we didn't specify a project file, return.
                        if (!VisualStudioProjectCommands.fileIsProject(file)) { file = undefined; } 
                    }
                }

                const fileTypes = VisualStudioProjectCommands.projectFileTypes;
                fileTypes.push(".dll");

                file = file || await QuickPicker.pickWorkspaceFile(defaultFolder, "Choose a projet to build or assembly to upload", undefined, false, fileTypes).then(r => vscode.Uri.file(r));
                if (!file) { return; }

                if (VisualStudioProjectCommands.fileIsProject(file)) {
                    await vscode.commands.executeCommand(cs.dynamics.deployment.dotNetBuild, file, undefined, "!")
                        .then(() => FileSystem.walk(path.dirname(file.fsPath), item => {
                            return item.endsWith(path.basename(file.fsPath, path.extname(file.fsPath)) + ".dll" );
                        }))
                        .then(async results => { 
                            if (results.length === 0) {
                                vscode.window.showErrorMessage(`No build output was found when building ${file}`);

                                return;
                            } else {
                                let option = await QuickPicker.pick("Choose the output assembly to deploy", ...results.map(r => new QuickPickOption(`${Octicon.file_binary} ${r}`, undefined, undefined, r)));
                                
                                if (option) {
                                    file = vscode.Uri.file(option.context);
                                }
                            }
                        });
                }

                config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				solution = solution || await QuickPicker.pickDynamicsSolution(config, "Choose a solution", true);
                pluginAssembly = pluginAssembly || await QuickPicker.pickDynamicsSolutionComponent(config, solution, DynamicsWebApi.SolutionComponent.PluginAssembly, "Choose a plugin assembly to update (or press esc for new)");
               
                const api = new ApiRepository(config);

                return DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Tools\\CloudSmith.Dynamics365.AssemblyScanner\\"))
                    .then(async terminal => { 
                        return await terminal.run(new TerminalCommand(`.\\AssemblyScanner.exe "${file.fsPath}"`))
                            .then(tc => {
                                const assemblyInfo = JSON.parse(tc.output);
                                const types:any[] = new TS.Linq.Enumerator(assemblyInfo.Types).where(t => new TS.Linq.Enumerator((<any>t).Interfaces).any(i => i === "Microsoft.Xrm.Sdk.IPlugin")).toArray();
                                let assemblyId:string;

                                if (!types || types.length === 0) {
                                    vscode.window.showWarningMessage(`The plugin assembly could not find any valid Plugin classes when scanning '${file.fsPath}'`);

                                    return;
                                }

                                return api.uploadPluginAssembly(file, pluginAssembly ? pluginAssembly.pluginassemblyid : null)
                                    .then(pluginAssemblyId => {
                                        assemblyId = pluginAssemblyId;

                                        if (!pluginAssembly && solution) {
                                            return api.addSolutionComponent(solution, pluginAssemblyId, DynamicsWebApi.SolutionComponent.PluginAssembly, true, false);
                                        }                        
                                    })
                                    .then(response => {
                                        const promises:Promise<void>[] = [];

                                        for (let i = 0; i < types.length; i++) {
                                            promises.push(api.upsertPluginType(assemblyId, types[i].Name));
                                        }
                                        
                                        return Promise.all(promises);
                                    }).then(responses => {
                                        if (!pluginAssembly) {
                                            vscode.commands.executeCommand(cs.dynamics.controls.pluginStep.open, assemblyId);
                                        }
                                    }).then(() => {
                                        vscode.window.showInformationMessage(`The plugin assembly '${file.fsPath}' has been registered on the Dynamics 365 server.`);
                                    });
                            });                      
                    });
            })
        );
    }
}