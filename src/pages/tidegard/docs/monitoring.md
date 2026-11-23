---
layout: ../../../layouts/DocsLayout.astro
title: Monitoring Tidegard
description: The health checks and Prometheus metrics every Tidegard service exposes, and the alerts worth setting on them.
---

A DDoS detector that has quietly stopped is worse than none, because
everyone believes it is watching. Monitor Tidegard like any other critical
service.

## Health checks

Every service answers two endpoints:

- `/healthz`: the process is running.
- `/readyz`: it can do its job, for example reach its database. It answers
  `503` until it can.

The API answers them on its own HTTPS address; the other services on their
metrics address.

| Service | Metrics and health, by default |
|---|---|
| Collector | `127.0.0.1:9090` |
| Incident manager | `127.0.0.1:9091` |
| Notifier | `127.0.0.1:9093` |
| Mitigator | `127.0.0.1:9094` |

## Metrics

Each service exposes Prometheus metrics at `/metrics`, with label sets kept
small so they are cheap to store. The ones that matter most:

| Metric | Watch for |
|---|---|
| `tidegard_collector_active_exporters` | Fewer routers than you expect |
| `tidegard_collector_parsed_flow_records_total` | A rate that falls to zero |
| `tidegard_collector_datagrams_refused_total` | Any rise, by `reason` |
| `tidegard_detector_snapshots_ignored_total{reason="windowMismatch"}` | Anything above zero: a policy is never evaluated |
| `tidegard_detector_state_table_full_total` | Any rise: new targets cannot be tracked |
| `tidegard_detector_detections_stale_total` | A rise while traffic looks normal usually means an exporter stopped |
| `tidegard_notifier_notifications_total` | Deliveries that fail |
| `tidegard_mitigator_*` | Peers not established, and failed announcements |

The provided **Collector**, **Detection** and **Incident manager**
dashboards in Grafana chart all of these; see
[Grafana dashboards](../dashboards/).

## Alerts worth having

1. **No flows** for five minutes from any exporter you expect.
2. **A service not ready** for two minutes.
3. **A policy never evaluated**: the window-mismatch counter above zero.
4. **Notifications failing**: a failed or dead-lettered delivery.
5. **A BGP session down**, when mitigation is on; the notifier also sends
   `bgp.peer_down`.
6. **Disk** on the ClickHouse volume over 80%.

Route these to a different channel from DDoS alerts, so a broken detector
is noticed even while the NOC is busy with an attack.

## Logs

Services log structured lines to standard output, collected by journald or
Docker. They never log a database connection string, a password or a
token. Set `RUST_LOG=debug` on one service, briefly, to see more.
