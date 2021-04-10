// Development version of fetch-config
export default async () => {
  return {
    launchRollout: 0.15,
    launchRolloutCohorts: [0.05, 0.1, 0.15, 0.16],
    launchUrl: "https://bashvideo.github.io/google-meet-push-to-talk/",
    ignoreAlreadyOpened: true,
    overrideRolloutValue: 0.151,
  };
};
