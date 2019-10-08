import { AttributeMetadata } from "./AttributeMetadata";

export interface OptionSetAttributeMetadata extends AttributeMetadata {
    PicklistOptions?: OptionSetMetadata[];
}

export interface OptionSetMetadata {
    Label: string;
    Value: number;
}