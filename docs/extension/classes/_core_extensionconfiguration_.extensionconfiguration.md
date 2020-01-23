[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/ExtensionConfiguration"](../modules/_core_extensionconfiguration_.md) › [ExtensionConfiguration](_core_extensionconfiguration_.extensionconfiguration.md)

# Class: ExtensionConfiguration

## Hierarchy

* **ExtensionConfiguration**

## Index

### Properties

* [_configurations](_core_extensionconfiguration_.extensionconfiguration.md#static-private-_configurations)
* [_notifiers](_core_extensionconfiguration_.extensionconfiguration.md#static-private-_notifiers)

### Methods

* [getConfiguration](_core_extensionconfiguration_.extensionconfiguration.md#static-getconfiguration)
* [getConfigurationInfo](_core_extensionconfiguration_.extensionconfiguration.md#static-getconfigurationinfo)
* [getConfigurationValue](_core_extensionconfiguration_.extensionconfiguration.md#static-getconfigurationvalue)
* [getConfigurationValueOrDefault](_core_extensionconfiguration_.extensionconfiguration.md#static-getconfigurationvalueordefault)
* [notify](_core_extensionconfiguration_.extensionconfiguration.md#static-notify)
* [parseConfigurationString](_core_extensionconfiguration_.extensionconfiguration.md#static-private-parseconfigurationstring)
* [parseConfigurationValue](_core_extensionconfiguration_.extensionconfiguration.md#static-parseconfigurationvalue)
* [setConfigurationValue](_core_extensionconfiguration_.extensionconfiguration.md#static-setconfigurationvalue)
* [unnotify](_core_extensionconfiguration_.extensionconfiguration.md#static-unnotify)
* [updateConfiguration](_core_extensionconfiguration_.extensionconfiguration.md#static-updateconfiguration)

## Properties

### `Static` `Private` _configurations

▪ **_configurations**: *object*

Defined in src/core/ExtensionConfiguration.ts:4

#### Type declaration:

* \[ **key**: *string*\]: WorkspaceConfiguration

___

### `Static` `Private` _notifiers

▪ **_notifiers**: *object*

Defined in src/core/ExtensionConfiguration.ts:5

#### Type declaration:

* \[ **key**: *string*\]: function

▸ (`config`: WorkspaceConfiguration): *void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | WorkspaceConfiguration |

## Methods

### `Static` getConfiguration

▸ **getConfiguration**(`namespace`: string): *WorkspaceConfiguration*

Defined in src/core/ExtensionConfiguration.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`namespace` | string |

**Returns:** *WorkspaceConfiguration*

___

### `Static` getConfigurationInfo

▸ **getConfigurationInfo**<**T**>(...`config`: string[]): *object | undefined*

Defined in src/core/ExtensionConfiguration.ts:40

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`...config` | string[] |

**Returns:** *object | undefined*

___

### `Static` getConfigurationValue

▸ **getConfigurationValue**<**T**>(...`config`: string[]): *T | undefined*

Defined in src/core/ExtensionConfiguration.ts:54

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`...config` | string[] |

**Returns:** *T | undefined*

___

### `Static` getConfigurationValueOrDefault

▸ **getConfigurationValueOrDefault**<**T**>(`config`: string, `defaultValue`: T): *T | undefined*

Defined in src/core/ExtensionConfiguration.ts:82

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`config` | string |
`defaultValue` | T |

**Returns:** *T | undefined*

___

### `Static` notify

▸ **notify**(`namespace`: string, `notify?`: function): *void*

Defined in src/core/ExtensionConfiguration.ts:97

**Parameters:**

▪ **namespace**: *string*

▪`Optional`  **notify**: *function*

▸ (`config`: WorkspaceConfiguration): *void*

**Parameters:**

Name | Type |
------ | ------ |
`config` | WorkspaceConfiguration |

**Returns:** *void*

___

### `Static` `Private` parseConfigurationString

▸ **parseConfigurationString**(...`config`: string[]): *object*

Defined in src/core/ExtensionConfiguration.ts:109

**Parameters:**

Name | Type |
------ | ------ |
`...config` | string[] |

**Returns:** *object*

* **configKey**: *string*

* **namespace**: *string | undefined*

___

### `Static` parseConfigurationValue

▸ **parseConfigurationValue**<**T**>(`workspaceConfig`: WorkspaceConfiguration, ...`config`: string[]): *T*

Defined in src/core/ExtensionConfiguration.ts:91

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`workspaceConfig` | WorkspaceConfiguration |
`...config` | string[] |

**Returns:** *T*

___

### `Static` setConfigurationValue

▸ **setConfigurationValue**<**T**>(`config`: string, `value?`: T, `configurationTarget`: ConfigurationTarget): *Thenable‹void› | undefined*

Defined in src/core/ExtensionConfiguration.ts:68

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`config` | string | - |
`value?` | T | - |
`configurationTarget` | ConfigurationTarget | vscode.ConfigurationTarget.Global |

**Returns:** *Thenable‹void› | undefined*

___

### `Static` unnotify

▸ **unnotify**(`namespace`: string): *void*

Defined in src/core/ExtensionConfiguration.ts:103

**Parameters:**

Name | Type |
------ | ------ |
`namespace` | string |

**Returns:** *void*

___

### `Static` updateConfiguration

▸ **updateConfiguration**(`namespace`: string): *void*

Defined in src/core/ExtensionConfiguration.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`namespace` | string |

**Returns:** *void*
