import * as vscode from 'vscode';
import * as cs from '../../cs';
import { TS } from 'typescript-linq/TS';
import ExtensionConfiguration from '../../config/ExtensionConfiguration';
import IWireUpCommands from '../../wireUpCommand';
import QuickPicker from '../../helpers/QuickPicker';
import Dictionary from '../../helpers/Dictionary';
import Utilities from '../../helpers/Utilities';

import createWebResource from "../../commands/cs.dynamics.deployment.createWebResource";
import compareWebResource from "../../commands/cs.dynamics.deployment.compareWebResource";
import packWebResource from "../../commands/cs.dynamics.deployment.packWebResource";
import unpackWebResource from "../../commands/cs.dynamics.deployment.unpackWebResource";

export default class WebResourceManager implements IWireUpCommands {
    /**
     * local copy of workspace configuration to maintain consistency between calls
     */
    private static context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        WebResourceManager.context = context;
    }

    get context():vscode.ExtensionContext { return WebResourceManager.context; }

    wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void {
        // now wire a command into the context
        context.subscriptions.push(
            vscode.commands.registerCommand(cs.dynamics.deployment.createWebResource, createWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.compareWebResource, compareWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.packWebResource, packWebResource.bind(this)),
            vscode.commands.registerCommand(cs.dynamics.deployment.unpackWebResource, unpackWebResource.bind(this))
        );
    }
}

export enum WebResourceFileType {
    Html = ".html",
    Css = ".css",
    JScript = ".js",
    Json = ".json",
    Data = ".xml",
    Png = ".png",
    Jpeg = ".jpg",
    Gif = ".gif",
    Silverlight = ".xap",
    Xsl = ".xsl",
    Icon = ".ico",
    Vector = ".svg",
    String = ".resx"
}