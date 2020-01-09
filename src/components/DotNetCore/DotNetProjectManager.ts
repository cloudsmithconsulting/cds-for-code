import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as FileSystem from '../../core/io/FileSystem';
import Xml from '../../core/io/Xml';
import dotNetBuild from "../../commands/cs.cds.deployment.dotNetBuild";
import dotNetTest  from "../../commands/cs.cds.deployment.dotNetTest";
import command from '../../core/Command';
import logger from '../../core/framework/Logger';

export default class VisualStudioProjectCommands {
    @command(cs.cds.controls.explorer.dotNetBuild, "Run dotnet build from File Explorer")
    static async dotNetBuildFromExplorer(file?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.deployment.dotNetBuild, file);
    }

    @command(cs.cds.deployment.dotNetBuild, "Run dotnet build")
    static async dotNetBuild(file?: vscode.Uri, updateVersionBuild: boolean = true, logFile?: string): Promise<any> {
        return await dotNetBuild.apply(this, [file, updateVersionBuild, logFile]);
    }

    @command(cs.cds.controls.explorer.dotNetTest, "Run dotnet test from File Explorer")
    static async dotNetTestFromFileExplorer(file?: vscode.Uri) {
        return await vscode.commands.executeCommand(cs.cds.deployment.dotNetTest, file);
    }

    @command(cs.cds.deployment.dotNetTest, "Run dotnet test")
    static async dotNetTest(file?: vscode.Uri, logFile?: string): Promise<any> {
        return await dotNetTest.apply(this, [file, logFile]);
    }

    static projectFileTypes:string[] = [".csproj", ".vbproj"];

    static fileIsProject(file:vscode.Uri):boolean {
        let fileIsProject = false;

        if (this.projectFileTypes) {
            this.projectFileTypes.forEach(t => { if (file.path.endsWith(t)) { fileIsProject = true; } });   
        }

        return fileIsProject;
    }

    static async updateVersionNumber(file: vscode.Uri, increment: (build: string) => string) {
        const projectFileXml = await Xml.parseFile(file.fsPath);

        if (projectFileXml
            && projectFileXml.Project
            && projectFileXml.Project.PropertyGroup
            && projectFileXml.Project.PropertyGroup.length > 0) {
                
            let propertyGroup = projectFileXml.Project.PropertyGroup[0];

            if (!propertyGroup.AssemblyVersion) {
                propertyGroup.AssemblyVersion = { _: "1.0.0.0" };
            } else {
                let value = propertyGroup.AssemblyVersion[0];

                propertyGroup.AssemblyVersion = { _: increment(value) };
            }

            if (!propertyGroup.FileVersion) {
                propertyGroup.FileVersion = { _: "1.0.0.0" };
            }
            else {
                let value = propertyGroup.FileVersion[0];

                propertyGroup.FileVersion = { _: increment(value) };
            }

            logger.log(`Updating version number in ${file.fsPath}`);            
            FileSystem.writeFileSync(file.fsPath, await Xml.createXml(projectFileXml));
        }
    }
}
