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

const cache = {
	customers: [],
	lookups: new Map<string, any[]>(),
	users: [],
	parties: []
};

const generators = {
	"Boolean": async (attribute: any): Promise<GeneratorDefinition<boolean>> => { 
		return { name: attribute.LogicalName, generate: () => faker.random.boolean() }; 
	},
	"Customer": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<string>> => {
		if (cache.customers?.length === 0) {
			const api = new DataApiRepository(config);
			cache.customers = await api.getSampleCustomers();
		}

		const customer = cache.customers[Math.round(Math.random() * cache.customers.length)];

		 return { name: `${attribute.LogicalName}_${customer.collection.substring(0, customer.collection.length - 1)}@odata.bind`, generate: () => `/${customer.collection}/${Utilities.Guid.trimGuid(customer.id)}` }; 
	},
	"DateTime": async (attribute: any): Promise<GeneratorDefinition<Date>> => {
		return { name: attribute.LogicalName, generate: () => faker.date.between('1/1/1900', new Date()) };
	}, 
	"Decimal": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { name: attribute.LogicalName, generate: () => faker.random.float(faker.random.number(9)) };
	},
	"Double": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { name: attribute.LogicalName, generate: () => faker.random.float(faker.random.number(5)) };
	},
	"Integer": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { name: attribute.LogicalName, generate: () => faker.random.number({ min: attribute.MinValue, max: attribute.MaxValue }) };
	},
	"Lookup": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<any>> => {
		if (!cache.lookups.has(attribute.Targets)) {
			const api = new DataApiRepository(config);
			const value = await api.getLookupValues(attribute.Targets);

			cache.lookups.set(attribute.Targets, value);
		}

		const possibleValues = cache.lookups.get(attribute.Targets).length;

		return { name: `${attribute.LogicalName}@odata.bind`, generate: () => {
			const randomValue = cache.lookups.get(attribute.Targets)[faker.random.number(possibleValues) - 1];

			return `/${randomValue.collection}/${Utilities.Guid.trimGuid(randomValue.id)}`;
		} };
	},
	"Memo": async (attribute: any): Promise<GeneratorDefinition<string>> => {
		return { name: attribute.LogicalName, generate: () => faker.random.words(faker.random.number(100)) };
	},
	"Money": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { name: attribute.LogicalName, generate: () => faker.random.float(2) };
	},
	"Owner": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<string>> => {
		if (cache.users?.length === 0) {
			const api = new DataApiRepository(config);
			cache.users = await api.getSystemUsers();
		}

		const user = cache.users[Math.round(Math.random() * cache.users.length)];

		return { name: `${attribute.LogicalName}_${user.collection.substring(0, user.collection.length - 1)}@odata.bind`, generate: () => `/${user.collection}/${Utilities.Guid.trimGuid(user.id)}` }; 
	},
	"PartyList": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<any>> => {
		if (cache.parties?.length === 0) {
			const api = new DataApiRepository(config);
			cache.parties = await api.getPartyListMembers();
		}

		return { name: attribute.LogicalName, generate: () => cache.parties[Math.round(Math.random() * cache.parties.length)] };
	},
	"Picklist": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<number>> => {
		const optionSet = attribute.OptionSet || attribute.GlobalOptionSet;
		const option = optionSet.Options[Math.round(Math.random() * optionSet.Options.length)];

		return { name: attribute.LogicalName, generate: () => option.Value };
	}, 
	"State": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<number>> => {
		return { name: attribute.LogicalName, generate: () => 0 };
	}, 	
	"Status": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<number>> => {
		return { name: attribute.LogicalName, generate: () => 1 };
	}, 	
	"String": async (attribute: any, config: CdsWebApi.Config): Promise<GeneratorDefinition<string>> => {
		const type = attribute.Format;
		let value: string;

		switch (type) {
			case "Email":
				value = faker.internet.email();
				break;
			case "Text":
				value = faker.lorem.text();
				break;
		}
		return { name: attribute.LogicalName, generate: () => value };
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
	const attributes = await api.retrieveAttributes(entity.MetadataId, []);
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
		switch (a.AttributeType) {
			case "Customer":
			case "Picklist":
				returnFake.generators[a.LogicalName] = await generators[a.AttributeType](a, config);

				break;
			default:
				returnFake.generators[a.LogicalName] = await generators[a.AttributeType](a);

				break;
		}
	});

	return returnFake;
}