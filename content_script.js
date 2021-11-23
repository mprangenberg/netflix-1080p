// From EME Logger extension

const EXTERNAL_SCRIPTS = [
    // 'https://cdn.rawgit.com/ricmoo/aes-js/master/index.js',
    // 'https://cdn.rawgit.com/Caligatio/jsSHA/master/dist/sha.js'
];

const INTERNAL_SCRIPTS = [
    'netflix_max_bitrate.js'
];

// promisify chrome storage API for easier chaining
function chromeStorageGet(opts) {
    return new Promise(resolve => {
        chrome.storage.sync.get(opts, resolve);
    });
} 

function attachScript(resp) {
    const xhr = resp.target;
    const mainScript = document.createElement('script');
    mainScript.type = 'application/javascript';
    if (xhr.status == 200) {
        mainScript.text = xhr.responseText;
        document.documentElement.appendChild(mainScript);
    }
}

chromeStorageGet({
    use6Channels: true,
    setMaxBitrate: true,
    disableVP9: false,
    disableAVChigh: false,
}).then(items => {
    // very messy workaround for accessing chrome storage outside of background / content scripts
    const mainScript = document.createElement('script');
    mainScript.type = 'application/javascript';
    mainScript.text = `var globalOptions = JSON.parse('${JSON.stringify(items)}');`; 
    document.documentElement.appendChild(mainScript);
}).then(() => {
    // attach and include additional scripts after we have loaded the main configuration
    for (let i = 0; i < EXTERNAL_SCRIPTS.length; i++) {
        const script = document.createElement('script');
        script.src = EXTERNAL_SCRIPTS[i];
        document.documentElement.appendChild(script);
    }
    
    for (let i = 0; i < INTERNAL_SCRIPTS.length; i++) {
        const mainScriptUrl = chrome.extension.getURL(INTERNAL_SCRIPTS[i]);
    
        const xhr = new XMLHttpRequest();
        xhr.open('GET', mainScriptUrl, true);
        xhr.onload = attachScript;
    
        xhr.send();
    }
});