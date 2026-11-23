---
layout: ../../../layouts/DocsLayout.astro
title: Backup, restore and upgrade
description: What to back up, how to restore it, and how to upgrade Tidegard and roll back, in the order that loses nothing.
---

## What to back up

| What | How | Holds |
|---|---|---|
| The incident database | `pg_dump --format=custom` | Every incident, timeline, audit trail, token, mitigation and the migration history |
| Database roles | `pg_dumpall --roles-only` | The roles the database grants to; needed to restore into a new server |
| ClickHouse tables | `BACKUP TABLE … TO …` | Traffic and detection history for the dashboards |
| Settings | Copy `/etc/tidegard/` or the Compose directory | Policies, the guard file, the notifier's routes, certificates |

Keep secrets and private keys out of any backup that leaves the host
unencrypted.

## Taking a backup

```bash
pg_dump --host=db.example.net --username=tidegard_backup \
  --format=custom --file=incidents-$(date +%F).dump incidents
pg_dumpall --host=db.example.net --username=postgres --roles-only \
  --file=roles-$(date +%F).sql
```

`pg_dump` reads from one snapshot, so the backup is consistent while
Tidegard keeps running. For ClickHouse, back up the traffic and detection
tables with its `BACKUP` statement to a disk or object store you configure.

## Restoring

1. Stop the Tidegard services.
2. Restore the roles into the new server, then the database with
   `pg_restore`.
3. Restore the ClickHouse tables with `RESTORE`.
4. Start the incident manager first, then the other services.

Open incidents carry on where they were; timers resume from the restored
times. The kill switch set in the guard file still applies after a
restore.

**Test a restore** before you need one: restore last night's backup into a
spare host and check the incident count. Backup, restore and a full
disaster-recovery rebuild are part of Tidegard's automated tests.

## Upgrading

1. **Stop the collector and let its queue empty.** Detections already
   collected are written to the incident database; wait until nothing is
   pending, so nothing is lost in the upgrade.
2. **Back up**, as above.
3. **Install the new release**: the new images, or the new package's
   `install.sh`, which replaces binaries, the web UI and units, and keeps
   every setting.
4. **Start the incident manager first.** It applies any new database
   migrations. Then start the API, the collector, the notifier and the
   mitigator.
5. **Check** that every service is ready, flows arrive, and the UI shows
   your incidents.

Upgrade the API and the mitigator together. Read the release notes for any
setting that changed.

## Rolling back

Migrations only move forward, so rolling back means restoring the backup
taken in step 2 and installing the previous release. Upgrade and
rollback from the previous release are part of Tidegard's automated tests.
