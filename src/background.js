chrome.runtime.onInstalled.addListener(function () {
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

chrome.commands.onCommand.addListener(function (command) {
  if (command === "toggle-meeting-mute") {
    chrome.tabs.query({ url: "https://meet.google.com/*" }, function (tabs) {
      if (tabs?.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { toggle: "mute" });
      }
    });
  }
});
