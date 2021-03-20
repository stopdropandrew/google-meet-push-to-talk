chrome.runtime.onInstalled.addListener(function () {
  if (!chrome.declarativeContent) {
    return;
  }

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "https://meet.google.com" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

// keep a list of connected content scripts so that we can tell them to toggle mute
const ports = new Set();
// listen to global keyboard handler events
chrome.commands.onCommand.addListener(function (command) {
  if (command !== "toggle-meeting-mute" || ports.size === 0) { return; }

  for (const port of ports) {
    port.postMessage({ toggle: "mute" });
  }
});

// add a handler for when a Google Meet content script loads
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "meet", `Unexpected content script connection from port named "%s"`, port.name);
  ports.add(port);
  port.onDisconnect.addListener((port) => ports.delete(port));
});
