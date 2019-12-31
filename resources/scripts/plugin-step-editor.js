// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = CloudSmith.getHost();
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

        // initialize framework
        M.updateTextFields();
        // bind select controls
        $("select").formSelect();
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

        M.updateTextFields();
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
            users: viewModel.users,
            currentMessageFilters: [],
            sdkMessagesMap: {},
            primaryEntityMap: {},
            secondEntityMap: {}
        };

        /**
         * In order for autocomplete to work the data structure has to look like this:
         * {
         *  "item1": null,
         *  "item2": null,
         *  "item3": "https://urltosomeicon.com/myicondoesntexist.png"
         * }
         * 
         * For more details look here: https://materializecss.com/autocomplete.html
         */
        window.dataCache.sdkMessagesMap = _.reduce(window.dataCache.sdkMessages, (result, value, key) => {
            result[value.name] = null;
            return result;
        }, {});

        // initialize autocomplete for the text boxes
        $("#Message").autocomplete({ data: window.dataCache.sdkMessagesMap });

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
        // init collapsibles
        $(".collapsible").collapsible();
        
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
            // maps for autocomplete
            window.dataCache.primaryEntityMap = _.reduce(window.dataCache.currentMessageFilters, (result, value, key) => {
                result[value.primaryobjecttypecode] = null;
                return result;
            }, {});

            window.dataCache.secondEntityMap = _.reduce(window.dataCache.currentMessageFilters, (result, value, key) => {
                result[value.secondaryobjecttypecode] = null;
                return result;
            }, {});

            $("#PrimaryEntity").autocomplete({ data: window.dataCache.primaryEntityMap });
            $("#SecondEntity").autocomplete({ data: window.dataCache.secondEntityMap });

            if (Object.keys(window.dataCache.primaryEntityMap).length === 1) {
                $("#PrimaryEntity").val(Object.keys(window.dataCache.primaryEntityMap)[0]);
            }
            
            if (Object.keys(window.dataCache.secondEntityMap).length === 1) {
                $("#SecondEntity").val(Object.keys(window.dataCache.secondEntityMap)[0]);
            }

            M.updateTextFields();
        });

        // wire change of inputs that name and describe step automatically
        $("#Message,#PrimaryEntity,#EventHandler").change(function() {
           updateStepNameAndDescription(); 
        });

        function validateForm(step) {
            const messages = [];

            // put validations in here
            if (CloudSmith.Utilities.isNullOrEmpty(step["sdkmessageid@odata.bind"]) || _.endsWith(step["sdkmessageid@odata.bind"], "()")) { messages.push('Invalid Message'); }
            if (CloudSmith.Utilities.isNullOrEmpty(step["sdkmessagefilterid@odata.bind"]) || _.endsWith(step["sdkmessagefilterid@odata.bind"], "()")) { messages.push('Invalid Primary and Secondary entities'); }
            if (CloudSmith.Utilities.isNullOrEmpty(step.name)) { messages.push('The Step Name is required'); }
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