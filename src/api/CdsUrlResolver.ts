import { Utilities } from '../core/Utilities';
import { CdsSolutions } from './CdsSolutions';
import { CdsWebApi } from './cds-webapi/CdsWebApi';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import * as cs from '../cs';

/**
 * A class for resolving URLs to CDS
 *
 * @export
 * @class CdsUrlResolver
 */
export default class CdsUrlResolver {
    /**
     * Parses the form type
     *
     * @static
     * @param {number} formType
     * @returns {CdsSolutions.DynamicsForm}
     * @memberof CdsUrlResolver
     */
    static parseFormType(formType:number): CdsSolutions.DynamicsForm {
        return CdsSolutions.CodeMappings.DynamicsForms.getKey(formType);
    }

    /**
     * Parses the process type
     *
     * @static
     * @param {number} processType
     * @returns {CdsSolutions.ProcessType}
     * @memberof CdsUrlResolver
     */
    static parseProcessType(processType:number): CdsSolutions.ProcessType {
         return CdsSolutions.CodeMappings.ProcessTypes.getKey(processType);
    }

    /**
     * Parses the solution component
     *
     * @static
     * @param {number} solutionComponent
     * @returns {CdsSolutions.SolutionComponent}
     * @memberof CdsUrlResolver
     */
    static parseSolutionComponent(solutionComponent:number): CdsSolutions.SolutionComponent {
        return CdsSolutions.CodeMappings.SolutionComponents.getKey(solutionComponent);
    }

    /**
     * Gets the URI to manage a Model App
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {*} [app]
     * @param {*} [solution]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageAppUri(config: CdsWebApi.Config, app?: any, solution?: any): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}designer/app`;
        
        if (solution && solution.solutionid) {
            uriString += `/${solution.solutionid}`;
        }

        if (app) {
            // mimic exactly how CDS wants their URL's.  Picky.  So very picky.
            uriString += `/${app.appmoduleid.toUpperCase()}#/AppDesignerCanvas/${app.appmoduleid.toLowerCase()}`;
        } else {
            uriString += '#/CreateNewApp';
        }

        return uriString;
    }

    /**
     * Gets the URI for opening the app in the user's browser
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {*} app
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenAppUsingBrowserUri(config: CdsWebApi.Config, app: any): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?appid=${app.appmoduleid}`;

        return uriString;
    }
    /**
     * Gets the URI to manage the solution
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {*} [solution]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageSolutionUri(config: CdsWebApi.Config, solution?: any): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/solution/edit.aspx`;
        
        if (this.hasPowerAppsExperience(config) && solution && solution.solutionid) {
            uriString = this.getAppBaseUrl(config);
            uriString += `solutions/${solution.solutionid}`;
            uriString = this.addPowerAppsSource(uriString);
        } else {
            if (solution && solution.solutionid) {
                uriString += `?id=${CdsUrlResolver.crmGuid(solution.solutionid)}`;
            }
        }
        
        return uriString;
    }

    /**
     * Gets the URI to manage the entity
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityUri(config: CdsWebApi.Config, entity?: any, solution?: any): string {
        let uriString: string = this.getAppBaseUrl(config);

        if (this.hasPowerAppsExperience(config)) {
            if (solution && solution.solutionid) {
                uriString += `solutions/${solution.solutionid}/`;
            }
            if (entity && entity.MetadataId) {
                uriString += `entities/${entity.MetadataId}/${entity.LogicalName}/`;
            } else {
                uriString += 'entities/newentity/';
            }
            uriString = this.addPowerAppsSource(uriString);
        } else {
            uriString += `tools/systemcustomization/entities/manageentity.aspx?`;
            if (entity && entity.MetadataId) {
                uriString += `id=${CdsUrlResolver.crmGuid(entity.MetadataId)}`;
            }
            if (solution && solution.solutionid) {
                uriString = this.addSolutionToUri(uriString, solution.solutionid);
            }
        }

        return uriString;
    }

    /**
     * Gets the URI to manage the attribute
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} entityId
     * @param {string} [attributeId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageAttributeUri(config: CdsWebApi.Config, entityId:string, attributeId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/attributes/manageAttribute.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (attributeId) {
            uriString += `&attributeId=${CdsUrlResolver.crmGuid(attributeId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for opening the entity in the dynamics client app
     *
     * @static
     * @param {string} entityLogicalName
     * @param {string} [entityId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityUsingAppUrl(entityLogicalName:string, entityId?:string): string {
        let uriString: string = `ms-dynamicsxrm://?pagetype=${entityId ? "entity" : "create"}&etn=${entityLogicalName}`;

        if (entityId) {
            uriString += `&id=${Utilities.Guid.trimGuid(entityId)}`;
        }

        return uriString;
    }

    /**
     * Gets the URI for opening the entity form
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} entityLogicalName
     * @param {string} [formId]
     * @param {boolean} [showNavigationBar=true]
     * @param {boolean} [showCommandBar=true]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityFormUri(config: CdsWebApi.Config, entityLogicalName:string, formId?:string, showNavigationBar:boolean = true, showCommandBar:boolean = true): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=entityrecord&etn=${entityLogicalName}`;

        if (!showNavigationBar) {
            uriString += "&navbar=off";
        }

        if (!showCommandBar) {
            uriString += "&cmdbar=false";
        }

        if (formId) {
            uriString += `&extraqs=formid%3D${CdsUrlResolver.crmGuid(formId)}`;
        } 

        return this.addSolutionToUri(uriString);
    }

    /**
     * Gets the URI for managing the entity form
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} entityTypeCode
     * @param {CdsSolutions.DynamicsForm} [formType=CdsSolutions.DynamicsForm.Main]
     * @param {string} [formId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityFormUri(config: CdsWebApi.Config, entityTypeCode:string, formType:CdsSolutions.DynamicsForm = CdsSolutions.DynamicsForm.Main, formId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=formeditor&etc=${entityTypeCode}`;
        let options;

        // This one's fun, if you put the guid braces on it doesn't work :)
        if (formId) {
            options = { formtype: formType.toString(), formId: `${Utilities.Guid.trimGuid(formId)}`, action: -1 };
        } else {
            options = { formtype: formType, action: -1 };
        }

        uriString += `&extraqs=${CdsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for opening an entity view in the dynamics client app
     *
     * @static
     * @param {string} entityLogicalName
     * @param {string} [viewId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityViewUsingAppUrl(entityLogicalName:string, viewId?:string): string {
        let uriString: string = `ms-dynamicsxrm://?pagetype=view&etn=${entityLogicalName}`;

        if (viewId) {
            uriString += `&id=${Utilities.Guid.trimGuid(viewId)}`;
        }

        return uriString;
    }

    /**
     * Gets the URI for opening the entity view
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} entityLogicalName
     * @param {string} viewId
     * @param {boolean} [showNavigationBar=true]
     * @param {boolean} [showCommandBar=true]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityViewUri(config: CdsWebApi.Config, entityLogicalName:string, viewId:string, showNavigationBar:boolean = true, showCommandBar:boolean = true): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=entitylist&etn=${entityLogicalName}&viewid=${CdsUrlResolver.crmGuid(viewId)}&viewtype=1039`;

        if (!showNavigationBar) {
            uriString += "&navbar=off";
        }

        if (!showCommandBar) {
            uriString += "&cmdbar=false";
        }

        return this.addSolutionToUri(uriString);
    }

    /**
     * Gets the URI for managing the entity view
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} entityId
     * @param {string} [entityTypeCode]
     * @param {string} [viewId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityViewUri(config: CdsWebApi.Config, entityId:string, entityTypeCode?:string, viewId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/vieweditor/viewManager.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (this.hasPowerAppsExperience(config) && viewId) {
            uriString = this.getAppBaseUrl(config);
            // What is this shit? :'(
            uriString = uriString.replace(/environments\//, 'e/');
            // add solution and view
            if (!solutionId) {
                // default common data service solution
                solutionId = '00000001-0000-0000-0001-00000000009b';
            }
            uriString += `s/${solutionId}/view/${viewId}`;
            uriString = this.addPowerAppsSource(uriString);
        } else {
            if (viewId) {
                uriString += `&id=${CdsUrlResolver.crmGuid(viewId)}`;
            } else {
                uriString += `&mode=new&objectTypeCode=${entityTypeCode}`;
            }
            uriString = this.addSolutionToUri(uriString, solutionId);
        }

        return uriString;
    }

    /**
     * Gets the URL for opening the entity dasboard in the dynamics client app
     *
     * @static
     * @param {string} dashboardId
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getOpenEntityDashboardUsingAppUrl(dashboardId:string): string {
        let uriString: string = `ms-dynamicsxrm://?pagetype=dashboard&id=${Utilities.Guid.trimGuid(dashboardId)}`;

        return uriString;
    }

    /**
     * Gets the URI for managing the entity dashboard
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} [entityTypeCode]
     * @param {CdsSolutions.InteractiveDashboardLayout} [layoutType]
     * @param {string} [dashboardType]
     * @param {string} [dashboardId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityDashboardUri(config: CdsWebApi.Config, entityTypeCode?:string, layoutType?:CdsSolutions.InteractiveDashboardLayout, dashboardType?:string, dashboardId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=icdashboardeditor`;
        
        if (entityTypeCode) {
            uriString += `&entitytypecode=${entityTypeCode}&isentitydashboard=1`;
        }

        let options = {};

        if (dashboardType) {
            options["dashboardType"] = dashboardType;
        }
        
        if (dashboardId) {
            options["formId"] = `{${Utilities.Guid.trimGuid(dashboardId)}}`;
        } 
        
        if (layoutType) {
            options["layout"] = CdsSolutions.CodeMappings.getInteractiveDashboardLayout(layoutType);
        }

        uriString += `&extraqs=${CdsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for managing the entity chart
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} [entityTypeCode]
     * @param {string} [chartId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityChartUrl(config: CdsWebApi.Config, entityTypeCode?:string, chartId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?pagetype=vizdesigner`;
        let options;

        if (chartId) {
            options = { etc: entityTypeCode, id: `${Utilities.Guid.trimGuid(chartId)}` };
        } else {
            options = { etc: entityTypeCode };
        }
        
        uriString += `&extraqs=${CdsUrlResolver.escapeOptions(options)}`;

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for managing the entity keys
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [keyId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityKeyUrl(config: CdsWebApi.Config, entityId?:string, keyId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/AlternateKeys/manageAlternateKeys.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (keyId) {
            uriString += `&entityKeyId=${CdsUrlResolver.crmGuid(keyId)}`;
        } 

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URL for managing entity relationships
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [relationshipId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageEntityRelationshipUrl(config: CdsWebApi.Config, entityId?:string, relationshipId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/relationships/manageRelationship.aspx?entityId=${CdsUrlResolver.crmGuid(entityId)}`;

        if (relationshipId) {
            uriString += `&entityRelationshipId=${CdsUrlResolver.crmGuid(relationshipId)}`;
        } 

        uriString += "&entityRole=referenced";

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URI for managing business processes
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {CdsSolutions.ProcessType} processType
     * @param {number} [entityTypeCode]
     * @param {string} [processId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageBusinessProcessUri(config: CdsWebApi.Config, processType:CdsSolutions.ProcessType, processId?:string, solutionId?:string, entityTypeCode?:number): string {
        let  uriString:string;
        let uri: string;

        switch (processType)
        {
            case CdsSolutions.ProcessType.BusinessRule:
                uriString = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/businessrules/businessRulesDesigner.aspx?BRLaunchpoint=BRGrid&otc=${entityTypeCode}&templateId=0`;

                if (processId) {
                    uriString += `id=${CdsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString);
                break;
            case CdsSolutions.ProcessType.Flow:
                break;
            case CdsSolutions.ProcessType.BusinessProcessFlow:
                uriString = `${Utilities.String.withTrailingSlash(config.appUrl)}Tools/ProcessControl/UnifiedProcessDesigner.aspx?`;

                if (processId) {
                    uriString += `id=${CdsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString);
                break;
            case CdsSolutions.ProcessType.Dialog:
            case CdsSolutions.ProcessType.Action:
            case CdsSolutions.ProcessType.Workflow:
                uriString = `${Utilities.String.withTrailingSlash(config.appUrl)}sfa/workflow/edit.aspx?`;

                if (processId) {
                    uriString += `id=${CdsUrlResolver.crmGuid(processId)}`;  
                }

                uri = this.addSolutionToUri(uriString, solutionId);
                break;
        }

        return uri;
    }

    /**
     * Gets the URI for managing the web resource
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} [webResourceId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageWebResourceUri(config: CdsWebApi.Config, webResourceId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}main.aspx?etc=9333&pagetype=webresourceedit`;

        if (webResourceId) {
            uriString += `&id=${CdsUrlResolver.crmGuid(webResourceId)}`;
        }

        return this.addSolutionToUri(uriString, solutionId);
    }

    /**
     * Gets the URI for managing the option set
     *
     * @static
     * @param {CdsWebApi.Config} config
     * @param {string} [entityId]
     * @param {string} [entityTypeCode]
     * @param {string} [optionSetId]
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    static getManageOptionSetUri(config: CdsWebApi.Config, entityId?:string, entityTypeCode?:string, optionSetId?:string, solutionId?:string): string {
        let uriString: string = `${Utilities.String.withTrailingSlash(config.appUrl)}tools/systemcustomization/optionset/optionset.aspx?`;

        uriString += `_CreateFromType=7100`;

        if (solutionId) {
            uriString += `&_CreateFromId=${CdsUrlResolver.crmGuid(solutionId)}`;
        }

        if (optionSetId) {
            uriString += `&id=${CdsUrlResolver.crmGuid(optionSetId)}`;
        }

        uriString = this.addSolutionToUri(uriString, solutionId);

        return uriString;
    }

    /**
     * URL encodes a GUID for passing to web URI
     *
     * @private
     * @static
     * @param {string} value
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    private static crmGuid(value:string): string {
        return `%7B${Utilities.Guid.trimGuid(value)}%7D`;
    }

    /**
     * Escapes the options and returns a query string
     *
     * @private
     * @static
     * @param {*} options
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    private static escapeOptions(options:any): string {
        let returnString = escape(Utilities.$Object.asQuerystring(options));
        returnString = returnString.replace("%257B", "%7B").replace("%257D", "%7D");

        return `${returnString}`;
    }

    /**
     * Adds the solution id to the URI
     *
     * @private
     * @static
     * @param {string} uriString
     * @param {string} [solutionId]
     * @returns {string}
     * @memberof CdsUrlResolver
     */
    private static addSolutionToUri(uriString:string, solutionId?:string): string {
        if (solutionId)
        {
            if (!uriString.endsWith("?")) {
                uriString += "&";             
            }

            uriString += `appSolutionId=${CdsUrlResolver.crmGuid(solutionId)}`;
        }

        return uriString;
    }

    /**
     * Adds the source query string parameter to a powerapps URI
     *
     * @private
     * @static
     * @param {string} uriString
     * @returns {string}
     * @memberof CdsUrlResolvercds
     */
    private static addPowerAppsSource(uriString:string) : string {
        if (!uriString.endsWith('?')) {
            uriString += '?';
        }

        return uriString += 'source=cds-for-code';
    }

    /**
     * Determines if the config supports the power apps experience
     *
     * @private
     * @static
     * @param {CdsWebApi.Config} config
     * @returns
     * @memberof CdsUrlResolver
     */
    private static hasPowerAppsExperience(config: CdsWebApi.Config) {
        const usePowerAppsUi = ExtensionConfiguration.getConfigurationValue<boolean>(cs.cds.configuration.web.usePowerAppsUi);
        return usePowerAppsUi && config.environmentId && config.environmentId !== '';
    }

    /**
     * Gets the app base URL
     *
     * @private
     * @static
     * @param {CdsWebApi.Config} config
     * @returns
     * @memberof CdsUrlResolver
     */
    private static getAppBaseUrl(config: CdsWebApi.Config) {
        return !this.hasPowerAppsExperience(config)
            ? Utilities.String.withTrailingSlash(config.appUrl)
            : `https://make.powerapps.com/environments/${config.environmentId}/`;
    }
}
