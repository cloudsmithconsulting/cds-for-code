export function parseUtcDate(date: string): Date {
    let regexMatch: RegExpExecArray | (string | number)[];
    
    if (typeof date === 'string') {
        regexMatch = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:Z|[-+]\d{2}:\d{2})$/.exec(date);

        if (regexMatch) {
            return new Date(Date.UTC(+regexMatch[1], +regexMatch[2] - 1, +regexMatch[3], +regexMatch[4], +regexMatch[5], +regexMatch[6]));
        }
    }

    return new Date(date);        
}

export function dateAsFilename(): string {
    const now = new Date();
    let dateString = now.toISOString();

    dateString = dateString.substr(0, dateString.length - 5);
    dateString = dateString.replace("T", "-").replace(":", "").replace(":", "");
    
    return dateString;
}

export function withTrailingSlash(path: string | undefined): string {
    if (path && !path.endsWith("/")) {
        path = `${path}/`;
    }

    return path ? path : "";
}

export function noTrailingSlash(string: string): string {
    if (string.endsWith("/") || string.endsWith("\\")) {
        string = string.substr(0, string.length - 1);
    }

    return string;
}

export function noSlashes(string:string): string {
    return string.replace(/\/$/, "");
}

export function powerShellSafe(value: string): string {
    return value.replace('$', '`$');
}

export function plural(value:string): string { 
    if (value.endsWith("s")) {
        return `${value}es`;
    } else if (value.endsWith("y")) {
        return `${value.substring(0, value.length - 1)}ies`;
    } else {
        return `${value}s`;
    }
}