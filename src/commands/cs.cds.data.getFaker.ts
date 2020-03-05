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
import Dictionary from '../core/types/Dictionary';
import { select } from 'async';

export type GeneratorDefinition<T> = { attribute: any, name: string, rule: string, generate: (into?: any) => T };
export type CdsEntityFaker = { 
	attributes: any[],
	entity: any, 
	generators: { [key: string]: GeneratorDefinition<any> },
	generate: (count: number) => any[],
	generateAttribute: (name: string) => any
};

const cache = {
	customers: [],
	lookups: new Map<string, any[]>(),
	users: [],
	parties: [],
	picklists: new Map<string, any[]>()
};

const ignoredAttributes = [
	"createdon",
	"modifiedon",
	"processid",
	"stageid",
	"_composite",
	"versionnumber",
	"ownerid",
	"msdyn_billingaccount"
];

const stringAttributeTranslations = new Dictionary<string, { rule: string, generator: (attribute: any) => string }>([
	{ key: "_line1", value: { rule: 'Address Line 1', generator: attribute => faker.address.streetAddress(false) } },
	{ key: "_line2", value: { rule: 'Address Line 2', generator: attribute => faker.address.secondaryAddress() } },
	{ key: "_city", value: { rule: 'Address City', generator: attribute => faker.address.city() } },
	{ key: "_stateorprovince", value: { rule: 'Address State or Province', generator: attribute => faker.address.stateAbbr() } },
	{ key: "_postalcode", value: { rule: 'Address Postal Code', generator: attribute => faker.address.zipCode() } },
	{ key: "_county", value: { rule: 'Address County', generator: attribute => faker.address.county() } },
	{ key: "_country", value: { rule: 'Address Country', generator: attribute => faker.address.country() } },
	{ key: "companyname", value: { rule: 'Company Name', generator: attribute => faker.company.companyName() } },
	{ key: "company", value: { rule: 'Company Name', generator: attribute => faker.company.companyName() } },
	{ key: "emailaddress", value: { rule: 'Email Address', generator: attribute => faker.internet.email() } },
	{ key: "url", value: { rule: 'URL', generator: attribute => faker.internet.url() } },
	{ key: "phone", value: { rule: 'Phone Number', generator: attribute => faker.phone.phoneNumber() } },
	{ key: "fax", value: { rule: 'Fax Number', generator: attribute => faker.phone.phoneNumber() } },
	{ key: "pager", value: { rule: 'Pager Number', generator: attribute => faker.phone.phoneNumber() } },
	{ key: "salutation", value: { rule: 'Salutation', generator: attribute => faker.name.prefix() } },
	{ key: "suffix", value: { rule: 'Suffix', generator: attribute => faker.name.suffix() } },
	{ key: "firstname", value: { rule: 'First Name', generator: attribute => faker.name.firstName() } },
	{ key: "middlename", value: { rule: 'Middle Name', generator: attribute => faker.name.firstName() } },
	{ key: "lastname", value: { rule: 'Last Name', generator: attribute => faker.name.lastName() } },
	{ key: "numberof", value: { rule: 'Number Of', generator: attribute => faker.random.number(10 * (<number>attribute.MaxLength) || 1).toString() } }, 
	{ key: "name", value: { rule: 'Name', generator: attribute => attribute.EntityLogicalName === "account" ? faker.company.companyName() : attribute.EntityLogicalName === "product" ? faker.commerce.productName() : faker.name.findName() } },
	{ key: "number", value: { rule: 'Alphanumeric', generator: attribute => faker.random.alphaNumeric(Math.floor(Math.random() * (attribute.MaxLength || 1))) } }
]);

const doubleAttributeTranslations = new Dictionary<string, { rule: string, generator: (attribute: any) => string }>([
	{ key: "_latitude", value: { rule: 'Latitude', generator: attribute => faker.address.latitude() } },
	{ key: "_longitude", value: { rule: 'Longitude', generator: attribute => faker.address.longitude() } },
]);

const generators = {
	"Boolean": async (attribute: any): Promise<GeneratorDefinition<boolean>> => { 
		return { attribute, name: attribute.LogicalName, rule: 'Boolean', generate: () => faker.random.boolean() }; 
	},
	"Customer": async (attribute: any, api: DataApiRepository): Promise<GeneratorDefinition<string>> => {
		if (cache.customers?.length === 0) {
			cache.customers = await api.getSampleCustomers();
		}

		const customer = cache.customers[Math.floor(Math.random() * cache.customers.length)];

		 return { attribute, name: `${attribute.LogicalName}_${customer.collection.substring(0, customer.collection.length - 1)}@odata.bind`, rule: 'Customer', generate: () => `/${customer.collection}/${Utilities.Guid.trimGuid(customer.id)}` }; 
	},
	"DateTime": async (attribute: any): Promise<GeneratorDefinition<Date>> => {
		return { 
			attribute, 
			name: attribute.LogicalName, 
			rule: 'Date/Time', 
			generate: () => { 
				let theDate = faker.date.between(attribute.MinSupportedValue || '1/1/1900', attribute.MaxSupportedValue || new Date());
				if (attribute.Format === "DateOnly") {
					theDate = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate());
				}
				return theDate;
			}
		};
	}, 
	"Decimal": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { attribute, name: attribute.LogicalName, rule: 'Decimal', generate: () => faker.random.number({ min: attribute.MinValue || 0, max: attribute.MaxValue || 100000000000, precision: attribute.Precision || faker.random.number({ min: 0, max: 9, precision: 0 }) }) };
	},
	"Double": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		const attributeName = attribute.LogicalName.toLowerCase();

		let matchingKey: string;
		doubleAttributeTranslations.keys.forEach(k => { if (!matchingKey && attributeName.indexOf(k) !== -1) { matchingKey = k; } });

		if (matchingKey) {
			return { attribute, name: attribute.LogicalName, rule: doubleAttributeTranslations[matchingKey].rule, generate: () => doubleAttributeTranslations[matchingKey].generator(attribute) };
		} else {
			return { attribute, name: attribute.LogicalName, rule: 'Double', generate: () => faker.random.number({ min: attribute.MinValue || 0, max: attribute.MaxValue || Number.MAX_SAFE_INTEGER, precision: attribute.Precision || faker.random.number({ min: 0, max: 9, precision: 0 }) }) };
		}

	},
	"Integer": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { attribute, name: attribute.LogicalName, rule: 'Integer', generate: () => faker.random.number({ min: attribute.MinValue || 0, max: attribute.MaxValue || Number.MAX_SAFE_INTEGER, precision: attribute.Precision || 0 }) };
	},
	"Lookup": async (attribute: any, api: DataApiRepository): Promise<GeneratorDefinition<any>> => {
		for (let i = 0; i < attribute.Targets.length; i++) {
			const target = attribute.Targets[i];

			if (!cache.lookups.has(target)) {
				const value = await api.getLookupValues(`LogicalName='${target}'`);
	
				cache.lookups.set(target, value);
			}
	
			return { attribute, name: `${attribute.LogicalName}@odata.bind`, rule: 'Lookup', generate: () => {
				const possibleValues = cache.lookups.get(target).length;

				if (possibleValues === 0) {
					return;
				}

				const randomValue = cache.lookups.get(target)[faker.random.number(possibleValues) - 1];
	
				if (randomValue) {
					return `/${randomValue.collection}/${Utilities.Guid.trimGuid(randomValue.id)}`;
				}
			} };
		}
	},
	"Memo": async (attribute: any): Promise<GeneratorDefinition<string>> => {
		return { attribute, name: attribute.LogicalName, rule: 'Memo', generate: () => faker.random.words(faker.random.number(100)) };
	},
	"Money": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { attribute, name: attribute.LogicalName, rule: 'Money', generate: () => faker.random.number({ min: attribute.MinValue || 0, max: attribute.MaxValue || 100000000, precision: attribute.Precision || 2 }) };
	},
	"Owner": async (attribute: any, api: DataApiRepository): Promise<GeneratorDefinition<string>> => {
		if (cache.users?.length === 0) {
			cache.users = await api.getSystemUsers();
		}

		const user = cache.users[Math.floor(Math.random() * cache.users.length)];

		return { attribute, name: `${attribute.LogicalName}_${user.collection.substring(0, user.collection.length - 1)}@odata.bind`, rule: 'Owner', generate: () => `/${user.collection}/${Utilities.Guid.trimGuid(user.id)}` }; 
	},
	"PartyList": async (attribute: any, api: DataApiRepository): Promise<GeneratorDefinition<any>> => {
		if (cache.parties?.length === 0) {
			cache.parties = await api.getPartyListMembers();
		}

		return { attribute, name: attribute.LogicalName, rule: 'PartyList', generate: () => cache.parties[Math.round(Math.random() * cache.parties.length)] };
	},
	"Picklist": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		const optionSet = attribute.OptionSet || attribute.GlobalOptionSet;

		return { attribute, name: attribute.LogicalName, rule: 'Picklist', generate: () => (optionSet.Options[Math.floor(Math.random() * optionSet.Options.length)]).Value };
	}, 
	"State": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { attribute, name: attribute.LogicalName, rule: 'State', generate: () => 0 };
	}, 	
	"Status": async (attribute: any): Promise<GeneratorDefinition<number>> => {
		return { attribute, name: attribute.LogicalName, rule: 'Status', generate: () => 1 };
	}, 	
	"String": async (attribute: any): Promise<GeneratorDefinition<string>> => {
		const type = attribute.Format;
		const attributeName = attribute.LogicalName.toLowerCase();
		let rule: string;
		let generate: () => string;

		switch (type) {
			case "Email":
				generate = () => faker.internet.email();
				rule = "Email Address";
				break;
			case "Text":
				let matchingKey: string;
				stringAttributeTranslations.keys.forEach(k => { if (!matchingKey && attributeName.indexOf(k) !== -1) { matchingKey = k; } });

				if (matchingKey) {
					generate = () => stringAttributeTranslations[matchingKey].generator(attribute);
					rule = stringAttributeTranslations[matchingKey].rule;
				} else {
					generate = () => faker.lorem.text().substr(0, (<number>attribute.MaxLength) || 1);
					rule = "Text";
				}

				break;
			case "TextArea":
				generate = () => faker.lorem.paragraph().substr(0, (<number>attribute.MaxLength) || 1);
				rule = "Text (Multiple lines)";
				break;
			case "Url":
				generate = () => faker.internet.url();
				rule = "URL";
				break;
			case "TickerSymbol":
				generate = () => faker.hacker.abbreviation();
				rule = "Ticker Symbol";
				break;
			case "Phone":
				generate = () => faker.phone.phoneNumber();
				rule = "Phone Number";
				break;
			case "VersionNumber":
				generate = () => faker.random.float(10).toString();
				rule = "Version Number";
				break;
		}
		return { attribute, name: attribute.LogicalName, rule, generate };
	}, 	
	"Uniqueidentifier": async (attribute: any): Promise<GeneratorDefinition<string>> => {
		return { attribute, name: attribute.LogicalName, rule: "Unique Identiifer", generate: () => Utilities.Guid.newGuid() };
	},
	"BigInt": async (attribute: any): Promise<GeneratorDefinition<BigInt>> => {
		return { attribute, name: attribute.LogicalName, rule: "BigInt", generate: () => BigInt(faker.random.number(Number.MAX_SAFE_INTEGER)) };
	}
};

export default async function run(config?: CdsWebApi.Config, entity?: any, selectedAttributes?: string[]) : Promise<CdsEntityFaker> {
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

	if (!selectedAttributes) {
		const picked = await Quickly.pickCdsEntityComponents(config, entity, CdsSolutions.SolutionComponent.Attribute, undefined, "Choose attributes to fake (press ESC for all)");

		if (picked) {
			selectedAttributes = picked.map(i => i.component.LogicalName);
		}
	}

	const metadataApi = new MetadataRepository(config);
	const dataApi = new DataApiRepository(config);
	const attributes = (await metadataApi.retrieveAttributes(entity.MetadataId, undefined, []))
		.filter(a => !selectedAttributes || selectedAttributes.indexOf(a.LogicalName) !== -1);	

	const returnFake: CdsEntityFaker = {
		attributes: attributes.sort((a, b) => a.ColumnNumber - b.ColumnNumber),
		generators: {},
		entity,
		generateAttribute: function (name: string) {
			try {
				return (this.generators[name])?.generate();
			} 
			catch (error) {
				logger.warn(`Command: ${cs.cds.data.getFaker} Could not generate ${this.entity.LogicalName}.${name} using '${this.generators[name]?.rule}' generator: ${error.message}`);
			}
		},
		generate: function (count: number) {
			if (count && count > 0) {
				const returnArray = [];

				logger.info(`Command: ${cs.cds.data.getFaker} Generating ${count} ${entity.LogicalName}`);

				for (let i = 0; i < count; i++) {
					const returnObject: any = {};

					Object.keys(this.generators).forEach(k => {
						if (typeof(this.generators[k].generate) === 'function') {
							const attribute = this.generators[k].attribute;
							let ignoreAttribute: boolean = false;
							ignoredAttributes.forEach(a => { if (!ignoreAttribute && attribute.LogicalName.indexOf(a) !== -1) { ignoreAttribute = true; } });
			
							if (!ignoreAttribute
								&& attribute 
								&& attribute.IsValidForCreate 
								&& attribute.RequiredLevel.Value 
								&& (attribute.RequiredLevel.Value !== "None" || faker.random.boolean())) {
								try {
									const defined = (this.generators[k]).generate(returnObject);

									if (defined) {
										returnObject[this.generators[k].name] = defined;
									}
								} 
								catch (error) {
									logger.warn(`Command: ${cs.cds.data.getFaker} Could not generate ${this.entity.LogicalName}.${attribute.LogicalName} using '${this.generators[k].rule}' generator: ${error.message}`);
								}
							}
						}
					});

					returnArray.push(returnObject);
				}

				logger.info(`Command: ${cs.cds.data.getFaker} Generating ${count} ${entity.LogicalName} complete`);

				return returnArray;
			}
		}
	};
	
	for (let i = 0; i < attributes.length; i++) {
		const a = attributes[i];
		const generator = generators[a.AttributeType];

		if (!generator) {
			logger.warn(`Command: ${cs.cds.data.getFaker} No generator was found that can map to ${entity.LogicalName}.${a.LogicalName}`);
			continue;
		}

		try {
			switch (a.AttributeType) {
				case "Customer":
				case "Lookup":
				case "Owner":
				case "PartyList":
					returnFake.generators[a.LogicalName] = await generator(a, dataApi);
	
					break;
				case "Picklist":
					if (!cache.picklists[entity.LogicalName]) {
						cache.picklists[entity.LogicalName] = await metadataApi.retrieveAttributes(
							entity.LogicalName, 
							a.AttributeType, 
							[], 
							[ { property: 'GlobalOptionSet', select: [ 'Options' ] }, { property: 'OptionSet', select: [ 'Options' ] } ]
						);
					}
	
					const picklist = cache.picklists[entity.LogicalName].find(i => i.LogicalName === a.LogicalName);
					returnFake.generators[a.LogicalName] = await generator(picklist);
	
					break;
				default:
					returnFake.generators[a.LogicalName] = await generator(a);
	
					break;
			}	
		} catch (error) {
			throw error;
		}
	}

	return returnFake;
}