// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    //const oldState = vscode.getState();

    const localOutputDiv = document.getElementById("localOutput");
    const serverOutputDiv = document.getElementById("serverOutput");
    const submitButton = document.getElementById("submitButton");
    
    submitButton.addEventListener("click", event => {
        event.preventDefault();

        localOutputDiv.innerHTML =  "Form Submitted!";

        vscode.postMessage({
            command: 'createConnection',
            settings: {
                authType: document.getElementById("AuthType").value,
                serverUrl: document.getElementById("ServerUrl").value,
                domain: document.getElementById("Domain").value,
                workstation: document.getElementById("Workstation").value,
                accessToken: document.getElementById("AccessToken").value,
                username: document.getElementById("Username").value,
                password: document.getElementById("Password").value,
                webApiVersion: document.getElementById("WebApiVersion").value
            }
        });
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'connectionCreated':
                serverOutputDiv.innerHTML =  "Your connection was created!";
                break;
        }
    });
}());