---
layout: ../../../layouts/DocsLayout.astro
title: Tidegard documentation
description: Install Tidegard, point your routers at it, write detection policies, and handle DDoS attacks from detection to BGP mitigation.
---

Tidegard is a DDoS detection and network traffic monitoring platform for
ISPs, hosting providers, data centres and enterprise networks. It reads
IPFIX or sFlow from your routers and switches, works out how much traffic every host
and network on your side is sending and receiving, and opens an incident
when a threshold you set is crossed. From there your NOC acknowledges it,
gets the alert on Telegram, Slack, Teams, email or a webhook, and, if it
comes to that, requests a BGP blackhole or FlowSpec rule that a NOC lead
approves.

## Where to start

- **New to Tidegard?** Read [How Tidegard works](how-it-works/) for the
  pieces and how a flow becomes an incident.
- **Installing it?** Check [Requirements and sizing](requirements/), then
  follow [Installation](installation/) and the [Quick start](quick-start/).
- **Connecting routers?** [Router setup](router-setup/) has IPFIX examples
  for MikroTik RouterOS, Cisco IOS XR, Cisco IOS XE and Juniper.
- **Tuning detection?** [Detection policies](detection-policies/) explains
  thresholds, windows and how a policy is chosen for a host.
- **Planning mitigation?** Start with the
  [Mitigation overview](mitigation/), then [RTBH](rtbh/) and
  [FlowSpec](flowspec/).

## What Tidegard does

| Area | What you get |
|---|---|
| Flow collection | IPFIX (NetFlow v10) and sFlow version 5 over UDP, IPv4 and IPv6, with sampling correction and an allowlist of exporters |
| Traffic analytics | Totals per host, network, hostgroup, ASN, exporter and interface, kept in ClickHouse |
| Detection | Threshold policies in bits, packets and flows per second, per host, network, /24 or hostgroup, each way |
| Attack samples | The first seconds of each attack: protocol mix, top sources and their ASNs, top ports, sample flow records |
| Incidents | A seven-state lifecycle with notes, assignment, suppression, a timeline and a full audit trail |
| Notifications | Telegram, Slack, Microsoft Teams, email and signed webhooks, routed by tenant, event and severity |
| Mitigation | RTBH, parent-prefix blackhole and FlowSpec discard or rate limit, through GoBGP, always with approval |
| Visibility | A NOC web UI, Grafana dashboards, a REST API and the `tidegardctl` command line |

## Conventions in these docs

- Addresses in examples come from the documentation ranges
  (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24` and `2001:db8::/32`)
  and AS numbers from the private range. Replace them with your own.
- Settings are environment variables named `TIDEGARD_…`. The service that
  reads each one is named next to it.
- Commands that start with `docker compose` assume the Docker Compose
  deployment. With the systemd packages, the same binaries are on the path.

Something missing or unclear? [Tell us](../../contact/), and we will add it.
