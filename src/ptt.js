import hotkeys from "hotkeys-js";

let currentHotkey;

const toggle = (tip) => {
  document
    .querySelectorAll("[data-tooltip]")
    .forEach((el) => el.dataset.tooltip.includes(tip) && el.click());
};

const hookUpListeners = (hotkey) => {
  if (currentHotkey) {
    hotkeys.unbind(currentHotkey.join("+"));
  }
  currentHotkey = hotkey;

  hotkeys(hotkey.join("+"), { keyup: true }, (event) => {
    if (event.target?.dataset?.tooltip?.includes("microphone")) {
      event.stopPropagation();
    }

    if (event.type === "keydown") toggle("Turn on microphone");
    if (event.type === "keyup") toggle("Turn off microphone");
  });
};

chrome.storage.sync.get("hotkey", ({ hotkey }) => {
  hookUpListeners(hotkey);
});

chrome.storage.onChanged.addListener(({ hotkey }) => {
  hookUpListeners(hotkey.newValue);
});
