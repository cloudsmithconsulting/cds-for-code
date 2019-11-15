// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = CloudSmith.acquireVsCodeApi();
    window.initializeComplete = false;
    window.dataCache = {};

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
        if (!window.initializeComplete) { return; }
        // doing this vanilla js so we don't incur the jquery overhead
        const message = document.getElementById("Message").value;
        const primaryEntity = document.getElementById("PrimaryEntity").value;
        const $eventHandler = $("#EventHandler>option:selected");
        const eventHandler = $.trim($eventHandler.text());

        if (!CloudSmith.Utilities.isNullOrEmpty(message) 
            && !CloudSmith.Utilities.isNullOrEmpty(primaryEntity)
            && !CloudSmith.Utilities.isNullOrEmpty(eventHandler)) {
                const stepName = `${eventHandler.replace("(Plugin) ", "")}: ${message} of ${primaryEntity}`;
                $("#StepName,#Description").val(stepName);
        }
    }

    let currentFocus = {};
    function initializeAutoComplete($textInput, selectionArray, icon) {
        const inputId = $textInput.attr("id");
        currentFocus[inputId] = -1;
        // create keyup event to attach to $textInput
        const keyupEvent = _.debounce(function(e) {
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
                    $button.append(`<span class='iconify' data-icon='${icon ? icon : "fa:envelope"}'></span>`);
                    $button.append(`&nbsp;<strong>${selection.substr(0, lookup.length)}</strong>${selection.substr(lookup.length)}`);

                    $button.click(function() {
                        $textInput.val(this.value);
                        // update the stepname
                        updateStepNameAndDescription();
                        // call message change
                        $("#Message").change();
                        // clear all previous items
                        $("div", $autocompleteItems).remove();
                        // reset focus
                        currentFocus[inputId] = -1;
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
        }, 150); // <- debounce this event this many ms
        // wire the event up
        $textInput.keyup(keyupEvent);
    }

    function bindSelect($select, selectionArray, noSelectionOption) {
        // remove prior options if they exist
        $("option", $select).remove();
        if (noSelectionOption) {
            $select.append(`<option value="">${noSelectionOption}</option>`);
        }
        // add selections back
        _.forEach(selectionArray, i => {
            // create the dropdown option
            const $option = $(`<option value="${i.value}">${i.text}</option>`);
            // append this to the select list
            $select.append($option);
        });
    }

    function setInitialState(viewModel) {
        window.dataCache = {
            step: viewModel.step,
            entityTypeCodes: viewModel.entityTypeCodes,
            pluginTypes: viewModel.pluginTypes,
            sdkMessageFilters: viewModel.sdkMessageFilters,
            sdkMessages: viewModel.sdkMessages,
            sdkMessagesMap: _.map(viewModel.sdkMessages, i => i.name),
            users: viewModel.users,
            currentMessageFilters: [],
            primaryEntityMap: [],
            secondEntityMap: []
        };

        // initialize autocomplete for the text boxes
        initializeAutoComplete($("#Message"), window.dataCache.sdkMessagesMap, "mdi-message-settings-variant-outline");

        // bind select lists
        bindSelect($("#EventHandler"), _.map(viewModel.pluginTypes, i => {
            return { 
                value: i.plugintypeid,
                text: i.name
             }
        }));

        bindSelect($("#UserContext"), _.map(viewModel.users, i => {
            return {
                value: i.systemuserid,
                text: i.fullname
            }
        }), "Calling User");
        
        if (viewModel.step) {
            const step = viewModel.step;

            $("#Id").val(step.sdkmessageprocessingstepid)
            $("#PrimaryEntity").val(step.sdkmessagefilterid.primaryobjecttypecode);
            $("#SecondEntity").val(step.sdkmessagefilterid.secondaryobjecttypecode);
            $("#AsyncAutoDelete").prop("checked", step.asyncautodelete);
            $("#UnsecureConfiguration").val(step.configuration);
            $("#Description").val(step.description);
            $("#FilteringAttributes").val(step.filteringattributes);
            $("#Asynchronous").prop("checked", step.mode === 1);
            $("#Synchronous").prop("checked", step.mode === 0);
            $("#StepName").val(step.name);
            $("#PreValidation").prop("checked", step.stage === 10);
            $("#PreOperation").prop("checked", step.stage === 20);
            $("#PostOperation").prop("checked", step.stage === 40);
            $("#Server").prop("checked", step.supporteddeployment === 0 || step.supporteddeployment === 3);
            $("#Offline").prop("checked", step.supporteddeployment === 1 || step.supporteddeployment === 3);

            if (step && step.eventhandler_plugintype) {
                $("#EventHandler").val(step.eventhandler_plugintype.plugintypeid);
            }

            if (step && step.impersonatinguserid) {
                $("#UserContext").val(step.impersonatinguserid.systemuserid);
            }

            if (step.sdkmessageprocessingstepsecureconfigid 
                && step.sdkmessageprocessingstepsecureconfigid.secureconfig) {
                    $("#SecureConfiguration").val(step.sdkmessageprocessingstepsecureconfigid.secureconfig);
                }

            $("#Message").val(step.sdkmessageid.name);
            $("#Message").change();
        }

        window.initializeComplete = true;
        // hide initialize info box
        $("#loadingPanel").hide();
    }

    $(function() {
        // get the message value after change
        $("#Message").change(function() {
            // get the message from cache
            const currentMessage = _.find(window.dataCache.sdkMessages, i => i.name === this.value);
            // if we didnt find a message, get out of here
            if (!currentMessage) { return; }
            // get the message id
            const currentMessageId = currentMessage.sdkmessageid;
            // get only applicable message filters
            window.dataCache.currentMessageFilters = _.filter(window.dataCache.sdkMessageFilters, i => i._sdkmessageid_value === currentMessageId);
            // maps for autocomplete
            window.dataCache.primaryEntityMap = _.map(window.dataCache.currentMessageFilters, i => i.primaryobjecttypecode);
            window.dataCache.secondEntityMap = _.uniq(_.map(window.dataCache.currentMessageFilters, i => i.secondaryobjecttypecode));

            initializeAutoComplete($("#PrimaryEntity"), window.dataCache.primaryEntityMap, "fa:table");
            initializeAutoComplete($("#SecondEntity"), window.dataCache.secondEntityMap, "fa:table");

            if (window.dataCache.primaryEntityMap.length === 1) { 
                $("#PrimaryEntity").val(window.dataCache.primaryEntityMap[0]);
            }

            if (window.dataCache.secondEntityMap.length === 1) { 
                $("#SecondEntity").val(window.dataCache.secondEntityMap[0]);
            }
        });

        // wire change of inputs that name and describe step automatically
        $("#EventHandler").change(function() {
           updateStepNameAndDescription(); 
        });

        function existsInOptions(options, condition) {
            return _.find(options, i => condition(i)) !== null;
        }

        function validateForm(settings) {
            const messages = [];
            const dataCache = window.dataCache;

            // put validations in here
            if (CloudSmith.Utilities.isNullOrEmpty(settings.message)) { messages.push('The Message is required'); }
            if (!existsInOptions(dataCache.sdkMessages, i => i.name === settings.message)) { messages.push('The Message has to exist in message selection'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.primaryEntity)) { messages.push('The Primary Entity is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.secondEntity)) { messages.push('The Second Entity is required'); }
            if (!existsInOptions(dataCache.sdkMessageFilters, 
                i => i.primaryobjecttypecode === settings.primaryEntity && i.secondaryobjecttypecode === settings.secondEntity)) {
                    messages.push('The Primary and Second Entities do not exist in the entity selection');
                }
            if (CloudSmith.Utilities.isNullOrEmpty(settings._eventhandler_value)) { messages.push('The Event Handler is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(settings.name)) { messages.push('The Step Name is required'); }
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
                sdkmessageprocessingstepid: $("#Id").val(),
                message: $("#Message").val(),
                primaryEntity: $("#PrimaryEntity").val(),
                secondEntity: $("#SecondEntity").val(),
                filteringAttributes: $("#FilteringAttributes").val(),
                _eventhandler_value: $("#EventHandler").val(),
                name: $("#StepName").val(),
                userContext: $("#UserContext").val(),
                executionOrder: $("#ExecutionOrder").val(),
                description: $("#Description").val(),
                executionPipeline: $(`[name="ExecutionPipeline"]:checked`).val(),
                statusCode: $("#AsyncAutoDelete").prop("checked"),
                executionMode: $(`[name="ExecutionMode"]:checked`).val(),
                server: $("#Server").prop("checked"),
                offline: $("#Offline").prop("checked")
            };

            if (!validateForm(settings)) return;

            vscode.postMessage({
                command: 'saveSdkMessageProcessingStep',
                settings
            });
        });
    });

}());