const JSON_URL =
  "https://bashvideo.github.io/google-meet-push-to-talk/assets/gmptt.json";

export default async () => {
  const results = await fetch(JSON_URL);
  return await results.json();
};
