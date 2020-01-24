import * as vscode from 'vscode';
import logger from '../framework/Logger';

export async function forEach<T>(array: T[], callback: (item: T, index?: number, array?: T[]) => Promise<void>) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}