import * as cs from '../../cs';
import { DynamicsWebApi } from '../../api/Types';
import ExtensionContext from '../../core/ExtensionContext';

export default class GlobalState {
    private constructor() { }

    get DynamicsConnections(): DynamicsWebApi.Config[] {
        return ExtensionContext.Instance.globalState.get<DynamicsWebApi.Config[]>(cs.dynamics.configuration.globalState.dynamicsConnections);
    }
    set DynamicsConnections(value: DynamicsWebApi.Config[]) {
        ExtensionContext.Instance.globalState.update(cs.dynamics.configuration.globalState.dynamicsConnections, value);
    }

    get PowerShellScriptVersion(): number {
        return ExtensionContext.Instance.globalState.get<number>(cs.dynamics.configuration.globalState.powerShellScriptVersion);
    }
    set PowerShellScriptVersion(value: number) {
        ExtensionContext.Instance.globalState.update(cs.dynamics.configuration.globalState.powerShellScriptVersion, value);
    }
    
    static get Instance(): GlobalState {
        return new GlobalState();
    }
}
