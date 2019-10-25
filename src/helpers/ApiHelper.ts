import { DynamicsWebApiClient } from "../api/DynamicsWebApi";
import { DynamicsWebApi } from '../api/Types';
import { TS } from 'typescript-linq/TS';

export default class ApiHelper
{
    public static filterSolutionComponents(api: DynamicsWebApiClient, response:any, solutionId?:string, componentType?:DynamicsWebApi.SolutionComponent, keySelector?:(item:unknown) => any): Promise<TS.Linq.Enumerator<any>>
    {
        if (solutionId && componentType && keySelector) {
            let solutionQuery:DynamicsWebApi.RetrieveRequest = {
                collection: "solutions",
                id: solutionId,
                select: [ "solutionid", "uniquename" ],
                expand: [ { property: "solution_solutioncomponent", filter: `componenttype eq ${DynamicsWebApi.CodeMappings.getSolutionComponentCode(componentType)}` } ]
            };    
            
            return api.retrieveRequest(solutionQuery).then(solution => {
                if (!solution || !solution.solution_solutioncomponent || solution.solution_solutioncomponent.length === 0)
                {
                    return null;
                }
    
                let components = new TS.Linq.Enumerator(solution.solution_solutioncomponent);
                let filteredList = components
                    .join(new TS.Linq.Enumerator(response.value), c => c["objectid"], keySelector, (c, o) => o);
    
                return filteredList;
            });           
        } else {
            return Promise.resolve(new TS.Linq.Enumerator(response.value));
        }          
    }    
}