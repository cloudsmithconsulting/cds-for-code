import * as vscode from 'vscode';
import DataGenerationManager from "../components/DataGeneration/DataGenerationManager";
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/framework/Logger";
import Quickly, { QuickPickOption } from "../core/Quickly";
import * as cs from "../cs";
import { CdsSolutions } from "../api/CdsSolutions";
import MetadataRepository from "../repositories/metadataRepository";
import DataApiRepository from "../repositories/DataApiRepository";
import TemplateManager from '../components/Templates/TemplateManager';
import { Utilities } from '../core/Utilities';


export default async function run(this: DataGenerationManager, config?: CdsWebApi.Config, entity?: any, savedqueryid?: string): Promise<void> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} Organization not chosen, command cancelled`);
		return; 
    }
    
    if (!entity) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, undefined, CdsSolutions.SolutionComponent.Entity, "Choose an entity to export data from");

		if (!pickResponse) { 
			logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} Entity not chosen, command cancelled`);
			return; 
		}

		entity = pickResponse.component;
    }

    let useView;
    if (savedqueryid === undefined) {
        useView = await Quickly.pickBoolean("Do you want to use an entity view?", "Yes", "No");

        if (useView === undefined) {
            logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} Use view not chosen, command cancelled`);
            return;
        }
    } else {
        useView = true;
    }

    let selectedAttributes;
    let attributeDisplayNames;
    let data;
    if (!useView) {
        const pickResponse = await Quickly.pickCdsEntityComponents(config, 
            entity, 
            CdsSolutions.SolutionComponent.Attribute, 
            (a) => a.IsValidForCreate && (a.IsSearchable || a.IsValidForForm || a.IsValidForGrid || a.IsPrimaryId || a.IsPrimaryName), 
            "Choose entity attributes to export");

        if (!pickResponse || pickResponse.length === 0) {
            logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} Attributes not chosen, command cancelled`);
            return; 
        }

        selectedAttributes = pickResponse.map(i => i.component);
        attributeDisplayNames = selectedAttributes.map(i => i.DisplayName.UserLocalizedLabel.Label);
        const attributeLogicalNames = selectedAttributes.map(i => i.LogicalName);

        const dataApi = new DataApiRepository(config);
        data = await dataApi.retrieveEntitySetData(entity.EntitySetName, attributeLogicalNames);

        // sanitize data
        data.forEach(item => {
            // clean the data of @odata items
            Object.keys(item).forEach(key => {
                if (key.indexOf("@odata") !== -1) {
                    delete item[key];
                }
            });
        });
    } else {
        const metadataApi = new MetadataRepository(config);
        
        if (savedqueryid === undefined) {
            const viewOptions = await metadataApi.retrieveViews(entity.LogicalName, undefined, MetadataRepository.defaultSelections["savedqueries"])
                .then(data => data.map(i => new QuickPickOption(i.name, undefined, undefined, i)));
            
            const chosenView = await Quickly.pick("Choose a view to export data from", ...viewOptions)
                .then(o => o ? o.context : undefined);
            
            if (!chosenView) {
                logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} View not chosen, command cancelled`);
                return; 
            }

            savedqueryid = chosenView.savedqueryid;
        }

        const dataApi = new DataApiRepository(config);
        data = await dataApi.retrieveDataFromSavedQuery(entity.EntitySetName, savedqueryid);

        // sanitize data
        data.forEach(item => {
            Object.keys(item).forEach(key => {
                // clean @odata items or objects
                if (key.indexOf("@odata") !== -1 || Utilities.$Object.isObject(item[key])) {
                    delete item[key];
                }

                // rename keys with _x002e_ <- this is char code for .
                if (key.indexOf("_x002e_") !== -1) {
                    const val = item[key];
                    delete item[key];
                    item[key.replace("_x002e_", ".")] = val;
                }
            });
        });

        // normalize it
        let allItemKeys;
        if (data.length > 0) {
            const cloned = data.slice(0);
            cloned.sort((a, b) => { return Object.keys(b).length - Object.keys(a).length; });
            allItemKeys = Object.keys(cloned[0]);
            
            data.forEach(item => {
                allItemKeys.forEach(key => {
                    if (!item.hasOwnProperty(key)) {
                        item[key] = null;
                    }
                });
            });
        }

        selectedAttributes = await metadataApi.retrieveAttributes(entity.MetadataId);
        const attributesMap = selectedAttributes.map(i => { return { key: i.LogicalName, label: i.DisplayName?.UserLocalizedLabel?.Label }; });
        
        attributeDisplayNames = [];
        if (allItemKeys) {
            allItemKeys.forEach(key => {
                const attribute = attributesMap.find(i => i.key === key);
                
                if (attribute) {
                    attributeDisplayNames.push(attribute.label);
                } else {
                    attributeDisplayNames.push(key);
                }
            });
        }
    }
    
    const format = await Quickly.pick("Choose a file format", ...["CSV", "JSON"]).then(o => o ? o.label : undefined);
    if (!format) {
        logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} Format not chosen, command cancelled`);
        return; 
    }

    const savePathUri = await Quickly.pickWorkspaceFile(undefined, "Choose a location to save the file", undefined, true, [ `.${format.toLowerCase()}` ]).then(r => vscode.Uri.file(r));
    if (!savePathUri) {
        logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} Save location not chosen, command cancelled`);
        return; 
    }

    switch (format) {
        case "JSON": {
            await TemplateManager.getSystemTemplate("entity.data.export.json")
                .then(async template => await template.apply(savePathUri.fsPath, { data }));
        } 
            break;
        case "CSV": {
            await TemplateManager.getSystemTemplate("entity.data.export.csv")
                .then(async template => await template.apply(savePathUri.fsPath, { headers: attributeDisplayNames, data }));
        } 
            break;
        default: {
            logger.warn(`Command: ${cs.cds.data.exportDataFromEntity} Format not supported, command cancelled`);
        } 
            break;
    }

    logger.log(`Command: ${cs.cds.data.exportDataFromEntity} Exported data to file: ${savePathUri.fsPath}`);
}