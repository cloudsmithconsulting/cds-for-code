import * as vscode from 'vscode';
import * as cs from '../cs';
import connectionEditor from "./cs.cds.views.connectionEditor";
import pluginStepEditor from "./cs.cds.views.pluginStepEditor";
import pluginStepImageEditor from "./cs.cds.views.pluginStepImageEditor";
import jsonInspectorView from "./cs.cds.views.jsonInspectorView";
import newWorkspaceView from "./cs.cds.views.newWorkspaceView";
import svcUtilConfigView from "./cs.cds.views.svcUtilConfigView";
import command from '../core/Command';
import { View } from '../core/webui/View';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';

export default class ViewManager {
    @command(cs.cds.deployment.connectToCds, "Open CDS connection view")
    async openConnection(): Promise<View> {
        return await connectionEditor.apply(this, []);
    }

    @command(cs.cds.controls.cdsExplorer.editConnection, "Edit a CDS connection")
    async editConnection(config: CdsWebApi.Config): Promise<View> {
        return await connectionEditor.apply(this, [config]);
    }

    @command(cs.cds.controls.pluginStep.open, "Open plugin step registration view")
    async openPluginStep(context: vscode.ExtensionContext, pluginAssemblyId:string, config?: CdsWebApi.Config, step?: any): Promise<View> {
        return await pluginStepEditor.apply(this, [context, pluginAssemblyId, config, step]);
    }

    @command(cs.cds.controls.pluginStepImage.open, "Open plugin step image registration view")
    async openPluginStepImage(context: vscode.ExtensionContext, sdkmessageprocessingstepid: string, pluginStepImage: any, config?: CdsWebApi.Config): Promise<View> {
        return await pluginStepImageEditor.apply(this, [context, sdkmessageprocessingstepid, pluginStepImage, config]);
    }

    @command(cs.cds.controls.jsonInspector.open, "Open JSON inspector view")
    async openJsonInspector(item: any) {
        return await jsonInspectorView.apply(this, [item]);
    }

    @command(cs.cds.controls.newWorkspace.open, "Open New Workspace view")
    async openNewWorkspaceWelcome(config?: CdsWebApi.Config): Promise<View> {
        return await newWorkspaceView.apply(this, [config]);
    }

    @command(cs.cds.controls.svcUtilConfig.open, "Open SvcUtil configuration view")
    async openSvcUtilConfiguration(item?: any): Promise<View> {
        return await svcUtilConfigView.apply(this, [item]);
    }
}