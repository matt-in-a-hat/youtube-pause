/*jslint indent:2*/
/*global chrome*/

// This script is run when the addon is loaded by the browser (probably when the first window opens).
(function () {

  var _playingYoutubeTabIds = {};
  var _activeTab = null;

  // Sends the message to all youtube tabs we know about. Optionally except 1.
  var messageAllRegisteredYoutubeTabs = function (message, exceptTabId) {
    Object.keys(_playingYoutubeTabIds).forEach(function (tabId) {
      var match = tabId.match(/^(\d+)_tabId$/);
      if (match !== null) {
        tabId = parseInt(match[1], 10);
        if (tabId !== exceptTabId) {
          delete _playingYoutubeTabIds[tabId + "_tabId"];
          chrome.tabs.sendMessage(tabId, {message: message});
        }
      }
    });
  };

  // Handle messages from content scripts in youtube tabs
  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    if (typeof request === "object" && request.message !== undefined) {
      if (request.message === "youtubeExtensionVideoStarted") {
        _playingYoutubeTabIds[sender.tab.id + "_tabId"] = true;
        messageAllRegisteredYoutubeTabs("youtubeExtensionPauseVideo", sender.tab.id);
      }
    }
  });

  // Tells the active tab (if there is one) to start polling
  //  and the last active (if there is) to stop.
  // This will attempt to send to any tab, not just youtube ones.
  var updatePollingTab = function (newTabId) {
    var oldTabId = _activeTab;
    _activeTab = newTabId;
    if (oldTabId) {
      chrome.tabs.sendMessage(oldTabId, {message: 'youtubeExtensionStopPolling'});
    }
    if (newTabId) {
      chrome.tabs.sendMessage(newTabId, {message: 'youtubeExtensionStartPolling'});
    }
  };

  // Tell youtube tabs whether they're active so they don't always have to poll.
  //  When a tab changes,
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    updatePollingTab(activeInfo.tabId);
  });
  //  and when the focussed window changes
  chrome.windows.onFocusChanged.addListener(function (windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      updatePollingTab(null);
    } else {
      chrome.tabs.query({ active: true, windowId: windowId }, function (tabs) {
        updatePollingTab(tabs.length > 0 ? tabs[0].id : null);
      });
    }
  });

  // TODO:
  // Could I have some code here to run on start up (which will run on extension install/enable)
  //  to query all tabs for their URLs and inject the content script so that it works without
  //  having to refresh all open youtube tabs?
}());
