import * as vscode from 'vscode';
import * as cs from '../cs';
import IWireUpCommands from '../wireUpCommand';
import { DynamicsWebApi } from '../api/Types';
import ApiRepository from '../repositories/apiRepository';
import QuickPicker from '../helpers/QuickPicker';

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

                return api.uploadPluginAssembly(file, pluginAssembly ? pluginAssembly.pluginassemblyid : null)
                    .then(pluginAssemblyId => {
                        if (!pluginAssembly && solution) {
                            return api.addSolutionComponent(solution, pluginAssemblyId, DynamicsWebApi.SolutionComponent.PluginAssembly, false, true)
                                .catch(error => console.error(error));
                        }                        
                    });
            })
        );
    }


}