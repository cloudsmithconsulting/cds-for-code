import * as vscode from 'vscode';

export default class ExtensionConfiguration {
    private static _configurations: { [key: string]: vscode.WorkspaceConfiguration } = {};
    private static _notifiers: { [key: string]: (config: vscode.WorkspaceConfiguration) => void } = {};
    
    static updateConfiguration(namespace:string): void {
        if (this._configurations && this._configurations[namespace]) {
            delete this._configurations[namespace];
        }
    }

    static getConfiguration(namespace:string): vscode.WorkspaceConfiguration {
        if (!this._configurations || !this._configurations[namespace]) {
            // get root config
            const config = vscode.workspace.getConfiguration(namespace);
            
            // Auto-update configuration.
            vscode.workspace.onDidChangeConfiguration(e => {                
                if (e.affectsConfiguration(namespace) && this._configurations[namespace]) {
                    if (this._notifiers[namespace]) {
                        this._notifiers[namespace](vscode.workspace.getConfiguration(namespace));
                    }

                    delete this._configurations[namespace];
                }
            });

            if (this._notifiers[namespace]) {
                delete this._notifiers[namespace];
            }

            this._configurations[namespace] = config;
        }
        
        // return the configuration
        return this._configurations[namespace];
    }

    static getConfigurationInfo<T>(...config:string[]): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T, workspaceFolderValue?: T } | undefined {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey && parsedKey.namespace) {
            const configuration = this.getConfiguration(parsedKey.namespace);

            if (configuration) {
                return configuration.inspect<T>(parsedKey.configKey);
            }
        }

        return undefined;
    }

    static getConfigurationValue<T>(...config: string[]): T | undefined {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey && parsedKey.namespace) {
            const configuration = this.getConfiguration(parsedKey.namespace);

            if (configuration && configuration.has(parsedKey.configKey)) {
                return configuration.get<T>(parsedKey.configKey, undefined) as T;
            }
        }

        return undefined;
    }

    static setConfigurationValue<T>(config: string, value?: T, configurationTarget: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global): Thenable<void> | undefined {
        const parsedKey = this.parseConfigurationString(...config);

        if (parsedKey && parsedKey.namespace) {
            const configuration = this.getConfiguration(parsedKey.namespace);

            if (configuration && value) {
                configuration.update(parsedKey.configKey, value, configurationTarget);
            }
        } 

        return undefined;
    }

    static getConfigurationValueOrDefault<T>(config: string, defaultValue: T): T | undefined {
        const returnValue:T | undefined = this.getConfigurationValue(config);

        return returnValue || defaultValue;
    }

    // can be called 2 ways:
    // parseConfigurationValue<string>(config, "root.namespace", "value");
    // parseConfigurationValue<string>(config, "root.namespace.value");
    static parseConfigurationValue<T>(workspaceConfig: vscode.WorkspaceConfiguration, ...config: string[]): T {
        const parsedKey = this.parseConfigurationString(...config);

        return workspaceConfig.get<T>(parsedKey.configKey) as T;
    }

    static notify(namespace: string, notify?: (config: vscode.WorkspaceConfiguration) => void) {
        if (namespace && notify) {
            this._notifiers[namespace] = notify;
        }
    }

    static unnotify(namespace: string) {
        if (this._notifiers[namespace]) {
            delete this._notifiers[namespace];
        }
    }

    private static parseConfigurationString(...config: string[]): { namespace: string | undefined, configKey: string } {
        let namespace: string | undefined, configKey: string;
        const splitValues = config.join(".").split(".");

        configKey = splitValues[splitValues.length - 1];
        
        if (splitValues.length > 1) {
            namespace = splitValues.splice(0, splitValues.length - 1).join(".");
        }

        return { namespace, configKey };
    }
}