// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    // You MUST set = window.vscodeApi for scripts in main.js to work properly
    const vscode = window.vscodeApi = acquireVsCodeApi();
    const submitButton = document.getElementById("submitButton");

    submitButton.addEventListener("click", event => {
        event.preventDefault();
        const config = {
            // work on gathering the form information
            message: document.getElementById("Message").value,
            primaryEntity: document.getElementById("PrimaryEntity").value,
            secondEntity: document.getElementById("SecondEntity").value,
            filteringAttributes: document.getElementById("FilteringAttributes").value,
            eventHandler: document.getElementById("EventHandler").value,
            stepName: document.getElementById("StepName").value,
            userContext: document.getElementById("UserContext").value,
            executionOrder: document.getElementById("ExecutionOrder").value,
            excutionPipeline: CloudSmith.Controls.getRadioButtonValue("ExecutionPipeline"),
            statusCode: document.getElementById("StatusCode").value && document.getElementById("StatusCode").value.length > 0,
            executionMode: CloudSmith.Controls.getRadioButtonValue("ExecutionMode"),
            server: document.getElementById("Server").value && document.getElementById("Server").value.length > 0,
            offline: document.getElementById("Offline").value && document.getElementById("Offline").value.length > 0
        };

        if (!validateForm(config)) return;

        vscode.postMessage({
            command: 'saveSdkMessageProcessingStep',
            settings
        });
    });

    function setInitialState(viewModel) {
        if (viewModel.step) {
            document.getElementById("Message").value = viewModel.step.sdkmessageid.name;
        }
    }

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

        if (messages.length > 0) {
            // build and inject error message
            const errorHtml = `&nbsp;&nbsp;-&nbsp;${messages.join("<br/>&nbsp;&nbsp;-&nbsp;")}`
            errorMessage.innerHTML = errorHtml;
            // show this panel
            errorPanel.removeAttribute("hidden");
        } else {
            errorPanel.setAttribute("hidden", "hidden");
        }

        return messages.length === 0;
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data; 

        switch (message.command) {
            case "load":
                setInitialState(message.viewModel);
                break;
        }
    });

}());