import Hotkey from "./js/hotkey";
import { getSavedValues, addChangeListener } from "./js/storage";
import { elementReady } from "./js/element-ready";

const MIC_OFF = {
  de: "Mikrofon deaktivieren",
  en: "Turn off microphone",
  ja: "マイクをオフにする",
};

const MIC_ON = {
  de: "Mikrofon aktivieren",
  en: "Turn on microphone",
  ja: "マイクをオンにする",
};

let currentHotkey, keydownToggle, keyupToggle;

const currentLanguage = () => document.documentElement.lang;
const micButtonSelector = (tip) => `[data-tooltip*='${tip}']`;

const offButtonSelector = () =>
  [
    "[data-is-muted=false][data-tooltip*='+ d']",
    micButtonSelector(MIC_OFF[currentLanguage()]),
  ].join(",");
const offButton = () => document.querySelector(offButtonSelector());

const onButtonSelector = () =>
  [
    "[data-is-muted=true][data-tooltip*='+ d']",
    micButtonSelector(MIC_ON[currentLanguage()]),
  ].join(",");
const onButton = () => document.querySelector(onButtonSelector());

const toggle = (hotkey, isMuted) => {
  // actual event listener
  return (event) => {
    if (event.target && ["input", "textarea"].includes(event.target.type)) {
      return;
    }

    if (event.type === "keydown" && !hotkey.matchKeydown(event)) {
      return;
    }

    if (event.type === "keyup" && !hotkey.matchKeyup(event)) {
      return;
    }

    const tooltip = event.target?.dataset?.tooltip;
    if (
      tooltip?.includes("+ d") ||
      tooltip?.includes("+ e") ||
      tooltip?.includes("microphone") ||
      tooltip?.includes("camera")
    ) {
      event.stopPropagation();
    }

    event.preventDefault();

    const micButton = isMuted ? onButton() : offButton();
    micButton?.click();
  };
};

const hookUpListeners = (hotkey) => {
  if (currentHotkey) {
    document.body.removeEventListener("keydown", keydownToggle);
    document.body.removeEventListener("keyup", keyupToggle);
  }
  currentHotkey = hotkey;
  keydownToggle = toggle(hotkey, true);
  keyupToggle = toggle(hotkey, false);

  document.body.addEventListener("keydown", keydownToggle);
  document.body.addEventListener("keyup", keyupToggle);
};

getSavedValues(({ hotkey, muteOnJoin }) => {
  hookUpListeners(hotkey);

  if (muteOnJoin) {
    elementReady(offButtonSelector()).then((button) => {
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
    (offButton() || onButton())?.click();
  }
});
