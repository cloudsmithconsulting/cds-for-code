// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    const formElements = document.getElementsByClassName("field-container");
    const formTypeLabels = document.getElementsByClassName("form-type-label");

    const changeView = window.changeView = function(event, viewName) {
        if (!event) { return; }

        for (let i = 0; i < formElements.length; i++) {
            const el = formElements[i];
            if (el.getAttribute("data-form").indexOf(viewName) === -1) {
                el.setAttribute("hidden", "hidden");
            } else {
                el.removeAttribute("hidden");
            }
        }

        for (let i = 0; i < formTypeLabels.length; i++) {
            const el = formTypeLabels[i];
            el.innerHTML = viewName;
        }
    };

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data;

        switch (message.command) {
            case "configure":
                break;
        }
    });

}());