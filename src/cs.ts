import * as vscode from "vscode";

export namespace dynamics {
    // tslint:disable-next-line: class-name
    export class deployment {
        public static readonly _namespace:string = "cs.dynamics.deployment";
        public static readonly addSolutionComponent:string = `${deployment._namespace}.addSolutionComponent`;
        public static readonly createWebResource:string = `${deployment._namespace}.createWebResource`;
        public static readonly compareWebResource:string = `${deployment._namespace}.compareWebResource`;
        public static readonly dotNetBuild:string = `${deployment._namespace}.dotNetBuild`;
        public static readonly dotNetTest:string = `${deployment._namespace}.dotNetTest`;
        public static readonly packWebResource:string = `${deployment._namespace}.packWebResource`;
        public static readonly registerPluginAssembly:string = `${deployment._namespace}.registerPluginAssembly`;
        public static readonly removeSolutionComponent:string = `${deployment._namespace}.removeSolutionComponent`;
        public static readonly removeSolutionMapping:string = `${deployment._namespace}.removeSolutionMapping`;
        public static readonly unpackWebResource:string = `${deployment._namespace}.unpackWebResource`;
        public static readonly updateSolutionMapping:string = `${deployment._namespace}.updateSolutionMapping`;
    }

    // tslint:disable-next-line: class-name
    export class errors {
        public static readonly _namespace:string = "cs.dynamics.errors";
        public static readonly userCancelledAction:string = `${errors._namespace}.userCancelledAction`;
        public static readonly webApiResponseError:string = `${errors._namespace}.webApiResponseError`;
    } 

    // tslint:disable-next-line: class-name
    export class extension {
        public static readonly _namespace:string = "cs.dynamics.extension";
        public static readonly clearTerminal:string = `${extension._namespace}.clearTerminal`;
        public static readonly createTerminal:string = `${extension._namespace}.createTerminal`;
        public static readonly downloadRequiredIcons:string = `${extension._namespace}.downloadRequiredIcons`;
        public static readonly downloadRequiredScripts:string = `${extension._namespace}.downloadRequiredScripts`;
        public static readonly outputChannelName:string = `${extension._namespace}.outputChannelName`;
        private static _output:vscode.OutputChannel;
        static get output():vscode.OutputChannel {
            if (!this._output) {
                this._output = vscode.window.createOutputChannel(extension.outputChannelName);
            }

            this._output.show(false);
            return this._output;
        }
    }

    // tslint:disable-next-line: class-name
    export class powerShell {
        public static readonly _namespace:string = "cs.dynamics.powerShell";
        public static readonly generateEntities:string = `${powerShell._namespace}.generateEntities`;
        public static readonly packSolution:string = `${powerShell._namespace}.packSolution`;
        public static readonly unpackSolution:string = `${powerShell._namespace}.unpackSolution`;
    }

    // tslint:disable-next-line: class-name
    export class templates {
        public static readonly _namespace:string = "cs.dynamics.templates";
        public static readonly createFromTemplate:string = `${templates._namespace}.createFromTemplate`;
        public static readonly deleteTemplate:string = `${templates._namespace}.deleteTemplate`;
        public static readonly editTemplateCatalog:string = `${templates._namespace}.editTemplateCatalog`;
        public static readonly openTemplateFolder:string = `${templates._namespace}.openTemplateFolder`;
        public static readonly saveTemplate:string = `${templates._namespace}.saveTemplate`;
    }

    // tslint:disable-next-line: class-name
    export class viewContainers {
        public static readonly _namespace:string = "cs.dynamics.viewContainers";
        public static readonly dynamicsExplorer:string = `${viewContainers._namespace}.dynamicsExplorer`;
        public static readonly templateExplorer:string = `${viewContainers._namespace}.templateExplorer`;
    }

    // tslint:disable-next-line: class-name
    export class views {
        public static readonly _namespace:string = "cs.dynamics.views";
        public static readonly connectionView:string = `${viewContainers._namespace}.connectionView`;
        public static readonly jsonInspectorView:string = `${viewContainers._namespace}.jsonInspectorView`;
        public static readonly newWorkspaceView:string = `${viewContainers._namespace}.newWorkspaceView`;
        public static readonly pluginStepView:string = `${viewContainers._namespace}.pluginStepView`;
        public static readonly pluginStepImageView:string = `${viewContainers._namespace}.pluginStepImageView`;
        public static readonly svcUtilConfigView:string = `${viewContainers._namespace}.svcUtilConfigView`;
    }

    export namespace configuration {
        // tslint:disable-next-line: class-name
        export class explorer {
            public static readonly _namespace:string = "cs.dynamics.configuration.explorer";
            public static readonly showDefaultSolution:string = `${explorer._namespace}.showDefaultSolution`;
            public static readonly showWelcomeExperience:string = `${explorer._namespace}.showWelcomeExperience`;
        }

        // tslint:disable-next-line: class-name
        export class globalState {
            public static readonly _namespace:string = "cs.dynamics.configuration.globalState";
            public static readonly dynamicsConnections:string = `${globalState._namespace}:dynamicsConnections`;
            public static readonly powerShellScriptVersion:string = `${globalState._namespace}:powerShellScriptVersion`;
        }

        // tslint:disable-next-line: class-name
        export class iconThemes {
            public static readonly _namespace:string = "cs.dynamics.configuration.iconThemes";
            public static readonly default:string = `${iconThemes._namespace}.default`;
            public static readonly selectedTheme:string = `${iconThemes._namespace}.selectedTheme`;
        }

        // tslint:disable-next-line: class-name
        export class templates {
            public static readonly _namespace:string = "cs.dynamics.configuration.templates";
            public static readonly placeholders:string = `${templates._namespace}.placeholders`;
            public static readonly placeholderRegExp:string = `${templates._namespace}.placeholderRegExp`;
            public static readonly templatesDirectory:string = `${templates._namespace}.templatesDirectory`;
            public static readonly treeViewGroupPreference:string = `${templates._namespace}.treeViewGroupPreference`;
            public static readonly usePlaceholders:string = `${templates._namespace}.usePlaceholders`;
        }

        // tslint:disable-next-line: class-name
        export class tools {
            public static readonly _namespace:string = "cs.dynamics.configuration.tools";
            public static readonly sdkInstallPath:string = `${tools._namespace}.sdkInstallPath`;
            public static readonly updateSource:string = `${tools._namespace}.updateSource`;
            public static readonly updateChannel:string = `${tools._namespace}.updateChannel`;
        }

        // tslint:disable-next-line: class-name
        export class workspaceState {
            public static readonly _namespace:string = "cs.dynamics.configuration.workspaceState";
            public static readonly solutionMap:string = `${workspaceState._namespace}:solutionMap`;
        }
    }

    export namespace controls {
        // tslint:disable-next-line: class-name
        export class explorer {
            public static readonly _namespace:string = "cs.dynamics.controls.explorer";
            public static readonly createFromItemTemplate:string = `${explorer._namespace}.createFromItemTemplate`;
            public static readonly createFromProjectTemplate:string = `${explorer._namespace}.createFromProjectTemplate`;
            public static readonly craeteWebResource:string = `${explorer._namespace}.createWebResource`;
            public static readonly dotNetBuild:string = `${explorer._namespace}.dotNetBuild`;
            public static readonly dotNetTest:string = `${explorer._namespace}.dotNetTest`;
            public static readonly generateEntityCodeToFolder:string = `${explorer._namespace}.generateEntityCodeToFolder`;
            public static readonly generateEntityCodeToFile:string = `${explorer._namespace}.generateEntityCodeToFile`;
            public static readonly packSolutionFromFolder:string = `${explorer._namespace}.packSolutionFromFolder`;
            public static readonly saveTemplateFile:string = `${explorer._namespace}.saveTemplateFile`;
            public static readonly saveTemplateFolder:string = `${explorer._namespace}.saveTemplateFolder`;
            public static readonly registerPluginFile:string = `${explorer._namespace}.registerPluginFile`;
            public static readonly unpackSolutionToFolder:string = `${explorer._namespace}.unpackSolutionToFolder`;
        }

        // tslint:disable-next-line: class-name
        export class jsonInspector {
            public static readonly _namespace:string = "cs.dynamics.controls.jsonInspector";
            public static readonly inspect:string = `${jsonInspector._namespace}.inspect`;
        }

        // tslint:disable-next-line: class-name
        export class newWorkspace {
            public static readonly _namespace:string = "cs.dynamics.controls.newWorkspace";
            public static readonly hideLoadingMessage:string = `${newWorkspace._namespace}.hideLoadingMessage`;
            public static readonly open:string = `${newWorkspace._namespace}.open`;
            public static readonly showLoadingMessage:string = `${newWorkspace._namespace}.showLoadingMessage`;
        }

        // tslint:disable-next-line: class-name
        export class pluginStep {
            public static readonly _namespace:string = "cs.dynamics.controls.pluginStep";
            public static readonly open:string = `${pluginStep._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class pluginStepImage {
            public static readonly _namespace:string = "cs.dynamics.controls.pluginStepImage";
            public static readonly open:string = `${pluginStepImage._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class quickPicker {
            public static readonly _namespace:string = "cs.dynamics.controls.quickPicker";
            public static readonly cancel:string = `search.action.focusActiveEditor`;
            public static readonly quit:string = `workbench.action.quit`;
        }

        // tslint:disable-next-line: class-name
        export class svcUtilConfig {
            public static readonly _namespace:string = "cs.dynamics.controls.svcUtilConfig";
            public static readonly configure:string = `${svcUtilConfig._namespace}.configure`;
        }

        // tslint:disable-next-line: class-name
        export class dynamicsTreeView {
            public static readonly _namespace:string = "cs.dynamics.controls.dynamicsTreeView";
            public static readonly addConnection:string = `${dynamicsTreeView._namespace}.addConnection`;
            public static readonly addEntry:string = `${dynamicsTreeView._namespace}.addEntry`;
            public static readonly addEntryToSolution:string = `${dynamicsTreeView._namespace}.addEntryToSolution`;
            public static readonly clickEntry:string = `${dynamicsTreeView._namespace}.clickEntry`;
            public static readonly deleteEntry:string = `${dynamicsTreeView._namespace}.deleteEntry`;
            public static readonly editConnection:string = `${dynamicsTreeView._namespace}.editConnection`;
            public static readonly editEntry:string = `${dynamicsTreeView._namespace}.editEntry`;
            public static readonly inspectEntry:string = `${dynamicsTreeView._namespace}.inspectEntry`;
            public static readonly moveSolution:string = `${dynamicsTreeView._namespace}.moveSolution`;
            public static readonly openInApp:string = `${dynamicsTreeView._namespace}.openInApp`;
            public static readonly openInBrowser:string = `${dynamicsTreeView._namespace}.openInBrowser`;
            public static readonly openInEditor:string = `${dynamicsTreeView._namespace}.openInEditor`;
            public static readonly refreshEntry:string = `${dynamicsTreeView._namespace}.refreshEntry`;
            public static readonly removeEntryFromSolution:string = `${dynamicsTreeView._namespace}.removeEntryFromSolution`;
            public static readonly unpackSolution:string = `${dynamicsTreeView._namespace}.unpackSolution`;
        }

        // tslint:disable-next-line: class-name
        export class templateTreeView {
            public static readonly _namespace:string = "cs.dynamics.controls.templateTreeView";
            public static readonly addEntry:string = `${templateTreeView._namespace}.addEntry`;
            public static readonly clickEntry:string = `${templateTreeView._namespace}.clickEntry`;
            public static readonly createInWorkspace:string = `${templateTreeView._namespace}.createInWorkspace`;
            public static readonly deleteEntry:string = `${templateTreeView._namespace}.deleteEntry`;
            public static readonly editEntry:string = `${templateTreeView._namespace}.editEntry`;
            public static readonly openEntry:string = `${templateTreeView._namespace}.openEntry`;
            public static readonly refreshEntry:string = `${templateTreeView._namespace}.refreshEntry`;
        }
    }
}