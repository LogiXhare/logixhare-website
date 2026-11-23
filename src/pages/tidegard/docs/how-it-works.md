---
layout: ../../../layouts/DocsLayout.astro
title: How Tidegard works
description: The five services, the two databases, and the path a flow record takes from your router to an incident on the NOC's screen.
---

## The pieces

Tidegard is five small services and two databases, all on one host.

| Service | What it does |
|---|---|
| `tidegard-collector` | Receives IPFIX from your routers, decodes it, classifies each flow by direction, aggregates traffic and runs detection |
| `tidegard-incident-manager` | Turns detections into incidents, runs their timers, and applies retention |
| `tidegard-api` | The HTTPS REST API, and the server for the NOC web UI |
| `tidegard-notifier` | Sends alerts to Telegram, Slack, Teams, email and webhooks |
| `tidegard-mitigator` | The only component that talks to BGP: it announces and withdraws approved mitigations through GoBGP |

| Database | Holds |
|---|---|
| ClickHouse | Traffic history and detection events, for the dashboards and the NOC UI |
| PostgreSQL | Incidents, their timelines and audit trail, tokens, and mitigations |

Every connection between them uses TLS, and the services run as
unprivileged users.

## From a flow to an incident

1. **Your router exports IPFIX** to the collector on UDP port 2055. Flows
   from an address that is not on the exporter allowlist are refused and
   counted.
2. **The collector decodes and corrects for sampling.** It learns each
   exporter's templates and sampling rate, and multiplies sampled counters
   back up to real traffic.
3. **Each flow is classified by direction** against your
   [local prefixes](../prefixes-and-hostgroups/): incoming, outgoing,
   internal or other.
4. **Traffic is aggregated** per host, network, hostgroup, ASN, exporter
   and interface, and written to ClickHouse for the dashboards.
5. **Detection runs on every window.** Each host or network is checked
   against the most specific [policy](../detection-policies/) for it. When
   traffic stays over the threshold for the policy's trigger time, a
   detection starts.
6. **The incident manager opens an incident**, or attaches the detection to
   the one already open for that target. An attack sample of the first
   seconds follows it.
7. **The notifier alerts the people routed to it.** Every message says
   where the incident's mitigation stands.
8. **Your NOC works the incident** in the web UI or the CLI: acknowledge,
   investigate, note, assign, and, when it is needed, request a mitigation.
9. **A NOC lead approves the mitigation**, and the mitigator announces it
   to your edge routers through GoBGP. It is withdrawn when it expires, when
   someone withdraws it, or when the kill switch is engaged.

When the attack stops, the detection clears, the incident moves to
`Recovering` and then `Resolved`, and a person closes it when the NOC has
finished with it.

## Design principles

- **Nothing affects traffic on its own.** Detection can never mitigate.
  Every mitigation is requested by one person and approved by another,
  checked against an allowlist and hard prefix limits, and runs for a fixed
  time.
- **Mistakes are refused, not guessed at.** Unknown fields in a policy or
  an API request are errors that name the field. A duration without a unit
  is refused.
- **Every action is on the record.** Each change to an incident or a
  mitigation is in its timeline and audit trail, with who did it and why.
- **Bounded under attack.** Every table and queue the collector keeps has a
  limit, so a flood of new addresses cannot exhaust its memory.
