import { EntityMetadata } from "./EntityMetadata";

export interface EntityAttributeMetadata extends EntityMetadata {
    Attributes: AttributeMetadata[];
}

export interface LookupAttributeMetadata extends AttributeMetadata {
    LookupAttributes?: AttributeMetadata[];
    LookupEntityName?: string;
    LookupSchemaName?: string;
}

export interface AttributeMetadata {
    LogicalName: string;
    DisplayName: string;
    Type: AttributeTypeCode;
    IsCustomAttribute?: boolean;
}

export type AttributeTypeCode =
    'BigInt' |
    'Boolean' |
    'Customer' |
    'DateTime' |
    'Decimal' |
    'Double' |
    'Integer' |
    'Lookup' |
    'Memo' |
    'Money' |
    'PartyList' |
    'Picklist' |
    'State' |
    'Status' |
    'String';

export const AttributeTypeCodes = [
    'BigInt',
    'Boolean',
    'Customer',
    'DateTime',
    'Decimal',
    'Double',
    'Integer',
    'Lookup',
    'Memo',
    'Money',
    'PartyList',
    'Picklist',
    'State',
    'Status',
    'String'
];
