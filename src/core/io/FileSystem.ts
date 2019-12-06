import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively copy folder from src to dest
 * @param source source folder
 * @param destination destination folder
 */
export async function copyFolder(source: string, destination: string): Promise<boolean> {
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
            promises.push(copyFolder(srcPath, destPath));
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

export async function copyItem(path:string, destination:string): Promise<void> {
	fs.copyFile(path, destination, (error) => {
		if (error) {
			return Promise.reject(error);
		}

		return Promise.resolve();
	});
}

export function copyItemSync(path:string, destination:string): void {
	fs.copyFileSync(path, destination);
}

export function exists(path:string): boolean {
	return fs.existsSync(path);
}

export function stats(item:string): fs.Stats | null {
	if (fs.existsSync(item)) {
		return fs.lstatSync(item);
	}

	return null;
}

export function walk(item:string, predicate?:(item:string) => boolean): Promise<any[] | null> {
	return new Promise((resolve, reject) => {
		_walk(item, predicate, (error, result) => {
			if (error) {
				reject(error);
			} else {
				resolve(result);
			}
		});
	});
}

export function walkSync(item: string): string[] {
	let list: any[] = []
		, files = fs.readdirSync(item)
		, stats;

	files.forEach(file => {
		stats = fs.lstatSync(path.join(item, file));
		if (stats.isDirectory()) {
			list = list.concat(walkSync(path.join(item, file)));
		} else {
			list.push(path.join(item, file));
		}
	});

	return list;
}

/**
 * Recursively apply a function on a pair of files or directories from source to dest.
 * 
 * @param source source file or folder
 * @param destination destination file or folder
 * @param func function to apply between src and dest
 * @return if recursion should continue
 * @throws Error if function fails
 */
export async function recurse(source: string, destination: string, func: (src: string, dest: string) => Promise<boolean>): Promise<boolean> {
	// apply function between src/dest
	let success = await func(source, destination);

	if (!success) {
		return false;
	}

	if (fs.lstatSync(source).isDirectory()) {
		// read contents of source directory and iterate
		const entries: string[] = fs.readdirSync(source);

		for (let entry of entries) {
			// full path of src/dest
			const srcPath = path.join(source, entry);
			const destPath = path.join(destination, entry);

			// if directory, recursively copy, otherwise copy file
			success = await recurse(srcPath, destPath, func);

			if (!success) {
				return false;
			}
		}
	}

	return true;
}

async function _walk(dir: string, predicate?:(item:string) => boolean, done?: (error: any, result: any[] | null) => void) {
	let results: any[] = [];
	const applyPredicate = (results:any[]) => {
		if (results && predicate) {
			results = results.filter(predicate);
		}

		return results;
	};

	fs.readdir(dir, (err, list) => {
		if (err) { return done ? done(err, null) : undefined; }

		let pending = list.length;
		if (!pending) { return done ? done(null, results) : undefined; }

		list.forEach(file => {
			file = path.resolve(dir, file);

			fs.stat(file, (err, stat) => {
				if (stat && stat.isDirectory()) {
					_walk(file, predicate, (err, res) => {
						results = results.concat(res);
						if (!--pending && done) { done(null, applyPredicate(results)); }
					});
				} else {
					results.push(file);
					if (!--pending && done) { done(null, applyPredicate(results)); }
				}
			});
		});
	});
}

export async function deleteItem(path:string): Promise<void> {
	if (fs.existsSync(path)) {
		fs.unlink(path, (error) => {
			if (error) {
				return Promise.reject(error);
			}

			return Promise.resolve();
		});
	} 
}

/**
 * Recursively delete a directory and all contained contents
 * @param folder directory to delete
 */
export async function deleteFolder(folder: string): Promise<boolean> {
	if (fs.existsSync(folder) && fs.lstatSync(folder).isDirectory()) {
		let promises = fs.readdirSync(folder).map(
			(entry:string) => {
				let fn = path.join(folder, entry);

                if (fs.lstatSync(fn).isDirectory()) {
					return deleteFolder(fn);
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
export function makeFolderSync(destination: string, mode: string | number | null | undefined = undefined): boolean {
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

    if (!makeFolderSync(parent, mode)) {
		return false;
	}

	// make current directory
	fs.mkdirSync(destination, mode);

    return true;
}

export function readFileSync(source: string, options?: string | { encoding: string; flag?:string; }): any {
	return fs.readFileSync(source, options || 'utf8');
}

export function writeFileSync(destination: string, data: any, options?: { encoding?: string | null; mode?: number | string; flag?: string; } | string | null): void {
	fs.writeFileSync(destination, data, options || 'utf8');
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