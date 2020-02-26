// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = CloudSmith.getHost();
    let editor = null;

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
        document.getElementById("container").innerHTML = "";
        const container = document.getElementById("container");
        const options = {
            //modes: ['text', 'tree']
            mode: 'view'
        };
        const editor = new JSONEditor(container, options, item);

        return editor;
    }
}());