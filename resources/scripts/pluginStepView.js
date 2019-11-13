// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = CloudSmith.acquireVsCodeApi();
    window.entityTypeCodes = [];
    window.sdkMessageFilters = [];
    window.primaryObjectTypes = [];
    window.secondaryObjectTypes = [];
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

    function updateStepNameAndDescription() {
        // doing this vanilla js so we don't incur the jquery overhead
        const message = document.getElementById("Message").value;
        const primaryEntity = document.getElementById("PrimaryEntity").value;
        const eventHandler = document.getElementById("EventHandler").value;

        if (!CloudSmith.Utilities.isNullOrEmpty(message) 
            && !CloudSmith.Utilities.isNullOrEmpty(primaryEntity)
            && !CloudSmith.Utilities.isNullOrEmpty(eventHandler)) {
                const stepName = `${eventHandler.replace("(Plugin) ", "")}: ${message} of ${primaryEntity}`;
                $("#StepName,#Description").val(stepName);
        }
    }

    let currentFocus = {};
    function initializeAutoComplete($textInput, selectionArray) {
        const inputId = $textInput.attr("id");
        currentFocus[inputId] = -1;
        $textInput.keyup(function(e) {
            const lookup = this.value;
            // find the items div
            const $autocompleteItems = $textInput.next(".autocomplete-items")
            // clear all previous items
            $("div", $autocompleteItems).remove();
            // get out if there's no work to do
            if (CloudSmith.Utilities.isNullOrEmpty(lookup)) {
                currentFocus[inputId] = -1;
                return; 
            }
            // find all the matching items and append them to the
            // autocomplete
            _.each(selectionArray, selection => {
                // see if we have a match
                if (selection.substr(0, lookup.length).toLowerCase() === lookup.toLowerCase()) {
                    const $button = $("<button class='button button--primary'>");
                    $button.val(selection);
                    $button.append("<span class='iconify' data-icon='fa:envelope'></span>");
                    $button.append(`&nbsp;<strong>${selection.substr(0, lookup.length)}</strong>${selection.substr(lookup.length)}`);

                    $button.click(function() {
                        $textInput.val(this.value);
                        // update the stepname
                        updateStepNameAndDescription();
                        // call message change
                        $("#Message").change();
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
                currentFocus[inputId]++;
                /*and and make the current item more visible:*/
                $("button", $autocompleteItems).removeClass("button--active");
                $("button", $autocompleteItems).eq(currentFocus[inputId]).addClass("button--active");
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus[inputId]--;
                /*and and make the current item more visible:*/
                $("button", $autocompleteItems).removeClass("button--active");
                $("button", $autocompleteItems).eq(currentFocus[inputId]).addClass("button--active");
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
            if (currentFocus[inputId] > -1) {
                    /*and simulate a click on the "active" item:*/
                    $("button", $autocompleteItems).eq(currentFocus[inputId]).click();
                }
            }
        });
    }

    function setInitialState(viewModel) {
        window.entityTypeCodes = _.map(viewModel.entityTypeCodes, i => i.LogicalName);
        window.sdkMessageFilters = viewModel.sdkMessageFilters;
        window.sdkMessages = _.map(viewModel.sdkMessages, i => i.name);

        // initialize autocomplete for the text boxes
        initializeAutoComplete($("#Message"), window.sdkMessages);
        
        if (viewModel.step && viewModel.sdkMessageDetails) {
            $("#Message").val(viewModel.step.sdkmessageid.name);
            $("#Message").change();
            
            // $("#PrimaryEntity").val(),
            // $("#SecondEntity").val(),
            // $("#FilteringAttributes").val(),
            // $("#EventHandler").val(),
            // $("#StepName").val(),
            // $("#UserContext").val(),
            // $("#ExecutionOrder").val(),
            // $("#Description").val(),
            // $(`[name="ExecutionPipeline"]:checked`).val(),
            // $("#StatusCode").val(),
            // $(`[name="ExecutionMode"]:checked`).val(),
            // $("#Server").val(),
            // $("#Offline").val()
        }
    }

    $(function() {
        // get the message value after change
        $("#Message").change(function() {
            window.primaryObjectTypes = _.map(window.sdkmessageFilters, i => {
                if (i._sdkmessageid_value === _.find(window.sdkMessages, i => i.name === this.value).sdkmessageid) {
                    return i.primaryobjecttypecode;
                }
            });

            window.secondaryObjectTypes = _.map(window.sdkmessageFilters, i => {
                if (i._sdkmessageid_value === _.find(window.sdkMessages, i => i.name === this.value).sdkmessageid) {
                    return i.secondaryobjecttypecode;
                }
            });

            initializeAutoComplete($("#PrimaryEntity"), window.primaryObjectTypes);
            initializeAutoComplete($("#SecondaryEntity"), window.secondaryObjectTypes);

            if (window.primaryObjectTypes.length === 1) { 
                $("#PrimaryEntity").val(window.primaryObjectTypes[0]);
            }

            if (window.secondaryObjectTypes.length === 1) { 
                $("#SecondaryEntity").val(window.secondaryObjectTypes[0]);
            }
        });

        // wire change of inputs that name and describe step automatically
        $("#EventHandler").change(function() {
           updateStepNameAndDescription(); 
        });

        function validateForm(settings) {
            const messages = [];

            // put validations in here
            if (CloudSmith.Utilities.isNullOrEmpty(settings.message)) { messages.push('The Message is required'); }
            if (window.sdkMessages.indexOf(settings.message) === -1) { messages.push('The Message has to exist in message selection'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.primaryEntity)) { messages.push('The Primary Entity is required'); }
            if (window.entityTypeCodes.indexOf(settings.primaryEntity) === -1) { messages.push('The Primary Entity has to exist in message selection'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.secondEntity)) { messages.push('The Second Entity is required'); }
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
                description: $("#Description").val(),
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