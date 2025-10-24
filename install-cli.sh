#!/usr/bin/env bash
set -e

# Get current directory where install-cli.sh and docker-run.sh are
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_RUN_PATH="$SCRIPT_DIR/docker-run.sh"

if [ ! -f "$DOCKER_RUN_PATH" ]; then
  echo "docker-run.sh not found in $SCRIPT_DIR"
  exit 1
fi

# Path to install the CLI
CLI_INSTALL_PATH="/usr/local/bin/seer"

# Create cli.sh with embedded path to docker-run.sh
sudo tee "$CLI_INSTALL_PATH" > /dev/null <<EOF
#!/usr/bin/env bash
set -e

CURRENT_DIR="\$(pwd)"
"$DOCKER_RUN_PATH" "\$CURRENT_DIR"
EOF

# Make it executable
sudo chmod +x "$CLI_INSTALL_PATH"

echo -e "\033[34m[SEER]\033[0m CLI installed! You can now run \033[32m'seer run'\033[0m from any directory."

