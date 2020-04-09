zip --exclude ./releases/ --exclude ./releases/* -r releases/`jq -r '.version' manifest.json`.zip *
