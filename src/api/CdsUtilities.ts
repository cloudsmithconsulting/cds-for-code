export function getDisplayName(item: any, defaultValue: string = ""): string {
    return item.DisplayName && item.DisplayName.UserLocalizedLabel 
        ? item.DisplayName.UserLocalizedLabel.Label 
        : item.DisplayName.LocalizedLabels && item.DisplayName.LocalizedLabels.length > 0 
            ? item.DisplayName.LocalizedLabels[0].Label 
            : defaultValue;
}