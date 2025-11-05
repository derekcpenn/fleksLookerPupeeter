# Looker Studio PDF Export

Automated Looker Studio report exporter using Puppeteer. Exports reports to PDF on a scheduled basis.

## Features

- High-resolution PDF export with Retina quality
- Removes headers and navigation for clean reports
- Configurable export schedule
- Automated logging

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file with:
   ```
   REPORT_URL=https://lookerstudio.google.com/reporting/your-report-id
   OUT_DIR=./reports
   TIMEOUT_MS=90000
   ```

3. **Test the export:**
   ```bash
   npm start
   ```

## Automated Schedule

To run the export every 15 minutes:

1. **Run the installer:**
   ```bash
   ./install-cron.sh
   ```

2. **View logs:**
   ```bash
   tail -f export.log
   ```

3. **Manage cron jobs:**
   ```bash
   # List all cron jobs
   crontab -l

   # Edit cron jobs
   crontab -e

   # Remove all cron jobs
   crontab -r
   ```

## Output

PDFs are saved to `./reports/` with timestamped filenames:
```
looker-studio-2025-11-05T00-44-15-595Z.pdf
```

## Troubleshooting

### Permission Issues
Make sure the script is executable:
```bash
chmod +x run-export.sh install-cron.sh
```

### Environment Variable Conflicts
If you see permission errors for `/var/reports/`, unset the `OUT_DIR` environment variable:
```bash
unset OUT_DIR
```

### Cron Not Running
On macOS, you may need to grant Terminal/cron Full Disk Access:
1. System Preferences → Security & Privacy → Privacy → Full Disk Access
2. Add Terminal or cron

## Configuration

Adjust settings in [export-report.js](export-report.js):
- `deviceScaleFactor`: Change resolution (1 = normal, 2 = Retina)
- `scale`: Zoom level (0.8 = 80%, 1.0 = 100%)
- `width`/`height`: PDF dimensions
- Page format: Change from A3 landscape to other sizes
