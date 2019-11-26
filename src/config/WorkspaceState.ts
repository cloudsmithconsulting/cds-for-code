import * as cs from '../cs';
import { ExtensionContext } from 'vscode';
import SolutionMap from '../controls/SolutionMap/SolutionMap';

export default class WorkspaceState
{
    private _context: ExtensionContext;

    constructor (context: ExtensionContext)
    {
        this._context = context;
    }

    get SolutionMap(): SolutionMap {
        return SolutionMap.loadFromWorkspace(this._context);
    }
    set SolutionMap(value: SolutionMap) {
        value.saveToWorkspace(this._context);
    }

    public static Instance(context: ExtensionContext): WorkspaceState
    {
        return new WorkspaceState(context);
    }
}
