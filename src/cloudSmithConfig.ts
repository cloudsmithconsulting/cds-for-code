import * as vscode from 'vscode';

export default class CloudSmithConfig {
    public static returnValidConfig(): vscode.WorkspaceConfiguration {
        // get root config
        const config = vscode.workspace.getConfiguration('cloudSmith');

        // check config value
        const crmSdkRoot = config.get('crmSdkRootPath') as string;
        // get the svcutil path from configuration
        if (!crmSdkRoot
            || crmSdkRoot === undefined
            || crmSdkRoot.length === 0) {
            vscode.window.showErrorMessage(
                `The configuration setting cloudSmith.crmSdkRootPath was invalid or not set.`
            );
        }
        
        // return the configuration
        return config;
    }
}