import * as vscode from 'vscode';
import * as cs from "../cs";
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import logger from "../core/framework/Logger";
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from '../core/ExtensionContext';
import { CdsSolutions } from '../api/CdsSolutions';
import MetadataRepository from '../repositories/metadataRepository';
import DataApiRepository from '../repositories/DataApiRepository';
import Dictionary from '../core/types/Dictionary';

export default async function run(config: CdsWebApi.Config, entity: any, selectedAttributes: string[]): Promise<boolean> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.data.createDataMap} Organization not chosen, command cancelled`);
		return; 
	}

    if (!entity) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, undefined, CdsSolutions.SolutionComponent.Entity, "Choose an entity to use in the data map");

		if (!pickResponse) { 
			logger.warn(`Command: ${cs.cds.data.createDataMap} Entity not chosen, command cancelled`);
			return; 
		}

		entity = pickResponse.component;
	}

    if (!selectedAttributes) {
		const picked = await Quickly.pickCdsEntityComponents(config, entity, CdsSolutions.SolutionComponent.Attribute, undefined, "Choose attributes to use in the data map");

		if (picked) {
			selectedAttributes = picked.map(i => i.component.LogicalName);
		}
	}

    return true;
}