import { DataQuery, DataQueryCondition, GetRootQuery, Query } from "./Query";

class WebApiQuery
{
    constructor(url:string, headers?:any)
    {
        this.Url = url;

        if (headers)
        {
            this.Headers = headers;
        }
    }

    public Url:string;
    public Headers:any;
}

export default function GetWebApiQuery(baseUrl:string, query: Query, maxRowCount: number = 0): WebApiQuery {
    const dataQuery = GetRootQuery(query);

    return GetDataQueryWebApi(baseUrl, dataQuery, maxRowCount);
}

function GetDataQueryWebApi(baseUrl:string, query: DataQuery, maxRowCount: number): WebApiQuery {
    var urlString = [];
    urlString.push(baseUrl);

    if (maxRowCount > 0) {
        urlString.push(`$count="${maxRowCount}"`);
    }
    urlString.push('>');
    urlString.push(`<entity name="${query.EntityName}" >`);
    urlString.push(getQueryXml(query));
    urlString.push('</entity>');
    urlString.push('</fetch>');

    return new WebApiQuery(urlString.join(''));
}

function getQueryXml(query: DataQuery) : any {
    const xml = [];

    query.Attributes.forEach(attribute => {
        if (query.Alias[attribute]) {
            xml.push(`<attribute name="${attribute}" alias="${query.Alias[attribute]}" />`);
        }
        else {
            xml.push(`<attribute name="${attribute}" />`);
        }
    });
    query.OrderBy.forEach(attribute => {
        if (attribute.indexOf('_') === 0) {
            xml.push(`<order attribute="${attribute.slice(1)}" descending="true" />`);
        }
        else {
            xml.push(`<order attribute="${attribute}" />`);
        }
    });
    if (query.Conditions.length > 0) {
        var hasOrCondition = false;
        var filters = [];
        filters.push('<filter type="and">');
        for (var filter of query.Conditions) {
            if (filter && filter.hasOwnProperty('length')) {
                hasOrCondition = true;
                var conditions = <DataQueryCondition[]>filter;
                filters.push('</filter>');
                filters.push('<filter type="or">');
                for (var condition of conditions) {
                    filters.push(getConditionXml(condition));
                }
                filters.push('</filter>');
                filters.push('<filter type="and">');
            }
            else {
                filters.push(getConditionXml(<DataQueryCondition>filter));
            }
        }
        filters.push('</filter>');

        if (hasOrCondition) {
            filters.unshift('<filter type="and">');
            filters.push('</filter>');
        }

        var skipNextFilter;
        for (var i = 0; i < filters.length; i++) {
            if (filters[i] && filters[i + 1] && filters[i].indexOf('<filter') > -1 && filters[i + 1].indexOf('/filter>') > -1) {
                skipNextFilter = true;
            }
            else if (!skipNextFilter) {
                xml.push(filters[i]);
            }
            else {
                skipNextFilter = false;
            }
        }
    }
    if (query.Joins) {
        for (var join of query.Joins) {
            xml.push(`<link-entity name="${join.EntityName}" alias="${join.JoinAlias}" from="${join.JoinFromAttributeName}" to="${join.JoinToAttributeName}" link-type="${join.IsOuterJoin ? 'outer' : 'inner'}">`);
            xml.push(getQueryXml(join));
            xml.push('</link-entity>');
        }
    }

    return xml.join('\n');
}

function getConditionXml(condition: DataQueryCondition): string {
    var xml = [];
    if (condition.AttributeName.indexOf('.') > -1) {
        condition.AttributeName = `${condition.AttributeName.split('.')[1]}" entityname="${condition.AttributeName.split('.')[0]}`;
    }

    if (condition.Values && condition.Values.length > 0) {
        if (condition.Values.length > 1) {
            xml.push(`<condition attribute="${condition.AttributeName}" operator="${condition.Operator}">`);
            for (var value of condition.Values) {
                xml.push(`<value>${encodeValue(value)}</value>`);
            }
            xml.push('</condition>');
        }
        else {
            xml.push(`<condition attribute="${condition.AttributeName}" operator="${condition.Operator}" value="${encodeValue(condition.Values[0])}" />`);
        }
    }
    else {
        xml.push(`<condition attribute="${condition.AttributeName}" operator="${condition.Operator}" />`);
    }
    return xml.join('\n');
}

function encodeValue(value: any) {
    if (value === 0) { return '0'; }
    if (value === true) { return 'true'; }
    if (value === false) { return 'false'; }
    if (!value) { return ''; }
    if (typeof (value.toISOString) === 'function') { return value.toISOString(); }
    return xmlEncode(value.toString());
}

function xmlEncode(text: any) {
    if (text && typeof (text) === 'string') {
        text = text.replace(/&/g, '&amp;');
        text = text.replace(/\"/g, '&quot;');
        text = text.replace(/\'/g, '&apos;');
        text = text.replace(/</g, '&lt;');
        text = text.replace(/>/g, '&gt;');
    }
    return text;
}
