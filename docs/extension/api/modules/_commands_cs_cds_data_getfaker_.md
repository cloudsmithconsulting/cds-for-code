---
id: "_commands_cs_cds_data_getfaker_"
title: "commands/cs.cds.data.getFaker"
sidebar_label: "commands/cs.cds.data.getFaker"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.data.getFaker"](_commands_cs_cds_data_getfaker_.md)

## Index

### Type aliases

* [CdsEntityFaker](_commands_cs_cds_data_getfaker_.md#cdsentityfaker)
* [GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)

### Variables

* [doubleAttributeTranslations](_commands_cs_cds_data_getfaker_.md#const-doubleattributetranslations)
* [ignoredAttributes](_commands_cs_cds_data_getfaker_.md#const-ignoredattributes)
* [stringAttributeTranslations](_commands_cs_cds_data_getfaker_.md#const-stringattributetranslations)

### Functions

* [run](_commands_cs_cds_data_getfaker_.md#run)

### Object literals

* [cache](_commands_cs_cds_data_getfaker_.md#const-cache)
* [generators](_commands_cs_cds_data_getfaker_.md#const-generators)

## Type aliases

###  CdsEntityFaker

Ƭ **CdsEntityFaker**: *object*

Defined in src/commands/cs.cds.data.getFaker.ts:16

#### Type declaration:

* **attributes**: *any[]*

* **entity**: *any*

* **generate**(): *function*

  * (`count`: number): *any[]*

* **generateAttribute**(): *function*

  * (`name`: string): *any*

* **generators**(): *object*

___

###  GeneratorDefinition

Ƭ **GeneratorDefinition**: *object*

Defined in src/commands/cs.cds.data.getFaker.ts:15

#### Type declaration:

* **attribute**: *any*

* **generate**(): *function*

  * (`into?`: any): *T*

* **name**: *string*

* **rule**: *string*

## Variables

### `Const` doubleAttributeTranslations

• **doubleAttributeTranslations**: *[Dictionary](../classes/_core_types_dictionary_.dictionary.md)‹string, object›* = new Dictionary<string, { rule: string, generator: (attribute: any) => string }>([
	{ key: "_latitude", value: { rule: 'Latitude', generator: attribute => faker.address.latitude() } },
	{ key: "_longitude", value: { rule: 'Longitude', generator: attribute => faker.address.longitude() } },
])

Defined in src/commands/cs.cds.data.getFaker.ts:68

___

### `Const` ignoredAttributes

• **ignoredAttributes**: *string[]* = [
	"createdon",
	"modifiedon",
	"processid",
	"stageid",
	"_composite",
	"versionnumber",
	"ownerid",
	"msdyn_billingaccount"
]

Defined in src/commands/cs.cds.data.getFaker.ts:32

___

### `Const` stringAttributeTranslations

• **stringAttributeTranslations**: *[Dictionary](../classes/_core_types_dictionary_.dictionary.md)‹string, object›* = new Dictionary<string, { rule: string, generator: (attribute: any) => string }>([
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
])

Defined in src/commands/cs.cds.data.getFaker.ts:43

## Functions

###  run

▸ **run**(`config?`: [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md), `entity?`: any, `selectedAttributes?`: string[]): *Promise‹[CdsEntityFaker](_commands_cs_cds_data_getfaker_.md#cdsentityfaker)›*

Defined in src/commands/cs.cds.data.getFaker.ts:232

**Parameters:**

Name | Type |
------ | ------ |
`config?` | [Config](../interfaces/_api_cds_webapi_cdswebapi_.cdswebapi.config.md) |
`entity?` | any |
`selectedAttributes?` | string[] |

**Returns:** *Promise‹[CdsEntityFaker](_commands_cs_cds_data_getfaker_.md#cdsentityfaker)›*

## Object literals

### `Const` cache

### ▪ **cache**: *object*

Defined in src/commands/cs.cds.data.getFaker.ts:24

###  customers

• **customers**: *undefined[]* = []

Defined in src/commands/cs.cds.data.getFaker.ts:25

###  lookups

• **lookups**: *Map‹string, any[]›* = new Map<string, any[]>()

Defined in src/commands/cs.cds.data.getFaker.ts:26

###  parties

• **parties**: *undefined[]* = []

Defined in src/commands/cs.cds.data.getFaker.ts:28

###  picklists

• **picklists**: *Map‹string, any[]›* = new Map<string, any[]>()

Defined in src/commands/cs.cds.data.getFaker.ts:29

###  users

• **users**: *undefined[]* = []

Defined in src/commands/cs.cds.data.getFaker.ts:27

___

### `Const` generators

### ▪ **generators**: *object*

Defined in src/commands/cs.cds.data.getFaker.ts:73

###  BigInt

▸ **BigInt**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹BigInt››*

Defined in src/commands/cs.cds.data.getFaker.ts:227

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹BigInt››*

###  Boolean

▸ **Boolean**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹boolean››*

Defined in src/commands/cs.cds.data.getFaker.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹boolean››*

###  Customer

▸ **Customer**(`attribute`: any, `api`: [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md)): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

Defined in src/commands/cs.cds.data.getFaker.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |
`api` | [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md) |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

###  DateTime

▸ **DateTime**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹Date››*

Defined in src/commands/cs.cds.data.getFaker.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹Date››*

###  Decimal

▸ **Decimal**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

Defined in src/commands/cs.cds.data.getFaker.ts:100

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

###  Double

▸ **Double**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

Defined in src/commands/cs.cds.data.getFaker.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

###  Integer

▸ **Integer**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

Defined in src/commands/cs.cds.data.getFaker.ts:116

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

###  Lookup

▸ **Lookup**(`attribute`: any, `api`: [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md)): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹any››*

Defined in src/commands/cs.cds.data.getFaker.ts:119

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |
`api` | [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md) |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹any››*

###  Memo

▸ **Memo**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

Defined in src/commands/cs.cds.data.getFaker.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

###  Money

▸ **Money**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

Defined in src/commands/cs.cds.data.getFaker.ts:147

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

###  Owner

▸ **Owner**(`attribute`: any, `api`: [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md)): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

Defined in src/commands/cs.cds.data.getFaker.ts:150

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |
`api` | [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md) |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

###  PartyList

▸ **PartyList**(`attribute`: any, `api`: [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md)): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹any››*

Defined in src/commands/cs.cds.data.getFaker.ts:159

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |
`api` | [DataApiRepository](../classes/_repositories_dataapirepository_.dataapirepository.md) |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹any››*

###  Picklist

▸ **Picklist**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

Defined in src/commands/cs.cds.data.getFaker.ts:166

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

###  State

▸ **State**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

Defined in src/commands/cs.cds.data.getFaker.ts:171

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

###  Status

▸ **Status**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

Defined in src/commands/cs.cds.data.getFaker.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹number››*

###  String

▸ **String**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

Defined in src/commands/cs.cds.data.getFaker.ts:177

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

###  Uniqueidentifier

▸ **Uniqueidentifier**(`attribute`: any): *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*

Defined in src/commands/cs.cds.data.getFaker.ts:224

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | any |

**Returns:** *Promise‹[GeneratorDefinition](_commands_cs_cds_data_getfaker_.md#generatordefinition)‹string››*
