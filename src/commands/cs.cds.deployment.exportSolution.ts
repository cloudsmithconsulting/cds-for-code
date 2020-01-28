import * as cs from "../cs";
import * as path from 'path';
import * as vscode from 'vscode';
import * as FileSystem from '../core/io/FileSystem';
import { CdsWebApi } from "../api/cds-webapi/CdsWebApi";
import Quickly, { QuickPickOption } from "../core/Quickly";
import ExtensionContext from "../core/ExtensionContext";
import logger from "../core/framework/Logger";
import ApiRepository from "../repositories/apiRepository";

export type ExportSolutionOptions = {
    SolutionName: string,
    Managed: boolean,
    TargetVersion?: string,
    ExportAutoNumberingSettings?: boolean,
    ExportCalendarSettings?: boolean,
    ExportCustomizationSettings?: boolean,
    ExportEmailTrackingSettings?: boolean,
    ExportGeneralSettings?: boolean,
    ExportMarketingSettings?: boolean,
    ExportOutlookSynchronizationSettings?: boolean,
    ExportRelationshipRoles?: boolean,
    ExportIsvConfig?: boolean,
    ExportSales?: boolean,
    ExportExternalApplications?: boolean
};

/**
 * This command can be invoked by the by either the file explorer view or the Dynamics TreeView
 * and can compare two copies of a web resource.
 * @export run command function
 * @param {vscode.Uri} [defaultUri] that invoked the command
 * @returns void
 */
export default async function run(config?: CdsWebApi.Config, solution?: any, solutionFile?: vscode.Uri, options?: ExportSolutionOptions) {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.deployment.exportSolution} Organization not chosen, command cancelled`);
		return; 
	}

    config.timeout = 120 * 1000;
    const api = new ApiRepository(config);

    solution = solution || await Quickly.pickCdsSolution(config, "Choose a solution to export", true);
	if (!solution) { 
		logger.warn(`Command: ${cs.cds.deployment.exportSolution} Solution not chosen, command cancelled`);
		return; 
	}

    if (!options) {
        options = {
            SolutionName: solution.uniquename,
            Managed: (await Quickly.pick(`Export ${solution.uniquename} as Managed or Unmanaged?`, 'Managed', 'Unmanaged')).label === 'Managed'
            //TargetVersion: await Quickly.ask(`What is the target version for ${solution.uniquename}?`, undefined, solution.version)
        };

        options = await pickExportOptions(options);
    }
    
    if (!solutionFile) {
        const folder = await Quickly.pickAnyFolder(vscode.workspace?.workspaceFolders[0]?.uri, false, 'Export folder');

        solutionFile = vscode.Uri.file(path.join((<vscode.Uri>folder).fsPath, `${solution.uniquename}_${solution.version}${options.Managed ? '_Managed' : ''}.zip`));
    }

    logger.info(`Command: ${cs.cds.deployment.exportSolution} Exporting ${options.SolutionName} to ${solutionFile.fsPath}`);
    
    const result = await api.exportSolution(options);

    FileSystem.writeFileSync(solutionFile.fsPath, result);

    await Quickly.inform(`Solution ${solution.uniquename} export complete`, undefined, 'Open file location', () => FileSystem.openFolderInExplorer(path.dirname(solutionFile.fsPath)));

    return solutionFile;
}

async function pickExportOptions(options: ExportSolutionOptions): Promise<ExportSolutionOptions> {
    const items: QuickPickOption[] = [
        new QuickPickOption('AutoNumber settings', undefined, undefined, 'ExportAutoNumberingSettings'),
        new QuickPickOption('Calendar settings', undefined, undefined, 'ExportCalendarSettings'),
        new QuickPickOption('Customization settings', undefined, undefined, 'ExportCustomizationSettings'),
        new QuickPickOption('Email tracking settings', undefined, undefined, 'ExportEmailTrackingSettings'),
        new QuickPickOption('General settings', undefined, undefined, 'ExportGeneralSettings'),
        new QuickPickOption('Marketing settings', undefined, undefined, 'ExportMarketingSettings'),
        new QuickPickOption('Outlook synchronization settings', undefined, undefined, 'ExportOutlookSynchronizationSettings'),
        new QuickPickOption('Relationship roles', undefined, undefined, 'ExportRelationshipRoles'),
        new QuickPickOption('Ribbon & site map', undefined, undefined, 'ExportIsvConfig'),
        new QuickPickOption('Sales settings', undefined, undefined, 'ExportSales'),
        new QuickPickOption('External applications', undefined, undefined, 'ExportExternalApplications'),
    ];

    const choices = await Quickly.pickAny('What additional items should be exported?', ...items);

    choices.forEach(c => options[c.context] = true);

    return options;
}