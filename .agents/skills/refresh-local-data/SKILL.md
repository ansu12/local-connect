---
name: refresh-local-data
description: Automated background job to sync local services data and index them on Google.
---

# Refresh Local Data Skill

This skill automates the data synchronization and indexing pipeline for the LocalConnect programmatic directory.

## Execution Sequence

When triggered, you must perform the following actions sequentially:

1. **Create Log Directory**: Ensure the `logs` directory exists in the workspace root.
2. **Sync Data**: Execute `npx tsx scripts/sync-data.ts >> logs/sync.log 2>&1`. This fetches new listings, calculates their verdict scores, and upserts them into the SQLite database.
3. **Index URLs**: Execute `npx tsx scripts/index-urls.ts >> logs/sync.log 2>&1`. This submits any newly updated pages to the Google Indexing API.
4. **Report**: Read the last few lines of `logs/sync.log` to verify success and report the status.

## Automation & Scheduling

If the user asks you to "schedule this skill" or run it automatically, use your `schedule` tool with a CronExpression of `0 0 * * *` (every 24 hours at midnight). Ensure `IsDaemon=true` since this is a standing maintenance job.
