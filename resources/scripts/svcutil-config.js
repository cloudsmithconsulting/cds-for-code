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
            options: { fsPath: viewModel.options ? viewModel.options.fsPath : undefined },
            entities: viewModel.entities,
            optionsets: viewModel.optionsets,
            solutions: viewModel.solutions,
            entityMap: _.map(viewModel.entities, i => { return { value: i.MetadataId, text: i.LogicalName } }),
            optionsetMap: _.map(viewModel.optionsets, i => { return { value: i.Name, text: i.Name } }),
            solutionMap: _.map(viewModel.solutions, i => { return { value: i.uniquename, text: i.uniquename } }),
            filterOptions: viewModel.filterOptions || { },
            filterRules: viewModel.filterRules || [],
            namingRules: viewModel.namingRules || [],
            codeGeneration: viewModel.codeGeneration || { namingRules: [], behaviors: {} }
        }

        $("[data-source='Entities']").each(function (index, element) {
            bindSelect($(element), window.dataCache.entityMap, !element.multiple ? "- Select Entity -" : undefined);
        });

        $("[data-source='OptionSets']").each(function (index, element) {
            bindSelect($(element), window.dataCache.optionsetMap, !element.multiple ? "- Select Option Set -" : undefined);
        });

        $("[data-source='Solutions']").each(function (index, element) {
            bindSelect($(element), window.dataCache.solutionMap, !element.multiple ? "- Select Solution -" : undefined);
        });

        // cache html for mustache template
        const filterRuleTemplate = $("#filter-rule-template").html();
        const namingRuleTemplate = $("#naming-rule-template").html();
        const codeGenerationNamingRuleTemplate = $("#code-generation-fileNaming-rule-template").html();

        if (window.dataCache.filterOptions.whitelistMode) {
            const $control = $('[data-action="whitelist-filtermode"]');
            const newMode = window.dataCache.filterOptions.whitelistMode === 'Eclusive' ? 'Inclusive' : 'Exclusive';
            const newText = `Switch to ${$control.attr("data-value")} Whitelist`;

            $control.attr("data-value") = newMode;
            $control.attr('title', newText)
            $control.text(newText);
        }

        if (window.dataCache.codeGeneration.path) {
            $("#code-generation-outputPath").val(window.dataCache.codeGeneration.path);
        }

        if (window.dataCache.codeGeneration.language) {
            $("#code-generation-outputLanguage").val(window.dataCache.codeGeneration.language);
            $("#code-generation-outputLanguage").formSelect();
        }

        if (window.dataCache.codeGeneration.behaviors) {
            if (window.dataCache.codeGeneration.behaviors.translateOptionSetsAsEnums) {
                $("#code-generation-translateOptionSets").prop("checked", true);
            }

            if (window.dataCache.codeGeneration.behaviors.importNamespaces) {
                $("#code-generation-defaultImports").val(window.dataCache.codeGeneration.behaviors.importNamespaces);
            }
        }

        // cache template in mustache
        Mustache.parse(filterRuleTemplate);
        Mustache.parse(namingRuleTemplate);
        Mustache.parse(codeGenerationNamingRuleTemplate);

        renderTemplate(filterRuleTemplate, window.dataCache.filterRules.filter(i => i.listType === 'whitelist'), 'whitelist');
        renderTemplate(filterRuleTemplate, window.dataCache.filterRules.filter(i => i.listType === 'blacklist'), 'blacklist');
        renderTemplate(namingRuleTemplate, window.dataCache.namingRules, "naming");
        renderTemplate(codeGenerationNamingRuleTemplate, window.dataCache.codeGeneration.namingRules, "code-generation-fileNaming");
                
        // hide initialize info box
        $("#loadingPanel").hide();
    }

    function setAttributes(attributes, targetElem) {
        window.dataCache.attributes = attributes;
        window.dataCache.attributesMap = _.map(attributes, i => { return { value: i.MetadataId, text: i.LogicalName } });

        bindSelect($(targetElem), window.dataCache.attributesMap);
    }

    const removeRule = window.removeRule = function(list, id) {
        let template, items, container;

        switch (list) {
            case "filter":
                _.remove(window.dataCache.filterRules, r => r.id === id);

                template = $("#filter-rule-template").html();
                container = id.split(".")[0];
                items = window.dataCache.filterRules.filter(r => r.listType === id.split(".")[0]);

                break;
            case "naming":
                _.remove(window.dataCache.namingRules, r => r.id === id);

                template = $("#naming-rule-template").html();
                container = list;
                items = window.dataCache.namingRules;

                break;
            case "fileNaming":
                _.remove(window.dataCache.codeGeneration.namingRules, r => r.id === id);

                template = $("#code-generation-fileNaming-rule-template").html();
                container = "code-generation-fileNaming";
                items = window.dataCache.codeGeneration.namingRules;

                break;
        }

        Mustache.parse(template);

        renderTemplate(template, items, container);
    }

    function getForm(formSelector, filter) {
        let form = {};
        $(formSelector)
            .serializeArray()
            .filter(filter)
            .forEach(i => {
                if (form.hasOwnProperty(i.name)) {
                    if (!(form[i.name] instanceof Array)) {
                        const currentItem = form[i.name];
                        form[i.name] = [ currentItem, i.value ];
                    } else {
                        form[i.name].push(i.value);
                    }
                } else {
                    form[i.name] = i.value;
                }
            });

        return form;
    }

    function addToFilterRules(form, listType, template) {
        let items = [];
        const itemType = form[`${listType}-filterType`] === 'OptionSet' ? 'optionSet' : form[`${listType}-filterType`].toLowerCase();

        if (form[`${listType}-${itemType}-addmode`] === itemType) {
            const options = itemType !== 'attribute' ? {} : { entity: form[`${listType}-${itemType}-allentities`] === 'true' ? '*' : window.dataCache.entities.filter(e => e.MetadataId === form[`${listType}-${itemType}-entity`])[0].LogicalName };
            const idPrefix = `${listType}.${itemType}.exact-match.${options.entity ? options.entity + "." : ''}`;

            if (form[`${listType}-${itemType}-selections`] instanceof Array) {
                form[`${listType}-${itemType}-selections`].forEach((value, index) => {
                    if (itemType === 'entity') {
                        value = window.dataCache.entities.filter(e => e.MetadataId === value)[0].LogicalName;
                    } else if (itemType === 'attribute') {
                        value = window.dataCache.attributes.filter(a => a.MetadataId === value)[0].LogicalName;
                    }

                    items.push({ id: idPrefix + value, listType, scope: itemType, value, ruleType: 'exact-match', options });
                });
            } else {
                let value = form[`${listType}-${itemType}-selections`]; 

                if (itemType === 'entity') {
                    value = window.dataCache.entities.filter(e => e.MetadataId === form[`${listType}-${itemType}-selections`])[0].LogicalName;
                } else if (itemType === 'attribute') {
                    value = window.dataCache.attributes.filter(a => a.MetadataId === form[`${listType}-${itemType}-selections`])[0].LogicalName;
                }

                items.push({ id: idPrefix + value, listType, scope: itemType, value, ruleType: 'exact-match', options });
            }
        } else {
            if (itemType !== "customizations") {
                items.push({ id: `${listType}.${itemType}.regex`, listType, scope: itemType, value: form[`${listType}-${itemType}-regex`], ruleType: 'regex', options: { ignoreCase: form[`${listType}-${itemType}-regex-ignorecase`] === 'true' } });
            } else {
                items.push({ id: `${listType}.${itemType}`, listType, scope: itemType, value: form[`${listType}-${itemType}-selections`], ruleType: 'customizations' });
            }
        }

        items.forEach(i => {
            const index = window.dataCache.filterRules.findIndex(r => r.id === i.id);

            if (index === -1) {
                window.dataCache.filterRules.push(i);
            } else {
                window.dataCache.filterRules[index] = i;
            }
        });

        renderTemplate(template, window.dataCache.filterRules.filter(i => i.listType === listType), listType);
    }

    function addToNamingRules(form, listType, template) {
        const itemType = listType === "naming-mapping" ? form[`${listType}-filterType`].toLowerCase() : "publisher";
        let oldValue;
        let newValue;

        if (itemType === "attribute") {
            oldValue = (form["naming-mapping-attribute-allentities"] === "true" ? "*." : window.dataCache.entities.filter(e => e.MetadataId === form["naming-mapping-attribute-entity"])[0].LogicalName + ".") 
                + window.dataCache.attributes.filter(a => a.MetadataId === form["naming-mapping-attribute-selection"])[0].LogicalName;
            newValue = form["naming-mapping-newname"];
        } else if (itemType === "entity") {
            oldValue = window.dataCache.entities.filter(e => e.MetadataId === form["naming-mapping-entity-selection"])[0].LogicalName;
            newValue = form["naming-mapping-newname"];
        } else if (itemType === "publisher") {
            oldValue = form["naming-publisher-oldname"];
            newValue = form["naming-publisher-newname"];
        }

        const items = [{ 
            id: `${itemType}.${oldValue}`,
            ruleType: listType === "naming-mapping" ? "Mapping" : "Publisher",
            scope: itemType,
            oldValue,
            newValue
        }];

        items.forEach(i => {
            const index = window.dataCache.namingRules.findIndex(r => r.id === i.id);

            if (index === -1) {
                window.dataCache.namingRules.push(i);
            } else {
                window.dataCache.namingRules[index] = i;
            }
        }); 

        renderTemplate(template, window.dataCache.namingRules, "naming");
    }

    function addToCodeGenFileNamingRules(form, listType, template) {
        const items = [{ 
            strategy: form[`${listType}-fileStrategy`],
            fileType: form[`${listType}-fileType`],
            format: form[`${listType}-filenameFormat`],
            id: `${this.strategy}.${this.fileType}`
        }];

        items.forEach(i => {
            const index = window.dataCache.codeGeneration.namingRules.findIndex(r => r.id === i.id);

            if (index === -1) {
                window.dataCache.codeGeneration.namingRules.push(i);
            } else {
                window.dataCache.codeGeneration.namingRules[index] = i;
            }
        });

        renderTemplate(template, window.dataCache.codeGeneration.namingRules, listType);
    }

    function renderTemplate(template, items, container) {
        const rendered = Mustache.render(template, { items });

        if (items.length > 0) {
            $(`#${container}-rules > [ux-template='default']`).hide();
        } else {
            $(`#${container}-rules > [ux-template='default']`).show();
        }

        $(`#${container}-rules > li:gt(1)`).remove();
        $(`#${container}-rules`).append(rendered);
    }

    // this part starts on document ready
    $(function () {
        M.AutoInit();

        // cache html for mustache template
        const filterRuleTemplate = $("#filter-rule-template").html();
        const namingRuleTemplate = $("#naming-rule-template").html();
        const codeGenerationNamingRuleTemplate = $("#code-generation-fileNaming-rule-template").html();

        // cache template in mustache
        Mustache.parse(filterRuleTemplate);
        Mustache.parse(namingRuleTemplate);
        Mustache.parse(codeGenerationNamingRuleTemplate);

        $('[data-action="whitelist-filtermode"]').click(function() {
            const $this = $(this);
            const currentMode = $this.attr('data-value');
            const newMode = currentMode === 'Exclusive' ? 'Inclusive' : 'Exclusive';
            const newText = `Switch to ${currentMode} Whitelist`;

            $this.attr('data-value', newMode);
            $this.attr('title', newText)
            $this.text(newText);
        });

        $('[data-action="whitelist-add"]').click(function() {
            $("#whitelist-nullpanel").hide();
            $("#whitelist-addpanel").show();
        });

        $('[data-action="blacklist-add"]').click(function() {
            $("#blacklist-nullpanel").hide();
            $("#blacklist-addpanel").show();
        });

        $('[data-action="naming-add-mapping"]').click(function() {
            $("#naming-nullpanel").hide();
            $("#naming-publisher-addpanel").hide();
            $("#naming-mapping-addpanel").show();
        });

        $('[data-action="naming-add-publisher"]').click(function() {
            $("#naming-nullpanel").hide();
            $("#naming-mapping-addpanel").hide();
            $("#naming-publisher-addpanel").show();
        });

        $('[data-action="code-generation-fileNaming-add"]').click(function() {
            $("#code-generation-fileNaming-nullpanel").hide();
            $("#code-generation-fileNaming-addpanel").show();
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

        $("#naming-mapping-filterType").change(function() {
            $("[data-filter-type]", "#naming-mapping-addpanel").hide();
            $(`[data-filter-type*=${this.value}]`, "#naming-mapping-addpanel").show();
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

        $("SELECT[name='blacklist-attribute-entity']").change(function() {
            if (!this.value) {
                $("option", "[data-source='Attributes']").remove();
                return;
            }
            
            vscode.postMessage({
                command: `retrieveListFor${$("#blacklist-filterType").val()}`,
                entityKey: this.value,
                targetElem: "[data-source='Attributes']"
            });
        });

        $("SELECT[name='naming-mapping-attribute-entity']").change(function() {
            if (!this.value) {
                $("option", "[data-source='Attributes']").remove();
                return;
            }
            
            vscode.postMessage({
                command: `retrieveListFor${$("#naming-mapping-filterType").val()}`,
                entityKey: this.value,
                targetElem: "[data-source='Attributes']"
            });
        });

        $("[data-action='whitelist-save']").click(function () {
            var form = getForm("FORM", i => i.name.startsWith("whitelist"));

            return addToFilterRules(form, 'whitelist', filterRuleTemplate);
        });

        $("[data-action='whitelist-cancel']").click(function () {
            $("#whitelist-addpanel").hide();
            $("#whitelist-nullpanel").show();
        });

        $("[data-action='blacklist-save']").click(function () {
            var form = getForm("FORM", i => i.name.startsWith("blacklist"));
            
            return addToFilterRules(form, 'blacklist', filterRuleTemplate);
        });

        $("[data-action='blacklist-cancel']").click(function () {
            $("#blacklist-addpanel").hide();
            $("#blacklist-nullpanel").show();
        });

        $("[data-action='naming-mapping-save']").click(function () {
            var form = getForm("FORM", i => i.name.startsWith("naming-"));
            
            return addToNamingRules(form, 'naming-mapping', namingRuleTemplate);
        });

        $("[data-action='naming-mapping-cancel']").click(function () {
            $("#naming-mapping-addpanel").hide();
            $("#naming-nullpanel").show();
        });

        $("[data-action='naming-publisher-save']").click(function () {
            var form = getForm("FORM", i => i.name.startsWith("naming-"));
            
            return addToNamingRules(form, 'naming-publisher', namingRuleTemplate);
        });

        $("[data-action='naming-publisher-cancel']").click(function () {
            $("#naming-publisher-addpanel").hide();
            $("#naming-nullpanel").show();
        });

        $("[data-action='code-generation-fileNaming-save']").click(function () {
            var form = getForm("FORM", i => i.name.startsWith("code-generation-fileNaming"));
            
            return addToCodeGenFileNamingRules(form, 'code-generation-fileNaming', codeGenerationNamingRuleTemplate);
        });

        $("[data-action='code-generation-fileNaming-cancel']").click(function () {
            $("#code-generation-fileNaming-addpanel").hide();
            $("#code-generation-fileNaming-nullpanel").show();
        });

        // wire up click handler for the submit button
        $("[data-action='save']").click(function() {
            // Save the handful of properties that aren't auto-saved.
            window.dataCache.filterOptions.whitelistMode = $('[data-action="whitelist-filtermode"]').attr("data-value");
            window.dataCache.codeGeneration.path = $("#code-generation-outputPath").val();
            window.dataCache.codeGeneration.language = $("#code-generation-outputLanguage").val();
            window.dataCache.codeGeneration.behaviors.translateOptionSetsAsEnums = $("#code-generation-translateOptionSets").prop("checked");
            window.dataCache.codeGeneration.behaviors.importNamespaces = $("#code-generation-defaultImports").val();

            vscode.postMessage({
                command: 'save',
                config: {
                    options: window.dataCache.options,
                    filterOptions: window.dataCache.filterOptions,
                    filterRules: window.dataCache.filterRules,
                    namingRules: window.dataCache.namingRules,
                    codeGeneration: window.dataCache.codeGeneration
                }
            })
        });
    });
}());