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
            case "error":
                CloudSmith.ErrorPanel.showError([`${message.message}`]);
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
            //entityTypeCodes: viewModel.entityTypeCodes,
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
            $("#Server").prop("checked", step.supporteddeployment === 0 || step.supporteddeployment === 2);
            $("#Offline").prop("checked", step.supporteddeployment === 1 || step.supporteddeployment === 2);

            if (step && step.eventhandler_plugintype) {
                $("#EventHandler").val(step.eventhandler_plugintype.plugintypeid);
            }

            if (step && step.impersonatinguserid) {
                $("#UserContext").val(step.impersonatinguserid.systemuserid);
            }

            if (step.sdkmessageprocessingstepsecureconfigid 
                && step.sdkmessageprocessingstepsecureconfigid.secureconfig) {
                    $("#SecureConfigId").val(step.sdkmessageprocessingstepsecureconfigid.sdkmessageprocessingstepsecureconfigid);
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

        function validateForm(step) {
            const messages = [];

            // put validations in here
            if (CloudSmith.Utilities.isNullOrEmpty(step["sdkmessageid@odata.bind"])) { messages.push('Invalid Message'); }
            if (CloudSmith.Utilities.isNullOrEmpty(step["sdkmessagefilterid@odata.bind"])) { messages.push('Invalid Prmary and Secondary entities'); }
            if (CloudSmith.Utilities.isNullOrEmpty(step.name)) { message.push('The Step Name is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(step.rank)
                || isNaN(step.rank)) {
                    message.push("Invalid Execution Order");
                }

            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        // wire up submit click handler
        $("[data-action='save']").click(function() {
            const dataCache = window.dataCache;
            
            const selectedMessageid = () => {
                const message = _.find(dataCache.sdkMessages, i => {
                    return i.name === $("#Message").val()
                });
                return message ? message.sdkmessageid : "";
            }

            const selectedFilterid = () => {
                const filter = _.find(dataCache.currentMessageFilters, i => {
                    return i.primaryobjecttypecode === $("#PrimaryEntity").val()
                        && i.secondaryobjecttypecode === $("#SecondEntity").val()
                });
                return filter ? filter.sdkmessagefilterid : "";
            }

            const server = $("#Server").prop("checked");
            const offline = $("#Offline").prop("checked");
            let supportedDeployment = 0;
            supportedDeployment = (offline && !server) ? 1 : supportedDeployment;
            supportedDeployment = (server && offline) ? 2 : supportedDeployment;
            
            const step = {
                // work on gathering the form information
                sdkmessageprocessingstepid: $("#Id").val(),
                "sdkmessageid@odata.bind": `sdkmessages(${selectedMessageid()})`,
                "sdkmessagefilterid@odata.bind": `sdkmessagefilters(${selectedFilterid()})`,
                "eventhandler_plugintype@odata.bind": `plugintypes(${$("#EventHandler").val()})`,
                filteringattributes: $("#FilteringAttributes").val(),
                name: $("#StepName").val(),
                rank: $("#ExecutionOrder").val(),
                description: $("#Description").val(),
                stage: $(`[name="ExecutionPipeline"]:checked`).val(),
                asyncautodelete: $("#AsyncAutoDelete").prop("checked"),
                mode: $(`[name="ExecutionMode"]:checked`).val(),
                supporteddeployment: supportedDeployment,
                configuration: $("#UnsecureConfiguration").val()
            };

            // attach a user if selected
            const userId = CloudSmith.Utilities.nullForEmpty($("#UserContext").val());
            if (userId) { step["impersonatinguserid@odata.bind"] = `systemsuers(${userId})`; }
            
            // attach secure config if needed
            const secureConfigId = CloudSmith.Utilities.nullForEmpty($("#SecureConfigId").val());
            const secureConfig = CloudSmith.Utilities.nullForEmpty($("#SecureConfiguration").val());
            if (secureConfigId) {
                step["sdkmessageprocessingstepsecureconfigid@odata.bind"] = `sdkmessageprocessingstepsecureconfigs(${secureConfigId})`;
                step.sdkmessageprocessingstepsecureconfigid = step.sdkmessageprocessingstepsecureconfigid || {};
                step.sdkmessageprocessingstepsecureconfigid.sdkmessageprocessingstepsecureconfigid = secureConfigId;
            }
            if (secureConfig) { 
                step.sdkmessageprocessingstepsecureconfigid = step.sdkmessageprocessingstepsecureconfigid || {};
                step.sdkmessageprocessingstepsecureconfigid.secureconfig = secureConfig
            }

            if (!validateForm(step)) return;

            vscode.postMessage({
                command: "save",
                step
            });
        });
    });

}());