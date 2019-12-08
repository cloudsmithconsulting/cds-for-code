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
            const message = event.data; // The json data that the extension sent
            switch (message.command) {
                case "load":
                    setInitialState(message.viewModel, message.sdkmessageprocessingstepid);
                    break;
                case "error":
                    CloudSmith.ErrorPanel.showError([`${message.message}`]);
                    break;
            }
        });
    });

    function setInitialState(viewModel, sdkmessageprocessingstepid) {
        $("#SdkMessageProcessingStepId").val(sdkmessageprocessingstepid);

        if (viewModel) {
            $("#Id").val(viewModel.sdkmessageprocessingstepimageid);
            $("#PreImage").prop("checked", viewModel.imagetype === 0 || viewModel.imagetype === 2);
            $("#PostImage").prop("checked", viewModel.imagetype === 1 || viewModel.imagetype === 2);
            $("#Name").val(viewModel.name);
            $("#Alias").val(viewModel.entityalias);
            $("#Parameters").val(viewModel.attributes);
        }
    }

    // this part starts on document ready
    $(function () {
        function validateForm(pluginStepImage) {
            const messages = [];
    
            if (CloudSmith.Utilities.isNullOrEmpty(pluginStepImage.sdkmessageprocessingstepid)) { messages.push('The sdkmessageprocessingstepid is required'); }
            if (pluginStepImage.imagetype === null) { messages.push('The Image Type is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(pluginStepImage.name)) { messages.push('The Name is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(pluginStepImage.entityalias)) { messages.push('The Entity Alias is required'); }
            if (CloudSmith.Utilities.isNullOrEmpty(pluginStepImage.attributes)) { messages.push('The Parameters is required'); }
            
            // show errors
            CloudSmith.ErrorPanel.showError(messages);

            // if false, we have errors
            return messages.length === 0;
        }

        $("[data-action='save']").click(function() {
            const id = $("#Id").val();

            const preImage = $("#PreImage").prop("checked");
            const postImage = $("#PostImage").prop("checked");
            let imagetype = null;
            imagetype = (preImage && !postImage) ? 0 : imagetype;
            imagetype = (postImage && !preImage) ? 1 : imagetype;
            imagetype = (postImage && preImage) ? 2 : imagetype;

            const pluginStepImage = {
                sdkmessageprocessingstepimageid: (id.length > 0) ? id: null, // pass the id or null
                sdkmessageprocessingstepid: $("#SdkMessageProcessingStepId").val(),
                name: $("#Name").val(),
                entityalias: $("#Alias").val(),
                attributes: $("#Parameters").val(),
                imagetype
            };

            if (!validateForm(pluginStepImage)) return;

            vscode.postMessage({
                command: "save",
                pluginStepImage
            });
        });
    });
}());