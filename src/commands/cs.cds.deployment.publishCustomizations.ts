import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import { CdsSolutions } from '../api/CdsSolutions';
import ApiRepository from '../repositories/apiRepository';
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from '../core/ExtensionContext';
import logger from '../core/Logger';

/**
 * This command can be invoked by the Command Palette or the Dynamics TreeView and adds a solution component to a solution.
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(config?: CdsWebApi.Config, components?: {type: CdsSolutions.SolutionComponent, id: string}[]) {
    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
    if (!config) { 
        logger.warn("Organization not chosen, command cancelled");
        return; 
    }

    const api = new ApiRepository(config);

    if (!components) {
        await api.publishAllXml();
        await Quickly.inform('All customizations published successfully');
    } else {
        let parameterXml:string = "<importexportxml><webresources>";
        
        components.forEach(c => {
            if (c.type === CdsSolutions.SolutionComponent.WebResource) {
                parameterXml += `<webresource>{${Utilities.Guid.trimGuid(c.id)}}</webresource>`;
            }
        });
        
        parameterXml += "</webresources></importexportxml>";

        await api.publishXml(parameterXml);
        await Quickly.inform("Components were published successfully");
    }
}