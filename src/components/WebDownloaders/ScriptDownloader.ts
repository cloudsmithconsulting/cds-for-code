import * as vscode from 'vscode';
import * as path from 'path';
import * as cs from '../../cs';
import * as crypto from 'crypto';
import ExtensionConfiguration from '../../core/ExtensionConfiguration';
import TerminalManager, { TerminalCommand } from '../Terminal/SecureTerminal';
import { Utilities } from '../../core/Utilities';
import GlobalState from '../Configuration/GlobalState';
import TemplateManager from "../Templates/TemplateManager";
import * as FileSystem from "../../core/io/FileSystem";
import ExtensionContext from '../../core/ExtensionContext';
import Quickly from '../../core/Quickly';
import command from '../../core/Command';
import Logger from '../../core/framework/Logger';
import { extensionActivate } from '../../core/Extension';
import logger from '../../core/framework/Logger';
import download from '../../core/http/nodeJsFileDownloader';

export default class ScriptDownloader {
	@extensionActivate(cs.cds.extension.productId)
    async activate(context: vscode.ExtensionContext, config?:vscode.WorkspaceConfiguration) {
        setTimeout(async () => await ScriptDownloader.runScriptCheck(), 10000);
    }

	@command(cs.cds.extension.downloadRequiredScripts, "Download required PowerShell scripts and templates")
    static async runScriptCheck() {
		if (!FileSystem.exists(ExtensionContext.Instance.globalStoragePath)) {
			FileSystem.makeFolderSync(ExtensionContext.Instance.globalStoragePath);
		}

		const version: string = vscode.extensions.getExtension(cs.cds.extension.productId).packageJSON.version;
		const remoteFolderPath: string = `${Utilities.String.withTrailingSlash(ExtensionConfiguration.getConfigurationValueOrDefault(cs.cds.configuration.tools.updateSource, "https://cloudsmithprodstorage.blob.core.windows.net/cds-for-code/"))}version-${version}/dist/`;
		const updateChannel: string = ExtensionConfiguration.getConfigurationValueOrDefault(cs.cds.configuration.tools.updateChannel, "stable");
		const manifestFile = path.join(ExtensionContext.Instance.globalStoragePath, "manifest.json");
		const alreadyHasManifest: boolean = FileSystem.exists(manifestFile);
		
		if (!alreadyHasManifest) {
			await download(remoteFolderPath + 'manifest.json', manifestFile);
		}

		const manifest = JSON.parse(FileSystem.readFileSync(manifestFile));

		Logger.log(`Command: ${cs.cds.extension.downloadRequiredScripts} Manifest ${manifestFile} loaded for v${version}`);
		let proceed: boolean;

		if (!alreadyHasManifest && manifest.version !== version) {
			logger.warn(`Command: ${cs.cds.extension.downloadRequiredScripts} Manifest version ${manifest.version} does not match product version ${version}`);

			await Quickly.warn(
				`The remote scripts needed to support CDS for Code are version '${manifest.version}', which does not match the product version '${version}'.  Would you like to download scripts from this source anyway?`, 
				undefined, 
				'Yes', 
				() => proceed = true,
				'No',
				() => proceed = false);

				if (!proceed) {
					logger.error(`Command: ${cs.cds.extension.downloadRequiredScripts} cancelled by user`);

					return;
				}
		}

		if (!alreadyHasManifest && manifest.channel !== updateChannel) {
			logger.warn(`Command: ${cs.cds.extension.downloadRequiredScripts} Manifest update channel ${manifest.channel} does not match configured update channel ${updateChannel}`);

			await Quickly.warn(
				`The remote scripts needed to support CDS for Code are from the update channel '${manifest.channel}', which does not match the configured vlaue '${updateChannel}'.  Would you like to download scripts from this source anyway?`,
				undefined, 
				'Yes', 
				() => proceed = true,
				'No',
				() => proceed = false);

				if (!proceed) {
					logger.error(`Command: ${cs.cds.extension.downloadRequiredScripts} cancelled by user`);

					return;
				}
		}

		const currentVersion = GlobalState.Instance.PowerShellScriptVersion;
		const systemTemplatesFolder = await TemplateManager.getTemplatesFolder(true);
		let filesDownloaded: number = 0;

		Utilities.Async.forEach(manifest.files, async (f: any) => {
			const remoteFilePath = `${remoteFolderPath}${Utilities.String.withTrailingSlash(f.path)}${f.filename}`;
			const localFolderPath = path.join(ExtensionContext.Instance.globalStoragePath, f.path);
			const localFilePath = path.join(localFolderPath, f.filename);
			const alreadyHasFile = FileSystem.exists(localFilePath);

			if (!alreadyHasFile) {
				FileSystem.makeFolderSync(localFolderPath);
			}

			if (!alreadyHasFile || (!currentVersion || currentVersion !== version)) {
				Logger.info(`Command: ${cs.cds.extension.downloadRequiredScripts} Downloading ${remoteFilePath} (v${version})`);

				await download(remoteFilePath, localFilePath);
				filesDownloaded++;
			} else {
				Logger.log(`Command: ${cs.cds.extension.downloadRequiredScripts} File ${localFilePath} is current (v${currentVersion})`);
			}

			const hash = crypto.createHash('md5');
			hash.update(FileSystem.readFileSync(localFilePath, { encoding: null }));

			if (hash.digest('hex') !== f.hash && alreadyHasFile) {
				FileSystem.deleteItem(localFilePath);

				Logger.warn(`Command: ${cs.cds.extension.downloadRequiredScripts} MD5 hash did not match for ${localFilePath}, downloading file from known source`);
				await download(remoteFilePath, localFilePath);
				filesDownloaded++;
			}

			if (localFilePath.endsWith("Install-Sdk.ps1")) {
				await ScriptDownloader.installCdsSdk();
			}
	
			if (localFilePath.endsWith(".zip")) {
				let options: any;
				let subfolder = path.basename(localFilePath.replace(path.extname(localFilePath), ""));
		
				// Treat templates a little different from other .zip files as they need to be imported.
				if (f.path === "templates") {																	
					if (f.filename === "SystemTemplates.zip") {
						options = { zipFile: localFilePath, extractPath: systemTemplatesFolder, isTemplate: false };
					} else {
						options = { zipFile: localFilePath, isTemplate: true };
					}
				} else {
					options = { zipFile: localFilePath, extractPath: path.join(ExtensionContext.Instance.globalStoragePath, f.path, subfolder), isTemplate: false };
				}
		
				if (options) {
					await ScriptDownloader.unzipDownload(options);
				}
			}
		});

		GlobalState.Instance.PowerShellScriptVersion = version;

		if (filesDownloaded > 0) {
			await Quickly.inform(`Remote scripts needed to run CDS for Code have been updated to ${version}.  ${filesDownloaded} files were downloaded`);
		}
	}

	static async installCdsSdk(): Promise<TerminalCommand> {
		const sdkInstallPath = ExtensionConfiguration.getConfigurationValueOrDefault<string>(cs.cds.configuration.tools.sdkInstallPath, path.join(ExtensionContext.Instance.globalStoragePath, "Sdk"));

		if (!FileSystem.exists(sdkInstallPath) || !FileSystem.exists(path.join(sdkInstallPath, "CoreTools")) && FileSystem.exists(path.join(ExtensionContext.Instance.globalStoragePath, "/Scripts/Install-Sdk.ps1"))) {
			FileSystem.makeFolderSync(sdkInstallPath);
		
			Logger.warn(`Extension: SDK not detected in ${sdkInstallPath}, downloading and extracting automatically.`);

			return await TerminalManager.showTerminal(path.join(ExtensionContext.Instance.globalStoragePath, "/Scripts/"))
				.then(async terminal => {
					return await terminal.run(new TerminalCommand(`.\\Install-Sdk.ps1 `)
						.text(`-Path "${sdkInstallPath}" `));
				});
		}
	}

	private static async unzipDownload(options: any) {
		if (options) {
			if (options.extractPath) { FileSystem.makeFolderSync(options.extractPath); }

			if (options.isTemplate) {
				Logger.log(`Command: ${cs.cds.extension.downloadRequiredScripts} Importing template: ${options.zipFile}`);

				await vscode.commands.executeCommand(cs.cds.templates.importTemplate, vscode.Uri.file(options.zipFile));
			} else {
				Logger.log(`Command: ${cs.cds.extension.downloadRequiredScripts} Unzipping downloaded file: ${options.zipFile}`);

				await FileSystem.unzip(options.zipFile, options.extractPath);				
			}
		}
	}
}