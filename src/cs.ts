export namespace dynamics
{
    // tslint:disable-next-line: class-name
    export class configuration
    {
        public static readonly _namespace:string = "cs.dynamics.configuration";
        public static readonly sdkInstallPath:string = `${configuration._namespace}.sdkInstallPath`;
    }

    // tslint:disable-next-line: class-name
    export class extension
    {
        public static readonly _namespace:string = "cs.dynamics.extension";
        public static readonly downloadRequiredScripts:string = `${extension._namespace}.downloadRequiredScripts`;
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
    }

    export namespace controls
    {
        // tslint:disable-next-line: class-name
        export class treeView
        {
            public static readonly _namespace:string = "cs.dynamics.controls.treeView";
            public static readonly addConnection:string = `${treeView._namespace}.addConnection`;
            public static readonly addEntry:string = `${treeView._namespace}.addEntry`;
            public static readonly clickEntry:string = `${treeView._namespace}.clickEntry`;
            public static readonly deleteEntry:string = `${treeView._namespace}.deleteEntry`;
            public static readonly editEntry:string = `${treeView._namespace}.editEntry`;
            public static readonly openConnection:string = `${treeView._namespace}.openConnection`;
            public static readonly refreshEntry:string = `${treeView._namespace}.refreshEntry`;

        }
    }
}