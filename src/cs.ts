import * as vscode from "vscode";

export namespace cds {

    /**
     * Static values related to deployment tasks in the CDS for Code extension
     *
     * @export
     * @class deployment
     */
    // tslint:disable-next-line: class-name
    export class deployment {
        static readonly _namespace: string = "cs.cds.deployment";
        static readonly addSolutionComponent: string = `${deployment._namespace}.addSolutionComponent`;
        static readonly compareWebResource: string = `${deployment._namespace}.compareWebResource`;
        static readonly connectToCds: string = `${deployment._namespace}.connectToCds`;
        static readonly createCrmSvcUtilConfig: string = `${deployment._namespace}.createCrmSvcUtilConfig`;
        static readonly createProcess: string = `${deployment._namespace}.createProcess`;
        static readonly createWebResource: string = `${deployment._namespace}.createWebResource`;
        static readonly dotNetBuild: string = `${deployment._namespace}.dotNetBuild`;
        static readonly dotNetTest: string = `${deployment._namespace}.dotNetTest`;
        static readonly exportSolution: string = `${deployment._namespace}.exportSolution`;
        static readonly importSolution: string = `${deployment._namespace}.importSolution`;
        static readonly packWebResource: string = `${deployment._namespace}.packWebResource`;
        static readonly publishCustomizations: string = `${deployment._namespace}.publishCustomizations`;
        static readonly registerPluginAssembly: string = `${deployment._namespace}.registerPluginAssembly`;
        static readonly removeSolutionComponent: string = `${deployment._namespace}.removeSolutionComponent`;
        static readonly removeSolutionMapping: string = `${deployment._namespace}.removeSolutionMapping`;
        static readonly unpackWebResource: string = `${deployment._namespace}.unpackWebResource`;
        static readonly updateSolutionMapping: string = `${deployment._namespace}.updateSolutionMapping`;
    }

    // tslint:disable-next-line: class-name
    export class errors {
        static readonly _namespace: string = "cs.cds.errors";
        static readonly userCancelledAction: string = `${errors._namespace}.userCancelledAction`;
        static readonly webApiResponseError: string = `${errors._namespace}.webApiResponseError`;
    } 

    // tslint:disable-next-line: class-name
    export class extension {
        static readonly _namespace: string = "cs.cds.extension";
        static readonly clearTerminal: string = `${extension._namespace}.clearTerminal`;
        static readonly createTerminal: string = `${extension._namespace}.createTerminal`;
        static readonly downloadRequiredIcons: string = `${extension._namespace}.downloadRequiredIcons`;
        static readonly downloadRequiredScripts: string = `${extension._namespace}.downloadRequiredScripts`;
        static readonly productId: string = `CloudSmithConsulting.cds-for-code`;
        static readonly productName: string = `CloudSmith CDS for Code`;
        static readonly telemetryKey: string = `8e60943e-a073-4ccd-a199-45516b5d7cf3`;
    }

    // tslint:disable-next-line: class-name
    export class powerShell {
        static readonly _namespace: string = "cs.cds.powerShell";
        static readonly generateEntities: string = `${powerShell._namespace}.generateEntities`;
        static readonly packSolution: string = `${powerShell._namespace}.packSolution`;
        static readonly unpackSolution: string = `${powerShell._namespace}.unpackSolution`;
    }

    // tslint:disable-next-line: class-name
    export class telemetryEvents {
        static readonly _namespace: string = "extension";
        static readonly commandInvoked: string = `${telemetryEvents._namespace}.commandInvoked`;
        static readonly commandCompleted: string = `${telemetryEvents._namespace}.commandCompleted`;
        static readonly extensionActivated: string = `${telemetryEvents._namespace}.activated`;
        static readonly extensionDeactivated: string = `${telemetryEvents._namespace}.deactivated`;
        static readonly httpRequest: string = `${telemetryEvents._namespace}.httpRequest`;
        static readonly httpError: string = `${telemetryEvents._namespace}.httpError`;
        static readonly loginFailure: string = `${telemetryEvents._namespace}.loginFailure`;
        static readonly performanceCritical: string = `${telemetryEvents._namespace}.performanceCritical`;
    }

    // tslint:disable-next-line: class-name
    export class templates {
        static readonly _namespace: string = "cs.cds.templates";
        static readonly createFromTemplate: string = `${templates._namespace}.createFromTemplate`;
        static readonly deleteTemplate: string = `${templates._namespace}.deleteTemplate`;
        static readonly editTemplateCatalog: string = `${templates._namespace}.editTemplateCatalog`;
        static readonly exportTemplate: string = `${templates._namespace}.exportTemplate`;
        static readonly importTemplate: string = `${templates._namespace}.importTemplate`;
        static readonly openTemplateFolder: string = `${templates._namespace}.openTemplateFolder`;
        static readonly saveTemplate: string = `${templates._namespace}.saveTemplate`;
    }

    // tslint:disable-next-line: class-name
    export class viewContainers {
        static readonly _namespace: string = "cs.cds.viewContainers";
        static readonly cdsExplorer: string = `${viewContainers._namespace}.cdsExplorer`;
        static readonly templateExplorer: string = `${viewContainers._namespace}.templateExplorer`;
    }

    // tslint:disable-next-line: class-name
    export class views {
        static readonly _namespace: string = "cs.cds.views";
        static readonly connectionEditor: string = `${viewContainers._namespace}.connectionEditor`;
        static readonly jsonInspectorView: string = `${viewContainers._namespace}.jsonInspectorView`;
        static readonly newWorkspaceView: string = `${viewContainers._namespace}.newWorkspaceView`;
        static readonly pluginStepEditor: string = `${viewContainers._namespace}.pluginStepEditor`;
        static readonly pluginStepImageEditor: string = `${viewContainers._namespace}.pluginStepImageEditor`;
        static readonly svcUtilConfigView: string = `${viewContainers._namespace}.svcUtilConfigView`;
    }

    export namespace configuration {
        // tslint:disable-next-line: class-name
        export class web {
            static readonly _namespace: string = "cs.cds.configuration.web";
            static readonly usePowerAppsUi: string = `${web._namespace}.usePowerAppsUi`;
        }
        
        // tslint:disable-next-line: class-name
        export class explorer {
            static readonly _namespace: string = "cs.cds.configuration.explorer";
            static readonly showDefaultSolution: string = `${explorer._namespace}.showDefaultSolution`;
            static readonly showWelcomeExperience: string = `${explorer._namespace}.showWelcomeExperience`;
        }

        // tslint:disable-next-line: class-name
        export class globalState {
            static readonly _namespace: string = "cs.cds.configuration.globalState";
            static readonly dynamicsConnections: string = `${globalState._namespace}:dynamicsConnections`;
            static readonly powerShellScriptVersion: string = `${globalState._namespace}:powerShellScriptVersion`;
        }

        // tslint:disable-next-line: class-name
        export class iconThemes {
            static readonly _namespace: string = "cs.cds.configuration.iconThemes";
            static readonly default: string = `${iconThemes._namespace}.default`;
            static readonly selectedTheme: string = `${iconThemes._namespace}.selectedTheme`;
        }

        // tslint:disable-next-line: class-name
        export class templates {
            static readonly _namespace: string = "cs.cds.configuration.templates";
            static readonly placeholders: string = `${templates._namespace}.placeholders`;
            static readonly placeholderRegExp: string = `${templates._namespace}.placeholderRegExp`;
            static readonly templatesDirectory: string = `${templates._namespace}.templatesDirectory`;
            static readonly treeViewGroupPreference: string = `${templates._namespace}.treeViewGroupPreference`;
            static readonly usePlaceholders: string = `${templates._namespace}.usePlaceholders`;
        }

        // tslint:disable-next-line: class-name
        export class tools {
            static readonly _namespace: string = "cs.cds.configuration.tools";
            static readonly sdkInstallPath: string = `${tools._namespace}.sdkInstallPath`;
            static readonly updateSource: string = `${tools._namespace}.updateSource`;
            static readonly updateChannel: string = `${tools._namespace}.updateChannel`;
        }

        // tslint:disable-next-line: class-name
        export class workspaceState {
            static readonly _namespace: string = "cs.cds.configuration.workspaceState";
            static readonly solutionMap: string = `${workspaceState._namespace}.solutionMap`;
        }
    }

    export namespace controls {
        // tslint:disable-next-line: class-name
        export class cdsExplorer {
            static readonly _namespace: string = "cs.cds.controls.cdsExplorer";
            static readonly addConnection: string = `${cdsExplorer._namespace}.addConnection`;
            static readonly addEntry: string = `${cdsExplorer._namespace}.addEntry`;
            static readonly addEntryToSolution: string = `${cdsExplorer._namespace}.addEntryToSolution`;
            static readonly clickEntry: string = `${cdsExplorer._namespace}.clickEntry`;
            static readonly deleteEntry: string = `${cdsExplorer._namespace}.deleteEntry`;
            static readonly editConnection: string = `${cdsExplorer._namespace}.editConnection`;
            static readonly editEntry: string = `${cdsExplorer._namespace}.editEntry`;
            static readonly exportSolution: string = `${cdsExplorer._namespace}.exportSolution`;
            static readonly inspectEntry: string = `${cdsExplorer._namespace}.inspectEntry`;
            static readonly moveSolution: string = `${cdsExplorer._namespace}.moveSolution`;
            static readonly openInApp: string = `${cdsExplorer._namespace}.openInApp`;
            static readonly openInBrowser: string = `${cdsExplorer._namespace}.openInBrowser`;
            static readonly openInEditor: string = `${cdsExplorer._namespace}.openInEditor`;
            static readonly refreshEntry: string = `${cdsExplorer._namespace}.refreshEntry`;
            static readonly removeEntryFromSolution: string = `${cdsExplorer._namespace}.removeEntryFromSolution`;
            static readonly unpackSolution: string = `${cdsExplorer._namespace}.unpackSolution`;
        }

        // tslint:disable-next-line: class-name
        export class explorer {
            static readonly _namespace: string = "cs.cds.controls.explorer";
            static readonly createFromItemTemplate: string = `${explorer._namespace}.createFromItemTemplate`;
            static readonly createFromProjectTemplate: string = `${explorer._namespace}.createFromProjectTemplate`;
            static readonly craeteWebResource: string = `${explorer._namespace}.createWebResource`;
            static readonly dotNetBuild: string = `${explorer._namespace}.dotNetBuild`;
            static readonly dotNetTest: string = `${explorer._namespace}.dotNetTest`;
            static readonly generateEntityCodeToFolder: string = `${explorer._namespace}.generateEntityCodeToFolder`;
            static readonly generateEntityCodeToFile: string = `${explorer._namespace}.generateEntityCodeToFile`;
            static readonly importSolution: string = `${explorer._namespace}.importSolution`;
            static readonly packSolutionFromFolder: string = `${explorer._namespace}.packSolutionFromFolder`;
            static readonly packWebResource: string = `${explorer._namespace}.packWebResource`;
            static readonly saveTemplateFile: string = `${explorer._namespace}.saveTemplateFile`;
            static readonly saveTemplateFolder: string = `${explorer._namespace}.saveTemplateFolder`;
            static readonly registerPluginFile: string = `${explorer._namespace}.registerPluginFile`;
            static readonly unpackSolutionToFolder: string = `${explorer._namespace}.unpackSolutionToFolder`;
        }

        // tslint:disable-next-line: class-name
        export class jsonInspector {
            static readonly _namespace: string = "cs.cds.controls.jsonInspector";
            static readonly open: string = `${jsonInspector._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class newWorkspace {
            static readonly _namespace: string = "cs.cds.controls.newWorkspace";
            static readonly open: string = `${newWorkspace._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class pluginStep {
            static readonly _namespace: string = "cs.cds.controls.pluginStep";
            static readonly open: string = `${pluginStep._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class pluginStepImage {
            static readonly _namespace: string = "cs.cds.controls.pluginStepImage";
            static readonly open: string = `${pluginStepImage._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class quickPicker {
            static readonly _namespace: string = "cs.cds.controls.quickPicker";
            static readonly cancel: string = `search.action.focusActiveEditor`;
            static readonly quit: string = `workbench.action.quit`;
        }

        // tslint:disable-next-line: class-name
        export class svcUtilConfig {
            static readonly _namespace: string = "cs.cds.controls.svcUtilConfig";
            static readonly open: string = `${svcUtilConfig._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class templateExplorer {
            static readonly _namespace: string = "cs.cds.controls.templateExplorer";
            static readonly addEntry: string = `${templateExplorer._namespace}.addEntry`;
            static readonly clickEntry: string = `${templateExplorer._namespace}.clickEntry`;
            static readonly createInWorkspace: string = `${templateExplorer._namespace}.createInWorkspace`;
            static readonly deleteEntry: string = `${templateExplorer._namespace}.deleteEntry`;
            static readonly editEntry: string = `${templateExplorer._namespace}.editEntry`;
            static readonly exportEntry: string = `${templateExplorer._namespace}.exportEntry`;
            static readonly importEntry: string = `${templateExplorer._namespace}.importEntry`;
            static readonly openEntry: string = `${templateExplorer._namespace}.openEntry`;
            static readonly refreshEntry: string = `${templateExplorer._namespace}.refreshEntry`;
        }
    }

    export namespace theme {

         // tslint:disable-next-line: class-name
         export class colors {
            static readonly _namespace: string = "cs.cds.theme.colors";
            static readonly icons: string = `${colors._namespace}.icons`;
         }
    }
}