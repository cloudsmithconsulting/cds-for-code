import { DynamicsWebApi } from '../api/cds-webapi/DynamicsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import { TS } from 'typescript-linq/TS';

export default class ApiHelper {
    static isOuterJoin(componentType:CdsSolutions.SolutionComponent | CdsSolutions.SolutionComponent[]) {
        const innerFunction = (type:CdsSolutions.SolutionComponent) => {
            switch (type) {
                case CdsSolutions.SolutionComponent.Form:
                case CdsSolutions.SolutionComponent.SystemForm:
                case CdsSolutions.SolutionComponent.SavedQuery:
                case CdsSolutions.SolutionComponent.SavedQueryVisualization:
                    return true;
            }
    
            return false;
        };

        if (!(componentType instanceof Array)) {
            return innerFunction(<CdsSolutions.SolutionComponent>componentType);
        } else {
            (<CdsSolutions.SolutionComponent[]>componentType).forEach(c => {
                if (innerFunction(c)) {
                    return true;
                }
            });

            return false;
        }
    }

    static async getSolutionComponents(api: DynamicsWebApi.WebApiClient, solutionId?:string, componentType?:CdsSolutions.SolutionComponent | CdsSolutions.SolutionComponent[]): Promise<any[]> {
        return this.getSolutionComponentsRaw(api, solutionId, componentType)
            .then(solution => {
                 if (solution && solution.solution_solutioncomponent && solution.solution_solutioncomponent.length > 0) {
                     return solution.solution_solutioncomponent;
                 }

                 return [];
            });
    }

    static async filterSolutionComponents(api: DynamicsWebApi.WebApiClient, response:any, solutionId?:string, componentType?:CdsSolutions.SolutionComponent | CdsSolutions.SolutionComponent[], keySelector?:(item:unknown) => any): Promise<TS.Linq.Enumerator<any>> {
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

    private static async getSolutionComponentsRaw(api: DynamicsWebApi.WebApiClient, solutionId?:string, componentType?:CdsSolutions.SolutionComponent | CdsSolutions.SolutionComponent[]): Promise<any> {
        const getSolutionComponentFilter = () => {
            if (!(componentType instanceof Array)) {
                return `componenttype eq ${CdsSolutions.CodeMappings.getSolutionComponentCode(<CdsSolutions.SolutionComponent>componentType)}`;
            } else {
                const filterString = new TS.Linq.Enumerator(<CdsSolutions.SolutionComponent[]>componentType)
                    .select(c => `'${CdsSolutions.CodeMappings.getSolutionComponentCode(c)}'`)
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