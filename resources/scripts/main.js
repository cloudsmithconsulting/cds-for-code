// this will happen when the script is loaded
(function() {
    const CloudSmith = window.CloudSmith = {
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
            const vscode = window.vscodeApi;
            if (!vscode) throw "vscode was undefined";
            // call default "closeWindow"
            vscode.postMessage({
                command: "closeWindow"
            });
        });
    });
}());