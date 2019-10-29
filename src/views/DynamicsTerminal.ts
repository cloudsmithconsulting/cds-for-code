import * as vscode from 'vscode';
import IWireUpCommands from '../wireUpCommand';
import * as cs from '../cs';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { SpawnOptions } from 'child_process';
import Utilities from '../helpers/Utilities';
import { throws } from 'assert';

export class TerminalCommand {
	private _command:string;
	private _output:string;
	private _error:string;

	constructor(command: string, output?: string, error?:string) {
		this._command = command;
		this._output = output;
		this._error = error;
	}

	get command():string { 
		return this._command;
	}

	get output():string {
		return this._output;
	}

	get error():string {
		return this._error;
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
	private _process;
	private _isMasked: boolean = false;
	private _inputCommand:string = "";
	private _outputBuffer:string[] = [];
	private _errorBuffer:string[] = [];
	private _cursorPosition:number = 0;
	private _commandBuffer:TerminalCommand[] = [];

	public onDidWrite: vscode.Event<string> = this._onDidWrite.event;
	public onDidOpen: vscode.Event<void> = this._onDidOpen.event;
	public onDidClose: vscode.Event<void> = this._onDidClose.event;
	public onDidReceiveInput: vscode.Event<string> = this._onDidReceiveInput.event;
	public onDidRunCommand: vscode.Event<TerminalCommand> = this._onDidRunCommand.event;
	public onDidError: vscode.Event<TerminalCommand> = this._onDidError.event;
	
	private static _terminals:Terminal[] = [];
	static readonly defaultTerminalName: string = "CloudSmith Terminal";
	static readonly maximumCommandBufferSize: number = 20;

	static get ActiveTerminals(): Terminal[] {
		return this._terminals;
	}

	get commandBuffer(): TerminalCommand[] {
		return this._commandBuffer;
	}

	get isMasked(): boolean {
		return this._isMasked;
	}

	get name(): string {
		return this._terminal.name;
	}

	get path(): string {
		return this._path;
	}

	set path(value:string) { 
		if (value && value !== this._path) {
			this.sendText(`cd '${value}'`, true);
		}
	}

	get processId(): Thenable<number> {
		return this._process.pid;
	}

	get cursorPosition(): number {
		return this._cursorPosition;
	}

	constructor(options?:vscode.TerminalOptions, singleton:boolean = true) 
	{ 
		if (options) {
			this._options = options;
		}
	}

	create<T extends vscode.Terminal>(options?:vscode.TerminalOptions, singleton:boolean = true): Promise<T>
	{
		options = options || this._options;

		let index = Terminal.ActiveTerminals.findIndex(t => t.name === options.name);
		let currentTerminal:T;

		if (index === -1) {
			index = vscode.window.terminals.findIndex(t => t.name === options.name);

			if (index !== -1) {
				currentTerminal = <T>vscode.window.terminals.find(t => t.name === options.name);
			}
		} else { 
			currentTerminal = <T><unknown>Terminal.ActiveTerminals[index];
		}
		
		if (currentTerminal && singleton) {
			currentTerminal.show(true);

			if (options.cwd) {
				this.sendText(`cd '${options.cwd}'`, true);
			}
		} else {
			let spawnOptions:SpawnOptions = {
				cwd: options.cwd.toString(),				
			};

			return new Promise((resolve, reject) => {
				this._terminal = (<any>vscode.window).createTerminal({
					name: options.name || Terminal.defaultTerminalName,
					pty:  {
						onDidWrite: this._onDidWrite.event,
						open: () => {
							Terminal.ActiveTerminals.push(this);
							this.show(true);

							this._process = child_process.spawn(options.shellPath, spawnOptions);
							this._process.stdout.on("data", data => {
								this._outputBuffer.push(data.toString().replace(this._inputCommand, "").replace("\r", "").replace("\n", ""));

								if (!Utilities.IsNullOrEmpty(this._inputCommand)) {
									this.write(data.toString().replace(this._inputCommand, ""));
								} else {
									this.write(data.toString());
								}

								const prompt = /(PS )(.*)(> )/i.exec(data.toString());

								if (prompt && prompt.length > 2) {
									if (this._path !== prompt[2]) {
										this._path = prompt[2];
									}

									if (this._outputBuffer[this._outputBuffer.length - 1] === prompt[0]) {
										this._outputBuffer.pop();
									} else {
										this._outputBuffer[this._outputBuffer.length - 1] = this._outputBuffer[this._outputBuffer.length - 1].replace(prompt[0], "");
									}

									this.resolveIncomingCommand<T>(resolve, reject);
								}
							});
							this._process.stderr.on("data", data => {
								this._errorBuffer.push(data.toString().replace(this._inputCommand, "").replace("\r", "").replace("\n", ""));

								if (!Utilities.IsNullOrEmpty(this._inputCommand)) {
									this.writeColor(3, data.toString().replace(this._inputCommand, ""));
								} else {
									this.writeColor(3, data.toString());
								}

								const prompt = /(PS )(.*)(> )/i.exec(data.toString());

								if (prompt && prompt.length > 2) {
									if (this._path !== prompt[2]) {
										this._path = prompt[2];
									}

									if (this._errorBuffer[this._errorBuffer.length - 1] === prompt[0]) {
										this._errorBuffer.pop();
									} else {
										this._errorBuffer[this._errorBuffer.length - 1] = this._errorBuffer[this._errorBuffer.length - 1].replace(prompt[0], "");
									}

									this.resolveIncomingCommand<T>(resolve, reject);
								}
							});
				
							this._onDidOpen.fire();
						},
						close: () => {
							this._onDidClose.fire();

							const index = Terminal.ActiveTerminals.findIndex(t => t.name === this.name);

							if (index !== -1) {
								Terminal.ActiveTerminals.splice(index, 1);
							}

							this._process.stdin.end();
							this._process.dispose();
						},
						handleInput: (data: string) => {
							this._onDidReceiveInput.fire(data);

							if (data === '\r') { // Enter
								this.write('\r\n');
								this._cursorPosition = 0;

								if (this._process) {
									this._process.stdin.write(this._inputCommand + "\r\n"); 
								}

								return;
							}

							if (data === '\x7f') { // Backspace
								if (this._inputCommand.length === 0 || this._cursorPosition === 0) {
									return;
								}

								this._cursorPosition--;
								this._inputCommand = this._inputCommand.substr(0, this._inputCommand.length - 1);
								// Move cursor backward
								this.write('\x1b[D');
								// Delete character
								this.write('\x1b[P');

								return;
							}

							this.write(data);
							this._inputCommand += data;
							this._cursorPosition++;
						}
					}});
				});
		}
	}

	private resolveIncomingCommand<T extends vscode.Terminal>(resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) {
		if (!Utilities.IsNullOrEmpty(this._inputCommand) || this._outputBuffer.length > 0 || this._errorBuffer.length > 0) {
			const command = new TerminalCommand(this._inputCommand, this._outputBuffer.join(""), this._errorBuffer.join(""));

			this._onDidRunCommand.fire(command);
			this._commandBuffer.push(command);

			if (this._commandBuffer.length > Terminal.maximumCommandBufferSize) {
				this._commandBuffer.splice(0, this._commandBuffer.length - Terminal.maximumCommandBufferSize);
			}

			if (resolve && this._errorBuffer.length === 0) {
				resolve(<T><unknown>this);
			}
			else if (reject && this._errorBuffer.length > 0) {
				reject(<T><unknown>this);
			}

			this._inputCommand = "";
			this._outputBuffer = [];
			this._errorBuffer = [];
		}
	}

	clear(): Terminal {
		if (this._terminal) {
			this.write('\x1b[2J\x1b[3J\x1b[;H\r');
		}

		return this;
	}

	line(text:string): Terminal {
		this.sendText(text, true);

		return this;
	}

	text(text:string): Terminal {
		this.sendText(text, false);

		return this;
	}

	enter(): Terminal {
		this.sendText("", true);

		return this;
	}

	sensitive(text:string): Terminal {
		this._isMasked = true;
		this.sendText(text, false);
		this._isMasked = false;

		return this;
	}

	sendText(text: string, addNewLine?: boolean): void {
		if (this._isMasked) {
			for (let i = 0; i < text.length; i++) {
				this.write("*");
			}
		} else {
			this.write(text);
		}

		this._inputCommand += text;

		if (addNewLine) {
			this.write("\r\n");

			if (this._process) { this._process.stdin.write(this._inputCommand + "\r\n"); }
		}
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
			this.create(this._options).then(terminal => {
				terminal.show(preserveFocus);
			});
		} else {
			this._terminal.show(preserveFocus);
		}
	}

	hide(): void {
		if (this._terminal) {
			this._terminal.hide();
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

	dispose(): void {
		if (this._terminal) {
			this._terminal.dispose();
		}

		if (this._process) {
			this._process.stdin.end();
			this._process.dispose();
		}
	}
}

export default class DynamicsTerminal implements IWireUpCommands
{
	wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void {
		const terminal:Terminal = new Terminal();

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.createTerminal, (folder:string):Promise<Terminal> => {
			if (!folder || !fs.existsSync(folder)) {
				folder = context.globalStoragePath;
			}

			return terminal.create<Terminal>({
					name: Terminal.defaultTerminalName,
					shellPath: "powershell.exe",
					cwd: folder 
				}, true)
				.then(term => {
					term.onDidClose(() => {
						term.dispose();
						term = null;
					});

					return terminal;
				});
		}));

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.clearTerminal, async () => {
			if (!terminal) {
				await vscode.commands.executeCommand(cs.dynamics.extension.createTerminal);
			}

			terminal.clear();

			return terminal;
		}));
	}

    public static showTerminal(path: string): Thenable<Terminal> {
		return vscode.commands.executeCommand(cs.dynamics.extension.createTerminal, path);
	}
}