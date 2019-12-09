// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function() {
    // this stuff will be available on script load
    const vscode = window.CloudSmith.getHost();
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
        if (apiConfig.id && apiConfig.id !== "") {
            const $title = $("#title");
            $title.html($title.html().replace("New", "Edit"));
            document.title = $title.text();
        }

        // Move to the connection panel
        M.Collapsible.getInstance($("#ConnectionOptions")).open(1);

        // Swap our tabs
        const selectedTab = 
            apiConfig.type === 1 ? "#windowsAuth" : 
            apiConfig.type === 2 ? "#onlineAuth" : 
            apiConfig.type === 3 ? "#azureAuth" :
            apiConfig.type === 4 ? "#ifdAuth" : undefined;

        if (selectedTab) {
            setTimeout(M.Tabs.getInstance($('#ConnectionTypeTabs')).select(selectedTab), 100);
        }

        // The uusal
        $("#ConnectionId").val(apiConfig.id || $("#ConnectionId").val() || "");
        $("#ConnectionName").val(apiConfig.name || $("#ConnectionName").val() || "");

        // Advanced options
        $("#WebApiVersion").val(apiConfig.webApiVersion);
        $("#WebApiVersion").formSelect();

        switch (apiConfig.type) {
            case 1:
                $("#OnPrem-ServerUrl").val(apiConfig.webApiUrl || "");
                $("#OnPrem-Domain").val(apiConfig.credentials ? apiConfig.credentials.domain || "" : "");
                $("#OnPrem-Username").val(apiConfig.credentials ? apiConfig.credentials.username || "" : "");
                $("#OnPrem-Password").val(apiConfig.credentials ? apiConfig.credentials.password || "" : "");

                break;
            case 2:
                $("#Online-OrgUrl").val(apiConfig.webApiUrl || "");
                $("#Online-Username").val(apiConfig.credentials ? apiConfig.credentials.username || "" : "");
                $("#Online-Password").val(apiConfig.credentials ? apiConfig.credentials.password || "" : "");

                break;
            case 3:
                $("#AzureAd-ResourceUrl").val(apiConfig.webApiUrl || "");
                $("#AzureAd-ClientId").val(apiConfig.credentials ? apiConfig.credentials.username || "" : "");
                $("#AzureAd-ClientSecret").val(apiConfig.credentials ? apiConfig.credentials.password || "" : "");
                $("AzureAd-AuthorityUrl").val(apiConfig.authorityUri ? apiConfig.authorityUri || "" : "");

                break;
            case 4:
                break;
        }

        M.updateTextFields();
    }

    // this part starts on document ready
    $(function () {
        M.AutoInit();

        $("[data-enable-target]").each((index, t) => {
            $(t).on('change', function() {
                 var target = $(this).attr("data-enable-target");
                 var element = $(target);

                 element.prop('disabled', !this.checked);

                 if (element.prop("nodeName") === "SELECT") {
                    element.formSelect();
                 }
            });
        });

        function validateForm(settings) {
            const messages = [];

            // Online can do global disco
            if (settings.type !== 2) {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.webApiUrl))
                    messages.push("The Server URL or Resource URL is required");
                else if (!/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\.[a-z]{2,5})?(:[0-9]{1,5})?(\/.*)?$/gi.test(settings.webApiUrl))
                    messages.push("The Server URL or Resource URL is invalid");
            }

            if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.username))
                messages.push("The Username is required");
            if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.password))
                messages.push('The Password is required');
    
            if (settings.type === 1) {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.domain))
                    messages.push("The Domain is required");
            } else if (settings.type === 2) {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.token) 
                    && CloudSmith.Utilities.isNullOrEmpty(settings.credentials.username)) {
                        messages.push("Access Token or Username and Password is required");
                }
                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.token)
                    && !CloudSmith.Utilities.isNullOrEmpty(settings.credentials.username)
                    && CloudSmith.Utilities.isNullOrEmpty(settings.credentials.password)) {
                        messages.push('The Password is required');
                }
            } else if (settings.type === 3) {
                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.clientId))
                    messages.push('The Client ID is required');

                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.clientSecret))
                    messages.push('The Client Secret is required');

                if (CloudSmith.Utilities.isNullOrEmpty(settings.credentials.authorityUri))
                    messages.push('The Authority Url is required');
            }
            
            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        // Send this back to our extension for parsing.
        $("#ParseConnectionStringButton").click(function() {
            vscode.postMessage({
                command: "parseConnectionString",
                connectionString: $("#ConnectionString").val()
            });
        });

        $("[data-action='save']").click(function() {
            const id = $("#ConnectionId").val();
            let settings = {};

            const type = $("#windowsAuth").hasClass("active") ? 1 :
                $("#onlineAuth").hasClass("active") ? 2 :
                $("#azureAdAuth").hasClass("active") ? 3 :
                $("#ifdAuth").hasClass("active") ? 4 : undefined;

            const apiVersion = $("#WebApiVersion-Select").prop("checked") ? $("#WebApiVersion").val() : "";
            const token = $("#OAuthToken-Select").prop("checked") ? $("#OAuthToken").val() : undefined;
            const apiUri = 
                type && type == 1 ? $("#OnPrem-ServerUrl").val() : 
                type && type == 2 ? $("#Online-OrgUrl").val() : 
                type && type == 3 ? $("#AzureAd-ResourceUrl").val() : 
                undefined;

            const credentials = {};            
            switch (type) {
                case 1:
                    credentials.domain = $("#OnPrem-Domain").val();
                    credentials.username = $("#OnPrem-Username").val();
                    credentials.password = $("#OnPrem-Password").val();

                    break;
                case 2: 
                    credentials.resource = $("#Online-OrgUrl").val();

                    if (token) {
                        credentials.token = token;
                    } else {
                        credentials.username = $("#Online-Username").val();
                        credentials.password = $("#Online-Password").val();                        
                    }

                    break;
                case 3: 
                    credentials.clientId = $("#AzureAd-ClientId").val();
                    credentials.clientSecret = $("#AzureAd-ClientSecret").val();
                    credentials.authorityUri = $("#AzureAd-AuthorityUrl").val();

                    break;
            } 

            settings = {
                id: (id.length > 0) ? id: null, // pass the id or null
                type: type,
                webApiVersion: apiVersion,
                name: $("#ConnectionName").val(),
                webApiUrl: apiUri,
                credentials: credentials
            };

            if (!validateForm(settings)) return;

            vscode.postMessage({
                command: "save",
                settings
            });
        });
    });
}());