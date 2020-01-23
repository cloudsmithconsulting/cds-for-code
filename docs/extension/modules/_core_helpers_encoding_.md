[cds-for-code](../README.md) › [Globals](../globals.md) › ["core/helpers/Encoding"](_core_helpers_encoding_.md)

# External module: "core/helpers/Encoding"

## Index

### Variables

* [utf8encoder](_core_helpers_encoding_.md#const-utf8encoder)

### Functions

* [base64ToBytes](_core_helpers_encoding_.md#base64tobytes)
* [base64ToString](_core_helpers_encoding_.md#base64tostring)
* [bytesToBase64](_core_helpers_encoding_.md#bytestobase64)
* [bytesToHex](_core_helpers_encoding_.md#bytestohex)
* [hexToBytes](_core_helpers_encoding_.md#hextobytes)
* [stringToBase64](_core_helpers_encoding_.md#stringtobase64)

## Variables

### `Const` utf8encoder

• **utf8encoder**: *TextEncoder* = new TextEncoder()

Defined in src/core/helpers/Encoding.ts:3

## Functions

###  base64ToBytes

▸ **base64ToBytes**(`str`: string): *Uint8Array*

Defined in src/core/helpers/Encoding.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *Uint8Array*

___

###  base64ToString

▸ **base64ToString**(`str`: string): *string*

Defined in src/core/helpers/Encoding.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*

___

###  bytesToBase64

▸ **bytesToBase64**(`bytes`: Uint8Array): *string*

Defined in src/core/helpers/Encoding.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Uint8Array |

**Returns:** *string*

___

###  bytesToHex

▸ **bytesToHex**(`byteArray`: Uint8Array): *string*

Defined in src/core/helpers/Encoding.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`byteArray` | Uint8Array |

**Returns:** *string*

___

###  hexToBytes

▸ **hexToBytes**(`hexString`: string): *Uint8Array*

Defined in src/core/helpers/Encoding.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`hexString` | string |

**Returns:** *Uint8Array*

___

###  stringToBase64

▸ **stringToBase64**(`string`: string): *string*

Defined in src/core/helpers/Encoding.ts:5

**Parameters:**

Name | Type |
------ | ------ |
`string` | string |

**Returns:** *string*
