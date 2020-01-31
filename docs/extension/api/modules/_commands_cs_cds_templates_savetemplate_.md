---
id: "_commands_cs_cds_templates_savetemplate_"
title: "commands/cs.cds.templates.saveTemplate"
sidebar_label: "commands/cs.cds.templates.saveTemplate"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.templates.saveTemplate"](_commands_cs_cds_templates_savetemplate_.md)

## Index

### Variables

* [vscode](_commands_cs_cds_templates_savetemplate_.md#vscode)

### Functions

* [run](_commands_cs_cds_templates_savetemplate_.md#run)

## Variables

###  vscode

• **vscode**: *"vscode"*

Defined in src/commands/cs.cds.templates.saveTemplate.ts:1

## Functions

###  run

▸ **run**(`this`: [TemplateManager](../classes/_components_templates_templatemanager_.templatemanager.md), `templateUri`: Uri, `type`: [TemplateType](../enums/_components_templates_types_.templatetype.md)): *Promise‹void›*

Defined in src/commands/cs.cds.templates.saveTemplate.ts:19

This command saves a folder or item as a template.
This command can be invoked by the Command Palette or in a folder context menu on the explorer view.

**`export`** run command function

**`this`** TemplateManager instance that manages this command.

**Parameters:**

Name | Type |
------ | ------ |
`this` | [TemplateManager](../classes/_components_templates_templatemanager_.templatemanager.md) |
`templateUri` | Uri |
`type` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |

**Returns:** *Promise‹void›*

void
