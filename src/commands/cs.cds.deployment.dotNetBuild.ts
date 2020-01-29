import * as vscode from 'vscode';
import * as FileSystem from '../core/io/FileSystem';
import * as path from 'path';
import * as cs from '../cs';
import Quickly from '../core/Quickly';
import TerminalManager, { TerminalCommand } from '../components/Terminal/SecureTerminal';
import ExtensionContext from '../core/ExtensionContext';
import { Utilities } from '../core/Utilities';
import logger from '../core/framework/Logger';

/**
 * This command can be invoked by the Explorer file viewer and builds a .Net Core project
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
const incrementBuild = (build:string) => {
	const parts = build.split(".");
	
	if (parts.length < 4) {
		for (let i = parts.length; i <= 4; i++) {
			parts.push(i < 4 ? "0" : "1"); 
		}
	} else {
		parts[3] = (parseInt(parts[3]) + 1).toString();
	}

	return parts.join(".");
};

export default async function run(file?:vscode.Uri, updateVersionBuild:boolean = true, logFile?:string): Promise<any> {
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
	let defaultFolder = workspaceFolder ? workspaceFolder.uri : undefined;

	if (file) {
		if (FileSystem.stats(file.fsPath).isDirectory()) {
			defaultFolder = file;
			file = undefined;
		} else {
			// If we didn't specify a project file, return.
			if (!this.fileIsProject(file)) { file = undefined; } 
		}
	}

	file = file || await Quickly.pickWorkspaceFile(defaultFolder, "Choose a projet to build", undefined, false, this.projectFileTypes).then(r => vscode.Uri.file(r));
	if (!file) { 
		logger.warn(`Command: ${cs.cds.deployment.dotNetBuild} Project file not chosen, command cancelled`);
		return; 
	}

	if (updateVersionBuild) {
		await this.updateVersionNumber(file, incrementBuild);
	}

	if (!logFile || logFile !== "!") {
		if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
			//context.globalStoragePath, `/logs/build-
			logFile = path.join(ExtensionContext.Instance.globalStoragePath, `/logs/build-${path.basename(file.path)}-${Utilities.String.dateAsFilename()}`);
		}
	}

	if (logFile && logFile === "!") { logFile = undefined; }

	return TerminalManager.showTerminal(path.parse(file.fsPath).dir)
		.then(async terminal => { 
			return await terminal.run(new TerminalCommand(`dotnet build "${file.fsPath}"`))
				.then(async tc => {
					if (logFile) {
						const folder = path.dirname(logFile);

						if (!FileSystem.exists(folder)) {
							FileSystem.makeFolderSync(folder);
						}

						FileSystem.writeFileSync(logFile, tc.output);

						await vscode.workspace.openTextDocument(logFile)
							.then(d => vscode.window.showTextDocument(d));	
					}
				});                      
		});
}