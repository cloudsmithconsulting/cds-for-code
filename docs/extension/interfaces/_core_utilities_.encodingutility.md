[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/Utilities"](../modules/_core_utilities_.md) › [EncodingUtility](_core_utilities_.encodingutility.md)

# Interface: EncodingUtility

## Hierarchy

* **EncodingUtility**

## Index

### Properties

* [utf8encoder](_core_utilities_.encodingutility.md#utf8encoder)

### Methods

* [base64ToBytes](_core_utilities_.encodingutility.md#base64tobytes)
* [base64ToString](_core_utilities_.encodingutility.md#base64tostring)
* [bytesToBase64](_core_utilities_.encodingutility.md#bytestobase64)
* [bytesToHex](_core_utilities_.encodingutility.md#bytestohex)
* [hexToBytes](_core_utilities_.encodingutility.md#hextobytes)
* [stringToBase64](_core_utilities_.encodingutility.md#stringtobase64)

## Properties

###  utf8encoder

• **utf8encoder**: *TextEncoder*

Defined in src/core/Utilities.ts:14

## Methods

###  base64ToBytes

▸ **base64ToBytes**(`str`: string): *Uint8Array*

Defined in src/core/Utilities.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *Uint8Array*

___

###  base64ToString

▸ **base64ToString**(`str`: string): *string*

Defined in src/core/Utilities.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*

___

###  bytesToBase64

▸ **bytesToBase64**(`bytes`: Uint8Array): *string*

Defined in src/core/Utilities.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Uint8Array |

**Returns:** *string*

___

###  bytesToHex

▸ **bytesToHex**(`byteArray`: Uint8Array): *string*

Defined in src/core/Utilities.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`byteArray` | Uint8Array |

**Returns:** *string*

___

###  hexToBytes

▸ **hexToBytes**(`hexString`: string): *Uint8Array*

Defined in src/core/Utilities.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`hexString` | string |

**Returns:** *Uint8Array*

___

###  stringToBase64

▸ **stringToBase64**(`string`: string): *string*

Defined in src/core/Utilities.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`string` | string |

**Returns:** *string*
