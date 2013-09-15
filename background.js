(function () {

    var urlIndex = {};
    var youtubeTabIds = {};
    var activeYoutubeTabId;

    var isYoutubeURL = function (url, tabId) {
        if (url.match(/^(http[s]?:\/\/)?www\.youtube\.com\/watch/) !== null) {
            console.log(url, url.match(/&html5=1/));
            if (url.match(/&html5=1/) !== null) { // &enablejsapi=1 
                return true;
            } else {
                chrome.tabs.update(tabId, {url: url+'&html5=1'});
            }
        }
        return false;
    };

    var onNewRequest = function (tab) {
        var url = tab.url;
        if (isYoutubeURL(url, tab.id)) {
        	console.log("is yt");
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
           	for (var tabId in youtubeTabIds) {
           		var match = tabId.match(/^(\d+)_tabId$/);
           		if (match !== null) {
           			var tabId = parseInt(match[1]);
           			if (tabId !== tab.id) {
           				// chrome.pageAction.hide(tabId);
           				chrome.tabs.sendMessage(tabId, "pause", function(){console.log("callback", this, arguments)});
           			}
           		}
           	}

            urlIndex[url].tabIds.push(tab.id);
            youtubeTabIds[''+tab.id+'_tabId'] = true;
        }
    };

    var onTabClose = function (tabId) {

    };

    chrome.tabs.onCreated.addListener(function (tab) {
        console.log('new', tab);
        onNewRequest(tab);
    });
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        console.log(tabId, changeInfo, tab);
        onNewRequest(tab);
    });
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        console.log('remove', tabId, removeInfo);
    });
})();