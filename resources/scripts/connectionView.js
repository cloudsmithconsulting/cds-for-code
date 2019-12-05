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
                    if (message.message) {
                        setInitialState(message.message);
                    }

                    break;
                case "error":
                    CloudSmith.ErrorPanel.showError([`${message.message}`]);
                    break;
            }
        });
    });

    function setInitialState(apiConfig) {
        const $title = $("#title");
        $title.html($title.html().replace("New", "Edit"));
        document.title = $title.text();

        // The uusal.
        $("#ConnectionId").val(apiConfig.id || "");
        $("#ConnectionType").val(apiConfig.type || 0);
        $("#ConnectionName").val(apiConfig.name || "");

        // Advanced options.
        M.FormSelect.getInstance("WebApiVersion").wrapper.val(apiConfig.webApiVersion || "");

        switch (apiConfig.type) {
            case 0:
                $("#OnPrem-ServerUrl").val(apiConfig.webApiUrl || "");
                $("#OnPrem-Domain").val(apiConfig.credentials ? apiConfig.credentials.domain || "" : "");
                $("#OnPrem-Username").val(apiConfig.credentials ? apiConfig.credentials.username || "" : "");
                $("#OnPrem-Password").val(apiConfig.credentials ? apiConfig.credentials.password || "" : "");

                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }
    // this part starts on document ready
    $(function () {
        M.AutoInit();
        
        function showOrHide(target, value) {
            if (value) {
                target.show();
            } else {
                target.hide();
            }
        }

        function validateForm(settings) {
            const messages = [];
    
            if (CloudSmith.Utilities.isNullOrEmpty(settings.webApiUrl))
                messages.push("The Server URL is required");
            if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.[a-z]{2,5})?(:[0-9]{1,5})?(\/.*)?$/gi.test(settings.webApiUrl))
                messages.push("The Server URL is invalid");
            if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.username))
                messages.push("The Username is required");
            if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.password))
                messages.push('The Password is required');
    
            if (settings.type === 0) {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.domain))
                    messages.push("The Domain is required");
            } else {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.token) 
                    && CloudSmith.Utilities.isNullOrEmpty(settings.credentials.username)) {
                        messages.push("Access Token or Username and Password is required");
                }
                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.token)
                    && !CloudSmith.Utilities.isNullOrEmpty(settings.credentials.username)
                    && CloudSmith.Utilities.isNullOrEmpty(settings.credentials.password)) {
                        messages.push('The Password is required');
                }
            }
            
            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        $("#submitButton").click(function() {
            const id = $("#ConnectionId").val();
            const settings = {
                id: (id.length > 0) ? id: null, // pass the id or null
                type: parseInt($("[name='AuthType']:checked").val()),
                webApiVersion: $("#WebApiVersion").val(),
                name: $("#ConnectionName").val(),
                webApiUrl: $("#ServerUrl").val(),
                credentials: {
                    domain: $("#Domain").val(),
                    token: $("#OAuthToken").val(),
                    username: $("#Username").val(),
                    password: $("#Password").val()
                }
            };

            if (!validateForm(settings)) return;

            vscode.postMessage({
                command: "save",
                settings
            });
        });
    });
}());