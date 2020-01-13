export function getLocalizedName(item: any, defaultValue: string = ""): string {
    return item.UserLocalizedLabel 
        ? item.UserLocalizedLabel.Label 
        : item.LocalizedLabels && item.LocalizedLabels.length > 0 
            ? item.LocalizedLabels[0].Label 
            : defaultValue;
}