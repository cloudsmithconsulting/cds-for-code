// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    let currentTabId = window.currentTabId;

    const changeTab = window.changeTab = function(event, tabId) {
        if (!event) { return; } // only do this if event exists

        // set the current tab id
        currentTabId = tabId;
        
        // Get all elements with class="tabcontent" and hide them
        const tabcontent = document.getElementsByClassName("tab__content");
        for (let i = 0; i < tabcontent.length; i++) {
            tabcontent[i].setAttribute("hidden", "hidden");
        }

        // Get all elements with class="tablinks" and remove the class "active"
        const tablinks = document.getElementsByClassName("tab__item");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" tab__item--active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabId).removeAttribute("hidden");
        // set the class of active tab
        event.currentTarget.className += " tab__item--active";
    }
}());