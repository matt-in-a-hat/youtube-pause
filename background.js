/*jslint indent:4*/
/*global chrome*/

// This script is run when the addon is loaded by the browser (probably when the first window opens).
(function () {

    var urlIndex = {};
    var youtubeTabIds = {};
    var activeYoutubeTabId;

    var isYoutubeURL = function (url) {
        return url.match(/^(http[s]?:\/\/)?www\.youtube\.com\/watch/) !== null;
    };

    var onNewRequest = function (tab) {
        var url = tab.url;
        if (isYoutubeURL(url)) {
            if (urlIndex[url] === undefined) {
                urlIndex[url] = {
                    tabIds: []
                };
                // var namesDiv = document.getElementById('video_urls');
                // var p = document.createElement('p');
                // var content = document.createTextNode(url);
                // p.appendChild(content);
                // namesDiv.appendChild(p);
                // urlIndex[url].htmlItem = p;
            }

            // urlIndex[url].htmlItem.classList.add('tab-open');

            activeYoutubeTabId = tab.id;
            var tabId;
            // for (tabId in youtubeTabIds) {
            Object.keys(youtubeTabIds).forEach(function (tabId) {
                var match = tabId.match(/^(\d+)_tabId$/);
                if (match !== null) {
                    tabId = parseInt(match[1], 10);
                    if (tabId !== tab.id) {
                        chrome.tabs.sendMessage(tabId, "pause");
                    }
                }
            });

            urlIndex[url].tabIds.push(tab.id);
            youtubeTabIds[tab.id + '_tabId'] = true;
        }
    };

    var onTabClose = function (tabId) {

    };

    chrome.tabs.onCreated.addListener(function (tab) {
        onNewRequest(tab);
    });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        onNewRequest(tab);
    });
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        console.log('Removed', removeInfo);
    });

}());