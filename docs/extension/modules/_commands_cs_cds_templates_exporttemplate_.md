[cds-for-code](../README.md) › [Globals](../globals.md) › ["commands/cs.cds.templates.exportTemplate"](_commands_cs_cds_templates_exporttemplate_.md)

# External module: "commands/cs.cds.templates.exportTemplate"

## Index

### Variables

* [vscode](_commands_cs_cds_templates_exporttemplate_.md#vscode)

### Functions

* [run](_commands_cs_cds_templates_exporttemplate_.md#run)

## Variables

###  vscode

• **vscode**: *"vscode"*

Defined in src/commands/cs.cds.templates.exportTemplate.ts:1

## Functions

###  run

▸ **run**(`template`: [TemplateItem](../classes/_components_templates_types_.templateitem.md), `destinationUri`: Uri): *Promise‹void›*

Defined in src/commands/cs.cds.templates.exportTemplate.ts:20

Command exports a template from your workspace into a .zip archive for re-import later.
This command can be invoked by the Command Palette or in a folder context menu on the template view.

**`export`** command module

**`this`** TemplateManager instance that manages this command.

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](../classes/_components_templates_types_.templateitem.md) |
`destinationUri` | Uri |

**Returns:** *Promise‹void›*

void
