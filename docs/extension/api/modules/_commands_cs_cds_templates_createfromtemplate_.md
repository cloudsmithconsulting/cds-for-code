---
id: "_commands_cs_cds_templates_createfromtemplate_"
title: "commands/cs.cds.templates.createFromTemplate"
sidebar_label: "commands/cs.cds.templates.createFromTemplate"
---

[cds-for-code](../index.md) › [Globals](../globals.md) › ["commands/cs.cds.templates.createFromTemplate"](_commands_cs_cds_templates_createfromtemplate_.md)

## Index

### Functions

* [run](_commands_cs_cds_templates_createfromtemplate_.md#run)

## Functions

###  run

▸ **run**(`this`: [TemplateManager](../classes/_components_templates_templatemanager_.templatemanager.md), `destinationUri?`: Uri, `type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `template?`: [TemplateItem](../classes/_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/commands/cs.cds.templates.createFromTemplate.ts:20

Command creates a folder or item in your workspace and restores a template from the catalog to it.
This command can be invoked by the Command Palette or in a folder context menu on the explorer view.

**`export`** command module

**`this`** TemplateManager instance that manages this command.

**Parameters:**

Name | Type |
------ | ------ |
`this` | [TemplateManager](../classes/_components_templates_templatemanager_.templatemanager.md) |
`destinationUri?` | Uri |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |
`template?` | [TemplateItem](../classes/_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

void
