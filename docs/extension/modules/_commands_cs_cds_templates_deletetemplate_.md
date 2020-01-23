[cds-for-code](../README.md) › [Globals](../globals.md) › ["commands/cs.cds.templates.deleteTemplate"](_commands_cs_cds_templates_deletetemplate_.md)

# External module: "commands/cs.cds.templates.deleteTemplate"

## Index

### Functions

* [run](_commands_cs_cds_templates_deletetemplate_.md#run)

## Functions

###  run

▸ **run**(`template`: [TemplateItem](../classes/_components_templates_types_.templateitem.md)): *Promise‹void›*

Defined in src/commands/cs.cds.templates.deleteTemplate.ts:15

Main command to delete an existing template.
This command can be invoked by the Command Palette or in a folder context menu on the explorer view.

**`export`** run command function

**`this`** TemplateManager instance that manages this command.

**Parameters:**

Name | Type |
------ | ------ |
`template` | [TemplateItem](../classes/_components_templates_types_.templateitem.md) |

**Returns:** *Promise‹void›*

void
