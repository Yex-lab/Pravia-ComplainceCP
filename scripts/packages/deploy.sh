#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/deploy-config.env"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Configuration file not found: $CONFIG_FILE"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: $0 <package-name>"
  echo ""
  echo "Available packages:"
  grep -v '^#' "$CONFIG_FILE" | grep '=' | cut -d'=' -f1
  exit 1
fi

PACKAGE_PATH="$1"
GIT_REPO=$(grep "^${PACKAGE_PATH}=" "$CONFIG_FILE" | cut -d'=' -f2)

if [ -z "$GIT_REPO" ]; then
  echo "Error: No deployment target found for $PACKAGE_PATH"
  echo "Add it to $CONFIG_FILE"
  exit 1
fi

"$SCRIPT_DIR/deploy-to-git.sh" "$PACKAGE_PATH" "$GIT_REPO"
