// this will happen when the script is loaded
(function() {
    let currentVsCodeApi;
    // cloudsmith utilities
    const CloudSmith = window.CloudSmith = {
        acquireVsCodeApi: function() {
            currentVsCodeApi = currentVsCodeApi || acquireVsCodeApi();
            return currentVsCodeApi;
        },
        Controls: {
            getRadioButtonValue: function(radioButtonName) {
                return $(`[name="${radioButtonName}"]:checked`).val();
            }
        },
        Tabs: {
            getCurrentTab: function () {
                return $(".tab__item--active:first").attr("data-tab");
            }
        },
        Utilities: {
            isNullOrEmpty: function(str) {
                return (!str || str.replace(/\s/gi, "").length === 0);
            }
        }
    };

    // this will happen on document ready
    $(function () {
        // wire up cancel button event for default behavior
        $("#cancelButton").click(function() {
            // get the vscode api
            const vscode = CloudSmith.acquireVsCodeApi();
            if (!vscode) throw "vscode was undefined";
            // call default "closeWindow"
            vscode.postMessage({
                command: "closeWindow"
            });
        });
    });
}());