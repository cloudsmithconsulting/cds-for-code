import * as cs from "../cs";
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import { CdsSolutions } from "../api/CdsSolutions";
import ApiRepository from "../repositories/apiRepository";
import Quickly, { QuickPickOption } from "../core/Quickly";
import logger from "../core/framework/Logger";
import ExtensionContext from "../core/ExtensionContext";

/**
 * Creates a process for a CDS solution
 *
 * @export
 * @param {CdsWebApi.Config} [config]
 * @param {string} [solutionid]
 * @returns
 */
export default async function run(config?: CdsWebApi.Config, solutionid?: string) {
    config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.deployment.createProcess} Configuration not chosen, command cancelled`);
		return; 
	}

    const name = await Quickly.ask('What is the name of this new process?');

    if (!name) { 
		logger.warn(`Command: ${cs.cds.deployment.createProcess} Name not chosen, command cancelled`);
        return; 
    } 

    const excludeOptions = [CdsSolutions.ProcessType.BusinessRule, CdsSolutions.ProcessType.Flow];
    const processType = await Quickly.pickEnum<CdsSolutions.ProcessType>(CdsSolutions.ProcessType, "Which category?", excludeOptions);

    if (!processType) { 
        return; 
    } 
    
    const category = CdsSolutions.CodeMappings.getProcessTypeCode(processType);

    let globalAction = false;
    if (processType === CdsSolutions.ProcessType.Action) {
        globalAction = await Quickly.pickBoolean("Do you want this action to be global?", "Yes", "No");
    } else if (processType === CdsSolutions.ProcessType.BusinessRule) {
        globalAction = true;
    }

    let primaryentity = "";
    if (!globalAction) {
        const entityComponent = await Quickly.pickCdsSolutionComponent(config, undefined, CdsSolutions.SolutionComponent.Entity, "Which entity?");
        
        if (!entityComponent) { 
            logger.warn(`Command: ${cs.cds.deployment.createProcess} Entity not chosen, command cancelled`);
            return; 
        } 

        primaryentity = entityComponent.component.LogicalName;
    }

    let mode = 0;
    if (processType === CdsSolutions.ProcessType.Workflow) {
        if (!await Quickly.pickBoolean("Run this process in the background? (recommended)", "Yes", "No")) { 
            mode = 1; 
        }
    }

    let businessprocesstype = 0;
    let scope = 1;
    let xaml = "<?xml version=\"1.0\" encoding=\"utf-16\"?><Activity x:Class=\"XrmWorkflow00000000000000000000000000000000\" xmlns=\"http://schemas.microsoft.com/netfx/2009/xaml/activities\" xmlns:mva=\"clr-namespace:Microsoft.VisualBasic.Activities;assembly=System.Activities, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" xmlns:mxs=\"clr-namespace:Microsoft.Xrm.Sdk;assembly=Microsoft.Xrm.Sdk, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" xmlns:mxswa=\"clr-namespace:Microsoft.Xrm.Sdk.Workflow.Activities;assembly=Microsoft.Xrm.Sdk.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" xmlns:scg=\"clr-namespace:System.Collections.Generic;assembly=mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089\" xmlns:srs=\"clr-namespace:System.Runtime.Serialization;assembly=System.Runtime.Serialization, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089\" xmlns:this=\"clr-namespace:\" xmlns:x=\"http://schemas.microsoft.com/winfx/2006/xaml\"><x:Members><x:Property Name=\"InputEntities\" Type=\"InArgument(scg:IDictionary(x:String, mxs:Entity))\" /><x:Property Name=\"CreatedEntities\" Type=\"InArgument(scg:IDictionary(x:String, mxs:Entity))\" /></x:Members><this:XrmWorkflow00000000000000000000000000000000.InputEntities><InArgument x:TypeArguments=\"scg:IDictionary(x:String, mxs:Entity)\" /></this:XrmWorkflow00000000000000000000000000000000.InputEntities><this:XrmWorkflow00000000000000000000000000000000.CreatedEntities><InArgument x:TypeArguments=\"scg:IDictionary(x:String, mxs:Entity)\" /></this:XrmWorkflow00000000000000000000000000000000.CreatedEntities><mva:VisualBasic.Settings>Assembly references and imported namespaces for internal implementation</mva:VisualBasic.Settings><mxswa:Workflow /></Activity>";
    if (processType === CdsSolutions.ProcessType.BusinessProcessFlow) {
        if (!await Quickly.pickBoolean("Do you want this to run in Classic mode?", "Yes", "No")) {
            businessprocesstype = 1;
        }

        scope = 4; // set this global
        xaml = `<?xml version=\"1.0\" encoding=\"utf-16\"?><Activity x:Class=\"XrmWorkflow00000000000000000000000000000000\" xmlns=\"http://schemas.microsoft.com/netfx/2009/xaml/activities\" xmlns:mcwo=\"clr-namespace:Microsoft.Crm.Workflow.ObjectModel;assembly=Microsoft.Crm, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" xmlns:mva=\"clr-namespace:Microsoft.VisualBasic.Activities;assembly=System.Activities, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" xmlns:mxs=\"clr-namespace:Microsoft.Xrm.Sdk;assembly=Microsoft.Xrm.Sdk, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" xmlns:mxswa=\"clr-namespace:Microsoft.Xrm.Sdk.Workflow.Activities;assembly=Microsoft.Xrm.Sdk.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" xmlns:scg=\"clr-namespace:System.Collections.Generic;assembly=mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089\" xmlns:sco=\"clr-namespace:System.Collections.ObjectModel;assembly=mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089\" xmlns:srs=\"clr-namespace:System.Runtime.Serialization;assembly=System.Runtime.Serialization, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089\" xmlns:this=\"clr-namespace:\" xmlns:x=\"http://schemas.microsoft.com/winfx/2006/xaml\"><x:Members><x:Property Name=\"InputEntities\" Type=\"InArgument(scg:IDictionary(x:String, mxs:Entity))\" /><x:Property Name=\"CreatedEntities\" Type=\"InArgument(scg:IDictionary(x:String, mxs:Entity))\" /></x:Members><this:XrmWorkflow00000000000000000000000000000000.InputEntities><InArgument x:TypeArguments=\"scg:IDictionary(x:String, mxs:Entity)\" /></this:XrmWorkflow00000000000000000000000000000000.InputEntities><this:XrmWorkflow00000000000000000000000000000000.CreatedEntities><InArgument x:TypeArguments=\"scg:IDictionary(x:String, mxs:Entity)\" /></this:XrmWorkflow00000000000000000000000000000000.CreatedEntities><mva:VisualBasic.Settings>Assembly references and imported namespaces for internal implementation</mva:VisualBasic.Settings><mxswa:Workflow><mxswa:ActivityReference AssemblyQualifiedName=\"Microsoft.Crm.Workflow.Activities.EntityComposite, Microsoft.Crm.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" DisplayName=\"EntityStep1: ${primaryentity}\"><mxswa:ActivityReference.Properties><sco:Collection x:TypeArguments=\"Variable\" x:Key=\"Variables\" /><sco:Collection x:TypeArguments=\"Activity\" x:Key=\"Activities\"><mxswa:ActivityReference AssemblyQualifiedName=\"Microsoft.Crm.Workflow.Activities.PageComposite, Microsoft.Crm.Workflow, Version=9.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\" DisplayName=\"PageStep2: Enter a page name\"><mxswa:ActivityReference.Properties><sco:Collection x:TypeArguments=\"Variable\" x:Key=\"Variables\" /><sco:Collection x:TypeArguments=\"Activity\" x:Key=\"Activities\" /><sco:Collection x:TypeArguments=\"mcwo:StepLabel\" x:Key=\"StepLabels\"><mcwo:StepLabel Description=\"Enter a page name\" LabelId=\"4bae28b9-4841-47fd-961f-55a1a58d5984\" LanguageCode=\"1033\" /></sco:Collection><x:String x:Key=\"StageId\">956e80e2-0dcc-426a-a25e-06c9d77e1200</x:String><x:Null x:Key=\"StageCategory\" /><x:Null x:Key=\"NextStageId\" /><x:String x:Key=\"PageLayoutId\">4bae28b9-4841-47fd-961f-55a1a58d5984</x:String></mxswa:ActivityReference.Properties></mxswa:ActivityReference></sco:Collection><x:Null x:Key=\"RelationshipName\" /><x:Null x:Key=\"AttributeName\" /><x:Boolean x:Key=\"IsClosedLoop\">False</x:Boolean></mxswa:ActivityReference.Properties></mxswa:ActivityReference></mxswa:Workflow></Activity>`;
    }

    const api = new ApiRepository(config);

    // everything except process flow supports templates
    if (processType !== CdsSolutions.ProcessType.BusinessProcessFlow) {
        const processTemplates = await api.retrieveProcessTemplates(processType, primaryentity, solutionid);

        if (processTemplates && processTemplates.length > 0) {
            const templateOptions = processTemplates.map(i => new QuickPickOption(i.name, undefined, undefined, i));
            const fromTemplate = await Quickly.pickBoolean("Start from existing template? (no will create a blank process)", "Yes", "No");
        
            if (fromTemplate) {
                const templateSelection = await Quickly.pick("Which template?", ...templateOptions);
        
                if (!templateSelection) { 
                    logger.warn(`Command: ${cs.cds.deployment.createProcess} Template not chosen, command cancelled`);
                    return; 
                } 

                logger.log(`Command: ${cs.cds.deployment.createProcess} Creating process from template ${templateSelection.context.workflowid}`);
                const newProcess = await api.createProcessFromTemplate(templateSelection.context.workflowid, name)
                    .then(async response => {
                        if (solutionid) {
                            const solution = await api.retrieveSolution(solutionid);
                            logger.log(`Command: ${cs.cds.deployment.createProcess} Adding process to solution ${solution.uniquename}`);

                            await api.addSolutionComponent(solution, response.workflowid, CdsSolutions.SolutionComponent.Workflow, undefined, false)
                                .catch(err => {
                                    logger.error(`Command: ${cs.cds.deployment.createProcess} Could not add process to ${solution.uniquename}`);
                                    Quickly.error(err.message);
                                });
                        }

                        return response;
                    })
                    .catch(err => {
                        logger.error(`Command: ${cs.cds.deployment.createProcess} Could not add process: ${err.message}`);
                        Quickly.error(`Errors occurred while adding process to ${config.orgName}: ${err.message}`);
                    });
        
                if (newProcess) {
                    return {
                        processType,
                        workflowid: newProcess.workflowid,
                        solutionid
                    };
                }

                // if we get here, something broke
                return undefined;
            }
        }
    }

    // here's the docs on creating a workflow entity type
    // // https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/workflow?view=dynamics-ce-odata-9
    const workflow = {
        runas: 1, // calling user
        type: 1, // this is a definition
        name,
        uniquename: name,
        category,
        primaryentity,
        mode,
        businessprocesstype,
        scope,
        xaml
    };

    const workflowid = await api.createProcess(workflow)
        .then(async newid => {
            if (solutionid) {
                const solution = await api.retrieveSolution(solutionid);
                logger.log(`Command: ${cs.cds.deployment.createProcess} Adding process to solution ${solution.uniquename}`);

                await api.addSolutionComponent(solution, newid, CdsSolutions.SolutionComponent.Workflow, undefined, false)
                    .catch(err => {
                        logger.error(`Command: ${cs.cds.deployment.createProcess} Could not add process to ${solution.uniquename}`);
                        Quickly.error(err.message);
                    });
            }
            
            return newid;
        })
        .catch(err => {
            logger.error(`Command: ${cs.cds.deployment.createProcess} Could not add process: ${err.message}`);
            Quickly.error(`Errors occurred while adding process to ${config.orgName}: ${err.message}`);
        });

    if (!workflowid) { return; } // we must have hit an error
    
    return {
        processType,
        workflowid,
        solutionid
    };
}