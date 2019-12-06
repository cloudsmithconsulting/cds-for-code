import { Console } from 'console';
import { Writable } from 'stream';
import * as vscode from 'vscode';

const outputChannel = vscode.window.createOutputChannel("CloudSmith Extension");
const writableStream: Writable = new Writable({
    write: (chunk: any, _: string, done: () => void) => {
        outputChannel.append(chunk.toString(chunk.encoding || 'utf8'));

        done();
    },
    writev: (chunks: { chunk: any, encoding: string }[], done: () => void) => {
        chunks.forEach(i => outputChannel.append(i.chunk.toString(i.encoding || 'utf8')));
        
        done();
    },
});

type Logger = Console & { outputChannel?: vscode.OutputChannel };
const logger: Logger = new Console({ stdout: writableStream, stderr: writableStream });

logger.clear = outputChannel.clear.bind(outputChannel);
logger.outputChannel = outputChannel;

export default logger;