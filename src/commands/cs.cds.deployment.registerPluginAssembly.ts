import * as vscode from 'vscode';
import * as cs from '../cs';
import * as FileSystem from '../core/io/FileSystem';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import ApiRepository from '../repositories/apiRepository';
import TerminalManager, { TerminalCommand } from '../components/Terminal/SecureTerminal';
import * as path from 'path';
import { TS } from 'typescript-linq';
import DotNetProjectManager from '../components/DotNetCore/DotNetProjectManager';
import { Octicon } from "../core/types/Octicon";
import Quickly, { QuickPickOption } from '../core/Quickly';
import ExtensionContext from '../core/ExtensionContext';
import logger from '../core/framework/Logger';
import SolutionManager from '../components/Solutions/SolutionManager';

export default async function run(this: SolutionManager, config?: CdsWebApi.Config, pluginAssembly?: any, file?: vscode.Uri, solution?: any): Promise<any> {
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
    if (!file) { 
        logger.warn(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin assembly not chosen, command cancelled`);
        return; 
    }

    if (DotNetProjectManager.fileIsProject(file)) {
        await vscode.commands.executeCommand(cs.cds.deployment.dotNetBuild, file, undefined, "!")
            .then(() => FileSystem.walk(path.dirname(file.fsPath), item => {
                return item.indexOf('\\obj\\') === -1
                    && item.endsWith(path.basename(file.fsPath, path.extname(file.fsPath)) + ".dll" );
            }))
            .then(async results => { 
                if (results.length === 0) {
                    Quickly.error(`No build output was found when building ${file}`);

                    return;
                } else {
                    let option = await Quickly.pick("Choose the output assembly to deploy", ...results.map(r => new QuickPickOption(`${Octicon.file_binary} ${r}`, undefined, undefined, r)));
                    
                    if (option) {
                        file = vscode.Uri.file(option.context);
                    }
                }
            });
    }

    if (!file || !file.fsPath.endsWith('.dll')) { return; }

    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
    if (!config) { 
        logger.warn(`Command: ${cs.cds.deployment.registerPluginAssembly} Organization not chosen, command cancelled`);
        return; 
    }

    solution = solution || await Quickly.pickCdsSolution(config, "Choose a solution", true);
    pluginAssembly = pluginAssembly || await Quickly.pickCdsSolutionComponent(config, solution, CdsSolutions.SolutionComponent.PluginAssembly, undefined, "Choose a plugin assembly to update (or press esc for new)");
   
    const api = new ApiRepository(config);

    logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Attempting registration of plugin on '${config.appUrl}'`);

    return await TerminalManager.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "\\Tools\\CloudSmith.Tools.AssemblyScanner\\"))
        .then(async terminal => { 
            logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Scanning for plugin types.`);

            return await terminal.run(new TerminalCommand(`.\\AssemblyScanner.exe "${file.fsPath}"`))
                .then(tc => {
                    const assemblyInfo = JSON.parse(tc.output);
                    const types:any[] = new TS.Linq.Enumerator(assemblyInfo.Types).where(t => new TS.Linq.Enumerator((<any>t).Interfaces).any(i => i === "Microsoft.Xrm.Sdk.IPlugin")).toArray();
                    let assemblyId:string;

                    if (!types || types.length === 0) {
                        vscode.window.showWarningMessage(`The plugin assembly could not find any valid Plugin classes when scanning '${file.fsPath}'`);

                        return;
                    }

                    logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: ${types.length} plugins found.`);
                    logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Uploading plugin assembly.`);

                    return api.uploadPluginAssembly(file, pluginAssembly ? pluginAssembly.pluginassemblyid : null)
                        .then(pluginAssemblyId => {
                            assemblyId = pluginAssemblyId;

                            logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Upload successful for ${assemblyId}`);

                            if (!pluginAssembly && solution) {
                                logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Adding plugin to ${solution.uniquename}`);

                                return api.addSolutionComponent(solution, pluginAssemblyId, CdsSolutions.SolutionComponent.PluginAssembly, true, false);
                            }                        
                        })
                        .then(response => {
                            const promises:Promise<void>[] = [];

                            logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Adding plugin types`);

                            for (let i = 0; i < types.length; i++) {
                                promises.push(api.upsertPluginType(assemblyId, types[i].Name));
                            }
                            
                            return Promise.all(promises);
                        }).then(responses => {
                            logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Opening step window`);

                            if (!pluginAssembly) {
                                vscode.commands.executeCommand(cs.cds.controls.pluginStep.open, assemblyId, undefined, config, undefined);
                            }
                        }).then(() => {
                            logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Registration complete`);

                            Quickly.inform(`The plugin assembly '${path.basename(file.fsPath)}' has been registered on the Dynamics 365 server.`);
                        });
                });                      
        })
        .catch(async (error) => {
            logger.log(`Command: ${cs.cds.deployment.registerPluginAssembly} Plugin ${file}: Error occurred.  Output is as follows: \r\n${JSON.stringify(error)}`);

            await Quickly.error(
                `The plugin ${path.basename(file.fsPath)} was not registered successfully.  See the output window for details.`, 
                undefined, 
                'Retry', 
                () => SolutionManager.registerPluginAssembly(config, pluginAssembly, file, solution) );
        });

}