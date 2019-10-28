import * as vscode from 'vscode';
import IWireUpCommands from '../wireUpCommand';
import * as cs from '../cs';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { SpawnOptions } from 'child_process';

export class Terminal implements vscode.Terminal {
	private _onDidWrite: vscode.EventEmitter<string> = new vscode.EventEmitter<string>();
	private _onDidOpen: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	private _onDidClose: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	private _onDidReceiveInput: vscode.EventEmitter<string> = new vscode.EventEmitter<string>();
	private _terminal: vscode.Terminal;
	private _process;
	private _isMasked: boolean = false;
	private _inputCommand:string = "";
	private _output:string[] = [];
	private _error:string[] = [];

	readonly onDidWrite: vscode.Event<string> = this._onDidWrite.event;
	readonly onDidOpen: vscode.Event<void> = this._onDidOpen.event;
	readonly onDidClose: vscode.Event<void> = this._onDidClose.event;
	readonly onDidReceiveInput: vscode.Event<string> = this._onDidReceiveInput.event;
	static readonly defaultTerminalName: string = "CloudSmith Terminal";

	get isMasked(): boolean {
		return this._isMasked;
	}

	get name(): string {
		return this._terminal.name;
	}

	get processId(): Thenable<number> {
		return this._process.pid;
	}

	constructor(options?:vscode.TerminalOptions, singleton:boolean = true) 
	{ 
		if (options) {
			this.create(options, singleton);
		}
	}

	create(options:vscode.TerminalOptions, singleton:boolean = true): void
	{
		const index = vscode.window.terminals.findIndex(t => t.name === options.name);

		if (index === -1) {
			let spawnOptions:SpawnOptions = {
				cwd: options.cwd.toString(),				
			};

			this._terminal = (<any>vscode.window).createTerminal({
				name: options.name || Terminal.defaultTerminalName,
				pty:  {
					onDidWrite: this._onDidWrite.event,
					open: () => this._onDidOpen.fire(),
					close: () => this._onDidClose.fire(),
					handleInput: (data: string) => {
						this._inputCommand += data;
						if (this._process) { this._process.stdin.write(data); }

						if (data === '\r') { // Enter
							this.write(data);

							this._output = [];
							this._error = [];
							this._inputCommand = '';
							
							return;
						}

						if (data === '\x7f') { // Backspace
							if (this._inputCommand.length === 0) {
								return;
							}

							this._inputCommand = this._inputCommand.substr(0, this._inputCommand.length - 1);
							// Move cursor backward
							this.write('\x1b[D');
							// Delete character
							this.write('\x1b[P');

							return;
						}
					}
				}});


			this._process = child_process.spawn(options.shellPath, spawnOptions);
			this._process.stdout.on("data", data => {
				this._output.push(data.toString());
				this.write(data.toString());
			});
			this._process.stderr.on("data", data => {
				this._error.push(data.toString());
				this.writeColor(2, data.toString());
			});
		}
	}

	clear() {
		if (this._terminal) {
			this.write('\x1b[2J\x1b[3J\x1b[;H');
		}
	}

	sendText(text: string, addNewLine?: boolean): void {
		if (this._terminal) {
			this._terminal.sendText(text, addNewLine);
		}
	}

	sendColorText(color: number, text: string, addNewLine?: boolean): void {
		if (color > 6) { color = 6; }
		if (color < 0) { color = 0; }

		this.sendText(`\x1b[3${color}m${text}\x1b[0m`, addNewLine);
	}

	show(preserveFocus?: boolean): void {
		if (this._terminal) {
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
			if (this._isMasked) {
				this._onDidWrite.fire("*");
			} else {
				this._onDidWrite.fire(value); 
			}
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

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.createTerminal, (folder:string) => {
			if (!folder || !fs.existsSync(folder))
			{
				folder = context.globalStoragePath;
			}

			terminal = new Terminal({
				name: "CloudSmith Dynamics Terminal",
				shellPath: "powershell.exe",
				cwd: folder 
			});

			terminal.show();
		}));

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.clearTerminal, async () => {
			if (!terminal) {
				await vscode.commands.executeCommand(cs.dynamics.extension.createTerminal);
			}

			terminal.clear();
		}));
	}

    public static showTerminal(path: string): vscode.Terminal {
        const terminalName = 'CloudSmith: Dynamics PowerShell';
		//see if our terminal is open all ready
		const index = vscode.window.terminals.findIndex(t => t.name === terminalName);
		if (index === -1) {
			// index wasn't found, return new terminal
			const result = vscode.window.createTerminal({
				name: terminalName,
				// make sure we get powershell
				shellPath: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
				cwd: path // current working directory
			});
			// show it
			result.show();
			// return it
			return result;
		}
		// get terminal with name at index
		const result = vscode.window.terminals[index];
		// change cwd
		result.sendText(`cd ${path}`);
		// show it
		result.show();
		// return it
		return result;
	}
}