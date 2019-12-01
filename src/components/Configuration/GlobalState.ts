import * as cs from '../../cs';
import { DynamicsWebApi } from '../../api/CdsSolutions';
import ExtensionContext from '../../core/ExtensionContext';

export default class GlobalState {
    private constructor() { }

    get DynamicsConnections(): DynamicsWebApi.Config[] {
        const connections = ExtensionContext.Instance.globalState.get<DynamicsWebApi.Config[]>(cs.dynamics.configuration.globalState.dynamicsConnections);

        //TODO: transform credentials here from secure storage

        return connections;
    }
    set DynamicsConnections(value: DynamicsWebApi.Config[]) {
        value.forEach(c => {
            //TODO: transform credentials here into secure storage
        });

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
