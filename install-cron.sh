#!/bin/bash
# Script to install cron job for Looker Studio export

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOG_FILE="$SCRIPT_DIR/export.log"

echo "Installing cron job to run every 15 minutes..."
echo ""
echo "The cron entry will be:"
echo "*/15 * * * * cd $SCRIPT_DIR && ./run-export.sh >> $LOG_FILE 2>&1"
echo ""
echo "This will:"
echo "  - Run every 15 minutes"
echo "  - Save logs to $LOG_FILE"
echo "  - Save PDFs to $SCRIPT_DIR/reports/"
echo ""
read -p "Do you want to install this cron job? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Add to crontab
    (crontab -l 2>/dev/null | grep -v "run-export.sh"; echo "*/15 * * * * cd $SCRIPT_DIR && ./run-export.sh >> $LOG_FILE 2>&1") | crontab -
    echo "✓ Cron job installed successfully!"
    echo ""
    echo "To view logs: tail -f $LOG_FILE"
    echo "To list cron jobs: crontab -l"
    echo "To remove this cron job: crontab -e (then delete the line)"
else
    echo "Installation cancelled."
fi
