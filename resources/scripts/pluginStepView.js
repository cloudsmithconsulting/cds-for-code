// import { arrayify } from "tslint/lib/utils";

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    // You MUST set = window.vscodeApi for scripts in main.js to work properly
    const vscode = window.vscodeApi = acquireVsCodeApi();
    const submitButton = document.getElementById("submitButton");

    // Wire up our save handler.
    submitButton.addEventListener("click", event => {
        event.preventDefault();
        const config = {
            // work on gathering the form information
            message: document.getElementById("Message").value,
            primaryEntity: document.getElementById("PrimaryEntity").value,
            secondEntity: document.getElementById("SecondEntity").value,
            filteringAttributes: document.getElementById("FilteringAttributes").value,
            eventHandler: document.getElementById("EventHandler").value,
            stepName: document.getElementById("StepName").value,
            userContext: document.getElementById("UserContext").value,
            executionOrder: document.getElementById("ExecutionOrder").value,
            excutionPipeline: CloudSmith.Controls.getRadioButtonValue("ExecutionPipeline"),
            statusCode: document.getElementById("StatusCode").value && document.getElementById("StatusCode").value.length > 0,
            executionMode: CloudSmith.Controls.getRadioButtonValue("ExecutionMode"),
            server: document.getElementById("Server").value && document.getElementById("Server").value.length > 0,
            offline: document.getElementById("Offline").value && document.getElementById("Offline").value.length > 0
        };

        if (!validateForm(config)) return;

        vscode.postMessage({
            command: 'saveSdkMessageProcessingStep',
            settings
        });
    });

    function setInitialState(viewModel) {
        setMessageAutoComplete(viewModel.sdkMessages);
        
        if (viewModel.step) {
            document.getElementById("Message").value = viewModel.step.sdkmessageid.name;
        }
    }

    function setMessageAutoComplete(messages) {
        var names = messages.map(o => o.name);

        /*initiate the autocomplete function on the "Message" element, and pass along the message array as possible autocomplete values:*/
        autocomplete(document.getElementById("Message"), names);
    }

    function validateForm(config) {
        const messages = [];

        // put validations in here
        if (CloudSmith.Utilities.isNullOrEmpty(config.message)) { messages.push('The Message is required'); }
        if (CloudSmith.Utilities.isNullOrEmpty(config.primaryEntity)) { messages.push('The Primary Entity is required'); }
        if (CloudSmith.Utilities.isNullOrEmpty(config.secondEntity)) { messages.push('The Second Entity is required'); }
        if (CloudSmith.Utilities.isNullOrEmpty(config.filteringAttributes)) { messages.push('The Filtering Attributes is required'); }
        if (CloudSmith.Utilities.isNullOrEmpty(config.eventHandler)) { messages.push('The Event Handler is required'); }
        if (CloudSmith.Utilities.isNullOrEmpty(config.stepName)) { messages.push('The Step Name is required'); }
        if (CloudSmith.Utilities.isNullOrEmpty(config.userContext)) { messages.push('The User Context is required'); }
        if (CloudSmith.Utilities.isNullOrEmpty(config.executionOrder)) { messages.push('The Execution Order is required'); }

        if (messages.length > 0) {
            // build and inject error message
            const errorHtml = `&nbsp;&nbsp;-&nbsp;${messages.join("<br/>&nbsp;&nbsp;-&nbsp;")}`
            errorMessage.innerHTML = errorHtml;
            // show this panel
            errorPanel.removeAttribute("hidden");
        } else {
            errorPanel.setAttribute("hidden", "hidden");
        }

        return messages.length === 0;
    }

    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", event => {
        const message = event.data;

        switch (message.command) {
            case "load":
                setInitialState(message.viewModel);
                break;
        }
    });

}());