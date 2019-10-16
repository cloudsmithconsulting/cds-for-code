// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    //const oldState = vscode.getState();

    const errorPanel = document.getElementById("errorPanel");
    const errorMessage = document.getElementById("errorMessage");
    const submitButton = document.getElementById("submitButton");
    
    submitButton.addEventListener("click", event => {
        event.preventDefault();

        const settings = {
            authType: parseInt(document.getElementById("AuthType").value),
            domain: document.getElementById("Domain").value,
            password: document.getElementById("Password").value,
            name: document.getElementById("Name").value,
            username: document.getElementById("Username").value,
            webApiUrl: document.getElementById("ServerUrl").value,
            webApiVersion: document.getElementById("WebApiVersion").value
        };

        if (!validateForm(settings)) return;

        vscode.postMessage({
            command: 'createConnection',
            settings
        });
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case "connectionError":
                showConnectionError(message.message);
                break;
        }
    });

    function showConnectionError(message) {
        // build and inject error message
        const errorHtml = message;
        errorMessage.innerHTML = errorHtml;
        // show this panel
        errorPanel.removeAttribute('hidden');
    }

    function validateForm(settings) {
        const messages = [];

        if (isNullOrEmpty(settings.webApiUrl))
            messages.push("The Server URL is required");
        if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.[a-z]{2,5})?(:[0-9]{1,5})?(\/.*)?$/gi.test(settings.webApiUrl))
            messages.push("The Server URL is invalid");
        if (isNullOrEmpty(settings.domain))
            messages.push("The Domain is required");
        if (isNullOrEmpty(settings.username))
            messages.push("The Username is required");
        if (isNullOrEmpty(settings.password))
            messages.push('The Password is required')
        
        if (messages.length > 0) {
            // build and inject error message
            const errorHtml = `&nbsp;&nbsp;-&nbsp;${messages.join("<br/>&nbsp;&nbsp;-&nbsp;")}`
            errorMessage.innerHTML = errorHtml;
            // show this panel
            errorPanel.removeAttribute('hidden');
        } else {
            errorPanel.attributes["hidden"] = "hidden";
        }

        return messages.length === 0;
    }

    function isNullOrEmpty(str) {
        return (!str || str.replace(/\s/gi, "").length === 0);
    }
}());