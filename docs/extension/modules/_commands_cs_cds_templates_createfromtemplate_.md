[cds-for-code](../README.md) › [Globals](../globals.md) › ["commands/cs.cds.templates.createFromTemplate"](_commands_cs_cds_templates_createfromtemplate_.md)

# External module: "commands/cs.cds.templates.createFromTemplate"

## Index

### Variables

* [vscode](_commands_cs_cds_templates_createfromtemplate_.md#vscode)

### Functions

* [run](_commands_cs_cds_templates_createfromtemplate_.md#run)

## Variables

###  vscode

• **vscode**: *"vscode"*

Defined in src/commands/cs.cds.templates.createFromTemplate.ts:1

## Functions

###  run

▸ **run**(`destinationUri?`: Uri, `type?`: [TemplateType](../enums/_components_templates_types_.templatetype.md), `template?`: [TemplateItem](../classes/_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/commands/cs.cds.templates.createFromTemplate.ts:19

Command creates a folder or item in your workspace and restores a template from the catalog to it.
This command can be invoked by the Command Palette or in a folder context menu on the explorer view.

**`export`** command module

**`this`** TemplateManager instance that manages this command.

**Parameters:**

Name | Type |
------ | ------ |
`destinationUri?` | Uri |
`type?` | [TemplateType](../enums/_components_templates_types_.templatetype.md) |
`template?` | [TemplateItem](../classes/_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

void
