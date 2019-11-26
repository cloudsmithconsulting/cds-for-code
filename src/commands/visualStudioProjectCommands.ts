import * as vscode from 'vscode';
import * as cs from '../cs';
import IBuildCommands from '../core/CommandBuilder';
import * as FileSystem from '../core/io/FileSystem';
import QuickPicker from '../core/QuickPicker';
import DynamicsTerminal, { TerminalCommand } from '../views/DynamicsTerminal';
import * as path from 'path';
import XmlParser from '../core/XmlParser';

export default class VisualStudioProjectCommands implements IBuildCommands {
    public workspaceConfiguration:vscode.WorkspaceConfiguration;

    public static projectFileTypes:string[] = [".csproj", ".vbproj"];

    public static fileIsProject(file:vscode.Uri):boolean {
        let fileIsProject = false;

        VisualStudioProjectCommands.projectFileTypes.forEach(t => { if (file.path.endsWith(t)) { fileIsProject = true; } });   

        return fileIsProject;
    }

    public buildCommands(context: vscode.ExtensionContext, wconfig: vscode.WorkspaceConfiguration) {
        this.workspaceConfiguration = wconfig;

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

        // now wire a command into the context
        context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.dotNetBuild, async (file?:vscode.Uri, ...arg2:any) => {
				vscode.commands.executeCommand(cs.dynamics.deployment.dotNetBuild, file);
            }),
            
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.dotNetTest, async (file?:vscode.Uri, ...arg2:any) => {
				vscode.commands.executeCommand(cs.dynamics.deployment.dotNetTest, file);
			}),

            vscode.commands.registerCommand(cs.dynamics.deployment.dotNetBuild, async (file?:vscode.Uri, updateVersionBuild:boolean = true, logFile?:string):Promise<any> => { 
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

                file = file || await QuickPicker.pickWorkspaceFile(defaultFolder, "Choose a projet to build", undefined, false, VisualStudioProjectCommands.projectFileTypes).then(r => vscode.Uri.file(r));
                if (!file) { return; }

                if (updateVersionBuild) {
                    const projectFileXml = await XmlParser.parseFile(file.fsPath);

                    if (projectFileXml 
                        && projectFileXml.Project
                        && projectFileXml.Project.PropertyGroup
                        && projectFileXml.Project.PropertyGroup.length > 0) {

                        let propertyGroup = projectFileXml.Project.PropertyGroup[0];

                        if (!propertyGroup.AssemblyVersion) {
                            propertyGroup.AssemblyVersion = { _:"1.0.0.0" };
                        } else {
                            let  value = propertyGroup.AssemblyVersion[0];
                            propertyGroup.AssemblyVersion = { _:incrementBuild(value) };
                        }

                        if (!propertyGroup.FileVersion) {
                            propertyGroup.FileVersion = { _:"1.0.0.0" };
                        } else {
                            let  value = propertyGroup.FileVersion[0];
                            propertyGroup.FileVersion = { _:incrementBuild(value) };
                        }

                        FileSystem.writeFileSync(file.fsPath, await XmlParser.createXml(projectFileXml));
                    }
                }

                if (!logFile || logFile !== "!") {
                    if ((await QuickPicker.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
                        let dateString = new Date().toISOString();
                        dateString = dateString.substr(0, dateString.length - 5);
                        dateString = dateString.replace("T","-").replace(":","").replace(":", "");

                        logFile = path.join(context.globalStoragePath, `/logs/build-${path.basename(file.path)}-${dateString}.log`); 
                    }
                }

                if (logFile && logFile === "!") { logFile = undefined; }

                return DynamicsTerminal.showTerminal(path.parse(file.fsPath).dir)
                    .then(async terminal => { 
                        return await terminal.run(new TerminalCommand(`dotnet build "${file.fsPath}"`))
                            .then(tc => {
                                if (logFile) {
                                    const folder = path.dirname(logFile);

                                    if (!FileSystem.exists(folder)) {
                                        FileSystem.makeFolderSync(folder);
                                    }

                                    FileSystem.writeFileSync(logFile, tc.output);

                                    vscode.workspace.openTextDocument(logFile)
                                        .then(d => vscode.window.showTextDocument(d));	
                                }
                            });                      
                    });
            }),

            vscode.commands.registerCommand(cs.dynamics.deployment.dotNetTest, async (file?:vscode.Uri, logFile?:string):Promise<any> => { 
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

                file = file || await QuickPicker.pickWorkspaceFile(defaultFolder, "Choose a projet to test", undefined, false, VisualStudioProjectCommands.projectFileTypes).then(r => vscode.Uri.file(r));
                if (!file) { return; }

                if (!logFile) {
                    if ((await QuickPicker.pickBoolean("Do you want to review the log for this operation?", "Yes", "No"))) {
                        let dateString = new Date().toISOString();
                        dateString = dateString.substr(0, dateString.length - 5);
                        dateString = dateString.replace("T","-").replace(":","").replace(":", "");

                        logFile = path.join(context.globalStoragePath, `/logs/test-${path.basename(file.path)}-${dateString}.log`); 
                    }
                }

                return DynamicsTerminal.showTerminal(path.parse(file.fsPath).dir)
                    .then(async terminal => { 
                        return await terminal.run(new TerminalCommand(`dotnet test "${file.fsPath}"`))
                            .then(tc => {
                                if (logFile) {
                                    const folder = path.dirname(logFile);

                                    if (!FileSystem.exists(folder)) {
                                        FileSystem.makeFolderSync(folder);
                                    }

                                    FileSystem.writeFileSync(logFile, tc.output);

                                    vscode.workspace.openTextDocument(logFile)
                                        .then(d => vscode.window.showTextDocument(d));	
                                }
                            });                      
                    });
            })
        );
    }
}
