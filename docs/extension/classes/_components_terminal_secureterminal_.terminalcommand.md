[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Terminal/SecureTerminal"](../modules/_components_terminal_secureterminal_.md) › [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)

# Class: TerminalCommand

## Hierarchy

* **TerminalCommand**

## Index

### Constructors

* [constructor](_components_terminal_secureterminal_.terminalcommand.md#constructor)

### Properties

* [_command](_components_terminal_secureterminal_.terminalcommand.md#private-_command)
* [_error](_components_terminal_secureterminal_.terminalcommand.md#private-_error)
* [_hideFlag](_components_terminal_secureterminal_.terminalcommand.md#private-_hideflag)
* [_maskFlag](_components_terminal_secureterminal_.terminalcommand.md#private-_maskflag)
* [_masker](_components_terminal_secureterminal_.terminalcommand.md#private-_masker)
* [_onLineCompleted](_components_terminal_secureterminal_.terminalcommand.md#private-_onlinecompleted)
* [_output](_components_terminal_secureterminal_.terminalcommand.md#private-_output)
* [onLineCompleted](_components_terminal_secureterminal_.terminalcommand.md#onlinecompleted)
* [lineSeperator](_components_terminal_secureterminal_.terminalcommand.md#static-lineseperator)

### Accessors

* [command](_components_terminal_secureterminal_.terminalcommand.md#command)
* [error](_components_terminal_secureterminal_.terminalcommand.md#error)
* [hasHiddenText](_components_terminal_secureterminal_.terminalcommand.md#hashiddentext)
* [hidden](_components_terminal_secureterminal_.terminalcommand.md#hidden)
* [masked](_components_terminal_secureterminal_.terminalcommand.md#masked)
* [output](_components_terminal_secureterminal_.terminalcommand.md#output)
* [raw](_components_terminal_secureterminal_.terminalcommand.md#raw)

### Methods

* [backspace](_components_terminal_secureterminal_.terminalcommand.md#backspace)
* [clear](_components_terminal_secureterminal_.terminalcommand.md#clear)
* [credential](_components_terminal_secureterminal_.terminalcommand.md#credential)
* [enter](_components_terminal_secureterminal_.terminalcommand.md#enter)
* [hide](_components_terminal_secureterminal_.terminalcommand.md#hide)
* [if](_components_terminal_secureterminal_.terminalcommand.md#if)
* [join](_components_terminal_secureterminal_.terminalcommand.md#join)
* [line](_components_terminal_secureterminal_.terminalcommand.md#line)
* [sensitive](_components_terminal_secureterminal_.terminalcommand.md#sensitive)
* [text](_components_terminal_secureterminal_.terminalcommand.md#text)

## Constructors

###  constructor

\+ **new TerminalCommand**(`command?`: string, `output?`: string, `error?`: string): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`command?` | string |
`output?` | string |
`error?` | string |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

## Properties

### `Private` _command

• **_command**: *string*

Defined in src/components/Terminal/SecureTerminal.ts:19

___

### `Private` _error

• **_error**: *string*

Defined in src/components/Terminal/SecureTerminal.ts:23

___

### `Private` _hideFlag

• **_hideFlag**: *boolean* = false

Defined in src/components/Terminal/SecureTerminal.ts:24

___

### `Private` _maskFlag

• **_maskFlag**: *boolean* = false

Defined in src/components/Terminal/SecureTerminal.ts:25

___

### `Private` _masker

• **_masker**: *[Masker](_components_terminal_secureterminal_.masker.md)*

Defined in src/components/Terminal/SecureTerminal.ts:20

___

### `Private` _onLineCompleted

• **_onLineCompleted**: *EventEmitter‹object›*

Defined in src/components/Terminal/SecureTerminal.ts:21

___

### `Private` _output

• **_output**: *string*

Defined in src/components/Terminal/SecureTerminal.ts:22

___

###  onLineCompleted

• **onLineCompleted**: *Event‹object›*

Defined in src/components/Terminal/SecureTerminal.ts:27

___

### `Static` lineSeperator

▪ **lineSeperator**: *string* = "
"

Defined in src/components/Terminal/SecureTerminal.ts:28

## Accessors

###  command

• **get command**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:40

**Returns:** *string*

___

###  error

• **get error**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:51

**Returns:** *string*

• **set error**(`value`: string): *void*

Defined in src/components/Terminal/SecureTerminal.ts:54

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  hasHiddenText

• **get hasHiddenText**(): *boolean*

Defined in src/components/Terminal/SecureTerminal.ts:62

**Returns:** *boolean*

___

###  hidden

• **get hidden**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:58

**Returns:** *string*

___

###  masked

• **get masked**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:66

**Returns:** *string*

___

###  output

• **get output**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:44

**Returns:** *string*

• **set output**(`value`: string): *void*

Defined in src/components/Terminal/SecureTerminal.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

###  raw

• **get raw**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:70

**Returns:** *string*

## Methods

###  backspace

▸ **backspace**(): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:74

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  clear

▸ **clear**(): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:90

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  credential

▸ **credential**<**T**>(`key`: string | T, `store`: [ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md), `textFunction`: function): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:169

**Type parameters:**

▪ **T**: *[Credential](_core_security_types_.credential.md)*

**Parameters:**

▪ **key**: *string | T*

▪ **store**: *[ICredentialStore](../interfaces/_core_security_types_.icredentialstore.md)*

▪ **textFunction**: *function*

▸ (`decrypted`: T): *string*

**Parameters:**

Name | Type |
------ | ------ |
`decrypted` | T |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  enter

▸ **enter**(): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:141

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  hide

▸ **hide**(`text`: string): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:185

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  if

▸ **if**(`expression`: function, `action`: function, `otherwise?`: function): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:115

**Parameters:**

▪ **expression**: *function*

▸ (): *boolean*

▪ **action**: *function*

▸ (`command`: [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`command` | [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md) |

▪`Optional`  **otherwise**: *function*

▸ (`command`: [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`command` | [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md) |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  join

▸ **join**(): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:196

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  line

▸ **line**(`text`: string): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:98

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  sensitive

▸ **sensitive**(`text`: string): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:158

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  text

▸ **text**(`text`: string): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:125

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*
