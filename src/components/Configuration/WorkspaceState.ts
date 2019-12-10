import SolutionMap from '../Solutions/SolutionMap';
import ExtensionContext from '../../core/ExtensionContext';
import * as cs from "../../cs";

export default class WorkspaceState {
    private constructor() { }

    get SolutionMap(): SolutionMap {
        const value = ExtensionContext.Instance.workspaceState.get<SolutionMap>(cs.dynamics.configuration.workspaceState.solutionMap);

        if (value) {
            return new SolutionMap(value);
        }
    }

    set SolutionMap(value: SolutionMap) {
        ExtensionContext.Instance.workspaceState.update(cs.dynamics.configuration.workspaceState.solutionMap, this);
    }

    static get Instance(): WorkspaceState {
        return new WorkspaceState();
    }
}