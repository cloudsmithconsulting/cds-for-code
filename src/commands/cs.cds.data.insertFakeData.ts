import * as cs from '../cs';
import * as vscode from 'vscode';
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import DataGenerationManager from '../components/DataGeneration/DataGenerationManager';
import logger from '../core/framework/Logger';
import { CdsEntityFaker } from './cs.cds.data.getFaker';
import Quickly from '../core/Quickly';
import ExtensionContext from '../core/ExtensionContext';
import { CdsSolutions } from '../api/CdsSolutions';
import async = require('async');

export default async function run(this: DataGenerationManager, config?: CdsWebApi.Config, entity?: any, selectedAttributes?: string[], count: number = 25): Promise<string[]> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.data.insertFakeData} Organization not chosen, command cancelled`);
		return; 
	}

    if (!entity) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, undefined, CdsSolutions.SolutionComponent.Entity, "Choose an entity to fake");

		if (!pickResponse) { 
			logger.warn(`Command: ${cs.cds.data.insertFakeData} Entity not chosen, command cancelled`);
			return; 
		}

		entity = pickResponse.component;
	}

    if (!selectedAttributes) {
		const picked = await Quickly.pickCdsEntityComponents(config, 
			entity, 
			CdsSolutions.SolutionComponent.Attribute, 
			(a) => a.IsValidForCreate && (a.IsSearchable || a.IsValidForForm || a.IsValidForGrid || a.IsPrimaryId || a.IsPrimaryName), 
			"Choose attributes to fake");

		if (picked) {
			selectedAttributes = picked.map(i => i.component.LogicalName);
		}
	}

    const faker: CdsEntityFaker = await vscode.commands.executeCommand(cs.cds.data.getFaker, config, entity, selectedAttributes);

    logger.log(`Command: ${cs.cds.data.insertFakeData} Generating ${count} ${entity.EntitySetName}`);

    const entities = faker.generate(count);
	const api = new CdsWebApi.WebApiClient(config);
	const returnList = [];
	const errs = [];

	return async.each(entities, async (e, callback) => {
		try {
			const result = await api.create(e, faker.entity.EntitySetName);
			returnList.push(result);
			logger.log(`Command: ${cs.cds.data.insertFakeData} Generated ${returnList.length}/${count}`);	
		} catch (err) {
			err['fake'] = JSON.stringify(e);
			errs.push(err);
		}
		callback();
	})
	.then(() => {
		if (errs.length > 0) {
			logger.error(`Command: ${cs.cds.data.insertFakeData} encountered an error generating data for ${entity.EntitySetName}`);
			for (let i = 0; i < errs.length; i++) {
				const err = errs[i];
				logger.log(`Command: ${cs.cds.data.insertFakeData} error generating ${entity.EntitySetName}[${err['fake']}]`);
				logger.error(`Command: ${cs.cds.data.insertFakeData} error was ${err.message}`);
			}	
		}
		return returnList;
	});
}