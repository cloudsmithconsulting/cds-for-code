---
id: "_commands_cs_cds_templates_viewcompiledtemplate_"
title: "commands/cs.cds.templates.viewCompiledTemplate"
sidebar_label: "commands/cs.cds.templates.viewCompiledTemplate"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.templates.viewCompiledTemplate"](_commands_cs_cds_templates_viewcompiledtemplate_.md)

## Index

### Variables

* [vscode](_commands_cs_cds_templates_viewcompiledtemplate_.md#vscode)

### Functions

* [run](_commands_cs_cds_templates_viewcompiledtemplate_.md#run)

## Variables

###  vscode

• **vscode**: *"vscode"*

Defined in src/commands/cs.cds.templates.viewCompiledTemplate.ts:1

## Functions

###  run

▸ **run**(`this`: [TemplateManager](../classes/_components_templates_templatemanager_.templatemanager.md), `template`: [TemplateItem](../classes/_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/commands/cs.cds.templates.viewCompiledTemplate.ts:16

Command exports a template from your workspace into a .zip archive for re-import later.
This command can be invoked by the Command Palette or in a folder context menu on the template view.

**`export`** command module

**`this`** TemplateManager instance that manages this command.

**Parameters:**

Name | Type |
------ | ------ |
`this` | [TemplateManager](../classes/_components_templates_templatemanager_.templatemanager.md) |
`template` | [TemplateItem](../classes/_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

void
