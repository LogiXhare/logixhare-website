---
layout: ../../../layouts/DocsLayout.astro
title: Command line (tidegardctl)
description: Work incidents and mitigations from a terminal with tidegardctl, and script them safely.
---

`tidegardctl` is a client for the [REST API](../api/) and nothing more. It
never touches the database, so authorisation and the audit trail apply to
it exactly as to the UI.

## Connecting

Credentials are never command-line flags, because flags end up in shell
history. Use the environment or a profile file.

| Setting | Environment | Profile field |
|---|---|---|
| API address | `TIDEGARD_API_URL` | `url` |
| Token | `TIDEGARD_API_TOKEN` | `token` |
| CA bundle (PEM) | `TIDEGARD_API_CA_FILE` | `ca_file` |

The profile file is JSON, at `~/.config/tidegard/cli.json`, or
`%APPDATA%\tidegard\cli.json` on Windows:

```json
{
  "default_profile": "noc",
  "profiles": {
    "noc": {
      "url": "https://noc.example.net:8443",
      "ca_file": "/etc/tidegard/ca.pem",
      "token": "wnm_..."
    }
  }
}
```

Keep the file readable only by you. `--profile NAME` picks another
profile. An `https://` address needs a CA bundle; plain `http://` is
accepted only for an API on the same host.

## Incidents

```text
tidegardctl incidents list [--state S] [--severity S] [--direction D] [--limit N]
tidegardctl incidents show WNM-2026-000123
tidegardctl incidents timeline WNM-2026-000123
tidegardctl incidents detections WNM-2026-000123

tidegardctl incidents claim WNM-2026-000123
tidegardctl incidents acknowledge WNM-2026-000123
tidegardctl incidents note add WNM-2026-000123 --message "Upstream informed"
tidegardctl incidents suppress WNM-2026-000123 --for 2h --reason "Planned load test"
tidegardctl incidents resolve WNM-2026-000123 --note "Attack stopped at 21:40"
tidegardctl incidents close WNM-2026-000123 --reason resolved
tidegardctl incidents export WNM-2026-000123 --file incident.json
```

An incident can be named by its id or by its number.

## Mitigations

```text
tidegardctl mitigations list --live
tidegardctl mitigations request --prefix 203.0.113.9/32 --action rtbh \
  --for 30m --incident WNM-2026-000123 --reason "UDP flood, 9 Gbit/s"
tidegardctl mitigations approve <mitigation-id>
tidegardctl mitigations withdraw <mitigation-id> --reason "Attack over"
tidegardctl kill-switch status
tidegardctl kill-switch engage --reason "Unexpected routes on the edge"
tidegardctl bgp routes
tidegardctl bgp peers
```

A request announces nothing until a NOC lead approves it. There is no flag
for a next hop or a community: route attributes belong to the deployment.
Releasing the kill switch is deliberately not a CLI command; it is done on
the API host with `tidegard-api kill-switch release`.

## Safe by default

- **A change sends the version it read.** If someone else changed the
  incident in between, the command stops with exit code `4` and shows the
  current state, so you decide again. It never retries a conflict.
- **Retries are replayed, not repeated.** One idempotency key per command
  is reused on every retry.
- **Risky commands ask first:** closing, reopening, suppressing, lowering
  severity, redacting a note, approving or withdrawing a mitigation, and
  engaging the kill switch. `--yes` answers in advance. Without a terminal
  and without `--yes`, the command sends nothing and exits `2`.

## Scripting

`--output json` prints the API's JSON for any read command, for use with
`jq` or your own tools. `--output wide` adds columns to the tables.
