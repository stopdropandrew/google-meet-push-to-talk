import { getChromeStorage, setChromeStorage } from "./js/storage";
import log from "./js/log";

const JSON_URL =
  "https://bashvideo.github.io/google-meet-push-to-talk/assets/gmptt.json";

const ALARM = "Rollout";

const getOrSetRolloutValue = async () => {
  let { rolloutValue } = await getChromeStorage(["rolloutValue"]);

  if (rolloutValue === undefined) {
    const rolloutValue = Math.random();
    await setChromeStorage({ rolloutValue });
  }

  return rolloutValue;
};

const hookUpPageMatcher = () => {
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
};

const launchRolloutTabIfNeeded = async () => {
  chrome.alarms.clearAll();

  const { hasOpenedRollout } = await getChromeStorage(["hasOpenedRollout"]);
  if (hasOpenedRollout) {
    return;
  }
  try {
    const results = await fetch(JSON_URL);
    const { launchRollout, launchUrl } = await results.json();
    const rolloutValue = await getOrSetRolloutValue();
    log({ rolloutValue, launchRollout, launchUrl });
    if (rolloutValue <= launchRollout) {
      await setChromeStorage({ hasOpenedRollout: true });
      chrome.tabs.create({
        url: `${launchUrl}?ro=${Math.floor(rolloutValue * 20)}`,
      });
      return;
    }

    chrome.alarms.create(ALARM, { delayInMinutes: 30 });
  } catch (e) {
    log({ e });
  }
};

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM) {
    log("Rollout Alarm");
    launchRolloutTabIfNeeded();
  }
});

chrome.runtime.onInstalled.addListener(function () {
  log("Updated");
  hookUpPageMatcher();
  launchRolloutTabIfNeeded();
});

chrome.runtime.onStartup.addListener(() => {
  log("Startup");
  launchRolloutTabIfNeeded();
});

// keep a list of connected content scripts so that we can tell them to toggle mute
const ports = new Set();
// listen to global keyboard handler events
chrome.commands.onCommand.addListener(function (command) {
  if (command !== "toggle-meeting-mute" || ports.size === 0) {
    return;
  }

  for (const port of ports) {
    port.postMessage({ toggle: "mute" });
  }
});

// add a handler for when a Google Meet content script loads
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(
    port.name == "meet",
    `Unexpected content script connection from port named "%s"`,
    port.name
  );
  ports.add(port);
  port.onDisconnect.addListener((port) => ports.delete(port));
});
