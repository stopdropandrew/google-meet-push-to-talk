import {AltKey, Hotkey, MetaKey} from "./hotkey.js"

test("dummy key press events", () => {
  let key = new Hotkey({altKey: true});

  // These are to assert that a KeyboardEvent.altKey value does not determine
  // the result of Hotkey.matchKey* functions.
  expect(key.matchKeydown({altKey: true, keyCode: AltKey})).toBeTruthy();
  expect(key.matchKeydown({altKey: false, keyCode: AltKey})).toBeTruthy();
  expect(key.matchKeyup({altKey: true, keyCode: AltKey})).toBeTruthy();
  expect(key.matchKeyup({altKey: false, keyCode: AltKey})).toBeTruthy();

  // These are to assert that any incorrect keyCode will result in no matches
  expect(key.matchKeydown({altKey: true, keyCode: MetaKey})).toBeFalsy();
  expect(key.matchKeydown({altKey: false, keyCode: MetaKey})).toBeFalsy();
  expect(key.matchKeyup({altKey: true, keyCode: MetaKey})).toBeFalsy();
  expect(key.matchKeyup({altKey: false, keyCode: MetaKey})).toBeFalsy();
});
