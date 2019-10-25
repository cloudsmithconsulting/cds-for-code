import * as vscode from 'vscode';
import IWireUpCommands from '../wireUpCommand';
import * as cs from '../cs';

export class Terminal implements vscode.Terminal {
	private _onDidWrite: vscode.EventEmitter<string> = new vscode.EventEmitter<string>();
	private _onDidOpen: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	private _onDidClose: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	private _onDidReceiveInput: vscode.EventEmitter<string> = new vscode.EventEmitter<string>();
	private _insideTerminal: vscode.Terminal;
	private _hiddenTerminal: vscode.Terminal;
	private _isMasked: boolean = false;

	readonly onDidWrite: vscode.Event<string> = this._onDidWrite.event;
	readonly onDidOpen: vscode.Event<void> = this._onDidOpen.event;
	readonly onDidClose: vscode.Event<void> = this._onDidClose.event;
	readonly onDidReceiveInput: vscode.Event<string> = this._onDidReceiveInput.event;
	static readonly defaultTerminalName: string = "CloudSmith Terminal";

	get isMasked(): boolean {
		return this._isMasked;
	}

	get name(): string {
		return this._insideTerminal.name;
	}

	get processId(): Thenable<number> {
		return this._insideTerminal.processId;
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

		if (index !== -1 && !singleton) {
			vscode.window.terminals[index].dispose();
		}

		if (index === -1) {
			this._hiddenTerminal = (<any>vscode.window).createTerminal({
				name: `${options.name}_hidden` || `${Terminal.defaultTerminalName}_hidden`,
				shellPath: options.shellPath,
				shellArgs: options.shellArgs,
				cwd: options.cwd,
				env: options.env,
				strictEnv: options.strictEnv,
				//TODO: hard code this to yes.
				hideFromUser: options.hideFromUser,
				pty: {
					onDidWrite: (data: string) => {
						this.write(data);
					},
					open: () => console.log("Secure terminal opened."),
					close: () => console.log("Secure terminal closed."),
					handleInput: (data: string) => { }
				}
			});

			this._insideTerminal = (<any>vscode.window).createTerminal({
				name: options.name || Terminal.defaultTerminalName,
				hideFromUser: options.hideFromUser,
				pty: {
					onDidWrite: this.onDidWrite,
					open: this._onDidOpen.fire(),
					close: this._onDidClose.fire(),
					handleInput: (data: string) => { 
						if (data === '\r') {
							this._hiddenTerminal.sendText(data, true);
						} else {
							this._hiddenTerminal.sendText(data, false);
						}

						if (this.isMasked) {
							this.write("*");
						} else {
							this.write(data);
						}
					}
				}
			});
		}
	}

	clear() {
		if (this._insideTerminal) {
			this.write('\x1b[2J\x1b[3J\x1b[;H');
		}
	}

	sendText(text: string, addNewLine?: boolean): void {
		if (this._insideTerminal) {
			this._insideTerminal.sendText(text, addNewLine);
		}
	}

	sendColorText(color: number, text: string, addNewLine?: boolean): void {
		if (color > 6) { color = 6; }
		if (color < 0) { color = 0; }

		this.sendText(`\x1b[3${color}m${text}\x1b[0m`, addNewLine);
	}

	show(preserveFocus?: boolean): void {
		if (this._insideTerminal) {
			this._insideTerminal.show(preserveFocus);
		}
	}

	hide(): void {
		if (this._insideTerminal) {
			this._insideTerminal.hide();
		}		
	}

	private write(value:string) {
		this._onDidWrite.fire(value);
	}

	dispose(): void {
		if (this._insideTerminal) {
			this._insideTerminal.dispose();
		}
	}
}

export default class DynamicsTerminal implements IWireUpCommands
{
	wireUpCommands(context: vscode.ExtensionContext, config?: vscode.WorkspaceConfiguration): void {
		const terminal = new Terminal();

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.createTerminal, (folder:string) => {

			terminal.create({
				name: "CloudSmith Dynamics Terminal",
				// make sure we get powershell
				shellPath: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
				cwd: folder // current working directory
			});
		}));

		context.subscriptions.push(vscode.commands.registerCommand(cs.dynamics.extension.clearTerminal, () => {
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