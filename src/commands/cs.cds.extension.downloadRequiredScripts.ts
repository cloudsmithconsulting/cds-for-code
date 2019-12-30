import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../cs';
import fetch from 'node-fetch';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import { Utilities } from '../core/Utilities';
import GlobalState from '../components/Configuration/GlobalState';
import TemplateManager from "../components/Templates/TemplateManager";
import * as FileSystem from "../core/io/FileSystem";

export default async function run() {
    return this.runScriptCheck();
}
