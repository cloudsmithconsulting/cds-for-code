// this will happen when the script is loaded
(function() {
    let currentVsCodeApi;
    
    // cloudsmith utilities
    const CloudSmith = window.CloudSmith = {
        acquireVsCodeApi: function() {
            currentVsCodeApi = currentVsCodeApi || acquireVsCodeApi();
            return currentVsCodeApi;
        },
        ErrorPanel: {
            hide: function () {
                $("#errorPanel").hide();
            },
            showError: function(messages) {
                if (messages.length > 0) {
                    // build and inject error message
                    const errorMessage = `&nbsp;&nbsp;-&nbsp;${messages.join("<br/>&nbsp;&nbsp;-&nbsp;")}`
                    // build and inject error message
                    $("#errorMessage").html(errorMessage);
                    // show this panel
                    $("#errorPanel").show();
                } else {
                    // no errors, hide the panel
                    $("#errorPanel").hide();
                }
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
            },
            nullForEmpty: function(str) {
                return this.isNullOrEmpty(str) ? null : str;
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