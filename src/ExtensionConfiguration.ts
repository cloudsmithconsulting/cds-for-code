import * as vscode from 'vscode';
import * as cs from './cs';

export default class ExtensionConfiguration {
    private static _configurations: { [key: string]: vscode.WorkspaceConfiguration } = {};
    private static _validConfigurations: { [key: string]: boolean } = {};

    public static getConfiguration(namespace:string): vscode.WorkspaceConfiguration {
        if (!this._configurations || !this._configurations[namespace] || !this._validConfigurations || !this._validConfigurations[namespace])
        {
            // get root config
            const config = vscode.workspace.getConfiguration(namespace);

                this._configurations[namespace] = config;
                this._validConfigurations[namespace] = this.validateConfiguration(namespace, config);
        }
        
        // return the configuration
        return this._configurations[namespace];
    }

    public static getConfigurationValue<T>(...value:string[]): T
    {
        const parsedKey = this.parseConfigurationString(...value);

        if (parsedKey.namespace && this.getConfiguration(parsedKey.namespace))
        {
            return this.getConfiguration(parsedKey.namespace).get(parsedKey.configKey) as T;
        }
        else
        {
            return null;
        }
    }

    // can be called 2 ways:
    // parseConfigurationValue<string>(config, "root.namespace", "value");
    // parseConfigurationValue<string>(config, "root.namespace.value");
    public static parseConfigurationValue<T>(config:vscode.WorkspaceConfiguration, ...value:string[]): T
    {
        const parsedKey = this.parseConfigurationString(...value);

        return config.get(parsedKey.configKey) as T;
    }

    private static validateConfiguration(namespace:string, config:vscode.WorkspaceConfiguration): boolean
    {
        let returnValue:boolean = true;

        switch (namespace)
        {
            case cs.dynamics.configuration._namespace:
                // Check SDK Install Path
                const sdkInstallPath = this.parseConfigurationValue<string>(config, cs.dynamics.configuration.sdkInstallPath);

                if (!sdkInstallPath
                    || sdkInstallPath === undefined
                    || sdkInstallPath.length === 0) {
                        returnValue = false;
                        vscode.window.showErrorMessage(
                            `The configuration setting cs.dynamics.configuration.sdkInstallPath is invalid or not set.`
                    );
                }

                break;
        }

        return returnValue;
    }

    private static parseConfigurationString(...value:string[]): { namespace:string, configKey:string }
    {
        let namespace:string, configKey:string;

        if (value.length === 1) {
            const splitValues = value[0].split(".");
            
            if (splitValues.length < 2) {
                throw new Error(`The parameter '${value[0]}' supplied to parseConfigurationString() does not contain a namespace and configuration value.`);
            }
            else {
                configKey = splitValues[splitValues.length - 1];
                namespace = value[0].replace(`.${configKey}`, "");
            }
        }
        else if (value.length === 2) {
            configKey = value[1];
            namespace = value[0];
        }
        else {
            throw new Error(`The parameter '${value.join(", ")}' supplied to parseConfigurationString() has too many elements.`);
        }

        return { namespace, configKey };
    }
}