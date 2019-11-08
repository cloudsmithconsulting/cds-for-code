// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function() {
    // this stuff will be available on script load
    const vscode = CloudSmith.acquireVsCodeApi();
    //const oldState = vscode.getState();

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        // wait for document ready
        $(document).ready(function() { 
            const message = event.data;
            switch (message.command) {
                case "configure":
                    break;
            }
        });
    });

    window.welcomeExperience = function() {

    }

    // this part starts on document ready
    $(function () {
        $("#ConnectLink").click(function() {
            vscode.postMessage({
                command: 'openConnectionView'
            });
        })
    });
}());