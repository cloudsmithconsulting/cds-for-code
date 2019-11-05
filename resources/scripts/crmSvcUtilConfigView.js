// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
$(function () {
    // You MUST set = window.vscodeApi for scripts in main.js to work properly
    const vscode = window.vscodeApi = acquireVsCodeApi();

    // wire up view change events
    $(".view__item").click(function() {
        // get the clicked link element
        $viewLink = $(this);
        // remove active class
        $(".view__item").removeClass("view__item--active");
        // get the selected view
        const currentView = $viewLink.attr("data-view");
        // show or hide fields based on current view
        $(".field-container").each(function(index) {
            $formContainer = $(this);
            // show all the elements that have the current view in the 
            // comma delimited list in the data-form attribute
            if ($formContainer.attr("data-form").indexOf(currentView) !== -1) {
                $formContainer.show();
            } else {
                $formContainer.hide();
            }
        });
        // set the active class
        $viewLink.addClass("view__item--active");
        // set the form labels to correct view
        $(".form-type-label").html(currentView);
    });

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
                allEntities,
                ignoreCase
            });
        }

        console.log(rulesToAdd);
    });

    // wire up click handler for the submit button
    $("#submitButton").click(function() {

    });

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data;

        switch (message.command) {
            case "configure":
                break;
        }
    });

});