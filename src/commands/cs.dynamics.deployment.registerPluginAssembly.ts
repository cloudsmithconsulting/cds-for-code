import * as vscode from 'vscode';
import * as cs from '../cs';
import * as FileSystem from '../core/io/FileSystem';
import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import ApiRepository from '../repositories/apiRepository';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import * as path from 'path';
import { TS } from 'typescript-linq';
import DotNetProjectManager from '../components/DotNetCore/DotNetProjectManager';
import { Octicon } from "../core/types/Octicon";
import Quickly, { QuickPickOption } from '../core/Quickly';
import ExtensionContext from '../core/ExtensionContext';

export default async function run(config?:DynamicsWebApi.Config, pluginAssembly?:any, file?:vscode.Uri, solution?:any): Promise<any> {
    const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
    let defaultFolder = workspaceFolder ? workspaceFolder.uri : undefined;

    if (file) {
        if (FileSystem.stats(file.fsPath).isDirectory()) {
            defaultFolder = file;
            file = undefined;
        } else {
            // If we didn't specify a project file, return.
            if (!DotNetProjectManager.fileIsProject(file)) { file = undefined; } 
        }
    }

    const fileTypes = DotNetProjectManager.projectFileTypes;
    fileTypes.push(".dll");

    file = file || await Quickly.pickWorkspaceFile(defaultFolder, "Choose a projet to build or assembly to upload", undefined, false, fileTypes).then(r => vscode.Uri.file(r));
    if (!file) { return; }

    if (DotNetProjectManager.fileIsProject(file)) {
        await vscode.commands.executeCommand(cs.dynamics.deployment.dotNetBuild, file, undefined, "!")
            .then(() => FileSystem.walk(path.dirname(file.fsPath), item => {
                return item.endsWith(path.basename(file.fsPath, path.extname(file.fsPath)) + ".dll" );
            }))
            .then(async results => { 
                if (results.length === 0) {
                    vscode.window.showErrorMessage(`No build output was found when building ${file}`);

                    return;
                } else {
                    let option = await Quickly.pick("Choose the output assembly to deploy", ...results.map(r => new QuickPickOption(`${Octicon.file_binary} ${r}`, undefined, undefined, r)));
                    
                    if (option) {
                        file = vscode.Uri.file(option.context);
                    }
                }
            });
    }

    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a Dynamics 365 Organization", true);
    if (!config) { return; }

    solution = solution || await Quickly.pickCdsSolution(config, "Choose a solution", true);
    pluginAssembly = pluginAssembly || await Quickly.pickCdsSolutionComponent(config, solution, CdsSolutions.SolutionComponent.PluginAssembly, "Choose a plugin assembly to update (or press esc for new)");
   
    const api = new ApiRepository(config);

    return DynamicsTerminal.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "\\Tools\\CloudSmith.Dynamics365.AssemblyScanner\\"))
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
                                return api.addSolutionComponent(solution, pluginAssemblyId, CdsSolutions.SolutionComponent.PluginAssembly, true, false);
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

}