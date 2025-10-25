#!/usr/bin/env bash
set -e

# Check for argument
if [ -z "$1" ]; then
  echo "Usage: $0 <path_to_project>"
  exit 1
fi

PROJECT_PATH="$1"

# Optional: resolve absolute path
PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"

docker run \
  --rm \
  --name seer-ui \
  -p 3000:3000 \
  -v "$PROJECT_PATH":"$PROJECT_PATH" \
  -e PROJECT_ROOT="$PROJECT_PATH" \
  seer-ui
