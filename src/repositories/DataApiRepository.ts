import CdsRepository from '../api/CdsRepository';
import { CWA } from '../api/cds-webapi/CWA';
import moment = require('moment');
import { Utilities } from '../core/Utilities';

const defaultTimeout: number = 30;
const defaultCheckInterval: number = 2500;

export default class DataApiRepository extends CdsRepository {
    async getLookupValues(collection: string, count: number = 25): Promise<any[]> {
        if (count < 1) { count = 1; }
        if (count > 5000) { count = 5000; }

        const entityData = await this.webapi.retrieveEntity(collection);        
        const values = await this.webapi.retrieveMultipleRequest({ collection: entityData.EntitySetName, top: count, select: [ entityData.PrimaryIdAttribute, entityData.PrimaryNameAttribute ] });

        let returnArray = [];
        
        if (values.value.length < count) {
            count = values.value.length;
        }

        for (let i = 0; i < count; i++) { 
            returnArray.push({ id: values.value[i][entityData.PrimaryIdAttribute], name: values.value[i][entityData.PrimaryNameAttribute], collection: entityData.EntitySetName });
        }

        return returnArray;
    }

    async getPartyListMembers(count: number = 25): Promise<any[]> {
        if (count < 1) { count = 1; }
        if (count > 5000) { count = 5000; }

        const accounts = await this.webapi.retrieveAllRequest({ collection: "accounts", select: [ "accountid", "name" ], top: count });
        const contacts = await this.webapi.retrieveAllRequest({ collection: "contacts", select: [ "contactid", "name" ], top: count });
        const users = await this.webapi.retrieveAllRequest({ collection: "systemusers", select: [ "systemuserid", "fullname" ], top: count });

        let returnArray = [];

        for (let i = 0; i < count; i++) {
            const randomSeed = Math.round(Math.random() * 30);

            if (randomSeed <= 10) {
                const account = accounts.value[Math.floor(Math.random() * accounts.value.length)];
                returnArray.push({ id: account.accountid, entityType: "Account", name: account.name });
            } else if (randomSeed <= 20) {
                const contact = contacts.value[Math.floor(Math.random() * contacts.value.length)];
                returnArray.push({ id: contact.contactid, entityType: "Contact", name: contact.name });
            } else {
                const user = users.value[Math.floor(Math.random() * users.value.length)];
                returnArray.push({ id: user.systemuserid, entityType: "SystemUser", name: user.fullname });
            }
        }

        return returnArray;
    }

    async getSystemUsers(count: number = 25): Promise<any[]> { 
        if (count < 1) { count = 1; }
        if (count > 5000) { count = 5000; }

        const users = await this.webapi.retrieveAllRequest({ 
            collection: "systemusers", 
            select: [ "systemuserid", "fullname" ], 
            filter: "fullname ne 'INTEGRATION' and (accessmode eq 0 or accessmode eq 1)",
            top: count 
        });

        let returnArray = [];

        for (let i = 0; i < count; i++) {
            const user = users.value[Math.floor(Math.random() * users.value.length)];
            returnArray.push({ id: user.systemuserid, collection: "systemuesrs", name: user.fullname });
        }

        return returnArray;
    }

    async getSampleCustomers(count: number = 25): Promise<any[]> {
        if (count < 1) { count = 1; }
        if (count > 5000) { count = 5000; }
        
        const accounts = await this.webapi.retrieveAllRequest({ collection: "accounts", select: [ "accountid", "name" ], top: count });
        const contacts = await this.webapi.retrieveAllRequest({ collection: "contacts", select: [ "contactid", "fullname" ], top: count });

        let returnArray = [];
        
        for (let i = 0; i < count; i++) {
            if (Math.round(Math.random()) === 0) {
                const account = accounts.value[Math.floor(Math.random() * accounts.value.length)];
                returnArray.push({ id: account.accountid, collection: "accounts", name: account.name });
            } else {
                const contact = contacts.value[Math.floor(Math.random() * contacts.value.length)];
                returnArray.push({ id: contact.contactid, collection: "contacts", name: contact.fullname });
            }
        }

        return returnArray;
    }

    async createImportJob(importJob: any, importFile: any): Promise<string> {
        importJob = await this.webapi.create(importJob, "imports", CWA.Prefer.ReturnRepresentation);
        const importId = importJob.importid;

        importFile['importid@odata.bind'] = `imports(${importId})`;
        importFile = await this.webapi.create(importFile, "importfiles", CWA.Prefer.ReturnRepresentation);

        //return importId;
        return importId;
    }

    async parseImportJob(importId: string, timeout: number = defaultTimeout): Promise<any> {
        const startTime = moment.now();
        const endTime = startTime + (timeout * 1000);
        let asyncStatus = await this.webapi.executeBoundAction(importId, "imports", "Microsoft.Dynamics.CRM.ParseImport");

        while (asyncStatus?.statecode !== 3 || moment.now() < endTime) {
            asyncStatus = await this.webapi.retrieve(asyncStatus.asyncoperationid, "asyncoperations");

            await Utilities.Async.sleep(defaultCheckInterval);
        }

        return await this.webapi.retrieve(importId, "imports");
    }

    async transformImportJob(importId: string, timeout: number = defaultTimeout): Promise<any> {
        const startTime = moment.now();
        const endTime = startTime + (timeout * 1000);
        let asyncStatus = await this.webapi.executeUnboundAction("TransformImport", { ImportId: importId });

        while (asyncStatus?.statecode !== 3 || moment.now() < endTime) {
            asyncStatus = await this.webapi.retrieve(asyncStatus.asyncoperationid, "asyncoperations");

            await Utilities.Async.sleep(defaultCheckInterval);
        }

        return await this.webapi.retrieve(importId, "imports");
    }

    async importRecordsFromImportJob(importId: string, timeout: number = defaultTimeout): Promise<any> {
        const startTime = moment.now();
        const endTime = startTime + (timeout * 1000);
        let asyncStatus = await this.webapi.executeBoundAction(importId, "imports", "Microsoft.Dynamics.CRM.ImportRecordsImport");

        while (asyncStatus?.statecode !== 3 || moment.now() < endTime) {
            asyncStatus = await this.webapi.retrieve(asyncStatus.asyncoperationid, "asyncoperations");

            await Utilities.Async.sleep(defaultCheckInterval);
        }

        return await this.webapi.retrieve(importId, "imports");
    }

    async retrieveDataFromSavedQuery(entitySetName: string, savedQueryId: string): Promise<any> {
        return this.webapi.retrieveRequest({
            collection: entitySetName,
            savedQuery: savedQueryId
        })
        .then(response => response.value ? response.value : []);
    }

    async retrieveEntitySetData(entitySetName: string, select?: string[]) {
        return this.webapi.retrieveAllRequest({
            collection: entitySetName,
            select: select
        })
        .then(response => response.value ? response.value : []);
    }
}