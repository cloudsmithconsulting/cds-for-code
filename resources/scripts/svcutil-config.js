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

        $select.onOpenStart = function() {
            $select.recalculateDimensions();
            $select.onOpenStart = null;
        };

        $select.formSelect();
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

        $("[data-source='Entities']").each(function (index, element) {
            if (element.multiple) {
                bindSelect($(element), window.dataCache.entityMap);
            } else {
                bindSelect($(element), window.dataCache.entityMapWithId, "- Select Entity -");
            }
        });

        $("[data-source='OptionSets']").each(function (index, element) {
            if (element.multiple) {
                bindSelect($(element), window.dataCache.optionsetMap);
            } else {
                bindSelect($(element), window.dataCache.optionsetMap, "- Select Option Set -");
            }
        });

        $("[data-source='Solutions']").each(function (index, element) {
            if (element.multiple) {
                bindSelect($(element), window.dataCache.solutionMap);
            } else {
                bindSelect($(element), window.dataCache.solutionMap, "- Select Solution -");
            }
        });

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

        $('[data-action=whitelist-add').click(function() {
            $("#whitelist-addpanel").show();
        });

        $("[ux-enable-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-enable-target");
                var element = $(target);

                element.prop('disabled', !this.checked);

                if (element.prop("nodeName") === "SELECT") {
                    element.formSelect();
                }
            });
        });

        $("[ux-disable-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-disable-target");
                var element = $(target);

                element.prop('disabled', this.checked);

                if (element.prop("nodeName") === "SELECT") {
                    element.formSelect();
                }
            });
        });

        $("[ux-show-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-show-target");
                var element = $(target);

                element.prop('hidden', !this.checked);

                if (element.prop("nodeName") === "SELECT") {
                    element.formSelect();
                }
            });
        });

        $("[ux-hide-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-hide-target");
                var element = $(target);

                element.prop('hidden', this.checked);

                if (element.prop("nodeName") === "SELECT") {
                    element.formSelect();
                }
            });
        });

        // change visible fields based on filter type
        $("#whitelist-filterType").change(function() {
            $("[data-filter-type]", "#whitelist").hide();
            $(`[data-filter-type*=${this.value}]`, "#whitelist").show();
        });

        $("#blacklist-filterType").change(function() {
            $("[data-filter-type]", "#blacklist").hide();
            $(`[data-filter-type*=${this.value}]`, "#blacklist").show();
        });

        $("SELECT[name='whitelist-attribute-entity']").change(function() {
            if (!this.value) {
                $("option", "[data-source='Attributes']").remove();
                return;
            }
            
            vscode.postMessage({
                command: `retrieveListFor${$("#whitelist-filterType").val()}`,
                entityKey: this.value,
                targetElem: "[data-source='Attributes']"
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