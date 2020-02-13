import * as faker from 'faker';
import * as cs from "../cs";
import * as vscode from 'vscode';
import { CdsWebApi } from '../api/cds-webapi/CdsWebApi';
import ApiRepository from '../repositories/apiRepository';
import logger from "../core/framework/Logger";
import Quickly from '../core/Quickly';
import { Utilities } from '../core/Utilities';
import ExtensionContext from '../core/ExtensionContext';
import { CdsSolutions } from '../api/CdsSolutions';

export default async function run(config?: CdsWebApi.Config, entity?: any) : Promise<any> {
	config = config || await Quickly.pickCdsOrganization(ExtensionContext.Instance, "Choose a CDS Organization", true);
	if (!config) { 
		logger.warn(`Command: ${cs.cds.data.getFaker} Organization not chosen, command cancelled`);
		return; 
	}

    if (!entity) { 
		const pickResponse = await Quickly.pickCdsSolutionComponent(config, undefined, CdsSolutions.SolutionComponent.Entity, "Choose an entity to fake");
		if (!pickResponse) { 
			logger.warn(`Command: ${cs.cds.data.getFaker} Entity not chosen, command cancelled`);
			return; 
		}

		entity = pickResponse.component;
	}
}