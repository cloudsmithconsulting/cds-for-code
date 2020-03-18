import * as vscode from 'vscode';
import * as cs from "../cs";
import * as FileSystem from "../core/io/FileSystem";
import * as path from 'path';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import logger from "../core/framework/Logger";
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from '../core/ExtensionContext';
import { CdsSolutions } from '../api/CdsSolutions';
import MetadataRepository from '../repositories/metadataRepository';
import DataApiRepository from '../repositories/DataApiRepository';
import Dictionary from '../core/types/Dictionary';
import DataGenerationManager from '../components/DataGeneration/DataGenerationManager';

const fieldDelimiters = new Map<number, string>([
	[ 1, `:` ],
	[ 2, `,` ],
	[ 3, `<tab>` ],
	[ 4, `;` ]
]);

const stringDelimiters = new Map<number, string>([
	[ 1, `"` ],
	[ 2, `<none>` ],
	[ 3, `'` ]
]);

function getKey(map: Map<unknown,unknown>, val: unknown) {
	return [...map].find(([key, value]) => val === value)[0];
}

export default async function run(this: DataGenerationManager, config: CdsWebApi.Config, entity: any, fileUri: vscode.Uri): Promise<string> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.data.insertCsvData} Organization not chosen, command cancelled`);
		return; 
	}

    if (!entity) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, undefined, CdsSolutions.SolutionComponent.Entity, "Choose an entity to map CSV data to");

		if (!pickResponse) { 
			logger.warn(`Command: ${cs.cds.data.insertCsvData} Entity not chosen, command cancelled`);
			return; 
		}

		entity = pickResponse.component;
	}

	fileUri = fileUri || vscode.Uri.file(await Quickly.pickWorkspaceFile(fileUri, "Select a CSV file to import", undefined, false, [ ".csv" ]));	
	if (!fileUri && !FileSystem.exists(fileUri.fsPath)) {
		logger.warn(`Command: ${cs.cds.data.insertCsvData} File not chosen, command cancelled`);
		return; 
	}

	const hasHeaders = await Quickly.pickBoolean("Does this file have headers?", "Yes", "No");
	const fieldDelimiter = (await Quickly.pick("What is the field delimiter", ...Array.from(fieldDelimiters.values()))).label;
	const stringDelimiter = (await Quickly.pick("What is the string delimiter?", ...Array.from(stringDelimiters.values()))).label;
	const enableduplicatedetection = await Quickly.pickBoolean("Enable duplicate detection during import?", "Yes", "No");
	const importjob = {
		isimport: true,
		modecode: 0,
		name: `${path.basename(fileUri.fsPath)} CSV import`
	};

	const importFile = {
		content: FileSystem.readFileSync(fileUri.fsPath),
		datadelimitercode: getKey(stringDelimiters, stringDelimiter),
		enableduplicatedetection: enableduplicatedetection,
		fielddelimitercode: getKey(fieldDelimiters, fieldDelimiter),
		filetypecode: 0,
		isfirstrowheader: hasHeaders,
		processcode: 1,
		targetentityname: entity.LogicalName,
		upsertmodecode: 1
	};

	const dataRepository = new DataApiRepository(config);
	const returnFile = await dataRepository.createImportJob(importjob, importFile);

	return returnFile.importfileid;
}