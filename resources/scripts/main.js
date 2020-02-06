// this will happen when the script is loaded
(function() {
    let host;
    let bridge;

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
        closeWindow: function() {
            CloudSmith.getHost().postMessage({command: "system:closeWindow" });
        },
        ready: function() {
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
        $("[data-action='cancel']").click(() => {
             CloudSmith.System.closeWindow(); 
        });

        $("[ux-enable-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-enable-target");

                $(target).prop('disabled', !this.checked);
                $(target).each(function (index, el) {
                    var element = $(el);

                    if (element.prop("nodeName") === "SELECT") {
                        element.formSelect();
                    }
                });
            });
        });

        $("[ux-disable-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-disable-target");
                
                $(target).prop('disabled', this.checked);
                $(target).each(function (index, el) {
                    var element = $(el);

                    if (element.prop("nodeName") === "SELECT") {
                        element.formSelect();
                    }
                });
            });
        });

        $("[ux-show-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-show-target");

                $(target).prop('hidden', !this.checked);
                $(target).each(function (index, el) {
                    var element = $(el);

                    if (element.prop("nodeName") === "SELECT") {
                        element.formSelect();
                    }
                });
            });
        });

        $("[ux-hide-target]").each((index, t) => {
            $(t).on('change', function () {
                var target = $(this).attr("ux-hide-target");

                $(target).prop('hidden', this.checked);
                $(target).each(function (index, el) {
                    var element = $(el);

                    if (element.prop("nodeName") === "SELECT") {
                        element.formSelect();
                    }
                });
            });
        });
        
        CloudSmith.System.ready();
    });
}());