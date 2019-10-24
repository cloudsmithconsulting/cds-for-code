// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    
    const submitButton = document.getElementById("submitButton");

    submitButton.addEventListener("click", event => {
        event.preventDefault();
        const config = {
            // work on gathering the form information
            message: document.getElementById("Message").value,
            primaryEntity: document.getElementById("PrimaryEntity").value
        };

        if (!validateForm(config)) return;
    });

    function validateForm(config) {
        const messages = [];

        // put validations in here
        if (isNullOrEmpty(config.message)) { messages.push('The Message is required'); }

        if (messages.length > 0) {
            // build and inject error message
            const errorHtml = `&nbsp;&nbsp;-&nbsp;${messages.join("<br/>&nbsp;&nbsp;-&nbsp;")}`
            errorMessage.innerHTML = errorHtml;
            // show this panel
            errorPanel.removeAttribute("hidden");
        } else {
            errorPanel.setAttribute("hidden", "hidden");
        }

        return messages.length === 0;
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data; 

        switch (message.command) {
            case "open":
                break;
        }
    });

    function isNullOrEmpty(str) {
        return (!str || str.replace(/\s/gi, "").length === 0);
    }

}());