import * as vscode from 'vscode';
import IWireUpCommands from '../wireUpCommand';
import * as cs from '../cs';
import * as fs from 'fs';
import * as eol from 'eol';
import * as child_process from 'child_process';
import Utilities from '../helpers/Utilities';
import QuickPicker, { QuickPickOption } from '../helpers/QuickPicker';
import { TS } from 'typescript-linq';
import { TextEncoder, TextDecoder } from 'util';
import Dictionary from '../helpers/Dictionary';

export class TerminalCommand {
	private _command:string;
	private _masker:Masker;
	private readonly _onLineCompleted: vscode.EventEmitter<{ raw:string, masked:string, hidden:string }>;
	private _output:string;
	private _error:string;
	private _hideFlag:boolean = false;
	private _maskFlag:boolean = false;

	public onLineCompleted: vscode.Event<{ raw:string, masked:string, hidden:string }>;
	public static readonly lineSeperator:string = "\r\n";

	constructor(command?: string, output?: string, error?:string) {
		this._onLineCompleted = new vscode.EventEmitter<{ raw:string, masked:string, hidden:string }>();
		this.onLineCompleted = this._onLineCompleted.event;
		this._masker = new Masker();

		this._command = command || "";
		this._output = output || "";
		this._error = error || "";
	}

	get command():string { 
		return this._masker.unencodeText(this._command);
	}

	get output():string {
		return this._output;
	}
	set output(value:string) {
		this._output = value;
	}

	get error():string {
		return this._error;
	}
	set error(value:string) {
		this._error = value;
	}

	get hidden():string { 
		return this._masker.maskText(this._command, true);
	}

	get hasHiddenText(): boolean { 
		return this.masked !== this.hidden;
	}

	get masked():string {
		return this._masker.maskText(this._command);
	}

	get raw():string {
		return this._command;
	}

	backspace(): TerminalCommand {
		if (this._command.length > 0) {
			if (this._command.charCodeAt(this._command.length - 1) === Masker.maskSeperatorByte) {
				this._command = this._command.substring(0, this._command.length - 2);
				this._maskFlag = !this._maskFlag;
			} else if (this._command.charCodeAt(this._command.length - 1) === Masker.hiddenSeperatorByte) {
				this._command = this._command.substring(0, this._command.length - 2);
				this._hideFlag = !this._hideFlag;
			} else {
				this._command = this._command.substring(0, this._command.length - 1);
			}
		}

		return this;
	}

	clear(): TerminalCommand { 
		this._command = "";
		this._maskFlag = false;
		this._hideFlag = false;

		return this;
	}

	line(text:string): TerminalCommand {
		if (this._maskFlag) {
			this._command += Masker.maskSeperator;
			this._maskFlag = !this._maskFlag;
		}

		if (this._hideFlag) {
			this._command += Masker.hiddenSeperator;
			this._hideFlag = !this._hideFlag;
		}

		this._command += text += TerminalCommand.lineSeperator;
		this._onLineCompleted.fire({ raw: this.command, masked: this.masked, hidden: this.hidden });

		return this;
	}

	if(expression:() => boolean, action: (command:TerminalCommand) => void, otherwise?: (command:TerminalCommand) => void): TerminalCommand {
		if (expression()) {
			action(this);
		} else {
			if (otherwise) { otherwise(this); }
		}

		return this;
	}

	text(text:string): TerminalCommand {
		if (this._maskFlag) {
			this._command += Masker.maskSeperator;
			this._maskFlag = !this._maskFlag;
		}

		if (this._hideFlag) {
			this._command += Masker.hiddenSeperator;
			this._hideFlag = !this._hideFlag;
		}

		this._command += text.replace(TerminalCommand.lineSeperator, "");

		return this;
	}

	enter(): TerminalCommand {		
		if (this._maskFlag) {
			this._command += Masker.maskSeperator;
			this._maskFlag = !this._maskFlag;
		}

		if (this._hideFlag) {
			this._command += Masker.hiddenSeperator;
			this._hideFlag = !this._hideFlag;
		}

		this._command += TerminalCommand.lineSeperator;
		this._onLineCompleted.fire({ raw: this.command, masked: this.masked, hidden: this.hidden });

		return this;
	}

	sensitive(text:string): TerminalCommand {
		if (!this._maskFlag) {
			this._command += Masker.maskSeperator;
			this._maskFlag = !this._maskFlag;
		}
		
		this._command += text.replace(TerminalCommand.lineSeperator, "");

		return this;
	}

	hide(text:string): TerminalCommand {
		if (!this._hideFlag) {
			this._command += Masker.hiddenSeperator;
			this._hideFlag = !this._hideFlag;
		}

		this._command += text.replace(TerminalCommand.lineSeperator, "");

		return this;
	}

	join(): TerminalCommand {
		if (this._command) {
			this._command = this._command.replace(TerminalCommand.lineSeperator, "");
		}

		return this;
	}
}

class PromiseInfo<T> { 
	resolve: (value?: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;

	constructor(resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) {
		this.resolve = resolve;
		this.reject = reject;
	}
}

class Masker {
	public static readonly hiddenReplacementByte:number = 0;		// ASCII 0 is null
	public static readonly maskReplacementByte:number = 42;		// ASCII 42 is *
	public static readonly hiddenSeperatorByte:number = 30;		// ASCII 30 is RS (Record Seperator)
	public static readonly maskSeperatorByte:number = 29;		// ASCII 29 is GS (Group Seperator)
	public static readonly maskSeperator:string = String.fromCharCode(Masker.maskSeperatorByte);
	public static readonly hiddenSeperator:string = String.fromCharCode(Masker.hiddenSeperatorByte);

	maskText(text:string, includeHidden?:boolean): string {
		return this.maskBytes(new TextEncoder().encode(text), includeHidden);
	}

	maskBytes(bytes:Uint8Array, includeHidden:boolean = false): string {
		let returnLength:number = 0;
		let newPosition:number = 0;
		let isHidden:boolean = false;

		for (let i = 0; i < bytes.length; i++) {
			if (bytes[i] !== Masker.maskSeperatorByte && bytes[i] !== Masker.hiddenSeperatorByte) {
				if (!isHidden || (isHidden && includeHidden)) {
					returnLength++;
				}
			}

			if (bytes[i] === Masker.hiddenSeperatorByte) {
				isHidden = !isHidden;
			}
		}

		const returnBytes:Uint8Array = new Uint8Array(returnLength);
		let isMasked:boolean = false;
		isHidden = false;

		for (let i = 0; i < bytes.length; i++) {
			const byte = bytes[i];

			if (byte === Masker.maskSeperatorByte) {
				isMasked = !isMasked;
			} else if (byte === Masker.hiddenSeperatorByte) {
				isHidden = !isHidden;
			} else {
				if (!isHidden || (isHidden && includeHidden)) {
					returnBytes.set([ isMasked ? Masker.maskReplacementByte : byte ], newPosition);
					newPosition++;
				}
			}
		}

		return new TextDecoder("utf-8").decode(returnBytes);
	}

	unencodeText(text:string): string {
		return this.unencodeBytes(new TextEncoder().encode(text));
	}

	unencodeBytes(bytes:Uint8Array): string {
		let returnLength:number = 0;
		let newPosition:number = 0;

		for (let i = 0; i < bytes.length; i++) {
			if (bytes[i] !== Masker.maskSeperatorByte && bytes[i] !== Masker.hiddenSeperatorByte) {
				returnLength++;
			}
		}

		const returnBytes:Uint8Array = new Uint8Array(returnLength);

		for (let i = 0; i < bytes.length; i++) {
			const byte = bytes[i];
			
			if (byte !== Masker.maskSeperatorByte && byte !== Masker.hiddenSeperatorByte) {
				returnBytes.set([ byte ], newPosition);
				newPosition++;
			}
		}

		return new TextDecoder("utf-8").decode(returnBytes);
	}
}

class MaskedBuffer {
	private _autoFlush: boolean;
	private _masker:Masker;
	private readonly _onDidFlush: vscode.EventEmitter<{ bytes:Uint8Array, raw:string, masked:string }>;
	private _rawBuffer:string[];
	private _timeout:NodeJS.Timeout;

	public static readonly autoFlushDelay:number = 400;
	public onDidFlush: vscode.Event<{ bytes:Uint8Array, raw:string, masked:string }>;

	constructor(autoFlush:boolean = true) {
		this._autoFlush = autoFlush;
		this._rawBuffer = [];
		this._masker = new Masker();
		this._onDidFlush = new vscode.EventEmitter<{ bytes:Uint8Array, raw:string, masked:string }>();

		this.onDidFlush = this._onDidFlush.event;
	}

	get autoFlush(): boolean {
		return this._autoFlush;
	}

	get length(): number {
		return this._rawBuffer.length;
	}

	public flush(): { raw:string, masked:string } {
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = undefined;
		}

		if (this.length === 0) {
			return null;
		}

		const raw = this.toString();
		const bytes = new TextEncoder().encode(raw);
		const masked = this.toMaskedString();
		const returnValue = { bytes, raw, masked };

		this._onDidFlush.fire(returnValue);
		this._rawBuffer = [];

		return returnValue;
	}

	public push(bytes:Uint8Array): void {
		if (bytes && bytes.length > 0) {
			this._rawBuffer.push(bytes.toString());

			if (this.autoFlush && this.onDidFlush) {
				if (this._timeout) {
					clearTimeout(this._timeout);
				} 
					
				this._timeout = setTimeout(() => this.flush(), MaskedBuffer.autoFlushDelay);
			}
		}
	}

	public toMaskedString(): string { 
		return this._masker.maskText(this._rawBuffer.join(""));
	}

	public toString(): string {
		return this._rawBuffer.join("");
	}
}

export class Terminal implements vscode.Terminal {
	private _onDidWrite: vscode.EventEmitter<string> = new vscode.EventEmitter<string>();
	private _onDidOpen: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	private _onDidClose: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	private _onDidReceiveInput: vscode.EventEmitter<string> = new vscode.EventEmitter<string>();
	private _onDidRunCommand: vscode.EventEmitter<TerminalCommand> = new vscode.EventEmitter<TerminalCommand>();
	private _onDidError: vscode.EventEmitter<TerminalCommand> = new vscode.EventEmitter<TerminalCommand>();
	private _terminal: vscode.Terminal;
	private _options: vscode.TerminalOptions;
	private _path:string = "";
	private _prompt:string = "";
	private _process;
	private _commandBuffer:TerminalCommand[] = [];
	private _inputCommand:TerminalCommand;
	private _outputBuffer:MaskedBuffer;
	private _errorBuffer:MaskedBuffer;
	private _cursorPosition:number = 0;
	private _promiseInfo:PromiseInfo<TerminalCommand>;
	private _isAlreadyInitialized:boolean = false;

	public onDidWrite: vscode.Event<string> = this._onDidWrite.event;
	public onDidOpen: vscode.Event<void> = this._onDidOpen.event;
	public onDidClose: vscode.Event<void> = this._onDidClose.event;
	public onDidReceiveInput: vscode.Event<string> = this._onDidReceiveInput.event;
	public onDidRunCommand: vscode.Event<TerminalCommand> = this._onDidRunCommand.event;
	public onDidError: vscode.Event<TerminalCommand> = this._onDidError.event;
	
	static readonly defaultTerminalName: string = "CloudSmith Terminal";
	static readonly maximumCommandBufferSize: number = 20;

	constructor(options?:vscode.TerminalOptions) 
	{ 
		this._outputBuffer = new MaskedBuffer();
		this._errorBuffer = new MaskedBuffer();
		this.createInputCommand();

		if (options) {
			this.create(options);
		}
	}

	dispose(): void {
		if (this._terminal) {
			this._terminal.dispose();
		}

		if (this._process) {
			this._process.stdin.end();
			this._process.dispose();
		}
	}

	get commandBuffer(): TerminalCommand[] {
		return this._commandBuffer;
	}

	get name(): string {
		return this._terminal.name;
	}

	get path(): string {
		return this._path;
	}

	setPath(value:string): Promise<TerminalCommand> { 
		if (value && !value.endsWith("\\")) { value = `${value}\\`; }
		if (this._path && !this._path.endsWith("\\")) { this._path = `${this._path}\\`; }

		if (value && value.toLocaleLowerCase() !== this._path.toLocaleLowerCase()) {
			return this.run(new TerminalCommand(`cd '${value}'`));
		}
	}

	get process(): any {
		if (!this._process) {
			this.createChildProcess(this._options, { cwd: this._options.cwd.toString() });
		}

		return this._process;
	}

	get processId(): Thenable<number> {
		return this._process.pid;
	}

	get prompt(): string {
		return this._prompt;
	}

	get cursorPosition(): number {
		return this._cursorPosition;
	}

	backspace(howMany:number = 1) {
		for (let i = 0; i < howMany; i++) {
			if (this._cursorPosition > 0) {
				// Move cursor backward
				this.write('\x1b[D');
				// Delete character
				this.write('\x1b[P');

				this._cursorPosition--;
			}

			this._inputCommand.backspace();
		}
	}

	clearCommand() {
		this._inputCommand.clear();
	}

	async showComandBuffer(): Promise<TerminalCommand> {
		const options = new TS.Linq.Enumerator(this._commandBuffer)
			.where(c => !Utilities.IsNullOrEmpty(c.command))
			.select(c => new QuickPickOption(c.hidden, undefined, undefined, c)).toArray();

		return await QuickPicker.pick("", ...options)
			.then(o => o ? o.context : null);
	}

	create(options?:vscode.TerminalOptions): void | Promise<TerminalCommand> {
		options = options || this._options;

		this._options = options;

		let index = vscode.window.terminals.findIndex(t => t.name === options.name);

		if (index !== -1) {
			this._terminal = vscode.window.terminals[index];
			
			if (options.cwd) {
				return this.setPath(options.cwd.toString());
			}
		} else {
			this._terminal = (<any>vscode.window).createTerminal({
				name: options.name || Terminal.defaultTerminalName,
				pty:  {
					onDidWrite: this._onDidWrite.event,
					open: () => {
						const resolveBufferFlush = (flushData, isError) => {
							const promptExpression = /(PS .*> )/i;
							const prompt =  promptExpression.exec(flushData.raw);

							// Our terminal needs normalized line endings.
							let displayText = eol.crlf(flushData.masked);

							// The first time a terminal is opened, there will be a prompt (initial) as well as the command output.
							// As such, our parsing logic is a little different.
							if (!this._isAlreadyInitialized && displayText.indexOf(this._inputCommand.command) !== -1) {
								displayText = displayText.replace(this._inputCommand.command, this._inputCommand.masked);
							} else {
								displayText = displayText.replace(this._inputCommand.command, "");
							}

							if (prompt && prompt.length > 0) {
								this._path = prompt[0].substr(3, prompt[0].length - 5);
								this._prompt = prompt[0];

								// If we got 2 prompts it means that we completed the command and flushed the buffer in one pass.
								if (prompt.length === 2 && !this._isAlreadyInitialized) { this._isAlreadyInitialized = true; }

								if (this._inputCommand.command.trim() === "clear" || this._inputCommand.command.trim() === "cls") {
									this.clear();
									this.write(this._prompt);

									return;
								}
							}

							if (!isError) {
								if (this._isAlreadyInitialized && flushData.raw.endsWith(this._prompt)) {
									this.resolveIncomingCommand(flushData.raw.replace(this._inputCommand.command, "").replace(this._prompt, ""), undefined);
								} else {
									this._inputCommand.output += flushData.raw;
									this._inputCommand.output = this._inputCommand.output.replace(this._inputCommand.command, "").replace(this._prompt, "");
								}

								this.write(displayText);
							} else {
								if (this._isAlreadyInitialized && flushData.raw.endsWith(this._prompt)) {
									this.resolveIncomingCommand(undefined, flushData.raw.replace(this._inputCommand.command, "").replace(this._prompt, ""));	
								} else {
									this._inputCommand.error += flushData.raw;
									this._inputCommand.error = this._inputCommand.output.replace(this._inputCommand.command, "").replace(this._prompt, "");
								}
								
								this.writeColor(4, displayText);
							}

							this._isAlreadyInitialized = true;
						};

						this.createChildProcess(options, { cwd: options.cwd.toString() });

						this._outputBuffer.onDidFlush(flushData => resolveBufferFlush(flushData, false));
						this._errorBuffer.onDidFlush(flushData => resolveBufferFlush(flushData, true));

						this._onDidOpen.fire();
					},
					close: () => {
						this._process.stdin.end();
						this._process.dispose();
						this._process = null;
						this._inputCommand.clear();
						this._outputBuffer.onDidFlush = null;
						this._errorBuffer.onDidFlush = null;
						this._outputBuffer.flush();
						this._errorBuffer.flush();

						this._onDidClose.fire();
					},
					handleInput: (data: string) => {
						this._onDidReceiveInput.fire(data);

						if (data === '\x1b[A') { /// Up arrow 
							this.showComandBuffer().then(c => {
								this.show(false);

								if (c) {
									this.run(c);									
								}
							});

							return;
						}

						if (data === '\r') { // Enter
							this.write('\r');
							this._inputCommand.enter();
							this._cursorPosition = 0;

							return;
						}

						if (data === '\x7f') { // Backspace
							if (this._cursorPosition === 0) {
								return;
							}

							this.backspace(1);

							return;
						}

						if (data === '\x09') { // Tab
						}
						
						this.write(data);
						this._inputCommand.hide(data);
						this._cursorPosition++;
					}
				}});
		}
	}

	clear(): Terminal {
		this._outputBuffer.flush();
		this._errorBuffer.flush();
		this._inputCommand.clear();

		if (this._terminal) {
			this.write('\x1b[2J\x1b[3J\x1b[;H\r');
		}

		return this;
	}

	run(command:TerminalCommand): Promise<TerminalCommand> {
		if (command) {
			this.createInputCommand(command);

			return new Promise<TerminalCommand>((resolve, reject) => {
				this._promiseInfo = new PromiseInfo(resolve, reject);
				this._inputCommand.enter();
			});
		}

		return null;
	}

	sendText(text: string, addNewLine?: boolean): Terminal {
		this._inputCommand.text(text);

		if (addNewLine) {
			this._inputCommand.enter();
		}

		return this;
	}

	color(color: number): Terminal {
		if (color > 6) { color = 6; }
		if (color < 0) { color = 0; }

		this.sendText(`\x1b[3${color}m`, false);

		return this;
	}

	nocolor(): Terminal {
		this.sendText(`\x1b[0m`);

		return this;
	}

	show(preserveFocus?: boolean): void {
		if (!this._terminal && this._options) {
			this.create(this._options);
		} 

		this._terminal.show(preserveFocus);
	}

	hide(): void {
		if (this._terminal) {
			this._terminal.hide();
		}		
	}

	private createChildProcess(options: vscode.TerminalOptions, spawnOptions: child_process.SpawnOptions) {
		if (this._process) { return; }

		const args:string[] = [];

		if (options.shellPath.endsWith("powershell.exe")) {
			args.push("-NoLogo");
		}

		this._process = child_process.spawn(options.shellPath, args, spawnOptions);

		if (spawnOptions && spawnOptions.cwd) {
			this._path = spawnOptions.cwd;
		}

		this._process.stdout.on("data", data => {
			this._outputBuffer.push(data);
		});

		this._process.stderr.on("data", data => {
			this._errorBuffer.push(data);
		});
	}

	private createInputCommand(command?:TerminalCommand): TerminalCommand {
		this._inputCommand = command ? new TerminalCommand(command.raw) : new TerminalCommand();
		
		this._inputCommand.onLineCompleted(line => {
			this.write(line.hidden);

			if (this.process) {
				this.process.stdin.write(line.raw); 
			}
		});

		return this._inputCommand;
	}

	private resolveIncomingCommand(outputBuffer:string, errorBuffer:string) {
		if (!Utilities.IsNullOrEmpty(this._inputCommand.command) || outputBuffer || errorBuffer) {
			if (outputBuffer) { this._inputCommand.output += outputBuffer; }
			if (errorBuffer) { this._inputCommand.error += errorBuffer; }

			// Sanitize the output text to remove prompts, the echo'd command text, etc.
			this._inputCommand.output = this._inputCommand.output.replace(this._inputCommand.command, "").replace(this._prompt, "");
			this._inputCommand.error = this._inputCommand.error.replace(this._inputCommand.command, "").replace(this._prompt, "");

			// Remove all crlf as this command is complete.
			this._inputCommand.join();

			const hasError = !Utilities.IsNullOrEmpty(this._inputCommand.error);
			const hasOutput = !Utilities.IsNullOrEmpty(this._inputCommand.output);
			const readyToProcess = !hasError || (hasError && hasOutput);

			if (this._inputCommand.command.trim() !== "" && readyToProcess) {
				this._commandBuffer.push(this._inputCommand);
			}

			if (this._commandBuffer.length > Terminal.maximumCommandBufferSize) {
				this._commandBuffer.splice(0, this._commandBuffer.length - Terminal.maximumCommandBufferSize);
			}

			if (this._promiseInfo && readyToProcess) {
				if (!Utilities.IsNullOrEmpty(this._inputCommand.error)) {
					this._promiseInfo.reject(this._inputCommand.error);
				} else {
					this._promiseInfo.resolve(this._inputCommand);
				}

				this._promiseInfo = null;
			}

			if (readyToProcess) {
				this._onDidRunCommand.fire(this._inputCommand);

				// Reset our input command as we're all done.
				this.createInputCommand();
			}
		}
	}

	private write(value:string) {
		if (this._onDidWrite) { 
			this._onDidWrite.fire(value); 
		}
	}

	private writeColor(color: number, value: string) {
		if (color > 6) { color = 6; }
		if (color < 0) { color = 0; }

		this._onDidWrite.fire(`\x1b[3${color}m${value}\x1b[0m`);
	}
}

export default class DynamicsTerminal implements IWireUpCommands
{
	wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void {
		let terminals:Dictionary<string, Terminal> = new Dictionary<string, Terminal>();

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.createTerminal, async (folder:string, name:string): Promise<Terminal> => {
			if (!folder || !fs.existsSync(folder)) {
				folder = context.globalStoragePath;
			}

			name = name || Terminal.defaultTerminalName;

			if (!terminals.containsKey(name)) {
				const terminal = new Terminal({name, shellPath: "powershell.exe", cwd: folder });
	
				terminal.onDidClose(() => {
					terminal.dispose();
				});

				terminal.show(false);
				terminals.add(name, terminal);
			} else {
				terminals[name].show(false);

				await terminals[name].setPath(folder);
			}

			return terminals[name];
		}));

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.clearTerminal, async (terminal) => {
			if (!terminal) {
				if (terminals.length === 0) {
					terminal = await vscode.commands.executeCommand(cs.dynamics.extension.createTerminal);
				} else if (terminals.length === 1) {
					terminal = terminals.values[0];
				} else {
					terminal = await QuickPicker.pickDictionaryEntry(terminals, "Choose a terminal to clear");
				}
			}

			if (terminal) {
				terminal.clear();
			}
		}));
	}

    public static async showTerminal(folder: string, name?:string): Promise<Terminal> {
		return vscode.commands.executeCommand(cs.dynamics.extension.createTerminal, folder, name);
	}
}