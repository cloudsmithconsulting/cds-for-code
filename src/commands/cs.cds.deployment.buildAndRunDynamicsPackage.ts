import * as vscode from 'vscode';
import * as FileSystem from '../core/io/FileSystem';
import * as path from 'path';
import * as cs from '../cs';
import Quickly from '../core/Quickly';
import logger from '../core/framework/Logger';
import VisualStudioProjectCommands from '../components/DotNetCore/DotNetProjectManager';
import TerminalManager, { TerminalCommand } from '../components/Terminal/SecureTerminal';
import ExtensionConfiguration from '../core/ExtensionConfiguration';
import ExtensionContext from '../core/ExtensionContext';
import { Utilities } from '../core/Utilities';

export default async function run(this: VisualStudioProjectCommands, file?:vscode.Uri, runPackage?: boolean): Promise<any> {
	const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0 ? vscode.workspace.workspaceFolders[0] : null;
	let defaultFolder = workspaceFolder ? workspaceFolder.uri : undefined;

	if (file) {
		if (FileSystem.stats(file.fsPath).isDirectory()) {
			defaultFolder = file;
			file = undefined;
		} else {
			// If we didn't specify a project file, return.
			if (!VisualStudioProjectCommands.fileIsProject(file)) { file = undefined; } 
		}
	}

	file = file || await Quickly.pickWorkspaceFile(defaultFolder, "Choose a project to build", undefined, false, VisualStudioProjectCommands.projectFileTypes).then(r => vscode.Uri.file(r));
	if (!file) { 
		logger.warn(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Project file not chosen, command cancelled`);
		return; 
	}

	const output = await TerminalManager.showTerminal(path.parse(file.fsPath).dir)
        .then(async terminal => { 
            return await terminal.run(new TerminalCommand(`dotnet build "${file.fsPath}"`))
                .then(tc => tc.output);                      
        });

    logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Build for ${file.fsPath} complete`);

    const match = /\>\s(.+).dll/gi.exec(output);
    const buildOutputLocation = match[0].replace(/\>\s/, '');
    const classLibName = path.basename(buildOutputLocation);

    const outputPath = path.dirname(buildOutputLocation).replace(/bin(.+)/, "bin\\PackageDeployment");

    if (!FileSystem.exists(outputPath)) {
        FileSystem.makeFolderSync(outputPath);
    }

    if (FileSystem.exists(buildOutputLocation)) {
        FileSystem.copyItem(buildOutputLocation, path.join(outputPath, classLibName));
        logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Copied file ${classLibName}`);
    }

    const configName = classLibName.replace(/\.dll/, '.dll.config');
    const configLocation = `${path.dirname(buildOutputLocation)}\\${configName}`;

    if (FileSystem.exists(configLocation)) {
        FileSystem.copyItem(configLocation, path.join(outputPath, configName));
        logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Copied file ${configName}`);
    }

    const debugSymbolName = classLibName.replace(/\.dll/, '.pdb');
    const debugSymbolLocation = `${path.dirname(buildOutputLocation)}\\${debugSymbolName}`;

    if (FileSystem.exists(debugSymbolLocation)) {
        FileSystem.copyItem(debugSymbolLocation, path.join(outputPath, debugSymbolName));
        logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Copied file ${debugSymbolName}`);
    }

    const packageFolderName = "PkgFolder";
    const packageFolderLocation = path.join(path.dirname(buildOutputLocation), packageFolderName);

    if (FileSystem.exists(packageFolderLocation)) {
        FileSystem.copyFolder(packageFolderLocation, path.join(outputPath, packageFolderName));
        logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Copied ${packageFolderName}`);
    }

    const sdkInstallPath = ExtensionConfiguration.getConfigurationValueOrDefault<string>(cs.cds.configuration.tools.sdkInstallPath, path.join(ExtensionContext.Instance.globalStoragePath, "Sdk"));
    const packageDeploymentRoot = !Utilities.$Object.isNullOrEmpty(sdkInstallPath) ? path.join(sdkInstallPath, 'PackageDeployment') : null;
    
    FileSystem.copyFolder(packageDeploymentRoot, outputPath);
    logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Copied ${packageDeploymentRoot} files`);

    logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Created package in ${outputPath}`);

    if (runPackage === undefined) {
        runPackage = runPackage || await Quickly.pickBoolean("Do you want to run this package?", "Yes", "No");
    }

    if (runPackage) {
        const packageDeployerLocation = path.join(outputPath, "PackageDeployer.exe");
        await TerminalManager.showTerminal(outputPath)
            .then(async terminal => { 
                return await terminal.run(new TerminalCommand(`& ${packageDeployerLocation}`))
                    .then(tc => tc.output);                      
            });
        logger.log(`Command: ${cs.cds.deployment.buildAndRunDynamicsPackage} Executed ${packageDeployerLocation}`);
    }
}