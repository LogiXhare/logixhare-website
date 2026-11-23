---
layout: ../../../layouts/DocsLayout.astro
title: Known limitations
description: What the current release of Tidegard does not do, or does only in part, so you can plan around it.
---

We would rather you read this here than find it in production. None of
these is a known critical or high security issue.

## By design in the current release

- **IPFIX only.** The collector decodes IPFIX (NetFlow v10). NetFlow v5 and
  v9 and sFlow are not supported yet. Most current carrier and enterprise
  routers can export IPFIX.
- **One node.** Every service runs on one host, against one PostgreSQL and
  one ClickHouse. There is no clustering or automatic failover between
  hosts; a lost host is rebuilt from backups. Two mitigators can run as
  active and standby.
- **Thresholds, not learned baselines.** Detection compares traffic with the
  thresholds you set. It does not learn each host's normal traffic by
  itself.
- **No queue in front of the collector.** Flows that arrive while it is
  stopped, or faster than it can read them, are dropped by the host's
  network stack. Size the host with headroom; see
  [Requirements and sizing](../requirements/).
- **BGP mitigation is not inside the Docker Compose stack.** It runs from the
  systemd packages, beside GoBGP on loopback.
- **FlowSpec redirect** (to a VRF or a scrubbing next hop) is not offered;
  discard and rate limit are.
- **One sampling rate for routers that do not report theirs.** A router that
  sends its rate in IPFIX options is corrected automatically; for the rest,
  one global rate applies.

## Multi-tenancy

- **Tenant isolation is enforced by the application**, not yet also by the
  database's row-level security.
- **The kill switch and the BGP session list are deployment-wide.** In a
  shared deployment, any tenant's NOC lead can engage the kill switch.
- **Assignment does not check a user directory.** Assigning an incident to a
  name grants that person nothing.

## Smaller gaps

| Gap | Effect |
|---|---|
| An incident's title and description cannot be edited | They stay as detection set them |
| Acknowledging takes no note | Add a note separately |
| A detection counts the routers that reported it but does not name them | Tracing forged flows needs the collector's log |
| Every incident uses one staleness timeout | Not tunable per policy |
| The CLI trusts only an explicit CA bundle | Set `TIDEGARD_API_CA_FILE` |
| Kernel UDP receive drops are not a Tidegard metric | Read them with `netstat -su` or `nstat` |

If one of these matters to your deployment, [talk to us](../../../contact/):
several are on the roadmap, and the order is driven by what customers need.
