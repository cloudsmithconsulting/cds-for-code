// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function() {
    // this stuff will be available on script load
    const vscode = CloudSmith.getHost();
    //const oldState = vscode.getState();
    window.dataCache = {};

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data;

        switch (message.command) {
            case "load":
                setInitialState(message.viewModel);
                break;
            case "updateAttributes":
                setAttributes(message.attributes, message.targetElem);
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

    function bindSelect($select, selectionArray, noSelectionOption) {
        // remove prior options if they exist
        $("option", $select).remove();
        if (noSelectionOption) {
            $select.append(`<option value="">${noSelectionOption}</option>`);
        }
        // add selections back
        for (let i = 0; i < selectionArray.length; i++) {
            const item = selectionArray[i];
            // create the dropdown option
            const $option = $(`<option value="${item.value}">${item.text}</option>`);
            // append this to the select list
            $select.append($option);   
        }
    }

    function setInitialState(viewModel) {
        // form load here
        window.dataCache = {
            entities: viewModel.entities,
            optionsets: viewModel.optionsets,
            solutions: viewModel.solutions,
            entityMap: _.map(viewModel.entities, i => { return { value: i.LogicalName, text: i.LogicalName } }),
            entityMapWithId: _.map(viewModel.entities, i => { return { value: i.MetadataId, text: i.LogicalName } }),
            optionsetMap: _.map(viewModel.optionsets, i => { return { value: i.Name, text: i.Name } }),
            solutionMap: _.map(viewModel.solutions, i => { return { value: i.uniquename, text: i.uniquename } })
        }

        bindSelect($("#EntityList"), window.dataCache.entityMap);
        bindSelect($("#EntityList2"), window.dataCache.entityMap);
        bindSelect($("#EntitySelect"), window.dataCache.entityMapWithId, "- Select -");
        bindSelect($("#EntitySelect2"), window.dataCache.entityMapWithId, "- Select -");
        bindSelect($("#OptionSetList"), window.dataCache.optionsetMap);
        bindSelect($("#SolutionList"), window.dataCache.solutionMap);

        // hide initialize info box
        $("#loadingPanel").hide();
    }

    function setAttributes(attributes, targetElem) {
        window.dataCache.attributes = attributes;
        window.dataCache.attributesMap = _.map(attributes, i => { return { value: i.LogicalName, text: i.LogicalName } });

        bindSelect($(targetElem), window.dataCache.attributesMap);
    }

    const removeRule = window.removeRule = function(button) {
        const $button = $(button);
        $button.parent("td").parent("tr").remove();
    }

    // this part starts on document ready
    $(function () {
        M.AutoInit();

        // change visible fields based on filter type
        $("#FilterType").change(function() {
            $("[data-filter-type]", "#tab1").hide();
            $(`[data-filter-type*=${this.value}]`, "#tab1").show();
        });

        $("#FilterType2").change(function() {
            $("[data-filter-type]", "#tab2").hide();
            $(`[data-filter-type*=${this.value}]`, "#tab2").show();
        });

        $("#EntitySelect").change(function() {
            if (!this.value) {
                $("option", "#AttributeList").remove();
                return;
            }
            
            vscode.postMessage({
                command: `retrieveListFor${$("#FilterType").val()}`,
                entityKey: this.value,
                targetElem: "#AttributeList"
            });
        });

        $("#EntitySelect2").change(function() {
            if (!this.value) {
                $("option", "#AttributeSelect").remove();
                return;
            }
            
            vscode.postMessage({
                command: `retrieveListFor${$("#FilterType2").val()}`,
                entityKey: this.value,
                targetElem: "#AttributeSelect"
            });
        });
    
        // cache html for mustache template
        const listRowTemplate = $("#listRowTemplate").html();
        // cache template in mustache
        Mustache.parse(listRowTemplate);

        // add any rules to the table
        // const rendered = Mustache.render(listRowTemplate, {rulesToAdd});
        // $(`#${listType}Table>tbody`).append(rendered);
    
        // wire up click handler for the submit button
        $("[data-action='save']").click(function() {
    
        });
    });
}());