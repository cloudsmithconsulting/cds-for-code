import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../cs';
import ApiHelper from "./ApiHelper";
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import CdsRepository from '../api/CdsRepository';

export default class DataApiRepository extends CdsRepository {
    async getLookupValues(collection: string, count: number = 25): Promise<any[]> {
        if (count < 1) { count = 1; }
        if (count > 5000) { count = 5000; }

        const entityData = await this.webapi.retrieveEntity(collection);        
        const values = await this.webapi.retrieveMultipleRequest({ collection, top: count, select: [ entityData.PrimaryIdAttribute, entityData.PrimaryNameAttribute ] });

        let returnArray = [];
        
        for (let i = 0; i < count; i++) { 
            returnArray.push({ id: values[i][entityData.PrimaryIdAttribute], name: values[i][entityData.PrimaryNameAttribute], collection });
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
                const account = accounts[Math.round(Math.random() * accounts.length)];
                returnArray.push({ id: account.accountid, entityType: "Account", name: account.name });
            } else if (randomSeed <= 20) {
                const contact = contacts[Math.round(Math.random() * contacts.length)];
                returnArray.push({ id: contact.contactid, entityType: "Contact", name: contact.name });
            } else {
                const user = users[Math.round(Math.random() * users.length)];
                returnArray.push({ id: user.systemuserid, entityType: "SystemUser", name: user.fullname });
            }
        }

        return returnArray;
    }

    async getSystemUsers(count: number = 25): Promise<any[]> { 
        if (count < 1) { count = 1; }
        if (count > 5000) { count = 5000; }

        const users = await this.webapi.retrieveAllRequest({ collection: "systemusers", select: [ "systemuserid", "fullname" ], top: count });

        let returnArray = [];
        
        for (let i = 0; i < count; i++) {
            const user = users[Math.round(Math.random() * users.length)];
            returnArray.push({ id: user.systemuserid, collection: "systemuesrs", name: user.fullname });
        }

        return returnArray;
    }

    async getSampleCustomers(count: number = 25): Promise<any[]> {
        if (count < 1) { count = 1; }
        if (count > 5000) { count = 5000; }
        
        const accounts = await this.webapi.retrieveAllRequest({ collection: "accounts", select: [ "accountid", "name" ], top: count });
        const contacts = await this.webapi.retrieveAllRequest({ collection: "contacts", select: [ "contactid", "name" ], top: count });

        let returnArray = [];
        
        for (let i = 0; i < count; i++) {
            if (Math.round(Math.random()) === 0) {
                const account = accounts[Math.round(Math.random() * accounts.length)];
                returnArray.push({ id: account.accountid, collection: "accounts", name: account.name });
            } else {
                const contact = contacts[Math.round(Math.random() * contacts.length)];
                returnArray.push({ id: contact.contactid, collection: "contacts", name: contact.name });
            }
        }

        return returnArray;
    }
}