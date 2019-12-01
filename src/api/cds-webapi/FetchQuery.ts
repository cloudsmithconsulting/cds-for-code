export interface FetchQuery {
    Alias: any;
    EntityName: string;
    EntityPath?: string;
    Attributes: Set<string>;
    OrderBy: Set<string>;
    Conditions: (FetchQueryCondition | FetchQueryCondition[])[];
    Joins: FetchQueryJoin[];
}

export interface FetchQueryCondition {
    AttributeName: string;
    Operator: FetchQueryOperator;
    Values: any[];
}

export interface FetchQueryJoin extends FetchQuery {
    JoinAlias?: string;
    JoinFromAttributeName?: string;
    JoinToAttributeName?: string;
    IsOuterJoin?: boolean;
}

export interface QueryResolver {
    ResolveQuery(query: Query): string;
}

export interface Query {
    [key:string]: any; // Add index signature
    alias(attributeName: string, alias: string): Query;
    path(entityPath: string): Query;
    select(...attributeNames: string[]): Query;
    where(attributeName: string, operator: QueryOperatorParam, ...values: any[]): Query;
    whereAny(any: (or: (attributeName: string, operator: QueryOperatorParam, ...values: any[]) => void) => void): Query;
    orderBy(attributeName: string, isDescendingOrder?: boolean): Query;
    join(entityName: string, fromAttribute: string, toAttribute?: string, alias?: string, isOuterJoin?: boolean): Query;
    Query: FetchQuery;
}

// Query operators are either Fetch or WebApi
export type QueryOperatorParam = FetchQueryOperator | FetchQueryOperatorExpression;

export enum FetchQueryOperator {
    Contains = 'like',
    NotContains = 'not-like',
    StartsWith = 'begins-with',
    Equals = 'eq',
    NotEquals = 'neq',
    GreaterThan = 'gt',
    LessThan = 'lt',
    In = 'in',
    NotIn = 'not-in',
    OnOrBefore = 'on-or-before',
    OnOrAfter = 'on-or-after',
    Null = 'null',
    NotNull = 'not-null',
    IsCurrentUser = 'eq-userid',
    IsNotCurrentUser = 'ne-userid',
    IsCurrentUserTeam = 'eq-userteams'
}

export type FetchQueryOperatorExpression =
    'like' |
    'not-like' |
    'begins-with' |
    'eq' |
    'neq' |
    'gt' |
    'lt' |
    'in' |
    'not-in' |
    'on-or-before' |
    'on-or-after' |
    'null' |
    'not-null' |
    'eq-userid' |
    'ne-userid' |
    'eq-userteams';
   
export default function fetchQuery(entityName: string, ...attributeNames: string[]): Query {
    return FetchQueryProvider.Create(entityName, ...attributeNames);
}

export function GetRootQuery(query: Query): FetchQuery {
    return (query['RootQuery'] || query).Query;
}

class FetchQueryProvider implements Query {
    public Query: FetchQuery;
    public RootQuery: Query | undefined;

    constructor(private EntityName: string) {
        this.Query = {
            Alias: { EntityName },
            EntityName: EntityName,
            Attributes: new Set(),
            OrderBy: new Set(),
            Conditions: [],
            Joins: []
        };
    }

    static Create(entityName:string, ...attributeNames: string[]): Query {
        return new FetchQueryProvider(entityName).select(...attributeNames);
    }

    alias(attributeName: string, alias: string): Query {
        this.Query.Alias[attributeName] = alias;

        return this;
    }

    path(entityPath: string): Query {
        this.Query.EntityPath = entityPath;

        return this;
    }

    select(...attributeNames: string[]): Query {
        for (const a of this.flatten(attributeNames)) {
            this.Query.Attributes.add(a);
        }

        if (this.RootQuery) {
            const rootQuery = GetRootQuery(this);

            for (const a of this.flatten(attributeNames)) {
                rootQuery.Attributes.add(this.EntityName + '.' + a);
            }
        }

        return this;
    }

    where(attributeName: string, operator: QueryOperatorParam, ...values: any[]): Query {
        this.Query.Conditions.push({
            AttributeName: attributeName,
            Operator: operator as FetchQueryOperator,
            Values: this.flatten(values)
        });

        return this;
    }

    whereAny(any: (or: (attributeName: string, operator: QueryOperatorParam, ...values: any[]) => void) => void): Query {
        let conditions:FetchQueryCondition[] = [];
        
        any((attributeName: string, operator: QueryOperatorParam, ...values: any[]) => {
            conditions.push({
                AttributeName: attributeName,
                Operator: operator as FetchQueryOperator,
                Values: this.flatten(values)
            });
        });

        this.Query.Conditions.push(conditions);

        return this;
    }

    orderBy(attributeName: string, isDescendingOrder?: boolean): Query {
        if (isDescendingOrder) {
            this.Query.OrderBy.add('_' + attributeName);
        }
        else {
            this.Query.OrderBy.add(attributeName);
        }

        return this;
    }

    join(entityName: string, fromAttribute: string, toAttribute?: string, alias?: string, isOuterJoin?: boolean): Query {
        var exp = new FetchQueryProvider(entityName);
        var join = <FetchQueryJoin>exp.Query;
       
        exp.RootQuery = this.RootQuery || this;
        join.JoinAlias = alias || entityName;
        join.JoinFromAttributeName = fromAttribute;
        join.JoinToAttributeName = toAttribute || this.EntityName + 'id';
        join.IsOuterJoin = isOuterJoin;

        this.Query.Joins.push(join);
       
        return exp;
    }

    private flatten(values: any[]): any[] {
        return [].concat(...values);
    }
}
