import "./css/options.css";
import Hotkey from "./js/hotkey";
import { getSavedValues, saveHotkey, saveMuteOnJoin } from "./js/storage";

const editButton = document.getElementById("hotkey_edit"),
  saveButton = document.getElementById("hotkey_save"),
  cancelButton = document.getElementById("hotkey_cancel"),
  hotkeyDisplay = document.getElementById("hotkey"),
  hotkeyLabel = document.querySelector('label[for="hotkey"]'),
  muteOnJoinCheckbox = document.getElementById("mute_on_join");

let storedHotkey, currentHotkey;

getSavedValues(({ hotkey, muteOnJoin }) => {
  storedHotkey = hotkey;
  hotkeyDisplay.innerHTML = storedHotkey.display();
  muteOnJoinCheckbox.checked = muteOnJoin;
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

  saveHotkey(currentHotkey);
});

cancelButton.addEventListener("click", () => {
  hotkeyLabel.classList.remove("unlocked");
  document.body.removeEventListener("keydown", keyCapture);

  hotkeyDisplay.innerHTML = storedHotkey.display();
});

muteOnJoinCheckbox.addEventListener("click", () => {
  saveMuteOnJoin(muteOnJoinCheckbox.checked);
});
