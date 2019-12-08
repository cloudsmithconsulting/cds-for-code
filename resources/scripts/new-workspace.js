// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function() {
    // this stuff will be available on script load
    const vscode = CloudSmith.getHost();
    //const oldState = vscode.getState();

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        // wait for document ready
        $(document).ready(() => { 
            const message = event.data;

            switch (message.command) {
                case "showLoadingMessage":
                    $("#loadingPanel").show();
                    break;
                case "hideLoadingMessage":
                    $("#loadingPanel").hide();
                    break;
                case "load":
                    window.viewModel = message.parameters;
                    break;
            }
        });
    });

    // this part starts on document ready
    $(function () {
        M.AutoInit();

        $("#ShowWelcomeExperienceCheckbox").prop("checked") = window.viewModel.showWelcomeExperience;

        $("#ShowWelcomeExperienceCheckbox").click(() => {
            vscode.postMessage({ command: 'updateWelcomeExperienceConfig', value: $("#ShowWelcomeExperienceCheckbox").is(':checked') });
        })

        $("#ConnectLink").click(() => {
            vscode.postMessage({ command: 'openConnectionView' });
        })
    });
}());