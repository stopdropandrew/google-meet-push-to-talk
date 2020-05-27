import Hotkey from "./js/hotkey";
import { getSavedValues, addChangeListener } from "./js/storage";
import { elementReady } from "./js/element-ready";

const MIC_OFF = "Turn off microphone",
  MIC_ON = "Turn on microphone";

let currentHotkey, keydownToggle, keyupToggle;

const micButtonSelector = (tip) => `[data-tooltip*='${tip}']`;

const toggle = (hotkey, tip) => {
  // actual event listener
  return (event) => {
    if (event.target && ["input", "textarea"].includes(event.target.type)) {
      return;
    }

    const tooltip = event.target?.dataset?.tooltip;
    if (tooltip?.includes("microphone") || tooltip?.includes("camera")) {
      event.stopPropagation();
    }

    if (event.type === "keydown" && !hotkey.matchKeydown(event)) {
      return;
    }

    if (event.type === "keyup" && !hotkey.matchKeyup(event)) {
      return;
    }

    event.preventDefault();
    document.querySelector(micButtonSelector(tip))?.click();
  };
};

const hookUpListeners = (hotkey) => {
  if (currentHotkey) {
    document.body.removeEventListener("keydown", keydownToggle);
    document.body.removeEventListener("keyup", keyupToggle);
  }
  currentHotkey = hotkey;
  keydownToggle = toggle(hotkey, MIC_ON);
  keyupToggle = toggle(hotkey, MIC_OFF);

  document.body.addEventListener("keydown", keydownToggle);
  document.body.addEventListener("keyup", keyupToggle);
};

getSavedValues(({ hotkey, muteOnJoin }) => {
  hookUpListeners(hotkey);

  if (muteOnJoin) {
    elementReady(micButtonSelector(MIC_OFF)).then((button) => {
      button.click();
    });
  }
});

addChangeListener(({ hotkey }) => {
  hookUpListeners(hotkey);
});

var port = chrome.runtime.connect({ name: "meet" });
port.onMessage.addListener(function (msg) {
  if (msg?.toggle === "mute") {
    const offButton = document.querySelector(micButtonSelector(MIC_OFF));
    const onButton = document.querySelector(micButtonSelector(MIC_ON));
    (offButton || onButton)?.click();
  }
});
