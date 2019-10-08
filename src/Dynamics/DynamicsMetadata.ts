import { WebApiVersion } from "./Dynamics";
import { dynamicsBatch } from "./DynamicsBatch";
import { dynamicsRequest, ConnectionOptions } from "./DynamicsRequest";
import { AttributeMetadata, AttributeTypeCode, EntityAttributeMetadata, LookupAttributeMetadata } from "./Model/AttributeMetadata";
import { EntityMetadata } from "./Model/EntityMetadata";
import { OptionSetAttributeMetadata, OptionSetMetadata } from "./Model/OptionSetMetadata";

export type DynamicsEntityMetadata = EntityAttributeMetadata;
export type DynamicsAttributeMetadata = AnyAttributeMetadata;
export type DynamicsOptionSetMetadata = OptionSetMetadata;
export type DynamicsLookupAttributeMetadata = LookupAttributeMetadata;
export type DynamicsOptionSetAttributeMetadata = OptionSetAttributeMetadata;

export default function dynamics(connectionOptions?: ConnectionOptions): DynamicsMetadata {
    return new DynamicsMetadataClient(connectionOptions);
}

export function isLookupAttribute(attribute: DynamicsAttributeMetadata): attribute is DynamicsLookupAttributeMetadata {
    return attribute.Type === 'Lookup' && attribute['LookupEntityName'];
}

export function isOptionSetAttribute(attribute: DynamicsAttributeMetadata): attribute is DynamicsOptionSetAttributeMetadata {
    return (attribute.Type === 'Picklist' || attribute.Type === 'State' || attribute.Type === 'Status') && attribute['PicklistOptions'];
}

export interface DynamicsMetadata {
    attributes(entityName: string): Promise<AttributeMetadata[]>;
    entities(): Promise<EntityMetadata[]>;
    entity(entityName: string): Promise<EntityAttributeMetadata>;
    entityAttributes(...entityNames: string[]): Promise<EntityAttributeMetadata[]>;
}

interface EntityType {
    Description?: DisplayName;
    DisplayName: DisplayName;
    EntitySetName: string;
    IconSmallName?: string;
    IsActivity?: boolean;
    IsCustomEntity?: boolean;
    LogicalName: string;
    PrimaryIdAttribute: string;
    PrimaryNameAttribute: string;
}

interface AttributeType {
    AttributeType: AttributeTypeCode;
    DisplayName: DisplayName;
    IsCustomAttribute?: boolean;
    LogicalName: string;
    SchemaName?: string;
}

interface LookupAttributeType extends AttributeType {
    Targets?: string[];
}

interface OptionSetAttributeType extends AttributeType {
    OptionSet?: { Options: OptionSetType[] }
}

interface OptionSetType {
    Value: number;
    Label: DisplayName;
}

type AnyAttributeType = AttributeType | LookupAttributeType | OptionSetAttributeType;
type AnyAttributeMetadata = AttributeMetadata | LookupAttributeMetadata | OptionSetAttributeMetadata;

interface DisplayName {
    UserLocalizedLabel: {
        Label: string;
    }
}

const entityProperties = [
    "Description", "DisplayName", "EntitySetName",
    "IconSmallName", "IsActivity", "IsCustomEntity",
    "LogicalName", "PrimaryIdAttribute", "PrimaryNameAttribute"
];

const attributeProperties = [
    "AttributeType", "DisplayName", "IsCustomAttribute",
    "LogicalName", "SchemaName"
];

const ExcludedAttributeTypeFilters = [
    'Uniqueidentifier',
    'CalendarRules',
    'EntityName',
    'ManagedProperty',
    'Owner',
    'Virtual',
    'Lookup',
    'Picklist',
    'Status',
    'State'
];

const ExcludedAttributeNameFilters = [
    'exchangerate',
    'utcconversiontimezonecode',
    'timezoneruleversionnumber',
    'importsequencenumber',
    'organizationid',
    'transactioncurrencyid',
    'versionnumber',
    'createdonbehalfby',
    'modifiedonbehalfby',
    'overriddencreatedon',
    'entityimage_timestamp'
];

class DynamicsMetadataClient implements DynamicsMetadata {
    private dynamicsHeaders: any;
    private connectionOptions: ConnectionOptions;

    constructor(options?:ConnectionOptions) {
        if (options)
        {
            this.connectionOptions = options;
        }
    }

    attributes(entityName: string): Promise<AttributeMetadata[]> {
        return dynamicsBatch(this.connectionOptions, this.dynamicsHeaders)
            .requestAllUrls(this.getMetadataUrls(entityName, false))
            .execute()
            .then(data => this.flatten(data)
                .filter((attribute: AttributeType) => attribute.LogicalName.indexOf('yomi') === -1 || attribute.LogicalName.indexOf('base') != attribute.LogicalName.length - 4)
                .map(DynamicsMetadataMapper.MapAttribute)
            );
    }

    entities(): Promise<EntityMetadata[]> {
        return dynamicsRequest<EntityType[]>(this.connectionOptions, `/api/data/${WebApiVersion}/EntityDefinitions?$select=EntitySetName,Description,DisplayName,LogicalName,PrimaryIdAttribute,PrimaryNameAttribute,IconSmallName,IsActivity,IsCustomEntity`, this.dynamicsHeaders)
            .then(data => data
                .map(entity => DynamicsMetadataMapper.MapEntity(entity))
            );
    }

    entity(entityName: string): Promise<EntityAttributeMetadata> {
        return dynamicsRequest<EntityType>(this.connectionOptions, `/api/data/${WebApiVersion}/EntityDefinitions(LogicalName='${entityName}')?$select=EntitySetName,Description,DisplayName,LogicalName,PrimaryIdAttribute,PrimaryNameAttribute,IconSmallName,IsActivity,IsCustomEntity`, this.dynamicsHeaders)
            .then(entity =>
                this.attributes(entityName)
                    .then(attributes => DynamicsMetadataMapper.MapEntity(entity, attributes))
            );
    }

    entityAttributes(...entityNames: string[]): Promise<EntityAttributeMetadata[]> {
        return dynamicsBatch(this.connectionOptions, this.dynamicsHeaders)
            .requestAllUrls(this.flatten(entityNames.map(e => this.getMetadataUrls(e, true))))
            .execute()
            .then(data => {
                const entities = [];
                const items = this.flatten(data);
                let currentEntity: EntityAttributeMetadata;
                for (const item of items) {
                    if (item.EntitySetName) {
                        currentEntity = DynamicsMetadataMapper.MapEntity(item);
                        entities.push(currentEntity);
                    }
                    else if (item.LogicalName.indexOf('yomi') == -1 && item.LogicalName.indexOf('base') != item.LogicalName.length - 4) {
                        currentEntity.Attributes.push(DynamicsMetadataMapper.MapAttribute(item));
                    }
                }
                return entities;
            });
    }

    private getMetadataUrls(entityName: string, includeEntity: boolean = false): any[] {
        const attributeTypeFilter = ExcludedAttributeTypeFilters.map(v => `AttributeType ne Microsoft.Dynamics.CRM.AttributeTypeCode'${v}'`).join(' and ');
        const attributeNameFilter = ExcludedAttributeNameFilters.map(v => `LogicalName ne '${v}'`).join(' and ');
        return [
            `/api/data/${WebApiVersion}/EntityDefinitions(LogicalName='${entityName}')?$select=${entityProperties}`,
            `/api/data/${WebApiVersion}/EntityDefinitions(LogicalName='${entityName}')/Attributes?$select=${attributeProperties}&$filter=${attributeTypeFilter} and ${attributeNameFilter}`,
            `/api/data/${WebApiVersion}/EntityDefinitions(LogicalName='${entityName}')/Attributes/Microsoft.Dynamics.CRM.LookupAttributeMetadata?$select=${attributeProperties},Targets`,
            `/api/data/${WebApiVersion}/EntityDefinitions(LogicalName='${entityName}')/Attributes/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$select=${attributeProperties}&$expand=OptionSet($select=Options)`,
            `/api/data/${WebApiVersion}/EntityDefinitions(LogicalName='${entityName}')/Attributes/Microsoft.Dynamics.CRM.StatusAttributeMetadata?$select=${attributeProperties}&$expand=OptionSet($select=Options)`,
            `/api/data/${WebApiVersion}/EntityDefinitions(LogicalName='${entityName}')/Attributes/Microsoft.Dynamics.CRM.StateAttributeMetadata?$select=${attributeProperties}&$expand=OptionSet($select=Options)`
        ].slice(includeEntity ? 0 : 1);
    }
    
    private flatten(values: any[]): any[] {
        return [].concat(...values);
    }
}

class DynamicsMetadataMapper {
    static MapAttribute(attribute: AnyAttributeType): AnyAttributeMetadata {
        return {
            LogicalName: attribute.LogicalName,
            DisplayName: (attribute.DisplayName && attribute.DisplayName.UserLocalizedLabel && attribute.DisplayName.UserLocalizedLabel.Label) || attribute.LogicalName,
            Type: attribute.AttributeType,
            IsCustomAttribute: attribute.IsCustomAttribute,
            LookupEntityName: isLookup(attribute) && attribute.Targets[0],
            LookupSchemaName: isLookup(attribute) && attribute.SchemaName,
            PicklistOptions: isOptionSet(attribute) && attribute.OptionSet.Options.map((opt) => ({
                Label: (opt.Label && opt.Label.UserLocalizedLabel && opt.Label.UserLocalizedLabel.Label),
                Value: opt.Value
            }))
        };
    }

    static MapEntity(entity: EntityType, attributes?: AttributeMetadata[]): EntityAttributeMetadata {
        return {
            Description: (entity.Description && entity.Description.UserLocalizedLabel && entity.Description.UserLocalizedLabel.Label) || '',
            DisplayName: (entity.DisplayName && entity.DisplayName.UserLocalizedLabel && entity.DisplayName.UserLocalizedLabel.Label) || entity.LogicalName,
            EntitySetName: entity.EntitySetName,
            IconSmallName: entity.IconSmallName,
            IsActivity: entity.IsActivity,
            IsCustomEntity: entity.IsCustomEntity,
            LogicalName: entity.LogicalName,
            PrimaryIdAttribute: entity.PrimaryIdAttribute,
            PrimaryNameAttribute: entity.PrimaryNameAttribute,
            Attributes: attributes || []
        };
    }
}

function isLookup(attribute: AnyAttributeType): attribute is LookupAttributeType {
    return Array.isArray(attribute['Targets']);
}

function isOptionSet(attribute: AnyAttributeType): attribute is OptionSetAttributeType {
    return attribute['OptionSet'] && Array.isArray(attribute['OptionSet'].Options);
}