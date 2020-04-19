export function displayHotkey(keys) {
  return keys.map((key) => `<kbd>${key}</kbd>`).join(" + ");
}
