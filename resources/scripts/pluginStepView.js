// import { arrayify } from "tslint/lib/utils";

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = CloudSmith.acquireVsCodeApi();

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data;

        switch (message.command) {
            case "load":
                setInitialState(message.viewModel);
                break;
        }
    });

    function setInitialState(viewModel) {
        setMessageAutoComplete(viewModel.sdkMessages);
        
        if (viewModel.step) {
            
        }
    }

    $(function() {
        function validateForm(config) {
            const messages = [];

            // put validations in here
            if (CloudSmith.Utilities.isNullOrEmpty(config.message)) { messages.push('The Message is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(config.primaryEntity)) { messages.push('The Primary Entity is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(config.secondEntity)) { messages.push('The Second Entity is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(config.filteringAttributes)) { messages.push('The Filtering Attributes is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(config.eventHandler)) { messages.push('The Event Handler is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(config.stepName)) { messages.push('The Step Name is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(config.userContext)) { messages.push('The User Context is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(config.executionOrder)) { messages.push('The Execution Order is required'); }

            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        // wire up submit click handler
        $("#submitButton").click(function() {
            const config = {
                // work on gathering the form information
                message: $("#Message").val(),
                primaryEntity: $("#PrimaryEntity").val(),
                secondEntity: $("#SecondEntity").val(),
                filteringAttributes: $("#FilteringAttributes").val(),
                eventHandler: $("#EventHandler").val(),
                stepName: $("#StepName").val(),
                userContext: $("#UserContext").val(),
                executionOrder: $("#ExecutionOrder").val(),
                executionPipeline: $(`[name="ExecutionPipeline"]:checked`).val(),
                statusCode: $("#StatusCode").val() && $("#StatusCode").val().length > 0,
                executionMode: $(`[name="ExecutionMode"]:checked`).val(),
                server: $("#Server").val() && $("#Server").val().length > 0,
                offline: $("#Offline").val() && $("#Offline").val().length > 0
            };

            if (!validateForm(config)) return;

            vscode.postMessage({
                command: 'saveSdkMessageProcessingStep',
                settings
            });
        });
    });

}());