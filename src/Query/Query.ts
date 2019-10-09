export interface DataQuery {
    Alias: any;
    EntityName: string;
    EntityPath?: string;
    Attributes: Set<string>;
    OrderBy: Set<string>;
    Conditions: (DataQueryCondition | DataQueryCondition[])[];
    Joins: DataQueryJoin[];
}

export interface DataQueryCondition {
    AttributeName: string;
    Operator: QueryOperator;
    Values: any[];
}

export interface DataQueryJoin extends DataQuery {
    JoinAlias?: string;
    JoinFromAttributeName?: string;
    JoinToAttributeName?: string;
    IsOuterJoin?: boolean;
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
    Query: DataQuery;
}

export type QueryOperatorParam = QueryOperator | QueryOperatorExpression;

export enum QueryOperator {
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

export type QueryOperatorExpression =
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

export default function query(entityName: string, ...attributeNames: string[]): Query {
    return new QueryProvider(entityName).select(...attributeNames);
}

export function GetRootQuery(query: Query): DataQuery {
    return (query['RootQuery'] || query).Query;
}
class QueryProvider implements Query {
    public Query: DataQuery;
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

    public alias(attributeName: string, alias: string): Query {
        this.Query.Alias[attributeName] = alias;
        return this;
    }

    public path(entityPath: string): Query {
        this.Query.EntityPath = entityPath;
        return this;
    }

    public select(...attributeNames: string[]): Query {
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

    public where(attributeName: string, operator: QueryOperatorParam, ...values: any[]): Query {
        this.Query.Conditions.push({
            AttributeName: attributeName,
            Operator: operator as QueryOperator,
            Values: this.flatten(values)
        });
        return this;
    }

    public whereAny(any: (or: (attributeName: string, operator: QueryOperatorParam, ...values: any[]) => void) => void): Query {
        let conditions:DataQueryCondition[] = [];
        
        any((attributeName: string, operator: QueryOperatorParam, ...values: any[]) => {
            conditions.push({
                AttributeName: attributeName,
                Operator: operator as QueryOperator,
                Values: this.flatten(values)
            });
        });
        this.Query.Conditions.push(conditions);
        return this;
    }

    public orderBy(attributeName: string, isDescendingOrder?: boolean): Query {
        if (isDescendingOrder) {
            this.Query.OrderBy.add('_' + attributeName);
        }
        else {
            this.Query.OrderBy.add(attributeName);
        }
        return this;
    }

    public join(entityName: string, fromAttribute: string, toAttribute?: string, alias?: string, isOuterJoin?: boolean): Query {
        var exp = new QueryProvider(entityName);
        var join = <DataQueryJoin>exp.Query;
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
