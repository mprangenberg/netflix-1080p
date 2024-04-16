const use6ChannelsCheckbox = document.getElementById("use-51");
const setMaxBitrateCheckbox = document.getElementById("set-max-bitrate");
const disableVP9Checkbox = document.getElementById("disable-vp9");
const disableAVChighCheckbox = document.getElementById("disable-avchigh");
const showAllSubsCheckbox = document.getElementById("show-all-subs");

const optionsSavedLabel = document.getElementById("options-saved");

function saveOptions() {
    const use6Channels = use6ChannelsCheckbox.checked;
    const setMaxBitrate = setMaxBitrateCheckbox.checked;
    const disableVP9 = disableVP9Checkbox.checked;
    const disableAVChigh = disableAVChighCheckbox.checked;
    const showAllSubs = showAllSubsCheckbox.checked;

    chrome.storage.sync.set({
        use6Channels,
        setMaxBitrate,
        disableVP9,
        disableAVChigh,
        showAllSubs,
    }, function() {
        optionsSavedLabel.style.display = "inline-block";
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        use6Channels: true,
        setMaxBitrate: true,
        disableVP9: false,
        disableAVChigh: false,
        showAllSubs: false,
    }, function(items) {
        use6ChannelsCheckbox.checked = items.use6Channels;
        setMaxBitrateCheckbox.checked = items.setMaxBitrate;
        disableVP9Checkbox.checked = items.disableVP9;
        disableAVChighCheckbox.checked = items.disableAVChigh;
        showAllSubsCheckbox.checked = items.showAllSubs;
    });
}

document.getElementById("save").addEventListener("click", saveOptions);
use6ChannelsCheckbox.addEventListener("change", () => optionsSavedLabel.style.display = "none");
setMaxBitrateCheckbox.addEventListener("change", () => optionsSavedLabel.style.display = "none");
disableVP9Checkbox.addEventListener("change", () => optionsSavedLabel.style.display = "none");
disableAVChighCheckbox.addEventListener("change", () => optionsSavedLabel.style.display = "none");
showAllSubsCheckbox.addEventListener("change", () => optionsSavedLabel.style.display = "none");

restoreOptions();