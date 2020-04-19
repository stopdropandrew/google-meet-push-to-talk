import Hotkey from "./js/hotkey";

let currentHotkey, keydownToggle, keyupToggle;

const toggle = (hotkey, tip) => {
  // actual event listener
  return (event) => {
    if (event.target && ["input", "textarea"].includes(event.target.type)) {
      return;
    }

    if (event.target?.dataset?.tooltip?.includes("microphone")) {
      event.stopPropagation();
    }

    if (event.type === "keydown" && !hotkey.matchKeydown(event)) {
      return;
    }

    if (event.type === "keyup" && !hotkey.matchKeyup(event)) {
      return;
    }

    event.preventDefault();
    document
      .querySelectorAll("[data-tooltip]")
      .forEach((el) => el.dataset.tooltip.includes(tip) && el.click());
  };
};

const hookUpListeners = (hotkey) => {
  if (currentHotkey) {
    document.removeEventListener("keydown", keydownToggle);
    document.removeEventListener("keyup", keyupToggle);
  }
  currentHotkey = hotkey;
  keydownToggle = toggle(hotkey, "Turn on microphone");
  keyupToggle = toggle(hotkey, "Turn off microphone");

  document.addEventListener("keydown", keydownToggle);
  document.addEventListener("keyup", keyupToggle);
};

chrome.storage.sync.get("hotkeyKeys", ({ hotkeyKeys }) => {
  hookUpListeners((hotkeyKeys && new Hotkey(hotkeyKeys)) || Hotkey.default());
});

chrome.storage.onChanged.addListener(({ hotkeyKeys }) => {
  hookUpListeners(new Hotkey(hotkeyKeys.newValue));
});
