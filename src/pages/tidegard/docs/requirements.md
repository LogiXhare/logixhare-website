---
layout: ../../../layouts/DocsLayout.astro
title: Requirements and sizing
description: The host, the software and the network access Tidegard needs, and how to size it from your flow rate and history.
---

## Host

| | Minimum to start | Notes |
|---|---|---|
| CPU | 4 cores, x86_64 or aarch64 | The collector used under half a core at 200,000 flow records a second in our load test |
| Memory | 8 GiB | ClickHouse benefits most from more; the collector's own memory is bounded by its settings |
| Disk | 50 GiB, SSD or NVMe | ClickHouse takes most of it. Size it from your history, below |
| Operating system | Linux | Docker Compose on any Linux, or the systemd packages on Ubuntu 22.04 or 24.04, or Debian 12 or 13 |

Tidegard runs on one host. Use a dedicated virtual machine or server for a
production deployment, not one shared with other workloads.

## Software

- **Docker deployment:** Docker Engine with the Compose plugin. PostgreSQL
  and ClickHouse come with the stack.
- **systemd deployment:** PostgreSQL 15, 16, 17 or 18 and ClickHouse, which
  you install and run. Every PostgreSQL version listed is tested on every
  change.
- **Dashboards:** Grafana 13, with the ClickHouse and Prometheus data
  sources. The dashboards are provided as files to load into it.
- **Mitigation, if you use it:** GoBGP's `gobgpd`, on the same host as the
  mitigator.

## Network access

| Port | Direction | For |
|---|---|---|
| UDP 2055 | From your routers to Tidegard | IPFIX. Allow only your exporters |
| TCP 8443 | From your NOC to Tidegard | The NOC web UI and the REST API, over HTTPS |
| TCP 3000 | From your NOC to Grafana | Dashboards, if Grafana runs on the same host |
| TCP 179 | Between `gobgpd` and your edge routers | iBGP, only when mitigation is turned on |
| TCP 9090 to 9094 | Local only | Each service's Prometheus metrics and health checks |

Keep the UI, the API and Grafana reachable only from your management
network. IPFIX is unauthenticated UDP, so firewall port 2055 to your
exporters' addresses as well as setting the allowlist in Tidegard.

## Sizing

Size from three numbers: your flow rate after sampling, the number of
active hosts and networks, and how long you keep history.

- **Collector:** budget one core per 200,000 flow records a second. Real
  exporters send fewer records per datagram than a load test, so leave
  headroom.
- **PostgreSQL:** small. It holds incidents, not flows.
- **ClickHouse:** most of the disk. By default, detailed traffic is kept
  for 30 days, hourly overviews for 180 days and detection events for a
  year; the traffic periods are settings. Disk grows with the number of
  active hosts and networks, not with the raw flow rate.

### Measured performance

On a 4-core cloud machine (AMD EPYC, 16 GiB), the full collector, with
decoding, classification, aggregation, detection and ClickHouse export:

| Flow records a second | Loss | Peak memory | CPU |
|---:|---:|---:|---:|
| 100,000 | 0% | 11 MiB | 0.24 cores |
| 200,000 | 0% | 13 MiB | 0.41 cores |

A five-hour soak at 50,000 records a second, almost 900 million records,
lost none and grew memory by 3.5%. These are measurements on one machine
with synthetic traffic, a floor rather than a promise for yours. Measure
your own traffic in a pilot before choosing a size.
