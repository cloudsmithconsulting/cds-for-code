import { Console } from 'console';
import { Writable } from 'stream';
import * as vscode from 'vscode';
import * as cs from '../cs';
import Dictionary from './types/Dictionary';

export type Logger = Console & { outputChannel?: vscode.OutputChannel };

export class ExtensionLogger {
    private static _instance: Dictionary<string, ExtensionLogger>;

    static get Instance(): Dictionary<string, ExtensionLogger> {
        if (!this._instance) {
            this._instance = new Dictionary<string, ExtensionLogger>();
            this.create("default", cs.cds.extension.productName);
        }

        return this._instance;
    }

    static create(key: string, channelName: string) {
        if (!this.Instance.containsKey(key)) {
            this.Instance.add(key, new ExtensionLogger(channelName));
        } else {
            this.Instance[key].dispose();
            this.Instance[key] = new ExtensionLogger(channelName);
        }
    }

    static remove(key: string) {
        if (this.Instance.containsKey(key)) {
            this.Instance[key].dispose();
            this.Instance.remove(key);
        }
    }

    private outputChannel: vscode.OutputChannel;
    private writableStream: Writable; 
    private logger: Logger;

    private constructor(channelName: string) {
        this.outputChannel = vscode.window.createOutputChannel(channelName);
        this.writableStream = new Writable({
            write: (chunk: any, _: string, done: () => void) => {
                this.outputChannel.append(chunk.toString(chunk.encoding || 'utf8'));
        
                done();
            },
            writev: (chunks: { chunk: any, encoding: string }[], done: () => void) => {
                chunks.forEach(i => this.outputChannel.append(i.chunk.toString(i.encoding || 'utf8')));
                
                done();
            },
        });

        this.logger = new Console({ stdout: this.writableStream, stderr: this.writableStream });
        this.logger.clear = this.outputChannel.clear.bind(this.outputChannel);
        this.logger.outputChannel = this.outputChannel;
    }

    dispose() {
        if (this.writableStream) { 
            this.writableStream.destroy();
        }

        if (this.outputChannel) { 
            this.outputChannel.dispose();
        }
    }

    /**
     * A simple assertion test that verifies whether `value` is truthy.
     * If it is not, an `AssertionError` is thrown.
     * If provided, the error `message` is formatted using `util.format()` and used as the error message.
     */
    assert(value: any, message?: string, ...optionalParams: any[]): void {
        this.logger.assert(value, message, ...optionalParams);
    }

    /**
     * Clears the current output window.
     */
    clear(): void {
        this.logger.clear();
    }

    /**
     * Maintains an internal counter specific to `label` and outputs to `stdout` the number of times `console.count()` has been called with the given `label`.
     */
    count(label?: string): void {
        this.logger.count(label);
    }

    /**
     * Resets the internal counter specific to `label`.
     */
    countReset(label?: string): void {
        this.logger.countReset(label);
    }

    /**
     * The `console.debug()` function is an alias for {@link console.log()}.
     */
    debug(message?: any, ...optionalParams: any[]): void {
        this.logger.debug(message, ...optionalParams);
    }

    /**
     * Prints to `stderr` with newline.
     */
    error(message?: any, ...optionalParams: any[]): void {
        this.logger.error(message, ...optionalParams);
    }

    /**
     * Increases indentation of subsequent lines by two spaces.
     * If one or more `label`s are provided, those are printed first without the additional indentation.
     */
    group(...label: any[]): void {
        this.logger.group(...label);
    }

    /**
     * Decreases indentation of subsequent lines by two spaces.
     */
    groupEnd(): void {
        this.logger.groupEnd();
    }

    /**
     * The {@link console.info()} function is an alias for {@link console.log()}.
     */
    info(message?: any, ...optionalParams: any[]): void {
        this.logger.info(message, ...optionalParams);
    }

    /**
     * Prints to `stdout` with newline.
     */
    log(message?: any, ...optionalParams: any[]): void {
        this.logger.log(message, ...optionalParams);
    }

    /**
     * This method does not display anything unless used in the inspector.
     *  Prints to `stdout` the array `array` formatted as a table.
     */
    table(tabularData: any, properties?: string[]): void { 
        this.logger.table(tabularData, properties);
    }

    /**
     * Starts a timer that can be used to compute the duration of an operation. Timers are identified by a unique `label`.
     */
    time(label?: string): void {
        this.logger.time(label);
    }

    /**
     * Stops a timer that was previously started by calling {@link ExtensionLogger.time()} and prints the result to `stdout`.
     */
    timeEnd(label?: string): void {
        this.logger.timeEnd(label);
    }

    /**
     * For a timer that was previously started by calling {@link ExtensionLogger.time()}, prints the elapsed time and other `data` arguments to `stdout`.
     */
    timeLog(label?: string, ...data: any[]): void {
        this.logger.timeLog(label, ...data);
    }

    /**
     * Prints to `stderr` the string 'Trace :', followed by the {@link util.format()} formatted message and stack trace to the current position in the code.
     */
    trace(message?: any, ...optionalParams: any[]): void {
        this.logger.trace(message, ...optionalParams);
    }

    /**
     * The {@link console.warn()} function is an alias for {@link console.error()}.
     */
    warn(message?: any, ...optionalParams: any[]): void {
        this.logger.warn(message, ...optionalParams);
    }
}

export default ExtensionLogger.Instance["default"];