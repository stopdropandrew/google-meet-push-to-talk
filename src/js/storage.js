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

export const getChromeStorage = async function (keys) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(keys, function (value) {
        resolve(value);
      });
    } catch (ex) {
      resolve({});
    }
  });
};

export const setChromeStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};
