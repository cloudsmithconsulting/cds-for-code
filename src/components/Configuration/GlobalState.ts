import * as cs from '../../cs';
import { ExtensionContext } from 'vscode';
import { DynamicsWebApi } from '../../api/Types';

export default class GlobalState
{
    private _context: ExtensionContext;

    constructor (context: ExtensionContext)
    {
        this._context = context;
    }

    get DynamicsConnections(): DynamicsWebApi.Config[] {
        if (this._context) {
            const value = this._context.globalState.get<DynamicsWebApi.Config[]>(cs.dynamics.configuration.globalState.dynamicsConnections);

            if (value) { return value; }
        }

        return [];
    }
    set DynamicsConnections(value: DynamicsWebApi.Config[]) {
        this._context.globalState.update(cs.dynamics.configuration.globalState.dynamicsConnections, value);
    }

    get PowerShellScriptVersion(): number {
        if (this._context) {
            const value = this._context.globalState.get<number>(cs.dynamics.configuration.globalState.powerShellScriptVersion);

            if (value) { return value; }
        }

        return -1;
    }
    set PowerShellScriptVersion(value: number) {
        this._context.globalState.update(cs.dynamics.configuration.globalState.powerShellScriptVersion, value);
    }
    
    public static Instance(context: ExtensionContext): GlobalState
    {
        return new GlobalState(context);
    }
}
