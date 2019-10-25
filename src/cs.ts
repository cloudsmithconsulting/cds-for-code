export namespace dynamics
{
    // tslint:disable-next-line: class-name
    export class extension
    {
        public static readonly _namespace:string = "cs.dynamics.extension";
        public static readonly downloadRequiredScripts:string = `${extension._namespace}.downloadRequiredScripts`;
        public static readonly openProjectTemplatesFolder:string = `${extension._namespace}.openProjectTemplatesFolder`;
        public static readonly saveProjectAsTemplate:string = `${extension._namespace}.saveProjectAsTemplate`;
        public static readonly deleteProjectTemplate:string = `${extension._namespace}.deleteProjectTemplate`;
        public static readonly createProjectFromTemplate:string = `${extension._namespace}.createProjectFromTemplate`;
        public static readonly createTerminal:string = `${extension._namespace}.createTerminal`;
        public static readonly clearTerminal:string = `${extension._namespace}.clearTerminal`;
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
        public static readonly connections:string = `${viewContainers._namespace}.connections`;
    }

    // tslint:disable-next-line: class-name
    export class views
    {
        public static readonly _namespace:string = "cs.dynamics.views";
        public static readonly connectionView:string = `${viewContainers._namespace}.connectionView`;
        public static readonly jsonInspectorView:string = `${viewContainers._namespace}.jsonInspectorView`;
    }

    export namespace configuration
    {
        // tslint:disable-next-line: class-name
        export class globalState
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.globalState";
            public static readonly dynamicsConnections:string = `${globalState._namespace}:dynamicsConnections`;
            public static readonly powerShellScriptVersion:string = `${globalState._namespace}.powerShellScriptVersion`;
        }

        // tslint:disable-next-line: class-name
        export class explorer
        {
            public static readonly _namespace:string = "cs.dynamics.configuration.explorer";
            public static readonly showDefaultSolution:string = `${explorer._namespace}.showDefaultSolution`;
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
    }

    export namespace controls
    {
        // tslint:disable-next-line: class-name
        export class jsonInspector
        {
            public static readonly _namespace:string = "cs.dynamics.controls.jsonInspector";
            public static readonly inspect:string = `${jsonInspector._namespace}.inspect`;
        }

        // tslint:disable-next-line: class-name
        export class quickPicker
        {
            public static readonly _namespace:string = "cs.dynamics.controls.quickPicker";
            public static readonly cancel:string = `search.action.focusActiveEditor`;
            public static readonly quit:string = `workbench.action.quit`;
        }

        // tslint:disable-next-line: class-name
        export class treeView
        {
            public static readonly _namespace:string = "cs.dynamics.controls.treeView";
            public static readonly addConnection:string = `${treeView._namespace}.addConnection`;
            public static readonly addEntry:string = `${treeView._namespace}.addEntry`;
            public static readonly clickEntry:string = `${treeView._namespace}.clickEntry`;
            public static readonly deleteEntry:string = `${treeView._namespace}.deleteEntry`;
            public static readonly editEntry:string = `${treeView._namespace}.editEntry`;
            public static readonly inspectEntry:string = `${treeView._namespace}.inspectEntry`;
            public static readonly openConnection:string = `${treeView._namespace}.openConnection`;
            public static readonly refreshEntry:string = `${treeView._namespace}.refreshEntry`;
        }
    }
}