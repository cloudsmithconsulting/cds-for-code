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
 * This command can be invoked by the Command Palette and builds and tests a .Net Core project
 * @export run command function
 * @param {vscode.Uri} [file] that invoked the command
 * @returns void
 */
export default async function run(file?:vscode.Uri, logFile?:string): Promise<any> {
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

	file = file || await Quickly.pickWorkspaceFile(defaultFolder, "Choose a projet to test", undefined, false, this.projectFileTypes).then(r => vscode.Uri.file(r));
	if (!file) { 
		logger.warn(`Command: ${cs.cds.deployment.dotNetTest} Project file not chosen, command cancelled`);
		return; 
	}

	if (!logFile) {
		if ((await Quickly.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
			logFile = path.join(ExtensionContext.Instance.globalStoragePath, `/logs/test-${path.basename(file.path)}-${Utilities.String.dateAsFilename()}`);		}
	}

	return TerminalManager.showTerminal(path.parse(file.fsPath).dir)
		.then(async terminal => { 
			return await terminal.run(new TerminalCommand(`dotnet test "${file.fsPath}"`))
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