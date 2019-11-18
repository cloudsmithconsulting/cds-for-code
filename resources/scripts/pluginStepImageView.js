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
            const message = event.data; // The json data that the extension sent
            switch (message.command) {
                case "load":
                    setInitialState(message.viewModel);
                    break;
            }
        });
    });

    function setInitialState(viewModel) {
        if (viewModel) {
            $("#Id").val(viewModel.sdkmessageprocessingstepimageid);
            $("#PreImage").prop("checked", viewModel.imagetype === 0 || viewModel.imagetype === 2);
            $("#PostImage").prop("checked", viewModel.imagetype === 1 || viewModel.imagetype === 2);
            $("#Name").val(viewModel.name);
            $("#Alias").val(viewModel.entityalias);
            $("#Parameters").val(viewModel.attributes);
        }
    }

    // this part starts on document ready
    $(function () {
        function validateForm(settings) {
            const messages = [];
    
            // if (CloudSmith.Utilities.isNullOrEmpty(settings.webApiUrl))
            //     messages.push("The Server URL is required");
            // if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.[a-z]{2,5})?(:[0-9]{1,5})?(\/.*)?$/gi.test(settings.webApiUrl))
            //     messages.push("The Server URL is invalid");
            // if (CloudSmith.Utilities.isNullOrEmpty(settings.domain))
            //     messages.push("The Domain is required");
    
            // if (settings.authType === 1) {
            //     if (CloudSmith.Utilities.isNullOrEmpty(settings.username))
            //         messages.push("The Username is required");
            //     if (CloudSmith.Utilities.isNullOrEmpty(settings.password))
            //         messages.push('The Password is required');
            // } else {
            //     if (CloudSmith.Utilities.isNullOrEmpty(settings.accessToken) 
            //         && CloudSmith.Utilities.isNullOrEmpty(settings.username)) {
            //             messages.push("Access Token or Username and Password is required");
            //     }
            //     if (CloudSmith.Utilities.isNullOrEmpty(settings.accessToken)
            //         && !CloudSmith.Utilities.isNullOrEmpty(settings.username)
            //         && CloudSmith.Utilities.isNullOrEmpty(settings.password)) {
            //             messages.push('The Password is required');
            //     }
            // }
            
            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        $("#submitButton").click(function() {
            // const id = $("#Id").val();
            // const pluginStepImage = {
            //     id: (id.length > 0) ? id: null, // pass the id or null
            //     authType: parseInt($("[name='AuthType']:checked").val()),
            //     webApiVersion: $("#WebApiVersion").val(),
            //     name: $("#Name").val(),
            //     webApiUrl: $("#ServerUrl").val(),
            //     domain: $("#Domain").val(),
            //     accessToken: $("#AccessToken").val(),
            //     username: $("#Username").val(),
            //     password: $("#Password").val()
            // };

            // if (!validateForm(settings)) return;

            // vscode.postMessage({
            //     command: 'createConnection',
            //     settings
            // });
        });
    });
}());