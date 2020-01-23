[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Terminal/SecureTerminal"](../modules/_components_terminal_secureterminal_.md) › [Masker](_components_terminal_secureterminal_.masker.md)

# Class: Masker

## Hierarchy

* **Masker**

## Index

### Properties

* [hiddenReplacementByte](_components_terminal_secureterminal_.masker.md#static-hiddenreplacementbyte)
* [hiddenSeperator](_components_terminal_secureterminal_.masker.md#static-hiddenseperator)
* [hiddenSeperatorByte](_components_terminal_secureterminal_.masker.md#static-hiddenseperatorbyte)
* [maskReplacementByte](_components_terminal_secureterminal_.masker.md#static-maskreplacementbyte)
* [maskSeperator](_components_terminal_secureterminal_.masker.md#static-maskseperator)
* [maskSeperatorByte](_components_terminal_secureterminal_.masker.md#static-maskseperatorbyte)

### Methods

* [maskBytes](_components_terminal_secureterminal_.masker.md#maskbytes)
* [maskText](_components_terminal_secureterminal_.masker.md#masktext)
* [unencodeBytes](_components_terminal_secureterminal_.masker.md#unencodebytes)
* [unencodeText](_components_terminal_secureterminal_.masker.md#unencodetext)

## Properties

### `Static` hiddenReplacementByte

▪ **hiddenReplacementByte**: *number* = 0

Defined in src/components/Terminal/SecureTerminal.ts:206

___

### `Static` hiddenSeperator

▪ **hiddenSeperator**: *string* = String.fromCharCode(Masker.hiddenSeperatorByte)

Defined in src/components/Terminal/SecureTerminal.ts:211

___

### `Static` hiddenSeperatorByte

▪ **hiddenSeperatorByte**: *number* = 30

Defined in src/components/Terminal/SecureTerminal.ts:208

___

### `Static` maskReplacementByte

▪ **maskReplacementByte**: *number* = 42

Defined in src/components/Terminal/SecureTerminal.ts:207

___

### `Static` maskSeperator

▪ **maskSeperator**: *string* = String.fromCharCode(Masker.maskSeperatorByte)

Defined in src/components/Terminal/SecureTerminal.ts:210

___

### `Static` maskSeperatorByte

▪ **maskSeperatorByte**: *number* = 29

Defined in src/components/Terminal/SecureTerminal.ts:209

## Methods

###  maskBytes

▸ **maskBytes**(`bytes`: Uint8Array, `includeHidden`: boolean): *string*

Defined in src/components/Terminal/SecureTerminal.ts:217

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`bytes` | Uint8Array | - |
`includeHidden` | boolean | false |

**Returns:** *string*

___

###  maskText

▸ **maskText**(`text`: string, `includeHidden?`: boolean): *string*

Defined in src/components/Terminal/SecureTerminal.ts:213

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`includeHidden?` | boolean |

**Returns:** *string*

___

###  unencodeBytes

▸ **unencodeBytes**(`bytes`: Uint8Array): *string*

Defined in src/components/Terminal/SecureTerminal.ts:260

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Uint8Array |

**Returns:** *string*

___

###  unencodeText

▸ **unencodeText**(`text`: string): *string*

Defined in src/components/Terminal/SecureTerminal.ts:256

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *string*
