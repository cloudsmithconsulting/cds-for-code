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
        
        $("#AuthType1").prop("checked", message.type === 0);
        $("#AuthType2").prop("checked", message.type === 1);
        $("#AuthType3").prop("checked", message.type === 2);
        $("#AuthType4").prop("checked", message.type === 3);

        $domainField = $("#domainField");
        $accessTokenField = $("#accessTokenField");

        showOrHide($accessTokenField, message.type !== 0);
        showOrHide($domainField, message.type === 0);

        $("#Id").val(message.id || "");
        $("#WebApiVersion").val(message.webApiVersion || "");
        $("#Name").val(message.name || "");
        $("#ServerUrl").val(message.webApiUrl || "");
        $("#Domain").val(message.credentials ? message.credentials.domain || "" : "");
        $("#AccessToken").val(message.credentials ? message.credentials.token || "" : "");
        $("#Username").val(message.credentials ? message.credentials.username || "" : "");
        $("#Password").val(message.credentials ? message.credentials.password || "" : "");
    }

    // this part starts on document ready
    $(function () {
        $("[name='AuthType']").click(function() {
            const authType = this.value;
            $domainField = $("#domainField");
            $accessTokenField = $("#accessTokenField");

            showOrHide($accessTokenField, authType !== 0);
            showOrHide($domainField, authType === 0);
        });

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
            if (CloudSmith.Utilities.isNullOrEmpty(settings.domain))
                messages.push("The Domain is required");
    
            if (settings.authType === 1) {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.username))
                    messages.push("The Username is required");
                if (CloudSmith.Utilities.isNullOrEmpty(settings.password))
                    messages.push('The Password is required');
            } else {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.accessToken) 
                    && CloudSmith.Utilities.isNullOrEmpty(settings.username)) {
                        messages.push("Access Token or Username and Password is required");
                }
                if (CloudSmith.Utilities.isNullOrEmpty(settings.accessToken)
                    && !CloudSmith.Utilities.isNullOrEmpty(settings.username)
                    && CloudSmith.Utilities.isNullOrEmpty(settings.password)) {
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
                type: parseInt($("[name='AuthType']:checked").val()),
                webApiVersion: $("#WebApiVersion").val(),
                name: $("#Name").val(),
                webApiUrl: $("#ServerUrl").val(),
                credentials: {
                    domain: $("#Domain").val(),
                    token: $("#AccessToken").val(),
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