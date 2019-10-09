import { dynamicsRequest, ConnectionOptions } from "./DynamicsRequest";
import { OrganizationMetadata } from "./Model/OrganizationMetadata";

export type OrganizationMetadata = OrganizationMetadata;

export const DefaultDiscoveryApiVersion = 'v9.1';

export default function dynamicsDiscovery(connectionOptions?: ConnectionOptions): DynamicsDiscovery {
    return new DynamicsDiscoveryClient(connectionOptions);
}

export interface DynamicsDiscovery {
    discover(): Promise<OrganizationMetadata[]>;
}

class DynamicsDiscoveryClient implements DynamicsDiscovery {
    private dynamicsHeaders: any;
    private connectionOptions: ConnectionOptions;

    constructor(options?:ConnectionOptions) {
        if (options)
        {
            this.connectionOptions = options;

            if (!options.webApiVersion)
            {
                this.connectionOptions.webApiVersion = DefaultDiscoveryApiVersion;
            }
        }
    }

    discover(): Promise<OrganizationMetadata[]> {
        return dynamicsRequest<OrganizationMetadata[]>(this.connectionOptions, `/api/discovery/${this.connectionOptions.webApiVersion}/Instances`, this.dynamicsHeaders);
    }
}