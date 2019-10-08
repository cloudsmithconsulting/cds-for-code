import { DataQuery, DataQueryCondition, GetRootQuery, Query } from "./Query";

export default function GetQueryXml(query: Query, maxRowCount: number = 0, format: boolean = false) {
    const dataQuery = GetRootQuery(query);
    if (format) {
        return formatXml(GetDataQueryXml(dataQuery, maxRowCount));
    }
    else {
        return GetDataQueryXml(dataQuery, maxRowCount);
    }
}

function GetDataQueryXml(query: DataQuery, maxRowCount: number) {
    var xml = [];
    xml.push('<fetch mapping="logical"');
    if (maxRowCount > 0) {
        xml.push(` count="${maxRowCount}"`);
    }
    xml.push('>');
    xml.push(`<entity name="${query.EntityName}" >`);
    xml.push(getQueryXml(query));
    xml.push('</entity>');
    xml.push('</fetch>');
    return xml.join('');
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

function formatXml(xmlString: any) {
    var indent = "\t";
    var tabs = "";  //store the current indentation

    return xmlString.replace(
        /\s*<[^>\/]*>[^<>]*<\/[^>]*>|\s*<.+?>|\s*[^<]+/g, //pattern to match nodes (angled brackets or text)
        function (m: string, i: number) {
            m = m.replace(/^\s+|\s+$/g, "");  //trim the match just in case

            if (i < 38 && /^<[?]xml/.test(m)) { return m + "\n"; }  //if the match is a header, ignore it

            if (/^<[/]/.test(m))  //if the match is a closing tag
            {
                tabs = tabs.replace(indent, "");  //remove one indent from the store
                m = tabs + m;  //add the tabs at the beginning of the match
            }
            else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(m))  //if the match contains an entire node
            {
                //leave the store as is or
                m = m.replace(/(<[^\/>]*)><[\/][^>]*>/g, "$1 />");  //join opening with closing tags of the same node to one entire node if no content is between them
                m = tabs + m; //add the tabs at the beginning of the match
            }
            else if (/<.*>/.test(m)) //if the match starts with an opening tag and does not contain an entire node
            {
                m = tabs + m;  //add the tabs at the beginning of the match
                tabs += indent;  //and add one indent to the store
            }
            else  //if the match contain a text node
            {
                m = tabs + m;  // add the tabs at the beginning of the match
            }

            //return m+"\n";
            return "\n" + m; //content has additional space(match) from header
        }
    );
}