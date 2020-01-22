![Cloudsmith Consulting LLC](https://cloudsmithstatics.azureedge.net/web/cloudsmith-notagline-450x103.png "Cloudsmith Consulting")

# Welcome to the CloudSmith CDS For Code Extension

This extension is designed to help developers with a simple development loop for Microsoft&trade; Common Data Service (CDS) using Visual Studio Code.  Many developers do not have access to a full Visual Studio license in order to use Microsoft&trade; CDS Development Toolkit.  This extension is designed to get you started.

Release version: 0.8.8

[![Board Status](https://dev.azure.com/cloudsmith-consulting/c20ca92d-a9a9-45af-8bdb-da3ce0803b59/dcd00a1d-957f-4b19-bcdc-f2951aed4c88/_apis/work/boardbadge/dca6f347-6bc4-4c07-831c-bda22d8068c3)](https://dev.azure.com/cloudsmith-consulting/c20ca92d-a9a9-45af-8bdb-da3ce0803b59/_boards/board/t/dcd00a1d-957f-4b19-bcdc-f2951aed4c88/Microsoft.RequirementCategory/)

---

## Table of Contents

- [Welcome to the CloudSmith CDS For Code Extension](#welcome-to-the-cloudsmith-cds-for-code-extension)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
    - [Adding a connection](#adding-a-connection)
  - [Features](#features)
  - [Commands](#commands)
    - [Commands and Descriptions](#commands-and-descriptions)
    - [These commands can be executed directly through the VSCode command palette](#these-commands-can-be-executed-directly-through-the-vscode-command-palette)
  - [Settings](#settings)
    - [Settings and Descriptions](#settings-and-descriptions)
    - [These settings are editable inside the VSCode Settings Editor](#these-settings-are-editable-inside-the-vscode-settings-editor)
  - [Known Issues](#known-issues)
  - [Change Log](#change-log)
  - [Contributors](#contributors)
  - [Feedback](#feedback)

---

## Prerequisites

Before you start you must install the Microsoft.Xrm.Data.PowerShell module. To do this run PowerShell **as Administrator** and then execute the following command:

``` PowerShell
Install-Package Microsoft.Xrm.Data.PowerShell
```

The remaining dependencies will be downloaded on the first activation of the CDS for Code extension.

---

## Getting started

### Adding a connection

This extension allows you to connect to CDS/Dynamics instances in the following ways:

- Microsoft&trade; Common Data Service Online
- Dynamics On-Premise (8.0+)
- Azure AD integrated into a Dynamice On-Premise installation

![gif](https://raw.githubusercontent.com/cloudsmithconsulting/cds-for-code/master/docs/images/create-new-cds-connection.gif)

---

## Features

This VS Code extension will help you perform these tasks in your CDS development loop.

- [X] Connect to CDS & On-Premise environments (8.0+)
- [X] View and inspect metadata on each server connection
- [X] Package and deploy CDS solutions from server into version control
- [X] Package and deploy CDS solution from version control into server
- [X] Generate entities using CrmSvcUtil
- [ ] Customize the CrmSvcUtil experience (coming soon)
- [X] Author web resources with VSCode
- [X] Put CDS solution assets into version control
- [x] Build and deploy plugins using VSCode
- [x] Deploy assets into solution using pre-made templates

For a more comprehensive walkthrough of features you can check out our How To articles on the following topics:

- [Working with Solutions](docs/howto/Solutions.md)
- [Working with Web Resources](docs/howto/WebResources.md)
- [Working with Plugins](docs/howto/Plugins.md)
- [Working with Code Generation and SvcUtil](docs/howto/CodeGeneration.md)
- [Working with Templates for code and projects](docs/howto/Templates.md)
- [Overview of Security Features](docs/howto/SecurityFeatures.md)

---

## Commands

### Commands and Descriptions

|Command|Description|
|:--|:--|
|Add component to a CDS Solution|Adds a selected component to your connected CDS solution|
|Compare a local web resource file to a version deployed on a CDS instance|Compares your local copy of a web resource to the one currently deployed in your CDS solution|
|Create or Edit a connection to the Common Data Service|Add a connection to a CDS instance|
|Create a web resource in your workspace or on a CDS instance|Create a web resource in your local workspace|
|Create a process on a CDS instance|Create a process on a CDS instance|
|Build a .Net Core project in the current workspace|Builds your .NET Core project inside the CDS for Code Secure Terminal|
|Build and Test a .Net Core project in the current workspace|Builds and runs tests for your .NET Core project inside the CDS for Code Secure Terminal|
|Deploy a Web Resource to CDS|Deploy a local web resource to a connected CDS instance|
|Publish solution changes on a CDS environment|Executes the Publish Changes command against a connected CDS instance|
|Register or update a plugin assembly|Registers a plugin step for you plugin assembly on a connected CDS instance|
|Remove a component from a CDS Solution|Removes a selected component from your connected CDS solution|
|Remove remembered locations where CDS solutions are stored in this workspace|Removes the mappings from connected CDS solutions to local workspace folders|
|Download a Web Resource from CDS|Download a copy of a web resource from a connected CDS solution to you local workspace|
|Create or update where CDS solutions are stored in this workspace|Create or update mappings from connected CDS solutions to local folders and workspaces|
|Clear the CDS for Code terminal|Clear the screen of the CDS for Code Secure Terminal|
|Open the CDS for Code terminal|Open or view the CDS for Code Secure Terminal|
|Download required PowerShell scripts from GitHub|Download the supporting PowerShell scripts necessary for functionality in the CDS for Code extension|
|Download & unpack solution from a registered CDS environment|Get the contents of a solutions from a connected CDS instance and put it inside of a local workspace for editing|
|Pack & deploy solution to a registerd CDS environment|Packages up local changes to a CDS solution and deploys them to a connected CDS instance|
|Configure entity code generation for use with CrmSvcUtil.exe|Configure options for code generation based on the [CloudSmith SvcUtil Extensions](https://github.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/tree/master/src/CloudSmith.Dynamics365.CrmSvcUtil)|
|Generate entity code from metadata on a registered CDS environment|Generates entity code using the CDS for Code Secure Terminal with a call to SvcUtil|
|Create new items or projects from a template|Create a new item or project from an existing template within the template catalog|
|Delete a template from the catalog|Deletes a template from the template catalog|
|Open template catalog in code editor|Opens the template catalog inside of the VSCode editor|
|Export template from the template catalog|Exports a template from the template catalog for sharing|
|Import template into the template catalog|Imports a template into the template catalog|
|Open template folder in explorer|Opens the template catalog folder in Windows Explorer|
|Save workspace items as a template in the template catalog|Save a file or project in the current workspace as a template to the template catalog|

### These commands can be executed directly through the VSCode command palette

![gif](https://raw.githubusercontent.com/cloudsmithconsulting/cds-for-code/master/docs/images/cds-for-code-command-palette.gif)

---

## Settings

### Settings and Descriptions

|Setting|Description|Default|
|:--|:--|:--|
|cs.cds.configuration.web.usePowerAppsUi|Use the PowerApps Maker UX where possible|true|
|cs.cds.configuration.tools.sdkInstallPath|The full path to the root of the Dynamics 365/CDS SDK installation on your computer|C:\Deploy\Tools|
|cs.cds.configuration.tools.updateSource|The URL where supporting scripts are located|[https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master/](https://raw.githubusercontent.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/master)|
|cs.cds.configuration.tools.updateChannel|The update channel to use when downloading new versions of this extension|production|
|cs.cds.configuration.iconThemes.selectedTheme|The icon set to use in the CDS Explorer view|default|
|cs.cds.configuration.explorer.showDefaultSolution|Show the Default Solution in the CDS Explorer view|false|
|cs.cds.configuration.explorer.showWelcomeExperience|Show the welcome experience for this extension|true|
|cs.cds.configuration.templates.placeholders|List of built in placeholders, in key-value string pairs|default|
|cs.cds.configuration.templates.placeholderRegExp|Regular expression for detecting placeholders (e.g. \"#{([\\s\\S]+?)}\"). The first capture group dictates the placeholder key|#{([\\s\\S]+?)}|
|cs.cds.configuration.templates.templatesDirectory|Filesystem path that stores templates||
|cs.cds.configuration.templates.treeViewGroupPreference|Preference for grouping templates in the Template Explorer|Publisher|
|cs.cds.configuration.templates.usePlaceholders|Look for and replace placeholders in template (e.g. #{author})|true|

### These settings are editable inside the VSCode Settings Editor

![gif](https://raw.githubusercontent.com/cloudsmithconsulting/cds-for-code/master/docs/images/cds-for-code-settings-editor.gif)

---

## Known Issues

We are currently on the insider preview program of CDS for Code. This build may come with instabilities, and will improve over the duration of the preview program. We thank our participants and hope they will submit their feedback to us.

---

## Change Log

You can stay up to date with the latest changes by checking out [our change log located here](ChangeLog.md).

---

## Contributors

All of this could not be possible without community projects and our preview program participants. You can read more about [our contributors here](/docs/Contributors.md)

---

## Feedback

- Create a [new GitHub issue](https://github.com/cloudsmithconsulting/cds-for-code/issues/new)
- Insiders can drop us a line in [CDS For Code Early Preview Teams Channel](https://teams.microsoft.com/l/channel/19%3aeb4e28a080cc4330b10effdef32b0ca0%40thread.skype/General?groupId=da1048fb-6db5-4fcf-8a87-27ceb8ac7b68&tenantId=b7d98656-670d-4ae0-b419-b03097edb814)
- Insiders can file a bug in [CloudSmith Azure DevOps Dashboard](http://cslink.co/cds-for-code-dashboard)
