import * as vscode from 'vscode';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import QuickPicker from '../helpers/QuickPicker';
import DynamicsTerminal from '../views/DynamicsTerminal';
import * as path from 'path';
import { TS } from 'typescript-linq';

export default class RegisterPluginAssembly implements IWireUpCommands {
    public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public wireUpCommands(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = wconfig;

        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.registerPluginAssembly, async (config?:DynamicsWebApi.Config, pluginAssembly?:any, file?:vscode.Uri, solution?:any):Promise<any> => { 
                const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;

                file = file || <vscode.Uri>await QuickPicker.pickAnyFile(workspaceFolder ? workspaceFolder.uri : undefined, false, "Choose the plugin assembly", { 'Assemblies': ['dll'] });
                if (!file) { return; }

                config = config || await QuickPicker.pickDynamicsOrganization(context, "Choose a Dynamics 365 Organization", true);
				if (!config) { return; }

				solution = solution || await QuickPicker.pickDynamicsSolution(config, "Choose a solution", true);
                pluginAssembly = pluginAssembly || await QuickPicker.pickDynamicsSolutionComponent(config, solution, DynamicsWebApi.SolutionComponent.PluginAssembly, "Choose a plugin assembly to update (or none for new)");

                const api = new ApiRepository(config);

                DynamicsTerminal.showTerminal(path.join(context.globalStoragePath, "\\Tools\\CloudSmith.Dynamics365.AssemblyScanner\\"))
                    .then(terminal => {
                        terminal.onDidRunCommand(tc => {
                            if (tc.command.indexOf("CloudSmith.Dynamics365.AssemblyScanner.exe") !== -1) {
                                const assemblyInfo = JSON.parse(tc.output);
                                const types:any[] = new TS.Linq.Enumerator(assemblyInfo.Types).where(t => new TS.Linq.Enumerator((<any>t).Interfaces).any(i => i === "Microsoft.Xrm.Sdk.IPlugin")).toArray();
                                let assemblyId:string;

                                return api.uploadPluginAssembly(file, pluginAssembly ? pluginAssembly.pluginassemblyid : null)
                                    .then(pluginAssemblyId => {
                                        assemblyId = pluginAssemblyId;

                                        if (!pluginAssembly && solution) {
                                            return api.addSolutionComponent(solution, pluginAssemblyId, DynamicsWebApi.SolutionComponent.PluginAssembly, false, true);
                                        }                        
                                    })
                                    .then(response => {
                                        const promises:Promise<void>[] = [];

                                        for (let i = 0; i < types.length; i++) {
                                            promises.push(api.upsertPluginType(assemblyId, types[i].Name));
                                        }
                                        
                                        return Promise.all(promises);
                                    });
                            }
                        });

                        return terminal;
                    })
                    .then(terminal => { terminal.text(`.\\CloudSmith.Dynamics365.AssemblyScanner.exe "${file.fsPath}"`).enter(); });
            })
        );
    }
}