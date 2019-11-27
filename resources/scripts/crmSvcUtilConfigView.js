// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function() {
    // this stuff will be available on script load
    const vscode = CloudSmith.acquireVsCodeApi();
    //const oldState = vscode.getState();

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        // wait for document ready
        $(document).ready(function() { 
            const message = event.data;
            switch (message.command) {
                case "configure":
                    break;
            }
        });
    });

    const removeRule = window.removeRule = function(button) {
        const $button = $(button);
        $button.parent("td").parent("tr").remove();
    }

    // this part starts on document ready
    $(function () {
        // wire up view change events
        $(".view__item").click(function() {
            // get the clicked link element
            const $viewLink = $(this);
            // get the parent div that is the tab
            const $tabContainer = $viewLink.parents(".tab__content:first");
            // remove active class
            $(".view__item", $tabContainer).removeClass("view__item--active");
            // get the selected view
            const currentView = $viewLink.attr("data-view");
            // show or hide fields based on current view
            $(".field-container", $tabContainer).each(function(index) {
                const $fieldContainer = $(this);
                // show all the elements that have the current view in the 
                // comma delimited list in the data-form attribute
                if ($fieldContainer.attr("data-form").indexOf(currentView) !== -1) {
                    $fieldContainer.show();
                } else {
                    $fieldContainer.hide();
                }
            });
            // set the active class
            $viewLink.addClass("view__item--active");
            // set the form labels to correct view
            $(".form-type-label", $tabContainer).html(currentView);
        });
    
        // cache html for mustache template
        const listRowTemplate = $("#listRowTemplate").html();
        // cache template in mustache
        Mustache.parse(listRowTemplate);

        // wire up add rule buttons
        $("button[id^='AddRule']").click(function() {
            // get the id of the clicked button
            const buttonId = this.id;
                
            // if we have a number, we want to suffix all the ids
            // with the same number
            const fieldSuffix = /\d/.test(buttonId)
                ? buttonId.charAt(buttonId.length - 1)
                : "";
    
            
            // gather our variables to be added to the rule
            const listType = $(".tab__item--active:first").attr("data-tab");
            const objectType = $(".view__item--active:first").attr("data-view");
            const ruleType = $(`[name="RuleType${fieldSuffix}"]:checked`).val();
            let appliesTo = "";
            let entity = "";
            let allEntities = false; 
            let ignoreCase = false; 
            const rulesToAdd = [];
    
            if (ruleType === "ByRule") {
                // if we're dealing with an attribute or optionset
                // see if it was to be applied to all entities
                if ("Attributes,OptionSets".indexOf(objectType) !== -1) {
                    allEntities = $(`#AllEntities${fieldSuffix}`).prop("checked");
                }
    
                if (objectType === "Entities") {
                    $(`#EntityList${fieldSuffix}>option:selected`).each(function(index) {
                        // set what entity this applies to
                        appliesTo = this.value;
                        // add rule for this entity
                        rulesToAdd.push({
                            listType,
                            objectType,
                            ruleType,
                            appliesTo,
                            entity,
                            allEntities,
                            ignoreCase
                        });
                    });
                } else if (objectType === "Solutions") {
                    $(`#SolutionList${fieldSuffix}>option:selected`).each(function(index) {
                        // set what entity this applies to
                        appliesTo = this.value;
                        // add rule for this entity
                        rulesToAdd.push({
                            listType,
                            objectType,
                            ruleType,
                            appliesTo,
                            entity,
                            allEntities,
                            ignoreCase
                        });
                    });
                } else if (objectType === "Attributes") {
                    // this will catch Attributes and OptionSets
                    entity = $(`#EntitySelect${fieldSuffix}`).val();
    
                    $(`#AttributeList${fieldSuffix}>option:selected`).each(function(index) {
                        // set what entity this applies to
                        appliesTo = this.value;
                        // add rule for this entity
                        rulesToAdd.push({
                            listType,
                            objectType,
                            ruleType,
                            appliesTo,
                            entity,
                            allEntities,
                            ignoreCase
                        });
                    });
                } else if (objectType === "OptionSets") {
                    // this will catch Attributes and OptionSets
                    entity = $(`#EntitySelect${fieldSuffix}`).val();
    
                    $(`#OptionSetList${fieldSuffix}>option:selected`).each(function(index) {
                        // set what entity this applies to
                        appliesTo = this.value;
                        // add rule for this entity
                        rulesToAdd.push({
                            listType,
                            objectType,
                            ruleType,
                            appliesTo,
                            entity,
                            allEntities,
                            ignoreCase
                        });
                    });
                }
            } else if (ruleType === "ByRegex") {
                // set to regex textbox value
                appliesTo = $(`#Expression${fieldSuffix}`).val();
                // see if ignore case option was selected
                ignoreCase = $(`#IgnoreCase${fieldSuffix}`).prop("checked");
                // add this regex rule
                rulesToAdd.push({
                    listType,
                    objectType,
                    ruleType,
                    appliesTo,
                    entity,
                    allEntities,
                    ignoreCase
                });
            }

            for (let i = 0; i < rulesToAdd.length; i++) {
                const rule = rulesToAdd[i];
                // add display for the ruleType
                rule.ruleTypeDisplay = (rule.ruleType === "ByRule")
                    ? "Exact Match"
                    : "Regular Expression";
                // add display for the appliesTo
                let ruleTypeDisplay = rule.appliesTo;
                if (ruleType === "ByRegex") {
                    if (rule.ignoreCase) {
                        ruleTypeDisplay = `${appliesTo} (ignore case)`;
                    }
                } else {
                    if ("Attributes,OptionSets".indexOf(rule.objectType) >= 0) {
                        if (rule.allEntities) {
                            ruleTypeDisplay = `${appliesTo} (all entities)`;
                        } else {
                            ruleTypeDisplay = `${appliesTo} (${rule.entity})`;
                        }
                    }
                }
                rule.appliesToDisplay = ruleTypeDisplay; 
            }
    
            // add any rules to the table
            const rendered = Mustache.render(listRowTemplate, {rulesToAdd});
            $(`#${listType}Table>tbody`).append(rendered);
        });

        // wire up search functionality to the text box
        $(".field__search").keyup(function() {
            const $searchBox = $(this);
            const searchText = $searchBox.val();
            // get the parent div that is the tab
            const $tabContainer = $searchBox.parents(".tab__content:first");
            // get the select options in the container
            const $selectOptions = $("select[multiple='multiple']>option", $tabContainer);
            // show all options
            $selectOptions.show();
            // if this is empty, do nothing and return
            if (CloudSmith.Utilities.IsNullOrEmpty(searchText)) { return; }

            // entities select filter
            $selectOptions.each(function() {
                const $option = $(this);
                // make sure it isn't selected
                $option[0].selected = false;
                // see if the search text is within the option text
                if ($option.text().toLowerCase().indexOf(searchText.toLowerCase()) >= 0) {
                    $option.show();
                } else {
                    $option.hide();
                }
            });

            // find any select list with only one visible element
            // and select the only visible element
            $("select[multiple='multiple']", $tabContainer).each(function() {
                const $options = $("option:visible", $(this));
                if ($options.length === 1) {
                    $options[0].selected = true;
                }
            });
        });
    
        // wire up click handler for the submit button
        $("#submitButton").click(function() {
    
        });
    });
}());