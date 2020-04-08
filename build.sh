zip -r releases/`jq -r '.version' manifest.json`.zip * --exclude releases
