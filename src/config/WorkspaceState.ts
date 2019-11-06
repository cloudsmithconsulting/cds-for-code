import * as cs from '../cs';
import { ExtensionContext } from 'vscode';
import SolutionMap from '../config/SolutionMap';

export default class WorkspaceState
{
    private _context: ExtensionContext;

    constructor (context: ExtensionContext)
    {
        this._context = context;
    }

    get SolutionMap(): SolutionMap {
        if (this._context) {
            const value = this._context.workspaceState.get<SolutionMap>(cs.dynamics.configuration.workspaceState.solutionMap);

            if (value && value instanceof SolutionMap) { return <SolutionMap>value; }
        }

        return new SolutionMap();
    }
    set SolutionMap(value: SolutionMap) {
        this._context.workspaceState.update(cs.dynamics.configuration.workspaceState.solutionMap, value);
    }

    public static Instance(context: ExtensionContext): WorkspaceState
    {
        return new WorkspaceState(context);
    }
}
