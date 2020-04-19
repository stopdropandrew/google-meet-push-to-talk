import "./css/options.css";
import hotkeys from "hotkeys-js";
import keycode from "keycode";
import { displayHotkey } from "./utils/keycode";

const modifierMap = {
  16: "shiftKey",
  18: "altKey",
  17: "ctrlKey",
  91: "metaKey",
};

const editButton = document.getElementById("hotkey_edit"),
  saveButton = document.getElementById("hotkey_save"),
  cancelButton = document.getElementById("hotkey_cancel"),
  hotkeyDisplay = document.getElementById("hotkey"),
  hotkeyLabel = document.querySelector('label[for="hotkey"]');

let storedHotkey, currentHotkey;

chrome.storage.sync.get("hotkey", ({ hotkey }) => {
  storedHotkey = hotkey || ["space"];
  hotkeyDisplay.innerHTML = displayHotkey(storedHotkey);
});

editButton.addEventListener("click", () => {
  hotkeyLabel.classList.add("unlocked");

  hotkeys("*", (event) => {
    event.preventDefault();
    hotkeyDisplay.innerHTML = "";

    currentHotkey = hotkeys
      .getPressedKeyCodes()
      .map((code) => (code === 91 ? "command" : keycode(code)));

    hotkeyDisplay.innerHTML = displayHotkey(currentHotkey);
  });
});

saveButton.addEventListener("click", () => {
  chrome.storage.sync.set({ hotkey: currentHotkey }, () => {
    hotkeyLabel.classList.remove("unlocked");
    hotkeys.unbind("*");
  });
});

cancelButton.addEventListener("click", () => {
  hotkeyLabel.classList.remove("unlocked");

  hotkeys.unbind("*");

  hotkeyDisplay.innerHTML = displayHotkey(storedHotkey);
});
