[cds-for-code](../README.md) › [Globals](../globals.md) › ["commands/cs.cds.templates.importTemplate"](_commands_cs_cds_templates_importtemplate_.md)

# External module: "commands/cs.cds.templates.importTemplate"

## Index

### Variables

* [vscode](_commands_cs_cds_templates_importtemplate_.md#vscode)

### Functions

* [run](_commands_cs_cds_templates_importtemplate_.md#run)

## Variables

###  vscode

• **vscode**: *"vscode"*

Defined in src/commands/cs.cds.templates.importTemplate.ts:1

## Functions

###  run

▸ **run**(`sourceUri`: Uri): *Promise‹void›*

Defined in src/commands/cs.cds.templates.importTemplate.ts:16

Command exports a template from your workspace into a .zip archive for re-import later.
This command can be invoked by the Command Palette or in a folder context menu on the template view.

**`export`** command module

**`this`** TemplateManager instance that manages this command.

**Parameters:**

Name | Type |
------ | ------ |
`sourceUri` | Uri |

**Returns:** *Promise‹void›*

void
