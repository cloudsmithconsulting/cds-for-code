// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    //const oldState = vscode.getState();

    const outputDiv = document.getElementById("output");
    const submitButton = document.getElementById("submitButton");
    
    submitButton.addEventListener("click", event => {
        event.preventDefault();

        outputDiv.innerHTML =  "Form Submitted!";

        vscode.postMessage({
            command: 'createConnection',
            settings: {
                server: document.getElementById("Server").value,
                port: document.getElementById("Port").value,
                useSsl: document.getElementById("UseSsl").value === "true",
                domain: document.getElementById("Domain").value,
                username: document.getElementById("Username").value,
                password: document.getElementById("Password").value
            }
        });
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'connectionCreated':
                outputDiv.innerHTML =  "Your connection was created!";
                break;
        }
    });
}());