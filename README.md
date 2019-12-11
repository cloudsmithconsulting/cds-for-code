# ![Cloudsmith Consulting LLC](https://cloudsmithstatics.azureedge.net/web/cloudsmith-notagline-450x103.png "Cloudsmith Consulting")<br> Welcome to the Dynamics 365 Development tools for VSCode
This extension is designed to help developers with a simple development loop for Microsoft Dynamics 365 using Visual Studio Code.  Many developers do not have access to a full Visual Studio license in order to use Microsoft's Dynamics CRM Development Toolkit.  This sample solution is designed to get you started.

Release version: 0.81

---

## Features

The VsCode addin handles these tasks in your development loop.

- [X] Connect to Dynamics 365 servers (8.0+)
- [X] View and inspect metadata on each server connection
- [X] Package and deploy Dynamics solutions from server into version control
- [X] Package and deploy Dynamics solution from version control into server
- [X] Generate entities using CrmSvcUtil
- [ ] Customize the CrmSvcUtil experience (coming soon)
- [X] Author web resources with VsCode
- [X] Put Dynamics solution assets into version control
- [x] Build and deploy plugins using VsCode
- [x] Deploy assets into solution using pre-made templates

---

## Getting started

Get started by adding a CDS connection and exporting a solution to your workspace.

![gif](\resources\images\Instructions-gif.gif)

---

## Configuration

This extension contributes the following settings:

- `cs.dynamics.configuration.tools.sdkInstallPath`: The full path to the root of the CRM SDK installation on your computer.
- `cs.dynamics.configuration.tools.updateSource`: The URL where supporting scripts are located.
- `cs.dynamics.configuration.tools.updateChannel`: The update channel to use.
- `cs.dynamics.configuration.iconThemes.selectedTheme`: The icon set to use in explorer views.
- `cs.dynamics.configuration.explorer.showDefaultSolution`: Show the Default Solution in the Dynamics explorer pane.
- `cs.dynamics.configuration.explorer.showWelcomeExperience`: Show the welcome experience for Dynamics when you open a new workspace.
- `cs.dynamics.configuration.templates.placeholders`: List of built in placeholders, in key-value string pairs.
- `cs.dynamics.configuration.templates.placeholderRegExp`: Regular expression for detecting placeholders (e.g. \"#{([\\s\\S]+?)}\").  The first capture group dictates the placeholder key.
- `cs.dynamics.configuration.templates.templatesDirectory`: Filesystem path that stores template folders.
- `cs.dynamics.configuration.templates.treeViewGroupPreference`: Preference for grouping template items in the Template Explorer.
- `cs.dynamics.configuration.templates.usePlaceholders`: Look for and replace placeholders in template (e.g. #{author})

---

## Settings

- `Show Default Solution`: Shows the Default Solution in the Dynamics explorer pane.
- `Show Welcome Experience`: Shows the welcome experience for Dynamics when you open a new workspace.
- `Selected Theme`: Allows you to select a theme of your choice.
- `PlaceHolder Reg Exp`: Regular expression for detecting placeholders (e.g. "#{([\s\S]+?)}"). The first capture group dictates the placeholder key.
- `PlaceHolders`: List of built in placeholders, in key-value string pairs.
- `Template Directory`: Filesystem path that stores template folders.
- `Tree View Group Preference`: Preference for grouping template items in the Template Explorer.
- `Use PlaceHolder`: Look for and replace placeholders in template (e.g. #{author}).
- `Sdk Install Path`: The full path to the root of the CRM SDK installation on your computer.
- `Update Channel`: The update channel to use.
- `Update Source`: The URL where supporting scripts are located.

---

## Known issues

We are currently on the insider preview stage of CDS for Code. This build may come with instabilities, and will improve over the duration of the preview program. We thank our participants and hope they will submit their feedback to us.

---

## Feedback

- Drop us a line in [CDS For Code Early Preview Teams Channel](https://teams.microsoft.com/l/channel/19%3aeb4e28a080cc4330b10effdef32b0ca0%40thread.skype/General?groupId=da1048fb-6db5-4fcf-8a87-27ceb8ac7b68&tenantId=b7d98656-670d-4ae0-b419-b03097edb814)
- File a bug in [CloudSmith Azure DevOps](https://dev.azure.com/cloudsmith-consulting/CloudSmith)
