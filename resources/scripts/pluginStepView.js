// import { arrayify } from "tslint/lib/utils";

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = CloudSmith.acquireVsCodeApi();
    window.sdkMessages = [];

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data;

        switch (message.command) {
            case "load":
                setInitialState(message.viewModel);
                break;
        }
    });

    function setMessageAutoComplete(sdkMessages) {
        window.sdkMessages = _.map(sdkMessages, m => m.name);
    };

    function setInitialState(viewModel) {
        setMessageAutoComplete(viewModel.sdkMessages);
        
        if (viewModel.step) {
            
        }
    }

    $(function() {
        const $autocompleteItems = $(".autocomplete-items");
        let currentFocus = -1;
        $("#Message").keyup(function(e) {
            const lookup = this.value;
            // clear all previous items
            $("div", $autocompleteItems).remove();
            // get out if there's no work to do
            if (CloudSmith.Utilities.isNullOrEmpty(lookup)) {
                currentFocus = -1;
                return; 
            }
            // find all the matching items and append them to the
            // autocomplete
            _.each(window.sdkMessages, message => {
                // see if we have a match
                if (message.substr(0, lookup.length).toLowerCase() === lookup.toLowerCase()) {
                    const $button = $("<button class='button button--primary'>");
                    $button.val(message);
                    $button.append("<span class='iconify' data-icon='fa:envelope'></span>");
                    $button.append(`&nbsp;<strong>${message.substr(0, lookup.length)}</strong>${message.substr(lookup.length)}`);

                    $button.click(function() {
                        $("#Message").val(this.value);
                        // clear all previous items
                        $("div", $autocompleteItems).remove();
                    });

                    const $div = $("<div></div>").append($button)
                    $autocompleteItems.append($div);
                }
            });

            // now look for navigation keys
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                $("button", $autocompleteItems).removeClass("button--active");
                $("button", $autocompleteItems).eq(currentFocus).addClass("button--active");
              } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                $("button", $autocompleteItems).removeClass("button--active");
                $("button", $autocompleteItems).eq(currentFocus).addClass("button--active");
              } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                  /*and simulate a click on the "active" item:*/
                  $("button", $autocompleteItems).eq(currentFocus).click();
                }
              }
        });

        function validateForm(settings) {
            const messages = [];

            // put validations in here
            if (CloudSmith.Utilities.isNullOrEmpty(settings.message)) { messages.push('The Message is required'); }
            if (window.sdkMessages.indexOf(cofig.message) === -1) { messages.push('The Message has to exist in message selection'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.primaryEntity)) { messages.push('The Primary Entity is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.secondEntity)) { messages.push('The Second Entity is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.filteringAttributes)) { messages.push('The Filtering Attributes is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.eventHandler)) { messages.push('The Event Handler is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.stepName)) { messages.push('The Step Name is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.userContext)) { messages.push('The User Context is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.executionOrder)) { messages.push('The Execution Order is required'); }

            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        // wire up submit click handler
        $("#submitButton").click(function() {
            const settings = {
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

            if (!validateForm(settings)) return;

            vscode.postMessage({
                command: 'saveSdkMessageProcessingStep',
                settings
            });
        });
    });

}());