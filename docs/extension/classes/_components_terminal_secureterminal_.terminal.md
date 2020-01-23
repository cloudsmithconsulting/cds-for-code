[cds-for-code](../README.md) › [Globals](../globals.md) › ["components/Terminal/SecureTerminal"](../modules/_components_terminal_secureterminal_.md) › [Terminal](_components_terminal_secureterminal_.terminal.md)

# Class: Terminal

## Hierarchy

* **Terminal**

## Implements

* Terminal

## Index

### Constructors

* [constructor](_components_terminal_secureterminal_.terminal.md#constructor)

### Properties

* [_commandBuffer](_components_terminal_secureterminal_.terminal.md#private-_commandbuffer)
* [_cursorPosition](_components_terminal_secureterminal_.terminal.md#private-_cursorposition)
* [_errorBuffer](_components_terminal_secureterminal_.terminal.md#private-_errorbuffer)
* [_inputCommand](_components_terminal_secureterminal_.terminal.md#private-_inputcommand)
* [_isAlreadyInitialized](_components_terminal_secureterminal_.terminal.md#private-_isalreadyinitialized)
* [_onDidClose](_components_terminal_secureterminal_.terminal.md#private-_ondidclose)
* [_onDidError](_components_terminal_secureterminal_.terminal.md#private-_ondiderror)
* [_onDidOpen](_components_terminal_secureterminal_.terminal.md#private-_ondidopen)
* [_onDidReceiveInput](_components_terminal_secureterminal_.terminal.md#private-_ondidreceiveinput)
* [_onDidRunCommand](_components_terminal_secureterminal_.terminal.md#private-_ondidruncommand)
* [_onDidWrite](_components_terminal_secureterminal_.terminal.md#private-_ondidwrite)
* [_options](_components_terminal_secureterminal_.terminal.md#private-_options)
* [_outputBuffer](_components_terminal_secureterminal_.terminal.md#private-_outputbuffer)
* [_path](_components_terminal_secureterminal_.terminal.md#private-_path)
* [_process](_components_terminal_secureterminal_.terminal.md#private-_process)
* [_promiseInfo](_components_terminal_secureterminal_.terminal.md#private-_promiseinfo)
* [_prompt](_components_terminal_secureterminal_.terminal.md#private-_prompt)
* [_terminal](_components_terminal_secureterminal_.terminal.md#private-_terminal)
* [onDidClose](_components_terminal_secureterminal_.terminal.md#ondidclose)
* [onDidError](_components_terminal_secureterminal_.terminal.md#ondiderror)
* [onDidOpen](_components_terminal_secureterminal_.terminal.md#ondidopen)
* [onDidReceiveInput](_components_terminal_secureterminal_.terminal.md#ondidreceiveinput)
* [onDidRunCommand](_components_terminal_secureterminal_.terminal.md#ondidruncommand)
* [onDidWrite](_components_terminal_secureterminal_.terminal.md#ondidwrite)
* [defaultTerminalName](_components_terminal_secureterminal_.terminal.md#static-defaultterminalname)
* [maximumCommandBufferSize](_components_terminal_secureterminal_.terminal.md#static-maximumcommandbuffersize)

### Accessors

* [commandBuffer](_components_terminal_secureterminal_.terminal.md#commandbuffer)
* [cursorPosition](_components_terminal_secureterminal_.terminal.md#cursorposition)
* [name](_components_terminal_secureterminal_.terminal.md#name)
* [path](_components_terminal_secureterminal_.terminal.md#path)
* [process](_components_terminal_secureterminal_.terminal.md#process)
* [processId](_components_terminal_secureterminal_.terminal.md#processid)
* [prompt](_components_terminal_secureterminal_.terminal.md#prompt)

### Methods

* [backspace](_components_terminal_secureterminal_.terminal.md#backspace)
* [clear](_components_terminal_secureterminal_.terminal.md#clear)
* [clearCommand](_components_terminal_secureterminal_.terminal.md#clearcommand)
* [color](_components_terminal_secureterminal_.terminal.md#color)
* [create](_components_terminal_secureterminal_.terminal.md#create)
* [createChildProcess](_components_terminal_secureterminal_.terminal.md#private-createchildprocess)
* [createInputCommand](_components_terminal_secureterminal_.terminal.md#private-createinputcommand)
* [dispose](_components_terminal_secureterminal_.terminal.md#dispose)
* [hide](_components_terminal_secureterminal_.terminal.md#hide)
* [nocolor](_components_terminal_secureterminal_.terminal.md#nocolor)
* [resolveIncomingCommand](_components_terminal_secureterminal_.terminal.md#private-resolveincomingcommand)
* [run](_components_terminal_secureterminal_.terminal.md#run)
* [sendText](_components_terminal_secureterminal_.terminal.md#sendtext)
* [setPath](_components_terminal_secureterminal_.terminal.md#setpath)
* [show](_components_terminal_secureterminal_.terminal.md#show)
* [showComandBuffer](_components_terminal_secureterminal_.terminal.md#showcomandbuffer)
* [write](_components_terminal_secureterminal_.terminal.md#private-write)
* [writeColor](_components_terminal_secureterminal_.terminal.md#private-writecolor)

## Constructors

###  constructor

\+ **new Terminal**(`options?`: TerminalOptions): *[Terminal](_components_terminal_secureterminal_.terminal.md)*

Defined in src/components/Terminal/SecureTerminal.ts:384

**Parameters:**

Name | Type |
------ | ------ |
`options?` | TerminalOptions |

**Returns:** *[Terminal](_components_terminal_secureterminal_.terminal.md)*

## Properties

### `Private` _commandBuffer

• **_commandBuffer**: *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)[]* = []

Defined in src/components/Terminal/SecureTerminal.ts:368

___

### `Private` _cursorPosition

• **_cursorPosition**: *number* = 0

Defined in src/components/Terminal/SecureTerminal.ts:372

___

### `Private` _errorBuffer

• **_errorBuffer**: *[MaskedBuffer](_components_terminal_secureterminal_.maskedbuffer.md)*

Defined in src/components/Terminal/SecureTerminal.ts:371

___

### `Private` _inputCommand

• **_inputCommand**: *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:369

___

### `Private` _isAlreadyInitialized

• **_isAlreadyInitialized**: *boolean* = false

Defined in src/components/Terminal/SecureTerminal.ts:374

___

### `Private` _onDidClose

• **_onDidClose**: *EventEmitter‹void›* = new vscode.EventEmitter<void>()

Defined in src/components/Terminal/SecureTerminal.ts:359

___

### `Private` _onDidError

• **_onDidError**: *EventEmitter‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›* = new vscode.EventEmitter<TerminalCommand>()

Defined in src/components/Terminal/SecureTerminal.ts:362

___

### `Private` _onDidOpen

• **_onDidOpen**: *EventEmitter‹void›* = new vscode.EventEmitter<void>()

Defined in src/components/Terminal/SecureTerminal.ts:358

___

### `Private` _onDidReceiveInput

• **_onDidReceiveInput**: *EventEmitter‹string›* = new vscode.EventEmitter<string>()

Defined in src/components/Terminal/SecureTerminal.ts:360

___

### `Private` _onDidRunCommand

• **_onDidRunCommand**: *EventEmitter‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›* = new vscode.EventEmitter<TerminalCommand>()

Defined in src/components/Terminal/SecureTerminal.ts:361

___

### `Private` _onDidWrite

• **_onDidWrite**: *EventEmitter‹string›* = new vscode.EventEmitter<string>()

Defined in src/components/Terminal/SecureTerminal.ts:357

___

### `Private` _options

• **_options**: *TerminalOptions*

Defined in src/components/Terminal/SecureTerminal.ts:364

___

### `Private` _outputBuffer

• **_outputBuffer**: *[MaskedBuffer](_components_terminal_secureterminal_.maskedbuffer.md)*

Defined in src/components/Terminal/SecureTerminal.ts:370

___

### `Private` _path

• **_path**: *string* = ""

Defined in src/components/Terminal/SecureTerminal.ts:365

___

### `Private` _process

• **_process**: *any*

Defined in src/components/Terminal/SecureTerminal.ts:367

___

### `Private` _promiseInfo

• **_promiseInfo**: *[PromiseInfo](_core_types_promiseinfo_.promiseinfo.md)‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

Defined in src/components/Terminal/SecureTerminal.ts:373

___

### `Private` _prompt

• **_prompt**: *string* = ""

Defined in src/components/Terminal/SecureTerminal.ts:366

___

### `Private` _terminal

• **_terminal**: *Terminal*

Defined in src/components/Terminal/SecureTerminal.ts:363

___

###  onDidClose

• **onDidClose**: *Event‹void›* = this._onDidClose.event

Defined in src/components/Terminal/SecureTerminal.ts:378

___

###  onDidError

• **onDidError**: *Event‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›* = this._onDidError.event

Defined in src/components/Terminal/SecureTerminal.ts:381

___

###  onDidOpen

• **onDidOpen**: *Event‹void›* = this._onDidOpen.event

Defined in src/components/Terminal/SecureTerminal.ts:377

___

###  onDidReceiveInput

• **onDidReceiveInput**: *Event‹string›* = this._onDidReceiveInput.event

Defined in src/components/Terminal/SecureTerminal.ts:379

___

###  onDidRunCommand

• **onDidRunCommand**: *Event‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›* = this._onDidRunCommand.event

Defined in src/components/Terminal/SecureTerminal.ts:380

___

###  onDidWrite

• **onDidWrite**: *Event‹string›* = this._onDidWrite.event

Defined in src/components/Terminal/SecureTerminal.ts:376

___

### `Static` defaultTerminalName

▪ **defaultTerminalName**: *string* = "CloudSmith Terminal"

Defined in src/components/Terminal/SecureTerminal.ts:383

___

### `Static` maximumCommandBufferSize

▪ **maximumCommandBufferSize**: *number* = 20

Defined in src/components/Terminal/SecureTerminal.ts:384

## Accessors

###  commandBuffer

• **get commandBuffer**(): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)[]*

Defined in src/components/Terminal/SecureTerminal.ts:408

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)[]*

___

###  cursorPosition

• **get cursorPosition**(): *number*

Defined in src/components/Terminal/SecureTerminal.ts:445

**Returns:** *number*

___

###  name

• **get name**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:412

**Returns:** *string*

___

###  path

• **get path**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:416

**Returns:** *string*

___

###  process

• **get process**(): *any*

Defined in src/components/Terminal/SecureTerminal.ts:429

**Returns:** *any*

___

###  processId

• **get processId**(): *Thenable‹number›*

Defined in src/components/Terminal/SecureTerminal.ts:437

**Returns:** *Thenable‹number›*

___

###  prompt

• **get prompt**(): *string*

Defined in src/components/Terminal/SecureTerminal.ts:441

**Returns:** *string*

## Methods

###  backspace

▸ **backspace**(`howMany`: number): *void*

Defined in src/components/Terminal/SecureTerminal.ts:449

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`howMany` | number | 1 |

**Returns:** *void*

___

###  clear

▸ **clear**(): *[Terminal](_components_terminal_secureterminal_.terminal.md)*

Defined in src/components/Terminal/SecureTerminal.ts:612

**Returns:** *[Terminal](_components_terminal_secureterminal_.terminal.md)*

___

###  clearCommand

▸ **clearCommand**(): *void*

Defined in src/components/Terminal/SecureTerminal.ts:464

**Returns:** *void*

___

###  color

▸ **color**(`color`: number): *[Terminal](_components_terminal_secureterminal_.terminal.md)*

Defined in src/components/Terminal/SecureTerminal.ts:647

**Parameters:**

Name | Type |
------ | ------ |
`color` | number |

**Returns:** *[Terminal](_components_terminal_secureterminal_.terminal.md)*

___

###  create

▸ **create**(`options?`: TerminalOptions): *void | Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

Defined in src/components/Terminal/SecureTerminal.ts:477

**Parameters:**

Name | Type |
------ | ------ |
`options?` | TerminalOptions |

**Returns:** *void | Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

___

### `Private` createChildProcess

▸ **createChildProcess**(`options`: TerminalOptions, `spawnOptions`: SpawnOptions): *void*

Defined in src/components/Terminal/SecureTerminal.ts:676

**Parameters:**

Name | Type |
------ | ------ |
`options` | TerminalOptions |
`spawnOptions` | SpawnOptions |

**Returns:** *void*

___

### `Private` createInputCommand

▸ **createInputCommand**(`command?`: [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)): *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

Defined in src/components/Terminal/SecureTerminal.ts:700

**Parameters:**

Name | Type |
------ | ------ |
`command?` | [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md) |

**Returns:** *[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)*

___

###  dispose

▸ **dispose**(): *void*

Defined in src/components/Terminal/SecureTerminal.ts:397

**Returns:** *void*

___

###  hide

▸ **hide**(): *void*

Defined in src/components/Terminal/SecureTerminal.ts:670

**Returns:** *void*

___

###  nocolor

▸ **nocolor**(): *[Terminal](_components_terminal_secureterminal_.terminal.md)*

Defined in src/components/Terminal/SecureTerminal.ts:656

**Returns:** *[Terminal](_components_terminal_secureterminal_.terminal.md)*

___

### `Private` resolveIncomingCommand

▸ **resolveIncomingCommand**(`outputBuffer`: string, `errorBuffer`: string): *void*

Defined in src/components/Terminal/SecureTerminal.ts:714

**Parameters:**

Name | Type |
------ | ------ |
`outputBuffer` | string |
`errorBuffer` | string |

**Returns:** *void*

___

###  run

▸ **run**(`command`: [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)): *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

Defined in src/components/Terminal/SecureTerminal.ts:624

**Parameters:**

Name | Type |
------ | ------ |
`command` | [TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md) |

**Returns:** *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

___

###  sendText

▸ **sendText**(`text`: string, `addNewLine?`: boolean): *[Terminal](_components_terminal_secureterminal_.terminal.md)*

Defined in src/components/Terminal/SecureTerminal.ts:637

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`addNewLine?` | boolean |

**Returns:** *[Terminal](_components_terminal_secureterminal_.terminal.md)*

___

###  setPath

▸ **setPath**(`value`: string): *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

Defined in src/components/Terminal/SecureTerminal.ts:420

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

___

###  show

▸ **show**(`preserveFocus?`: boolean): *void*

Defined in src/components/Terminal/SecureTerminal.ts:662

**Parameters:**

Name | Type |
------ | ------ |
`preserveFocus?` | boolean |

**Returns:** *void*

___

###  showComandBuffer

▸ **showComandBuffer**(): *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

Defined in src/components/Terminal/SecureTerminal.ts:468

**Returns:** *Promise‹[TerminalCommand](_components_terminal_secureterminal_.terminalcommand.md)›*

___

### `Private` write

▸ **write**(`value`: string): *void*

Defined in src/components/Terminal/SecureTerminal.ts:757

**Parameters:**

Name | Type |
------ | ------ |
`value` | string |

**Returns:** *void*

___

### `Private` writeColor

▸ **writeColor**(`color`: number, `value`: string): *void*

Defined in src/components/Terminal/SecureTerminal.ts:763

**Parameters:**

Name | Type |
------ | ------ |
`color` | number |
`value` | string |

**Returns:** *void*
