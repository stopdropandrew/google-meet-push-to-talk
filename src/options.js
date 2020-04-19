import "./css/options.css";
import hotkeys from "hotkeys-js";
import keycode from "keycode";

const modifierMap = {
  16: "shiftKey",
  18: "altKey",
  17: "ctrlKey",
  91: "metaKey",
};

const editButton = document.getElementById("hotkey_edit"),
  saveButton = document.getElementById("hotkey_save"),
  hotkey = document.getElementById("hotkey"),
  hotkeyLabel = document.querySelector('label[for="hotkey"]');

editButton.addEventListener("click", () => {
  hotkeyLabel.classList.add("unlocked");

  hotkeys("*", (event) => {
    event.preventDefault();
    hotkey.innerHTML = "";

    const codes = hotkeys.getPressedKeyCodes();
    hotkey.innerHTML = codes
      .map((code) => {
        const keyname = code === 91 ? "command" : keycode(code);
        return `<kbd>${keyname}</kbd>`;
      })
      .join(" + ");
  });
});

saveButton.addEventListener("click", () => {
  hotkeyLabel.classList.remove("unlocked");

  hotkeys.unbind("*");
});
