// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
$(function () {
    // handle tab item click
    $(".tab__item").click(function() {
        // get current tab item
        const $tabItem = $(this);
        // get the current tabid
        const tabId = $tabItem.attr("data-tab");
        // hide all tabs
        $(".tab__content").hide();
        // show correct tab
        $(`#${tabId}`).show();
        // remove active tab
        $(".tab__item").removeClass("tab__item--active");
        // add active class to current tab
        $tabItem.addClass("tab__item--active");
    });
});