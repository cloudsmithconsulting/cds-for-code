// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    // changeTab() comes from tabs.js
    // viewRenderer.addScript('tabs.js');
    changeTab(null, 'Filtering');

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data;

        switch (message.command) {
            case "configure":
                break;
        }
    });

}());