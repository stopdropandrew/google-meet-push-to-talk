import "./css/options.css";
import Hotkey from "./js/hotkey";

const editButton = document.getElementById("hotkey_edit"),
  saveButton = document.getElementById("hotkey_save"),
  cancelButton = document.getElementById("hotkey_cancel"),
  hotkeyDisplay = document.getElementById("hotkey"),
  hotkeyLabel = document.querySelector('label[for="hotkey"]');

let storedHotkey, currentHotkey;

chrome.storage.sync.get("hotkeyKeys", ({ hotkeyKeys }) => {
  storedHotkey = (hotkeyKeys && new Hotkey(hotkeyKeys)) || Hotkey.default();
  hotkeyDisplay.innerHTML = storedHotkey.display();
});

const keyCapture = (event) => {
  event.preventDefault();
  currentHotkey = Hotkey.fromEvent(event);
  hotkeyDisplay.innerHTML = currentHotkey.display();
};

editButton.addEventListener("click", () => {
  hotkeyLabel.classList.add("unlocked");
  document.body.addEventListener("keydown", keyCapture);
});

saveButton.addEventListener("click", () => {
  hotkeyLabel.classList.remove("unlocked");
  document.body.removeEventListener("keydown", keyCapture);

  chrome.storage.sync.set({ hotkeyKeys: currentHotkey.keys });
});

cancelButton.addEventListener("click", () => {
  hotkeyLabel.classList.remove("unlocked");
  document.body.removeEventListener("keydown", keyCapture);

  hotkeyDisplay.innerHTML = displayHotkey(storedHotkey);
});
