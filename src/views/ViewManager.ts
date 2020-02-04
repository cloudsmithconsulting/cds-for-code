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
    static async openConnection(): Promise<View> {
        return await connectionEditor.apply(this, []);
    }

    @command(cs.cds.controls.cdsExplorer.editConnection, "Edit a CDS connection")
    static async editConnection(config: CdsWebApi.Config): Promise<View> {
        return await connectionEditor.apply(this, [config]);
    }

    @command(cs.cds.controls.pluginStep.open, "Open plugin step registration view")
    static async openPluginStep(pluginAssemblyId:string, config?: CdsWebApi.Config, step?: any): Promise<View> {
        return await pluginStepEditor.apply(this, [pluginAssemblyId, config, step]);
    }

    @command(cs.cds.controls.pluginStepImage.open, "Open plugin step image registration view")
    static async openPluginStepImage(sdkmessageprocessingstepid: string, pluginStepImage: any, config?: CdsWebApi.Config): Promise<View> {
        return await pluginStepImageEditor.apply(this, [sdkmessageprocessingstepid, pluginStepImage, config]);
    }

    @command(cs.cds.controls.jsonInspector.open, "Open JSON inspector view")
    static async openJsonInspector(item: any) {
        return await jsonInspectorView.apply(this, [item]);
    }

    @command(cs.cds.controls.newWorkspace.open, "Open New Workspace view")
    static async openNewWorkspaceWelcome(config?: CdsWebApi.Config): Promise<View> {
        return await newWorkspaceView.apply(this, [config]);
    }

    @command(cs.cds.controls.svcUtilConfig.open, "Open SvcUtil configuration view")
    static async openSvcUtilConfiguration(config?: CdsWebApi.Config, viewModel?: any): Promise<View> {
        return await svcUtilConfigView.apply(this, [ config, viewModel ]);
    }
}