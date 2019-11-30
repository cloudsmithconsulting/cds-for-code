import { DynamicsWebApiClient } from "../http/DynamicsWebApi";
import { DynamicsWebApi } from '../http/Types';
import { TS } from 'typescript-linq/TS';

export default class ApiHelper {
    static isOuterJoin(componentType:DynamicsWebApi.SolutionComponent | DynamicsWebApi.SolutionComponent[]) {
        const innerFunction = (type:DynamicsWebApi.SolutionComponent) => {
            switch (type) {
                case DynamicsWebApi.SolutionComponent.Form:
                case DynamicsWebApi.SolutionComponent.SystemForm:
                case DynamicsWebApi.SolutionComponent.SavedQuery:
                case DynamicsWebApi.SolutionComponent.SavedQueryVisualization:
                    return true;
            }
    
            return false;
        };

        if (!(componentType instanceof Array)) {
            return innerFunction(<DynamicsWebApi.SolutionComponent>componentType);
        } else {
            (<DynamicsWebApi.SolutionComponent[]>componentType).forEach(c => {
                if (innerFunction(c)) {
                    return true;
                }
            });

            return false;
        }
    }

    static async getSolutionComponents(api: DynamicsWebApiClient, solutionId?:string, componentType?:DynamicsWebApi.SolutionComponent | DynamicsWebApi.SolutionComponent[]): Promise<any[]> {
        return this.getSolutionComponentsRaw(api, solutionId, componentType)
            .then(solution => {
                 if (solution && solution.solution_solutioncomponent && solution.solution_solutioncomponent.length > 0) {
                     return solution.solution_solutioncomponent;
                 }

                 return [];
            });
    }

    static async filterSolutionComponents(api: DynamicsWebApiClient, response:any, solutionId?:string, componentType?:DynamicsWebApi.SolutionComponent | DynamicsWebApi.SolutionComponent[], keySelector?:(item:unknown) => any): Promise<TS.Linq.Enumerator<any>> {
        if (solutionId && componentType && keySelector) {
            return this.getSolutionComponentsRaw(api, solutionId, componentType).then(solution => {
                if (!solution || !solution.solution_solutioncomponent || solution.solution_solutioncomponent.length === 0) {
                    // For certain components, exclusion from systemcomponent means "select *" (take all subcomponents)
                    if (this.isOuterJoin(componentType)) {
                        return Promise.resolve(new TS.Linq.Enumerator(response.value));
                    } else {
                        return Promise.resolve(TS.Linq.Enumerator.Empty);
                    }
                }
    
                let filteredList = new TS.Linq.Enumerator(response.value)
                    .join(new TS.Linq.Enumerator(solution.solution_solutioncomponent), keySelector, c => c["objectid"], (o, c) => o);
    
                if (filteredList.toArray().length === 0 && this.isOuterJoin(componentType)) {
                    return Promise.resolve(new TS.Linq.Enumerator(response.value));
                } else {
                    return filteredList;
                }
            });           
        } else {
            return Promise.resolve(new TS.Linq.Enumerator(response.value));
        }          
    }    

    private static async getSolutionComponentsRaw(api: DynamicsWebApiClient, solutionId?:string, componentType?:DynamicsWebApi.SolutionComponent | DynamicsWebApi.SolutionComponent[]): Promise<any> {
        const getSolutionComponentFilter = () => {
            if (!(componentType instanceof Array)) {
                return `componenttype eq ${DynamicsWebApi.CodeMappings.getSolutionComponentCode(<DynamicsWebApi.SolutionComponent>componentType)}`;
            } else {
                const filterString = new TS.Linq.Enumerator(<DynamicsWebApi.SolutionComponent[]>componentType)
                    .select(c => `'${DynamicsWebApi.CodeMappings.getSolutionComponentCode(c)}'`)
                    .toArray()
                    .join(",");

                return `Microsoft.Dynamics.CRM.In(PropertyName='componenttype',PropertyValues=[${filterString}])`;
            }
        };

        let solutionQuery:DynamicsWebApi.RetrieveRequest = {
            collection: "solutions",
            id: solutionId,
            select: [ "solutionid", "uniquename" ],
            expand: [ { property: "solution_solutioncomponent", select: [ "objectid", "componenttype" ], filter: getSolutionComponentFilter() } ]
        };    
        
        return api.retrieveRequest(solutionQuery);
    }

}