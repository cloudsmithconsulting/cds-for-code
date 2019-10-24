import * as vscode from "vscode";
import * as cs from '../cs';

export class QuickPicker {
	/**
	 * shows a QuickPick-Panel in the VS Code Window
	 * @param placeHolder text to display when nothing was chosen
	 * @param options options to choose from
	 */
	static async showQuickPick(placeHolder: string, ...options: QuickPickOption[]): Promise<QuickPickOption> {
		const option = await vscode.window.showQuickPick(options, { placeHolder: placeHolder });

        if (option) {
			return option;
		}

		return null;
	}    
}

export default class QuickPickOption implements vscode.QuickPickItem {
	public label: string;
	public command: string;
	public description: string;
    public context: any;
    public detail: string;
    public picked?: boolean;
    public alwaysShow?: boolean;

	constructor(label: string, command: string, description: string='', context?: any) {
		this.label = label;
		this.command = command;
        this.description = description;
        this.context = context;
    }
    
    public invokeCommand<T>(...options:any[]): Thenable<T>
    {
        if (this.command) {
            return vscode.commands.executeCommand(this.command, options);
        }

        return null;
    }

	static cancel = new QuickPickOption('Cancel', cs.dynamics.controls.quickPicker.cancel, 'ESC');
	static quit = new QuickPickOption('Close Window', cs.dynamics.controls.quickPicker.quit);
}