import Hotkey from "./js/hotkey";
import { getSavedValues, addChangeListener } from "./js/storage";
import { elementReady } from "./js/element-ready";

const MIC_OFF = {
  en: "Turn off microphone",
  ja: "マイクをオフにする"
}

const MIC_ON = {
  en: "Turn on microphone",
  ja: "マイクをオンにする"
}

let currentHotkey, keydownToggle, keyupToggle;

const currentLanguage = () => window.navigator.language.split("-")[0];

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
  keydownToggle = toggle(hotkey, MIC_ON[currentLanguage()]);
  keyupToggle = toggle(hotkey, MIC_OFF[currentLanguage()]);

  document.body.addEventListener("keydown", keydownToggle);
  document.body.addEventListener("keyup", keyupToggle);
};

getSavedValues(({ hotkey, muteOnJoin }) => {
  hookUpListeners(hotkey);

  if (muteOnJoin) {
    elementReady(micButtonSelector(MIC_OFF[currentLanguage()])).then((button) => {
      button.click();
    });
  }
});

addChangeListener(({ hotkey }) => {
  hookUpListeners(hotkey);
});
