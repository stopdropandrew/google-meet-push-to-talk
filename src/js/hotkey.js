import codeToString from "keycode";

const ShiftKey = 16;
const CtrlKey = 17;
const AltKey = 18;
const MetaKey = 91;

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
	  return this.matchKeyup(event);
  }

  matchKeyup(event) {
	  let keyCode = null;
	  if (this.keys.keyCode !== undefined) {
		  keyCode = this.keys.keyCode;
	  } else if (this.keys.ctrlKey) {
		  keyCode = CtrlKey;
	  } else if (this.keys.altKey) {
		  keyCode = AltKey;
	  } else if (this.keys.shiftKey) {
		  keyCode = ShiftKey;
	  } else if (this.keys.metaKey) {
		  keyCode = MetaKey;
	  }
	  return keyCode === event.keyCode;
  }
}

export {ShiftKey, CtrlKey, AltKey, MetaKey, Hotkey};
