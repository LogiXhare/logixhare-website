---
layout: ../../../layouts/DocsLayout.astro
title: Router setup (IPFIX and sFlow)
description: Export IPFIX from MikroTik RouterOS, Cisco IOS XR, Cisco IOS XE and Juniper routers, or sFlow from Cisco NX-OS, Arista and Juniper switches, to Tidegard, with the right timeouts, sampling and interfaces.
---

Tidegard collects two flow protocols over UDP:

- **IPFIX** (RFC 7011), sometimes called NetFlow v10, on port 2055;
- **sFlow version 5**, on port 6343, once you turn it on. See
  [sFlow](#sflow) below.

Both feed the same detection, incidents and dashboards, and one Tidegard
can take both at once. NetFlow v5 and v9 are not supported yet; see
[Known limitations](../limitations/).

## Before you start

On the Tidegard side:

1. Add each router's **source address** to the exporter allowlist,
   `TIDEGARD_COLLECTOR_ALLOWED_EXPORTERS` (in Compose,
   `TIDEGARD_ALLOWED_EXPORTERS` in `.env`), and restart the collector.
2. Open UDP 2055 (IPFIX) or 6343 (sFlow) from those addresses in the
   host's firewall.
3. Make sure your [local prefixes](../prefixes-and-hostgroups/) are set, or
   every flow is classified as `unknown`.

## What to export, and where

- **Export on the interfaces where traffic enters your network**: upstream
  transit, peering and IX ports, ingress. That sees every attack aimed at
  your customers. To watch traffic leaving your network as well, add the
  customer-facing interfaces, ingress.
- **Do not export the same packet twice.** If a flow crosses two exporting
  routers, or both the ingress and egress of one, it is counted twice.
- **Timeouts:** an active timeout of 60 seconds and an inactive timeout of
  15 seconds. Long active timeouts make an attack look late and bursty.
- **Templates and options:** resend templates and option data every 60
  seconds or less. Until Tidegard has a template, it cannot decode that
  router's data.
- **Source address:** export from a stable loopback, and allowlist that
  address.

## Sampling

Most routers sample packets at high rates, for example 1 in 1,000. Tidegard
multiplies sampled counters back up so that its numbers match real traffic.

- If the router reports its sampling rate in the IPFIX option data
  (`samplingInterval`), Tidegard uses it automatically.
- If it does not, set the rate yourself with
  `TIDEGARD_COLLECTOR_SAMPLING_GLOBAL_DEFAULT`, for example `1000`. This
  applies to every exporter that does not report one, so use the same
  sampling rate on all of them.

**Check it:** compare Tidegard's traffic for a busy interface with the
router's own interface counters over the same few minutes. They should
agree within a few percent. If Tidegard is low by about your sampling rate,
the rate is not being applied.

## MikroTik RouterOS 7

```text
/ip traffic-flow
set enabled=yes interfaces=sfp-sfpplus1,sfp-sfpplus2 \
    active-flow-timeout=1m inactive-flow-timeout=15s
/ip traffic-flow target
add dst-address=192.0.2.10 port=2055 version=ipfix src-address=198.51.100.1
```

RouterOS exports every packet unless you turn sampling on. Unsampled export
is accurate but costs router CPU on busy links; watch the router's load
after enabling it.

## Cisco IOS XR

```text
flow exporter-map TIDEGARD
 version ipfix
  template data timeout 60
  options interface-table timeout 60
  options sampler-table timeout 60
 !
 transport udp 2055
 source Loopback0
 destination 192.0.2.10
!
flow monitor-map TIDEGARD-V4
 record ipv4
 exporter TIDEGARD
 cache timeout active 60
 cache timeout inactive 15
!
flow monitor-map TIDEGARD-V6
 record ipv6
 exporter TIDEGARD
 cache timeout active 60
 cache timeout inactive 15
!
sampler-map SAMPLE-1K
 random 1 out-of 1000
!
interface HundredGigE0/0/0/0
 flow ipv4 monitor TIDEGARD-V4 sampler SAMPLE-1K ingress
 flow ipv6 monitor TIDEGARD-V6 sampler SAMPLE-1K ingress
```

The interface-table option lets the Interfaces dashboard show interface
names. Check whether your release reports the sampling rate in a form
Tidegard reads; if the traffic comes out about 1,000 times too low, set
`TIDEGARD_COLLECTOR_SAMPLING_GLOBAL_DEFAULT=1000`.

## Cisco IOS XE

```text
flow record TIDEGARD-V4
 match ipv4 source address
 match ipv4 destination address
 match ipv4 protocol
 match transport source-port
 match transport destination-port
 match interface input
 collect interface output
 collect transport tcp flags
 collect counter bytes long
 collect counter packets long
 collect timestamp absolute first
 collect timestamp absolute last
!
flow exporter TIDEGARD
 destination 192.0.2.10
 source Loopback0
 transport udp 2055
 export-protocol ipfix
 option interface-table
 option sampler-table
 template data timeout 60
!
flow monitor TIDEGARD-V4
 exporter TIDEGARD
 record TIDEGARD-V4
 cache timeout active 60
 cache timeout inactive 15
!
sampler SAMPLE-1K
 mode random 1 out-of 1000
!
interface TenGigabitEthernet0/0/0
 ip flow monitor TIDEGARD-V4 sampler SAMPLE-1K input
```

For IPv6, add a second record with the `ipv6` match fields and a second
monitor, applied with `ipv6 flow monitor`.

## Juniper MX (inline J-Flow)

```text
set services flow-monitoring version-ipfix template TIDEGARD-V4 ipv4-template
set services flow-monitoring version-ipfix template TIDEGARD-V4 flow-active-timeout 60
set services flow-monitoring version-ipfix template TIDEGARD-V4 flow-inactive-timeout 15
set services flow-monitoring version-ipfix template TIDEGARD-V4 template-refresh-rate seconds 60
set services flow-monitoring version-ipfix template TIDEGARD-V4 option-refresh-rate seconds 60

set forwarding-options sampling instance TIDEGARD input rate 1000
set forwarding-options sampling instance TIDEGARD family inet output flow-server 192.0.2.10 port 2055
set forwarding-options sampling instance TIDEGARD family inet output flow-server 192.0.2.10 version-ipfix template TIDEGARD-V4
set forwarding-options sampling instance TIDEGARD family inet output inline-jflow source-address 198.51.100.1

set chassis fpc 0 sampling-instance TIDEGARD
set interfaces xe-0/0/0 unit 0 family inet sampling input
```

For IPv6, add an `ipv6-template` and the same `family inet6` lines.

> These examples are starting points written from each vendor's
> documented syntax. Commands differ between software releases and
> platforms, so check them against your router's documentation, and apply
> them in a maintenance window the first time.

## sFlow

Many switches, and some routers, export sFlow version 5 rather than
IPFIX. An sFlow agent does not count flows: it picks one packet in N and
sends its headers, with N. Tidegard multiplies each sample by its own N,
so no sampling setting is needed on the Tidegard side, and a host's
traffic compares directly with one seen over IPFIX.

### Turn it on

The sFlow port is off until you set it, so an upgrade never opens a new
port by itself.

- **Docker Compose:** in `.env`, set `TIDEGARD_SFLOW_BIND=0.0.0.0:6343`
  and `TIDEGARD_SFLOW_PUBLISH=6343`, then `docker compose up -d`.
- **systemd:** in `/etc/tidegard/collector.env`, set
  `TIDEGARD_COLLECTOR_SFLOW_BIND=0.0.0.0:6343` and restart
  `tidegard-collector`.

The collector's log then says `sFlow collector listening`. The exporter
allowlist applies to sFlow too: list the addresses the datagrams come
from, which can differ from the agent address set on the device.

### What to configure on the device

- the collector's address and UDP port 6343;
- flow sampling on the interfaces where traffic enters your network,
  ingress, as for IPFIX;
- a sampling rate: 1 in 1,000 to 1 in 4,000 is common for 10G links, 1 in
  8,000 or more for 100G. A lower N is more accurate for small hosts but
  costs more samples;
- a header size of 128 bytes or more, so the TCP or UDP header is
  captured behind VLAN tags and MPLS labels;
- a stable agent or source address, such as a loopback.

### Cisco NX-OS

```text
feature sflow
sflow sampling-rate 4096
sflow max-sampled-size 128
sflow counter-poll-interval 20
sflow collector-ip 192.0.2.10 vrf default
sflow collector-port 6343
sflow agent-ip 198.51.100.1
sflow data-source interface ethernet 1/1
```

### Arista EOS

```text
sflow sample 4096
sflow destination 192.0.2.10 6343
sflow source-interface Loopback0
sflow run
```

### Juniper EX and QFX

```text
set protocols sflow collector 192.0.2.10 udp-port 6343
set protocols sflow sample-rate ingress 4096
set protocols sflow interfaces xe-0/0/0
```

The same caution applies as for the IPFIX examples: check the commands
against your platform's documentation and software release.

### What Tidegard reads from sFlow

- Flow samples, with the sampled packet's header (Ethernet, VLAN, MPLS,
  IPv4, IPv6, TCP and UDP) or the agent's own IPv4 and IPv6 records.
- Source and destination AS, when the agent sends its gateway record.
- Whether the packet was forwarded or discarded.

Counter samples are counted but not stored: keep SNMP for interface
counters. sFlow carries no interface names.

## Check that flows arrive

```bash
curl -s http://127.0.0.1:9090/metrics | grep tidegard_collector_
```

| Metric | What it tells you |
|---|---|
| `active_exporters` | How many routers are sending |
| `flow_datagrams_received_total` | Datagrams reaching the collector |
| `parsed_flow_records_total` | Flow records decoded, IPFIX records and sFlow flow samples together |
| `sflow_samples_total{kind="flow"}` | sFlow flow samples counted; `kind="counters"` alone means the device sends counters but no flow samples |
| `datagrams_refused_total{reason="not_allowed"}` | A router not on the allowlist is sending |
| `unknown_templates_total` | Data arriving before its template; shorten the template refresh |
| `parser_failures_total` | Malformed datagrams; the collector's log names each error |

Drops before the collector reads a datagram are the kernel's; check them
with `netstat -su` or `nstat`.
