import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../cs';
import ApiHelper from "./ApiHelper";
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import CdsRepository from '../api/CdsRepository';

export default class DataApiRepository extends CdsRepository {
    async getSampleCustomers(count: number = 25) : Promise<any> {
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