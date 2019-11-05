// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
$(function () {
    // You MUST set = window.vscodeApi for scripts in main.js to work properly
    const vscode = window.vscodeApi = acquireVsCodeApi();
    //const oldState = vscode.getState();

    $("[name='AuthType']").click(function() {
        const authType = this.value;
        $accessTokenField = $("#accessTokenField");
        if (authType === "2") {
            $accessTokenField.show();
        } else {
            $accessTokenField.hide();
        }
    });

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
            command: 'createConnection',
            settings
        });
    });

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
        
        if (messages.length > 0) {
            // build and inject error message
            const errorMessage = `&nbsp;&nbsp;-&nbsp;${messages.join("<br/>&nbsp;&nbsp;-&nbsp;")}`
            showErrorMessage(errorMessage);
        } else {
            // no errors, hide the panel
            $("#errorPanel").hide();
        }

        return messages.length === 0;
    }

    function showErrorMessage(message) {
        // build and inject error message
        $("#errorMessage").html(message);
        // show this panel
        $("#errorPanel").show();
    }

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

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case "connectionEdit":
                setInitialState(message.message);
                break;
            case "connectionError":
                showErrorMessage(message.message);
        }
    });
});