// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    //const oldState = vscode.getState();
    let currentAuthType = 2; // default

    const errorPanel = document.getElementById("errorPanel");
    const errorMessage = document.getElementById("errorMessage");
    const authTypeRadios = document.getElementsByName("AuthType");
    const accessTokenField = document.getElementById("accessTokenField");
    const submitButton = document.getElementById("submitButton");

    authTypeRadios.forEach(el => {
        el.addEventListener("change", event => {
            const value = parseInt(event.target.value);
            currentAuthType = value;
            if (currentAuthType === 2) {
                accessTokenField.removeAttribute("hidden");
            } else {
                accessTokenField.setAttribute("hidden", "hidden");
                accessTokenField.value = ""; // clear it out
            }
        });
    });

    submitButton.addEventListener("click", event => {
        event.preventDefault();

        const settings = {
            domain: document.getElementById("Domain").value,
            accessToken: document.getElementById("AccessToken").value,
            authType: currentAuthType,
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

        if (settings.authType === 1) {
            if (isNullOrEmpty(settings.username))
                messages.push("The Username is required");
            if (isNullOrEmpty(settings.password))
                messages.push('The Password is required');
        } else {
            if (isNullOrEmpty(settings.accessToken) 
                && isNullOrEmpty(settings.username)) {
                    messages.push("Access Token or Username and Password is required");
            }
            if (isNullOrEmpty(settings.accessToken)
                && !isNullOrEmpty(settings.username)
                && isNullOrEmpty(settings.password)) {
                    messages.push('The Password is required');
            }
        }
        
        if (messages.length > 0) {
            // build and inject error message
            const errorHtml = `&nbsp;&nbsp;-&nbsp;${messages.join("<br/>&nbsp;&nbsp;-&nbsp;")}`
            errorMessage.innerHTML = errorHtml;
            // show this panel
            errorPanel.removeAttribute("hidden");
        } else {
            errorPanel.attributes["hidden"] = "hidden";
        }

        return messages.length === 0;
    }

    function isNullOrEmpty(str) {
        return (!str || str.replace(/\s/gi, "").length === 0);
    }
}());