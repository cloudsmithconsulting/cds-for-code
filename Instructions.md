# ![Cloudsmith Consulting LLC](https://cloudsmithstatics.azureedge.net/web/cloudsmith-notagline-450x103.png "Cloudsmith Consulting")<br> Welcome to the Dynamics 365 Development tools for VSCode
This extension is designed to help developers with a simple development loop for Microsoft Dynamics 365 using Visual Studio Code.  Many developers do not have access to a full Visual Studio license in order to use Microsoft's Dynamics CRM Development Toolkit.  This sample solution is designed to get you started.

---
Release version: 0.81

# Instructions for Microsoft Dynamics 365

1. Add a new connection.
2. Under Connections Settings, Click on "Dyanmics 365 Online".
3. Under Web API Version, click on "Auto".
4. Under Name, Enter name of your server.
5. Under Server URL, enter the url of your Microsoft Dynamics 365.
6. Under Username, enter your username.
7. Under Password, enter your password.
8. Under Domain, enter the name of your domain.
9. Click on Save connection.

![Gif](C:\Dev\cds-for-code\resources\images\Instructions-gif)
-----------------------------------------------------------------------------------------------------------






-----------------------------------------------------------------------------------------------------------

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



> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

-----------------------------------------------------------------------------------------------------------
# Scenarios supported

Supported on Visual Studio Code for Windows.

# Configuration

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `cs.dynamics.configuration.tools.sdkInstallPath`: The full path to the root of the CRM SDK installation on your computer.
* `cs.dynamics.configuration.tools.updateSource`: The URL where supporting scripts are located.
* `cs.dynamics.configuration.tools.updateChannel`: The update channel to use.
* `cs.dynamics.configuration.iconThemes.selectedTheme`: The icon set to use in explorer views.
* `cs.dynamics.configuration.explorer.showDefaultSolution`: Show the Default Solution in the Dynamics explorer pane.
* `cs.dynamics.configuration.explorer.showWelcomeExperience`: Show the welcome experience for Dynamics when you open a new workspace.
* `cs.dynamics.configuration.templates.placeholders`: List of built in placeholders, in key-value string pairs.
* `cs.dynamics.configuration.templates.placeholderRegExp`: Regular expression for detecting placeholders (e.g. \"#{([\\s\\S]+?)}\").  The first capture group dictates the placeholder key.
* `cs.dynamics.configuration.templates.templatesDirectory`: Filesystem path that stores template folders.
* `cs.dynamics.configuration.templates.treeViewGroupPreference`: Preference for grouping template items in the Template Explorer.
* `cs.dynamics.configuration.templates.usePlaceholders`: Look for and replace placeholders in template (e.g. #{author})
-----------------------------------------------------------------------------------------------------------

# Settings

* `Show Default Solution`: Shows the Default Solution in the Dynamics explorer pane.
* `Show Welcome Experience`: Shows the welcome experience for Dynamics when you open a new workspace.
* `Selected Theme`: Allows you to select a theme of your choice.
* `PlaceHolder Reg Exp`: Regular expression for detecting placeholders (e.g. "#{([\s\S]+?)}"). The first capture group dictates the placeholder key.
* `PlaceHolders`: List of built in placeholders, in key-value string pairs.
* `Template Directory`: Filesystem path that stores template folders.
* `Tree View Group Preference`: Preference for grouping template items in the Template Explorer.
* `Use PlaceHolder`: Look for and replace placeholders in template (e.g. #{author}).
* `Sdk Install Path`: The full path to the root of the CRM SDK installation on your computer.
* `Update Channel`: The update channel to use.
* `Update Source`: The URL where supporting scripts are located.

-----------------------------------------------------------------------------------------------------------

# Known issues
Calling out known issues can help limit users opening duplicate issues against your extension.

# Feedback

-----------------------------------------------------------------------------------------------------------

