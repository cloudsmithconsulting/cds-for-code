// this will happen when the script is loaded
(function() {
    let host;
    
    // cloudsmith utilities
    const CloudSmith = window.CloudSmith || {};
    
    CloudSmith.getHost = function() {
        host = host || acquireVsCodeApi();

        if (!host) {
            throw "Could not obtain a context for vscode";
        }

        return host;
    };

    CloudSmith.System = {
        closeWindow = function() {
            CloudSmith.getHost().postMessage({command: "system:closeWindow" });
        },
        ready = function() {
            CloudSmith.getHost().postMessage({command: "system:ready" });
        }
    };

    CloudSmith.ErrorPanel = {
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
    };

    CloudSmith.Tabs = {
        getCurrentTab: function () {
            return $(".tab__item--active:first").attr("data-tab");
        }
    };

    CloudSmith.Utilities = {
        isNullOrEmpty: function(str) {
            return (!str || str.replace(/\s/gi, "").length === 0);
        },
        nullForEmpty: function(str) {
            return this.isNullOrEmpty(str) ? null : str;
        }
    };

    window.CloudSmith = CloudSmith;
    
    // this will happen on document ready
    $(function () {
        $("#[data-action='cancel']").click(() => {
             CloudSmith.System.closeWindow(); 
        });

        CloudSmith.System.ready();
    });
}());