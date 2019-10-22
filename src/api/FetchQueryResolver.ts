import { FetchQuery, FetchQueryCondition, GetRootQuery, Query, QueryResolver } from "./FetchQuery";

export class FetchQueryResolver implements QueryResolver
{
    public ResolveQuery(query: Query): string {
        return FetchQueryResolver.ResolveQuery(query);
    }

    public static ResolveQuery(query: Query, maxRowCount: number = 0, format: boolean = false): string {
        const dataQuery = GetRootQuery(query);

        if (format) {
            return this.formatXml(this.GetDataQueryXml(dataQuery, maxRowCount));
        }
        else {
            return this.GetDataQueryXml(dataQuery, maxRowCount);
        }
    }
    
    private static GetDataQueryXml(query: FetchQuery, maxRowCount: number): string {
        var xml = [];

        xml.push('<fetch mapping="logical"');
        
        if (maxRowCount > 0) {
            xml.push(` count="${maxRowCount}"`);
        }
        
        xml.push('>');
        xml.push(`<entity name="${query.EntityName}" >`);
        xml.push(this.getQueryXml(query));
        xml.push('</entity>');
        xml.push('</fetch>');
        
        return xml.join('');
    }
    
    private static getQueryXml(query: FetchQuery): string {
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
                    var conditions = <FetchQueryCondition[]>filter;
                    filters.push('</filter>');
                    filters.push('<filter type="or">');
                    for (var condition of conditions) {
                        filters.push(this.getConditionXml(condition));
                    }
                    filters.push('</filter>');
                    filters.push('<filter type="and">');
                }
                else {
                    filters.push(this.getConditionXml(<FetchQueryCondition>filter));
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
                xml.push(this.getQueryXml(join));
                xml.push('</link-entity>');
            }
        }
    
        return xml.join('\n');
    }
    
    private static getConditionXml(condition: FetchQueryCondition): string {
        var xml = [];

        if (condition.AttributeName.indexOf('.') > -1) {
            condition.AttributeName = `${condition.AttributeName.split('.')[1]}" entityname="${condition.AttributeName.split('.')[0]}`;
        }
    
        if (condition.Values && condition.Values.length > 0) {
            if (condition.Values.length > 1) {
                xml.push(`<condition attribute="${condition.AttributeName}" operator="${condition.Operator}">`);
                for (var value of condition.Values) {
                    xml.push(`<value>${this.encodeValue(value)}</value>`);
                }
                xml.push('</condition>');
            }
            else {
                xml.push(`<condition attribute="${condition.AttributeName}" operator="${condition.Operator}" value="${this.encodeValue(condition.Values[0])}" />`);
            }
        }
        else {
            xml.push(`<condition attribute="${condition.AttributeName}" operator="${condition.Operator}" />`);
        }
        return xml.join('\n');
    }
    
    private static encodeValue(value: any): string {
        if (value === 0) { return '0'; }
        if (value === true) { return 'true'; }
        if (value === false) { return 'false'; }
        if (!value) { return ''; }
        if (typeof (value.toISOString) === 'function') { return value.toISOString(); }
        
        return this.xmlEncode(value.toString());
    }
    
    private static xmlEncode(text: any): string {
        if (text && typeof (text) === 'string') {
            text = text.replace(/&/g, '&amp;');
            text = text.replace(/\"/g, '&quot;');
            text = text.replace(/\'/g, '&apos;');
            text = text.replace(/</g, '&lt;');
            text = text.replace(/>/g, '&gt;');
        }
        return text;
    }
    
    private static formatXml(xmlString: any): string {
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
}