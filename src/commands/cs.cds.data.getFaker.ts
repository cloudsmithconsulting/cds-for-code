import * as faker from 'faker';
import * as cs from "../cs";
import * as vscode from 'vscode';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import logger from "../core/framework/Logger";
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from '../core/ExtensionContext';
import { CdsSolutions } from '../api/CdsSolutions';
import MetadataRepository from '../repositories/metadataRepository';
import DataApiRepository from '../repositories/DataApiRepository';

export type GeneratorDefinition<T> = { name: string, generate: () => T };

let customers = [];

const generators = {
	0: async (attribute: any): Promise<GeneratorDefinition<boolean>> => { 
		return { name: attribute.LogicalName, generate: () => faker.random.boolean() }; 
	},
	1: async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<string>> => {
		if (customers?.length === 0) {
			const api = new DataApiRepository(config);
			customers = await api.getSampleCustomers();
		}

		const customer = customers[Math.round(Math.random() * customers.length)];

		 return { name: attribute.LogicalName, generate: () => customer }; 
	},
};

export default async function run(config?: CdsWebApi.Config, entity?: any) : Promise<any> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.data.getFaker} Organization not chosen, command cancelled`);
		return; 
	}

    if (!entity) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, undefined, CdsSolutions.SolutionComponent.Entity, "Choose an entity to fake");

		if (!pickResponse) { 
			logger.warn(`Command: ${cs.cds.data.getFaker} Entity not chosen, command cancelled`);
			return; 
		}

		entity = pickResponse.component;
	}

	const api = new MetadataRepository(config);
	const attributes = await api.retrieveAttributes(entity.MetadataId, [ 'AttributeType', 'AttributeTypeName', 'Description', 'DisplayName', 'IsCustomAttribute', 'IsPrimaryName', 'IsValidForCreate', 'LogicalName', 'SchemaName' ]);
	const returnFake: any = {
		attributes,
		generators: {},
		entity,
		generate: (count: number) => {
			if (count && count > 0) {
				const returnArray = [];

				for (let i = 0; i < count; i++) {
					const returnObject: any = {};

					Object.keys(this.generators).forEach(k => {
						if (typeof(this.generators[k]) === 'function') {
							const attribute = this.attributes.find(a => a.LogicalName === k);
							const defined = this.generators[k](attribute);

							returnObject[defined.name] = defined.generate();
						}
					});

					returnArray.push(returnObject);
				}

				return returnArray;
			}
		}
	};

	attributes.forEach(async a => {
		switch (<number>(a.AttributeType)) {
			case 1:
				returnFake.generators[a.LogicalName] = await generators[(<number>a.AttributeType)](a, config);

				break;
			default:
				returnFake.generators[a.LogicalName] = await generators[(<number>a.AttributeType)](a);

				break;
		}
	});

	return returnFake;
}