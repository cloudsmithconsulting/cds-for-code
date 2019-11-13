import * as vscode from "vscode";

export namespace dynamics
{
    // tslint:disable-next-line: class-name
    export class deployment
    {
        public static readonly _namespace:string = "cs.dynamics.deployment";
        public static readonly addSolutionComponent:string = `${deployment._namespace}.addSolutionComponent`;
        public static readonly dotNetBuild:string = `${deployment._namespace}.dotNetBuild`;
        public static readonly dotNetTest:string = `${deployment._namespace}.dotNetTest`;
        public static readonly registerPluginAssembly:string = `${deployment._namespace}.registerPluginAssembly`;
        public static readonly removeSolutionComponent:string = `${deployment._namespace}.removeSolutionComponent`;
        public static readonly removeSolutionMapping:string = `${deployment._namespace}.removeSolutionMapping`;
        public static readonly updateSolutionMapping:string = `${deployment._namespace}.updateSolutionMapping`;
    }

    // tslint:disable-next-line: class-name
    export class extension
    {
        public static readonly _namespace:string = "cs.dynamics.extension";
        public static readonly downloadRequiredIcons:string = `${extension._namespace}.downloadRequiredIcons`;
        public static readonly downloadRequiredScripts:string = `${extension._namespace}.downloadRequiredScripts`;
        public static readonly openProjectTemplatesFolder:string = `${extension._namespace}.openProjectTemplatesFolder`;
        public static readonly saveProjectAsTemplate:string = `${extension._namespace}.saveProjectAsTemplate`;
        public static readonly deleteProjectTemplate:string = `${extension._namespace}.deleteProjectTemplate`;
        public static readonly createProjectFromTemplate:string = `${extension._namespace}.createProjectFromTemplate`;
        public static readonly clearTerminal:string = `${extension._namespace}.clearTerminal`;
        public static readonly createTerminal:string = `${extension._namespace}.createTerminal`;
        public static readonly outputChannelName:string = `${extension._namespace}.outputChannelName`;
        private static _output:vscode.OutputChannel;
        static get output():vscode.OutputChannel
        {
            if (!this._output) {
                this._output = vscode.window.createOutputChannel(extension.outputChannelName);
                this._output.show(true);
            }

            return this._output;
        }
    }

    // tslint:disable-next-line: class-name
    export class powerShell
    {
        public static readonly _namespace:string = "cs.dynamics.powerShell";
        public static readonly generateEntities:string = `${powerShell._namespace}.generateEntities`;
        public static readonly packSolution:string = `${powerShell._namespace}.packSolution`;
        public static readonly unpackSolution:string = `${powerShell._namespace}.unpackSolution`;
    }
    
    // tslint:disable-next-line: class-name
    export class viewContainers
    {
        public static readonly _namespace:string = "cs.dynamics.viewContainers";
        public static readonly dynamicsExplorer:string = `${viewContainers._namespace}.dynamicsExplorer`;
    }

    // tslint:disable-next-line: class-name
    export class views
    {
        public static readonly _namespace:string = "cs.dynamics.views";
        public static readonly connectionView:string = `${viewContainers._namespace}.connectionView`;
        public static readonly jsonInspectorView:string = `${viewContainers._namespace}.jsonInspectorView`;
        public static readonly newWorkspaceView:string = `${viewContainers._namespace}.newWorkspaceView`;
        public static readonly pluginStepView:string = `${viewContainers._namespace}.pluginStepView`;
        public static readonly svcUtilConfigView:string = `${viewContainers._namespace}.svcUtilConfigView`;
    }

    export namespace configuration
    {
        // tslint:disable-next-line: class-name
        export class explorer
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.explorer";
            public static readonly showDefaultSolution:string = `${explorer._namespace}.showDefaultSolution`;
            public static readonly showWelcomeExperience:string = `${explorer._namespace}.showWelcomeExperience`;
        }

        // tslint:disable-next-line: class-name
        export class globalState
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.globalState";
            public static readonly dynamicsConnections:string = `${globalState._namespace}:dynamicsConnections`;
            public static readonly powerShellScriptVersion:string = `${globalState._namespace}:powerShellScriptVersion`;
        }

        // tslint:disable-next-line: class-name
        export class iconThemes 
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.iconThemes";
            public static readonly default:string = `${iconThemes._namespace}.default`;
            public static readonly selectedTheme:string = `${iconThemes._namespace}.selectedTheme`;
        }

        // tslint:disable-next-line: class-name
        export class templates
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.templates";
            public static readonly templatesDirectory:string = `${templates._namespace}.templatesDirectory`;
            public static readonly usePlaceholders:string = `${templates._namespace}.usePlaceholders`;
            public static readonly placeholderRegExp:string = `${templates._namespace}.placeholderRegExp`;
            public static readonly placeholders:string = `${templates._namespace}.placeholders`;            
        }

        // tslint:disable-next-line: class-name
        export class tools
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.tools";
            public static readonly sdkInstallPath:string = `${tools._namespace}.sdkInstallPath`;
            public static readonly updateSource:string = `${tools._namespace}.updateSource`;
            public static readonly updateChannel:string = `${tools._namespace}.updateChannel`;
        }

        // tslint:disable-next-line: class-name
        export class workspaceState
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.workspaceState";
            public static readonly solutionMap:string = `${workspaceState._namespace}:solutionMap`;
        }
    }

    export namespace controls
    {
        // tslint:disable-next-line: class-name
        export class explorer
        {
            public static readonly _namespace:string = "cs.dynamics.controls.explorer";
            public static readonly dotNetBuild:string = `${explorer._namespace}.dotNetBuild`;
            public static readonly dotNetTest:string = `${explorer._namespace}.dotNetTest`;
            public static readonly generateEntityCodeToFolder:string = `${explorer._namespace}.generateEntityCodeToFolder`;
            public static readonly generateEntityCodeToFile:string = `${explorer._namespace}.generateEntityCodeToFile`;
            public static readonly packSolutionFromFolder:string = `${explorer._namespace}.packSolutionFromFolder`;
            public static readonly registerPluginFile:string = `${explorer._namespace}.registerPluginFile`;
            public static readonly unpackSolutionToFolder:string = `${explorer._namespace}.unpackSolutionToFolder`;
        }

        // tslint:disable-next-line: class-name
        export class jsonInspector
        {
            public static readonly _namespace:string = "cs.dynamics.controls.jsonInspector";
            public static readonly inspect:string = `${jsonInspector._namespace}.inspect`;
        }

        // tslint:disable-next-line: class-name
        export class newWorkspace
        {
            public static readonly _namespace:string = "cs.dynamics.controls.newWorkspace";
            public static readonly open:string = `${jsonInspector._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class pluginStep
        {
            public static readonly _namespace:string = "cs.dynamics.controls.pluginStep";
            public static readonly open:string = `${pluginStep._namespace}.open`;
        }

        // tslint:disable-next-line: class-name
        export class quickPicker
        {
            public static readonly _namespace:string = "cs.dynamics.controls.quickPicker";
            public static readonly cancel:string = `search.action.focusActiveEditor`;
            public static readonly quit:string = `workbench.action.quit`;
        }

        // tslint:disable-next-line: class-name
        export class svcUtilConfig
        {
            public static readonly _namespace:string = "cs.dynamics.controls.svcUtilConfig";
            public static readonly configure:string = `${svcUtilConfig._namespace}.configure`;
        }

        // tslint:disable-next-line: class-name
        export class treeView
        {
            public static readonly _namespace:string = "cs.dynamics.controls.treeView";
            public static readonly addConnection:string = `${treeView._namespace}.addConnection`;
            public static readonly addEntry:string = `${treeView._namespace}.addEntry`;
            public static readonly addEntryToSolution:string = `${treeView._namespace}.addEntryToSolution`;
            public static readonly clickEntry:string = `${treeView._namespace}.clickEntry`;
            public static readonly deleteEntry:string = `${treeView._namespace}.deleteEntry`;
            public static readonly editConnection:string = `${treeView._namespace}.editConnection`;
            public static readonly editEntry:string = `${treeView._namespace}.editEntry`;
            public static readonly inspectEntry:string = `${treeView._namespace}.inspectEntry`;
            public static readonly moveSolution:string = `${treeView._namespace}.moveSolution`;
            public static readonly openInApp:string = `${treeView._namespace}.openInApp`;
            public static readonly openInBrowser:string = `${treeView._namespace}.openInBrowser`;
            public static readonly openInEditor:string = `${treeView._namespace}.openInEditor`;
            public static readonly refreshEntry:string = `${treeView._namespace}.refreshEntry`;
            public static readonly removeEntryFromSolution:string = `${treeView._namespace}.removeEntryFromSolution`;
            public static readonly unpackSolution:string = `${treeView._namespace}.unpackSolution`;
        }
    }
}