import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as StreamZip from 'node-stream-zip';

/**
 * Recursively copy folder from src to dest
 * @param source source folder
 * @param destination destination folder
 */
export async function CopyFolder(source: string, destination: string): Promise<boolean> {
	// read contents of source directory
	const entries : string[] = fs.readdirSync(source);

	// synchronously create destination if it doesn't exist to ensure 
	//    its existence before we copy individual items into it
	if (!fs.existsSync(destination)) {
		try {
			fs.mkdirSync(destination);
		} catch (err) {
			return Promise.reject(err);
		}
	} else if (!fs.lstatSync(destination).isDirectory()) {
		return Promise.reject(new Error("Unable to create directory '" + destination + "': already exists as file."));
	}

    let promises : Promise<boolean>[] = [];
    
    for(let entry of entries) {
		
		// full path of src/dest
		const srcPath = path.join(source,entry);
		const destPath = path.join(destination,entry);
		
		// if directory, recursively copy, otherwise copy file
        if(fs.lstatSync(srcPath).isDirectory()) {
            promises.push(CopyFolder(srcPath, destPath));
        } else {
			try {
				fs.copyFileSync(srcPath, destPath);
			} catch (err) {
				promises.push(Promise.reject(err));
			}
        }
	}

	await Promise.all(promises).then(
		(value: boolean[] )  => { 
			return value; 
		},
		(reason: any) => {
			console.log(reason);
			return Promise.reject(reason);
		}
	);

	return Promise.resolve(true);
}

/**
 * Recursively delete a directory and all contained contents
 * @param folder directory to delete
 */
export async function DeleteFolder(folder: string): Promise<boolean> {

	if (fs.existsSync(folder) && fs.lstatSync(folder).isDirectory()) {
		let promises = fs.readdirSync(folder).map(
			function(entry : string) {
				let fn = path.join(folder, entry);

                if (fs.lstatSync(fn).isDirectory()) {
					return DeleteFolder(fn);
				} else {
					try {
						fs.unlinkSync(fn);
					} catch (err) {
						console.error("Failed to delete '" + fn + "':" + err);

                        return Promise.reject(err);
					}

                    return Promise.resolve(true);
				}
			}
		);

		// wait for all promises
		await Promise.all(promises).then(
			(value: boolean[] )  => { 
				return value; 
			},
			(reason: any) => {
				console.log(reason);

                return Promise.reject(reason);
			}
		);
		
		// remove directory
		try {
			fs.rmdirSync(folder);
		} catch(err) {
			console.error("Failed to remove directory '" + folder + "': " + err);

            return Promise.reject(err);
		}

        return Promise.resolve(true);
	}

    return Promise.resolve(false);
}

/**
 * Recursively make directories
 * @param path destination path
 */
export function MakeFolderSync(destination: string, mode: string | number | null | undefined = undefined): boolean {
	// check if exists
	if (fs.existsSync(destination)) {
		if (fs.lstatSync(destination).isDirectory()) {
			return true;
		} else {
			return false;
		}
	}

	// empty path, we failed
	if (!path) {
		return false;
	}

	// ensure existence of parent
	let parent = path.dirname(destination);

    if (!MakeFolderSync(parent, mode)) {
		return false;
	}

	// make current directory
	fs.mkdirSync(destination, mode);

    return true;
}

export function Unzip(archive:string, destination:string): Promise<number>
{
	const zip = new StreamZip({
		file: archive,
		storeEntries: true
	});

	return new Promise((resolve, reject) => {
		zip.on('ready', () => {
			MakeFolderSync(destination);
			zip.extract(null, destination, (err, count) => {
				zip.close();

				if (err) {
					reject(err);
				}

				resolve(count);
			});
		});	
	});
}

/**
 * Helper funcion to open a folder in the user's file manager
 * @export
 * @param {string} folder folder to open
 */
export function openFolderInExplorer(folder: string) {
    let command = "";
    
    switch (process.platform) {
        case 'linux':
            command = 'xdg-open';
            break;
        case 'darwin':
            command = 'open';
            break;
        case 'win32':
            command = 'explorer.exe';
            break;
    }

	// executute open folder command
    if (command) {
        child_process.spawn(command, [folder]);
    }
}