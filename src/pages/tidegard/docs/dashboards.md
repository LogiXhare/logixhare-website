---
layout: ../../../layouts/DocsLayout.astro
title: Grafana dashboards
description: The nineteen Grafana dashboards that come with Tidegard, for traffic analysis, DDoS events and the health of Tidegard itself, and how to load them.
---

Tidegard comes with Grafana dashboards as files, for your Grafana 13.
They read traffic and detection history from ClickHouse, and Tidegard's own
health from Prometheus. Every panel of every dashboard is run against real
ClickHouse, Prometheus and Grafana on each change to Tidegard, so a
dashboard that ships has been seen to work.

## Traffic

| Dashboard | Shows |
|---|---|
| Traffic Overview | Inbound and outbound traffic at a glance: rates, and the top local networks by traffic and packets |
| Traffic by Type | Total traffic each way, broken down into TCP, UDP, ICMP, TCP SYN and fragments |
| Inbound Traffic | Inbound only: rates, the local networks receiving most, and their trend |
| Top Hosts | The busiest local hosts, inbound and outbound, by traffic and packets |
| Host Detail | One local host: traffic, packets and flows each way, by protocol |
| Per Network Traffic | Every configured local prefix, inbound and outbound |
| Network Detail | One local prefix: traffic by protocol each way, and its busiest hosts |
| Per Hostgroup Traffic | Each hostgroup's traffic and packets |
| Top ASNs | The remote networks exchanging the most traffic with yours, with their names |
| ASN Explorer | Chosen ASNs compared each way, at interval detail and hourly |
| Destination and Source Explorer | Where outbound traffic goes, and where inbound traffic comes from |
| Remote Host and Network | One remote host or /24, and its traffic each way |
| Interfaces | Traffic per router interface, named from the router's IPFIX options |
| Traffic | Deployment-wide totals from the interval traffic tables |

## Attacks

| Dashboard | Shows |
|---|---|
| DDoS Events | Detections now and over time, mitigation actions, and the targets attacked most |
| Attack Flows | The sampled flow records of each attack: what its traffic was made of |

## Tidegard's own health

| Dashboard | Shows |
|---|---|
| Collector | Datagrams, records, refusals, exporters and the aggregation pipeline |
| Detection | Scopes tracked and their states, and detection events |
| Incident manager | The detection inbox, the notification outbox, timers, retention and notifications |

## Loading them

1. Add two data sources to Grafana: **ClickHouse**, using a read-only
   ClickHouse user over HTTPS, and **Prometheus**, scraping each Tidegard
   service's metrics address.
2. Load the dashboard files with Grafana's file provisioning, using the
   provisioning example that comes with them, or import them through the
   Grafana UI.
3. Keep Grafana itself behind HTTPS and reachable only from your management
   network.

ASN names come from an ASN database file that the collector reads
(`TIDEGARD_COLLECTOR_ASN_DATABASE_FILE`); a daily timer can refresh it.

## Your own dashboards

The ClickHouse tables are documented, so you can build your own panels beside the provided ones: for example, a NOC
wall board, a per-customer view, or a dashboard that matches the layout your
team already knows from another tool. LogiXhare can build these for you
during onboarding.
