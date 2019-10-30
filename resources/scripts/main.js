// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const cancelButton = document.getElementById("cancelButton");

    if (cancelButton) {
        cancelButton.addEventListener("click", function(event) {
            const vscode = window.vscodeApi;
            if (!vscode) throw "vscode was undefined";
            vscode.postMessage({
                command: "closeWindow"
            });
        });
    }

    const CloudSmith = window.CloudSmith = {
        Controls: {
            getRadioButtonValue: function(radioButtonName) {
                const radioInputs = document.getElementsByName(radioButtonName);
                for (let i = 0; i < radioInputs.length; i++) {
                    const currentRadio = radioInputs[i];
                    if (currentRadio.checked) { return currentRadio.value; }
                }
            }
        },
        Tabs: {
            getCurrentTab: function (defaultTab) {
                return window.currentTab || defaultTab;
            }
        },
        Utilities: {
            isNullOrEmpty: function(str) {
                return (!str || str.replace(/\s/gi, "").length === 0);
            }
        }
    };
}());