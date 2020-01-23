[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Terminal/SecureTerminal"](../modules/_components_terminal_secureterminal_.md) › [MaskedBuffer](_components_terminal_secureterminal_.maskedbuffer.md)

# Class: MaskedBuffer

## Hierarchy

* **MaskedBuffer**

## Index

### Constructors

* [constructor](_components_terminal_secureterminal_.maskedbuffer.md#constructor)

### Properties

* [_autoFlush](_components_terminal_secureterminal_.maskedbuffer.md#private-_autoflush)
* [_masker](_components_terminal_secureterminal_.maskedbuffer.md#private-_masker)
* [_onDidFlush](_components_terminal_secureterminal_.maskedbuffer.md#private-_ondidflush)
* [_rawBuffer](_components_terminal_secureterminal_.maskedbuffer.md#private-_rawbuffer)
* [_timeout](_components_terminal_secureterminal_.maskedbuffer.md#private-_timeout)
* [onDidFlush](_components_terminal_secureterminal_.maskedbuffer.md#ondidflush)
* [autoFlushDelay](_components_terminal_secureterminal_.maskedbuffer.md#static-autoflushdelay)

### Accessors

* [autoFlush](_components_terminal_secureterminal_.maskedbuffer.md#autoflush)
* [length](_components_terminal_secureterminal_.maskedbuffer.md#length)

### Methods

* [flush](_components_terminal_secureterminal_.maskedbuffer.md#flush)
* [push](_components_terminal_secureterminal_.maskedbuffer.md#push)
* [toMaskedString](_components_terminal_secureterminal_.maskedbuffer.md#tomaskedstring)
* [toString](_components_terminal_secureterminal_.maskedbuffer.md#tostring)

## Constructors

###  constructor

\+ **new MaskedBuffer**(`autoFlush`: boolean): *[MaskedBuffer](_components_terminal_secureterminal_.maskedbuffer.md)*

Defined in src/components/Terminal/SecureTerminal.ts:293

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`autoFlush` | boolean | true |

**Returns:** *[MaskedBuffer](_components_terminal_secureterminal_.maskedbuffer.md)*

## Properties

### `Private` _autoFlush

• **_autoFlush**: *boolean*

Defined in src/components/Terminal/SecureTerminal.ts:286

___

### `Private` _masker

• **_masker**: *[Masker](_components_terminal_secureterminal_.masker.md)*

Defined in src/components/Terminal/SecureTerminal.ts:287

___

### `Private` _onDidFlush

• **_onDidFlush**: *EventEmitter‹object›*

Defined in src/components/Terminal/SecureTerminal.ts:288

___

### `Private` _rawBuffer

• **_rawBuffer**: *string[]*

Defined in src/components/Terminal/SecureTerminal.ts:289

___

### `Private` _timeout

• **_timeout**: *Timeout*

Defined in src/components/Terminal/SecureTerminal.ts:290

___

###  onDidFlush

• **onDidFlush**: *Event‹object›*

Defined in src/components/Terminal/SecureTerminal.ts:293

___

### `Static` autoFlushDelay

▪ **autoFlushDelay**: *number* = 400

Defined in src/components/Terminal/SecureTerminal.ts:292

## Accessors

###  autoFlush

• **get autoFlush**(): *boolean*

Defined in src/components/Terminal/SecureTerminal.ts:304

**Returns:** *boolean*

___

###  length

• **get length**(): *number*

Defined in src/components/Terminal/SecureTerminal.ts:308

**Returns:** *number*

## Methods

###  flush

▸ **flush**(): *object*

Defined in src/components/Terminal/SecureTerminal.ts:312

**Returns:** *object*

* **masked**: *string*

* **raw**: *string*

___

###  push

▸ **push**(`bytes`: Uint8Array): *void*

Defined in src/components/Terminal/SecureTerminal.ts:333

**Parameters:**

Name | Type |
------ | ------ |
`bytes` | Uint8Array |

**Returns:** *void*

___

###  toMaskedString

▸ **toMaskedString**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:347

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:351

**Returns:** *string*
