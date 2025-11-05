#!/bin/bash
# Script to run Looker Studio report export
# This ensures the environment is set up correctly for cron

cd "$(dirname "$0")"

# Unset OUT_DIR if it exists in the environment (to use .env value)
unset OUT_DIR

# Add node to PATH if needed
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# Log output with timestamp
echo "[$(date)] Starting Looker Studio export..."
node export-report.js 2>&1 | while read line; do echo "[$(date)] $line"; done
echo "[$(date)] Export completed"
