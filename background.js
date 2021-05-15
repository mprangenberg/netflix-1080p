chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {
            redirectUrl: chrome.extension.getURL("cadmium-playercore-6.0030.399.911-patched.js")
        };
    }, {
        urls: [
            "*://assets.nflxext.com/*/ffe/player/html/*",
            "*://www.assets.nflxext.com/*/ffe/player/html/*",
            "*://occ-weba-h2.a.nflxso.net/sec/*/ffe/player/html/*",
        ]
    }, ["blocking"]
);
