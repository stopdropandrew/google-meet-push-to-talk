import codeToString from "keycode";

let keydownState = false;

class Hotkey {
  constructor({
    keyCode,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    metaKey = false,
  }) {
    this.keys = { keyCode, ctrlKey, altKey, shiftKey, metaKey };
  }

  static default() {
    return new Hotkey({ keyCode: 32 });
  }

  static keysFromEvent({ keyCode, ctrlKey, altKey, shiftKey, metaKey }) {
    const keys = { ctrlKey, altKey, shiftKey, metaKey };
    if (![16, 17, 18, 91].includes(keyCode)) {
      keys.keyCode = keyCode;
    }
    return keys;
  }

  static fromEvent(event) {
    return new Hotkey(Hotkey.keysFromEvent(event));
  }

  keyStrings() {
    return [
      this.keys.ctrlKey && "Control",
      this.keys.altKey && "Alt",
      this.keys.shiftKey && "Shift",
      this.keys.metaKey && "Command",
      this.keys.keyCode && codeToString(this.keys.keyCode),
    ].filter((v) => v);
  }

  display() {
    return this.keyStrings()
      .map((key) => `<kbd>${key}</kbd>`)
      .join(" + ");
  }

  matchKeydown(event) {
    if (
      this.keys.ctrlKey == event.ctrlKey &&
      this.keys.altKey == event.altKey &&
      this.keys.shiftKey == event.shiftKey &&
      this.keys.metaKey == event.metaKey &&
      (this.keys.keyCode == event.keyCode ||
        ([16, 17, 18, 91].includes(event.keyCode) &&
          this.keys.keyCode === undefined))
    ) {
      keydownState = true;
      return true;
    }
    return false;
  }

  matchKeyup(event) {
    if (!keydownState) {
      return false;
    }

    if (this.keys.keyCode && this.keys.keyCode == event.keyCode) {
      keydownState = false;
      return true;
    }

    if (
      (this.keys.ctrlKey && !event.ctrlKey) ||
      (this.keys.altKey && !event.altKey) ||
      (this.keys.shiftKey && !event.shiftKey) ||
      (this.keys.metaKey && !event.metaKey)
    ) {
      keydownState = false;
      return true;
    }
    return false;
  }
}

export default Hotkey;
