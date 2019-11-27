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
                    setInitialState(message.message);
                    break;
                case "error":
                    CloudSmith.ErrorPanel.showError([`${message.message}`]);
                    break;
            }
        });
    });

    function setInitialState(message) {
        const $title = $("#title");
        $title.html($title.html().replace("New", "Edit"));
        document.title = $title.text();
        
        if (message.authType === 1) {
            $("#AuthType1").prop("checked", true);
            $("#accessTokenField").hide();
        }

        $("#Id").val(message.id || "");
        $("#WebApiVersion").val(message.webApiVersion || "");
        $("#Name").val(message.name || "");
        $("#ServerUrl").val(message.webApiUrl || "");
        $("#Domain").val(message.domain || "");
        $("#AccessToken").val(message.accessToken || "");
        $("#Username").val(message.username || "");
        $("#Password").val(message.password || "");
    }

    // this part starts on document ready
    $(function () {
        $("[name='AuthType']").click(function() {
            const authType = this.value;
            $accessTokenField = $("#accessTokenField");
            if (authType === "2") {
                $accessTokenField.show();
            } else {
                $accessTokenField.hide();
            }
        });

        function validateForm(settings) {
            const messages = [];
    
            if (CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.webApiUrl))
                messages.push("The Server URL is required");
            if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.[a-z]{2,5})?(:[0-9]{1,5})?(\/.*)?$/gi.test(settings.webApiUrl))
                messages.push("The Server URL is invalid");
            if (CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.domain))
                messages.push("The Domain is required");
    
            if (settings.authType === 1) {
                if (CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.username))
                    messages.push("The Username is required");
                if (CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.password))
                    messages.push('The Password is required');
            } else {
                if (CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.accessToken) 
                    && CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.username)) {
                        messages.push("Access Token or Username and Password is required");
                }
                if (CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.accessToken)
                    && !CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.username)
                    && CloudSmith.Utilities.$Object.IsNullOrEmpty(settings.password)) {
                        messages.push('The Password is required');
                }
            }
            
            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        $("#submitButton").click(function() {
            const id = $("#Id").val();
            const settings = {
                id: (id.length > 0) ? id: null, // pass the id or null
                authType: parseInt($("[name='AuthType']:checked").val()),
                webApiVersion: $("#WebApiVersion").val(),
                name: $("#Name").val(),
                webApiUrl: $("#ServerUrl").val(),
                domain: $("#Domain").val(),
                accessToken: $("#AccessToken").val(),
                username: $("#Username").val(),
                password: $("#Password").val()
            };

            if (!validateForm(settings)) return;

            vscode.postMessage({
                command: "save",
                settings
            });
        });
    });
}());