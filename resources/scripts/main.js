// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const cancelButton = document.getElementById("cancelButton");

    if (cancelButton) {
        cancelButton.addEventListener("click", function(event) {
            const vscode = window.vscodeApi;
            if (!vscode) throw "vscode was undefined";
            vscode.postMessage({
                command: "closeWindow"
            });
        });
    }
}());