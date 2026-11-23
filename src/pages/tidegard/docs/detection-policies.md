---
layout: ../../../layouts/DocsLayout.astro
title: Detection policies
description: Write threshold policies for hosts, networks and hostgroups, choose a detection window, and check a policy file before it goes live.
---

Detection is driven by a **policy file**, a JSON document the collector
reads at start. With no file, the collector still collects and aggregates
traffic, but detects nothing.

| Setting (collector) | Default | Meaning |
|---|---|---|
| `TIDEGARD_COLLECTOR_DETECTION_POLICY_FILE` | unset | The policy file. Unset turns detection off |
| `TIDEGARD_COLLECTOR_DETECTION_WINDOW_SECS` | `5` | The detection window. **Every policy's `window` must equal it** |
| `TIDEGARD_COLLECTOR_DETECTION_MAX_SCOPES` | `100000` | Most hosts and networks tracked at once |
| `TIDEGARD_COLLECTOR_DETECTION_STALE_SECS` | `180` | Close a detection whose traffic stopped being reported |
| `TIDEGARD_COLLECTOR_ATTACK_SAMPLE_SECS` | `10` | How long to sample a new attack; `0` turns samples off |

## A first policy file

```json
{
  "schemaVersion": 1,
  "defaults": {
    "clearPercent": 80,
    "cooldown": "10m",
    "severity": "major",
    "executionMode": "alertOnly"
  },
  "tenants": [
    { "tenant": "acme", "prefixes": ["192.0.2.0/24", "198.51.100.0/24", "2001:db8::/32"] }
  ],
  "policies": [
    {
      "id": "acme-host-in",
      "name": "Host inbound flood",
      "description": "Any single address receiving more than 2 Gbit/s or 400k packets/s.",
      "tenant": "acme",
      "scopeType": "host",
      "direction": "incoming",
      "window": "40s",
      "thresholds": { "bps": "2G", "pps": "400k" },
      "triggerFor": "40s",
      "clearFor": "80s",
      "severity": "critical"
    }
  ]
}
```

With this file, `TIDEGARD_COLLECTOR_DETECTION_WINDOW_SECS` must be `40`.

### Units

- **Durations need a unit:** `"250ms"`, `"30s"`, `"5m"`, `"2h"`, `"1d"`. A
  bare number is refused, because `300` means five minutes to one person
  and 300 milliseconds to another.
- **Thresholds may carry a magnitude:** `"12G"` is twelve billion. These
  are decimal, as everywhere in networking: `k` is a thousand. `bps` is bits
  per second, `pps` packets per second, `fps` flows per second.
- **Every field is checked.** A misspelt field, such as `trigger_for` for
  `triggerFor`, is an error that names it, not a policy that silently never
  fires.

## Policy fields

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Unique; appears on every event |
| `name` | yes | Human-readable |
| `description` | no | Record **why** the threshold is what it is |
| `tenant` | yes | The owning tenant, or `"*"` for every tenant |
| `scopeType` | yes | `host`, `prefix`, `slash24` or `hostgroupTotal` |
| `selector` | no | Which hosts, network or hostgroup; every one by default |
| `addressFamily` | no | `ipv4` or `ipv6`; both by default |
| `direction` | yes | `incoming` or `outgoing` |
| `window` | yes | Must equal the collector's detection window |
| `thresholds` | yes | One or more of `bps`, `pps` and `fps`; any one crossed triggers |
| `triggerFor` | yes | How long traffic must stay over the threshold; at least one window |
| `clearFor` | yes | How long it must stay under the clear level to clear |
| `clearPercent` | no | The clear level, as a percentage of the threshold; `80` by default |
| `cooldown` | no | Quiet time after clearing before the same target can trigger again |
| `severity` | no | `info`, `minor`, `major` or `critical`; `major` by default |
| `executionMode` | no | `alertOnly` by default; see below |
| `priority` | no | Breaks a tie between equally specific policies; higher wins |
| `labels` | no | Up to 16 key/value pairs, carried onto every event |
| `version` | no | **Bump it whenever the policy's meaning changes** |

### Scope types

| Scope | Watches |
|---|---|
| `host` | Each single address |
| `prefix` | Each configured local prefix as a whole |
| `slash24` | Each /24, for attacks spread across a block |
| `hostgroupTotal` | The combined traffic of one hostgroup |

### Which policy applies to a host

For a host, the most specific policy wins:

1. a policy naming that host;
2. a policy naming a network that contains it, the longest first;
3. a policy with no selector.

This lets you give a CGNAT pool, where each address carries many
subscribers, a higher per-host limit than the rest of your space:

```json
{
  "id": "cgnat-host-in",
  "name": "CGNAT address inbound flood",
  "tenant": "acme",
  "scopeType": "host",
  "selector": { "kind": "network", "addr": "198.51.100.0", "prefixLen": 24 },
  "direction": "incoming",
  "window": "40s",
  "thresholds": { "bps": "5G", "pps": "800k" },
  "triggerFor": "40s",
  "clearFor": "80s"
}
```

### Execution modes

| Mode | Evaluated | Event raised |
|---|---|---|
| `disabled` | No | No |
| `observe` | Yes | No: state and metrics move, nobody is alerted |
| `alertOnly` | Yes | Yes |
| `dryRun` | Yes | Yes, marked as a dry run |

No mode affects traffic. Detection can never mitigate; that is a separate,
approved step.

## Choosing the window

Windows are back to back, and the rate is judged per window. A short window
reacts to every burst; a long one judges the average.

- With a 5-second window and a 15-second trigger, a flood that swings
  between half and twice the threshold never gets three windows in a row
  and is missed, while a short legitimate burst can be reported.
- In a pilot on a live ISP network, a week of traffic was replayed against
  the bans raised by the operator's existing DDoS product, with the same
  thresholds:

| Window and trigger | Attacks missed, of 24 | Extra detections |
|---|---:|---:|
| 5 s / 15 s | 2 | about 13 |
| 30 s / 30 s | 0 | 7 |
| **40 s / 40 s** | **0** | **4** |
| 60 s / 60 s | 2 | 1 |

A 40-second window, with a 40-second trigger and an 80-second clear, missed
nothing and raised the fewest extras, and detected within a minute of the
existing product, often earlier. When you replace a product that averages
over N seconds, start from a window just under N.

## Tuning on live traffic

1. Start each new policy in `observe` with a threshold you are sure is too
   high.
2. Watch `tidegard_detector_events_total{kind="started"}` and the traffic
   dashboards for your busiest hosts at their busiest hour.
3. Lower the threshold until it would fire on traffic you consider an
   attack, and not on your peak hour.
4. Switch to `alertOnly`, and bump `version`.

Set `cooldown` to several minutes so one attack cannot raise a stream of
events, and `clearFor` long enough that a brief dip in an ongoing attack
does not close the detection.

## Check a file before a restart

A file the collector cannot load turns detection off until the next
restart, so check every change first:

```bash
tidegard-collector --check-policy /etc/tidegard/detection-policy.json.new
```

With Docker Compose:

```bash
docker compose run --rm --no-deps -v "$PWD/new-policy.json:/check.json:ro" \
  collector --check-policy /check.json
```

It prints the number of policies and exits 0, or names the problem and
exits 1. It also catches a policy whose `window` differs from the
collector's, which would load but never be evaluated. Then move the file
into place and restart the collector.

## Limits

A policy file can hold up to 10,000 policies and 100,000 tenant prefixes,
in up to 4 MiB. The longest window is 300 seconds and the longest timer 7
days. Anything over a limit is refused with a message naming it.
