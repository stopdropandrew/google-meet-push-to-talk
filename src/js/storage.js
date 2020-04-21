import Hotkey from "./hotkey";

export function getSavedValues(fn) {
  chrome.storage.sync.get(
    ["hotkeyKeys", "muteOnJoin"],
    ({ hotkeyKeys, muteOnJoin = true }) => {
      const hotkey = (hotkeyKeys && new Hotkey(hotkeyKeys)) || Hotkey.default();

      fn({ hotkey, muteOnJoin });
    }
  );
}

export function addChangeListener(fn) {
  chrome.storage.onChanged.addListener(({ hotkeyKeys }) => {
    hotkeyKeys?.newValue && fn({ hotkey: new Hotkey(hotkeyKeys.newValue) });
  });
}

export function saveHotkey(hotkey) {
  chrome.storage.sync.set({ hotkeyKeys: hotkey.keys });
}

export function saveMuteOnJoin(muteOnJoin) {
  chrome.storage.sync.set({ muteOnJoin });
}
