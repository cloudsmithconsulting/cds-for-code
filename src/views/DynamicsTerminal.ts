import * as vscode from 'vscode';
import IWireUpCommands from '../wireUpCommand';
import * as cs from '../cs';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { SpawnOptions } from 'child_process';
import Utilities from '../helpers/Utilities';
import { resolveSoa } from 'dns';

export class TerminalCommand {
	private _command:string;
	private _output:string;

	constructor(command: string, output: string) {
		this._command = command;
		this._output = output;
	}

	get command():string { 
		return this._command;
	}

	get output():string {
		return this._output;
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
	private _output:string[] = [];
	private _error:string[] = [];
	private _position:number = 0;

	onDidWrite: vscode.Event<string> = this._onDidWrite.event;
	onDidOpen: vscode.Event<void> = this._onDidOpen.event;
	onDidClose: vscode.Event<void> = this._onDidClose.event;
	onDidReceiveInput: vscode.Event<string> = this._onDidReceiveInput.event;
	onDidRunCommand: vscode.Event<TerminalCommand> = this._onDidRunCommand.event;
	onDidError: vscode.Event<TerminalCommand> = this._onDidError.event;
	
	static readonly defaultTerminalName: string = "CloudSmith Terminal";

	get isMasked(): boolean {
		return this._isMasked;
	}

	get name(): string {
		return this._terminal.name;
	}

	get path(): string {
		return this._path;
	}

	get processId(): Thenable<number> {
		return this._process.pid;
	}

	constructor(options?:vscode.TerminalOptions, singleton:boolean = true) 
	{ 
		if (options) {
			this._options = options;
		}
	}

	create(options?:vscode.TerminalOptions, singleton:boolean = true): Promise<Terminal>
	{
		options = options || this._options;
		const index = vscode.window.terminals.findIndex(t => t.name === options.name);

		if (index !== -1 && singleton) {
			return Promise.resolve(<Terminal>vscode.window.terminals[index]);
		}

		if (index === -1) {
			let spawnOptions:SpawnOptions = {
				cwd: options.cwd.toString(),				
			};

			return new Promise((resolve, reject) => {
				this._terminal = (<any>vscode.window).createTerminal({
					name: options.name || Terminal.defaultTerminalName,
					pty:  {
						onDidWrite: this._onDidWrite.event,
						open: () => {
							this._process = child_process.spawn(options.shellPath, spawnOptions);
							this._process.stdout.on("data", data => {
								this._output.push(data.toString().replace(this._inputCommand, "").replace("\r", "").replace("\n", ""));
				
								const result = /(PS )(.*)(> )/i.exec(data.toString());

								if (result && result.length > 2) {
									this._path = result[2];

									if (this._output[this._output.length - 1] === result[0]) {
										this._output.pop();
									} else {
										this._output[this._output.length - 1] = this._output[this._output.length - 1].replace(result[0], "");
									}

									if (resolve) { 
										resolve(this); 
									}

									if (!Utilities.IsNullOrEmpty(this._inputCommand) && this._output.length > 0) {
										this._onDidRunCommand.fire(new TerminalCommand(this._inputCommand, this._output.join("")));

										this._inputCommand = "";
										this._output = [];
									}
								}

								if (!Utilities.IsNullOrEmpty(this._inputCommand)) {
									this.write(data.toString().replace(this._inputCommand, ""));
								} else {
									this.write(data.toString());
								}
							});
							this._process.stderr.on("data", data => {
								this._error.push(data.toString().replace(this._inputCommand, "").replace("\r", "").replace("\n", ""));
				
								const result = /(PS )(.*)(> )/i.exec(data.toString());

								if (result && result.length > 2) {
									if (reject) { reject(this); }

									this._path = result[2];

									if (this._error[this._error.length - 1] === result[0]) {
										this._error.pop();
									} else {
										this._error[this._error.length - 1] = this._error[this._error.length - 1].replace(result[0], "");
									}

									if (!Utilities.IsNullOrEmpty(this._inputCommand) && this._error.length > 0) {
										this._onDidError.fire(new TerminalCommand(this._inputCommand, this._error.join("")));

										this._inputCommand = "";
										this._error = [];
									}
								}

								if (!Utilities.IsNullOrEmpty(this._inputCommand)) {
									this.writeColor(3, data.toString().replace(this._inputCommand, ""));
								} else {
									this.writeColor(3, data.toString());
								}
							});
				
							this._onDidOpen.fire();
						},
						close: () => {
							this._onDidClose.fire();

							this._process.stdin.end();
							this._process.dispose();
						},
						handleInput: (data: string) => {
							this._onDidReceiveInput.fire(data);

							if (data === '\r') { // Enter
								this.write('\r\n');
								this._position = 0;

								if (this._process) {
									this._process.stdin.write(this._inputCommand + "\r\n"); 
								}

								return;
							}

							if (data === '\x7f') { // Backspace
								if (this._inputCommand.length === 0 || this._position === 0) {
									return;
								}

								this._position--;
								this._inputCommand = this._inputCommand.substr(0, this._inputCommand.length - 1);
								// Move cursor backward
								this.write('\x1b[D');
								// Delete character
								this.write('\x1b[P');

								return;
							}

							this.write(data);
							this._inputCommand += data;
							this._position++;
						}
					}});
				});
			
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

			if (this._process) { this._process.stdin.write(text + "\r\n"); }
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
		let terminal:Terminal;

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.createTerminal, (folder:string):Promise<Terminal> => {
			if (!folder || !fs.existsSync(folder)) {
				folder = context.globalStoragePath;
			}

			const isNew:boolean = !terminal;

			terminal = terminal || new Terminal();

			return terminal.create({
					name: Terminal.defaultTerminalName,
					shellPath: "powershell.exe",
					cwd: folder 
				}, true)
				.then(term => {
					term.show();
					term.onDidClose(() => {
						term.dispose();
						term = null;
					});

					if (!isNew) { 
						term.sendText(`cd ${folder}`, true); 
					}

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