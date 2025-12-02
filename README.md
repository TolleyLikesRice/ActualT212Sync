# ActualT212Sync

## What?

An script to sync the total balance of a Trading 212 account with ActualBudget. By far not my finest work, but it's good enough for me.

## Usage

There is an included Dockerfile, which is published to Docker Hub, or you can build locally if you prefer.

This docker compose should be all that you need to run & configure ActualT212Sync:

```yaml
services:
  actual-t212:
    image: ghcr.io/tolleylikesrice/actualt212sync:main
    container_name: ActualT212Sync
    restart: unless-stopped
    environment:
      - ACTUAL_URL=https://xxx.uk
      - ACTUAL_PASSWORD=XXX
      - ACTUAL_SYNC_ID=XXX
      - ACTUAL_ACCOUNT_NAME=XXX
      - T212_API_KEY=XXX
      - T212_API_SECRET=XXX
      - CRON_SCHEDULE=0 23 * * *
      - TZ=UTC
```

You can create an API key from your Trading 212 account settings page, the only permission needed is "Account data".
