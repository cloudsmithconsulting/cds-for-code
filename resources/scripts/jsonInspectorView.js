// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = CloudSmith.acquireVsCodeApi();
    var editor = null;

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data; 

        switch (message.command) {
            case "inspect":
                var item = message.message;

                if (!editor)
                {
                    editor = inspect(item);
                }
                else
                {
                    editor.data = item;
                }

                break;
        }
    });

    function inspect(item) {
        // create the editor
        const container = document.getElementById("container");
        const options = {
            //modes: ['text', 'tree']
            mode: 'view'
        };
        const editor = new JSONEditor(container, options, item);

        return editor;
    }
}());