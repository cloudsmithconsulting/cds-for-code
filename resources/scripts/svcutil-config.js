// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function() {
    // this stuff will be available on script load
    const vscode = CloudSmith.getHost();
    //const oldState = vscode.getState();

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        // wait for document ready
        $(document).ready(function() { 
            const message = event.data;
            switch (message.command) {
                case "load":
                    if (message.message) {
                        setInitialState(message.message);
                    }
                    break;
            }
        });

        // initialize framework
        M.updateTextFields();
        // bind select controls
        $("select").formSelect();
    });

    function setInitialState(viewModel) {
        // form load here
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