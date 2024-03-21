function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function maxbitrate_set() {
    window.dispatchEvent(new KeyboardEvent('keydown', {
        keyCode: 66, // B
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
    }));

    const VIDEO_SELECT = getElementByXPath("//div[text()='Video Bitrate / VMAF']");
    const AUDIO_SELECT = getElementByXPath("//div[text()='Audio Bitrate']");
    const BUTTON = getElementByXPath("//button[text()='Override']");

    if (!(VIDEO_SELECT && AUDIO_SELECT && BUTTON)){
        return false;
    }

    let was_set = 0;

    [VIDEO_SELECT, AUDIO_SELECT].forEach(el => {
        let parent = el.parentElement;

        let options = parent.querySelectorAll('select > option');

        for (let i = 0; i < options.length - 1; i++) {
            options[i].removeAttribute('selected');
        }

        if (options.length > 0) {
            options[options.length - 1].setAttribute('selected', 'selected');
            was_set += 1;
        }
    });

    if (was_set != 2) return false;

    // attempt to click the button immediately
    BUTTON.click();
    maxbitrate_finish();

    return true;
}

function maxbitrate_hide(attempts) {
    // console.log("hide");
    const overrideButton = getElementByXPath("//button[text()='Override']");

    if (overrideButton) {
        overrideButton.click();
        maxbitrate_finish();
    } else if (attempts > 0) {
        setTimeout(() => maxbitrate_hide(attempts - 1), 200);
    }
}

function maxbitrate_run() {
    // console.log("run");
    if (!maxbitrate_set()) {
        setTimeout(maxbitrate_run, 100);
    } else {
        maxbitrate_hide(10);
    }
}

function maxbitrate_start() {
    // hide the bitrate selection menu while we try to simulate the interaction so that it doesn't rapidly appear and disappear.
    const styleNode = document.createElement("style");
    styleNode.textContent = `
        .player-streams {
            display: none;
        }
    `;
    styleNode.id = "maxbitrate-hide-menu-style";

    document.head.appendChild(styleNode);

    maxbitrate_run();
}

function maxbitrate_finish() {
    // remove the global style node again so that the menu becomes visible on normal user input again
    const styleNode = document.querySelector("#maxbitrate-hide-menu-style");
    styleNode.parentNode.removeChild(styleNode);
}

const WATCH_REGEXP = /netflix.com\/watch\/.*/;

let oldLocation;

if (window.globalOptions === undefined) {
    try {
        window.globalOptions = JSON.parse(document.getElementById("netflix-1080p-settings").innerText);
    } catch(e) {
        console.error("Could not load settings:", e);
    }
}

if (window.globalOptions.setMaxBitrate) {
    console.log("netflix_max_bitrate.js enabled");
    setInterval(function () {
        let newLocation = window.location.toString();

        if (newLocation !== oldLocation) {
            // console.log("detected navigation");

            oldLocation = newLocation;
            if (WATCH_REGEXP.test(newLocation)) {
                maxbitrate_start();
            }
        }
    }, 500);
}
