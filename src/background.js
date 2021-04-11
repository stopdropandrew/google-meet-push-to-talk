import { getChromeStorage, setChromeStorage } from "./js/storage";
import log from "./js/log";
import fetchConfig from "./js/fetch-config.js";

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

const findRolloutCohort = (cohorts, rolloutValue) =>
  cohorts.findIndex((value) => rolloutValue <= value);

const launchRolloutTabIfNeeded = async (reason) => {
  chrome.alarms.clearAll();

  try {
    const {
      launchRolloutCohorts,
      launchUrl,
      ignoreAlreadyOpened,
      overrideRolloutValue,
    } = await fetchConfig();

    const { hasOpenedRollout } = await getChromeStorage(["hasOpenedRollout"]);
    if (hasOpenedRollout && !ignoreAlreadyOpened) {
      log("Already opened rollout tab");
      return;
    }

    const rolloutValue = overrideRolloutValue || (await getOrSetRolloutValue());
    const cohort =
      reason === "install"
        ? 0.1
        : findRolloutCohort(launchRolloutCohorts, rolloutValue);
    log({ cohort, rolloutValue, launchUrl, launchRolloutCohorts });
    if (cohort >= 0) {
      await setChromeStorage({ hasOpenedRollout: true });
      chrome.tabs.create({
        url: `${launchUrl}?ro=${cohort}&v=${__VERSION__}&utm_medium=ext&utm_source=gmptt&utm_campaign=ro${cohort}`,
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
    launchRolloutTabIfNeeded("alarm");
  }
});

chrome.runtime.onInstalled.addListener(function (details) {
  hookUpPageMatcher();

  const reason = details.reason === "install" ? "install" : "update";
  log(`Updated - ${reason}`);
  launchRolloutTabIfNeeded(reason);
});

chrome.runtime.onStartup.addListener(() => {
  log("Startup");
  launchRolloutTabIfNeeded("startup");
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
