import * as vscode from 'vscode';
import * as cs from '../../cs';
import * as FileSystem from '../../core/io/FileSystem';
import IContributor from '../../core/CommandBuilder';
import Xml from '../../core/io/Xml';
import dotNetBuildFromExplorer from "../../commands/cs.dynamics.controls.explorer.dotNetBuild";
import dotNetTestFromExplorer from "../../commands/cs.dynamics.controls.explorer.dotNetTest";
import dotNetBuild from "../../commands/cs.dynamics.deployment.dotNetBuild";
import dotNetTest  from "../../commands/cs.dynamics.deployment.dotNetTest";

export default class VisualStudioProjectCommands implements IContributor {
    contribute(context: vscode.ExtensionContext, config: vscode.WorkspaceConfiguration) {
        // now wire a command into the context
        context.subscriptions.push(
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.dotNetBuild, dotNetBuildFromExplorer.bind(VisualStudioProjectCommands)),
			vscode.commands.registerCommand(cs.dynamics.controls.explorer.dotNetTest, dotNetTestFromExplorer.bind(VisualStudioProjectCommands)),
            vscode.commands.registerCommand(cs.dynamics.deployment.dotNetBuild, dotNetBuild.bind(VisualStudioProjectCommands)),
            vscode.commands.registerCommand(cs.dynamics.deployment.dotNetTest, dotNetTest.bind(VisualStudioProjectCommands)));
    }

    static projectFileTypes:string[] = [".csproj", ".vbproj"];

    static fileIsProject(file:vscode.Uri):boolean {
        let fileIsProject = false;

        this.projectFileTypes.forEach(t => { if (file.path.endsWith(t)) { fileIsProject = true; } });   

        return fileIsProject;
    }

    static async updateVersionNumber(file: vscode.Uri, incrementBuild: (build: string) => string) {
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

                propertyGroup.AssemblyVersion = { _: incrementBuild(value) };
            }

            if (!propertyGroup.FileVersion) {
                propertyGroup.FileVersion = { _: "1.0.0.0" };
            }
            else {
                let value = propertyGroup.FileVersion[0];

                propertyGroup.FileVersion = { _: incrementBuild(value) };
            }

            FileSystem.writeFileSync(file.fsPath, await Xml.createXml(projectFileXml));
        }
    }
}
