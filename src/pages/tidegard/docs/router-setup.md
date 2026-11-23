---
layout: ../../../layouts/DocsLayout.astro
title: Router setup (IPFIX)
description: Export IPFIX from MikroTik RouterOS, Cisco IOS XR, Cisco IOS XE and Juniper routers to Tidegard, with the right timeouts, sampling and interfaces.
---

Tidegard collects **IPFIX** (RFC 7011), sometimes called NetFlow v10, over
UDP. NetFlow v5 and v9 and sFlow are not supported yet; see
[Known limitations](../limitations/).

## Before you start

On the Tidegard side:

1. Add each router's **source address** to the exporter allowlist,
   `TIDEGARD_COLLECTOR_ALLOWED_EXPORTERS` (in Compose,
   `TIDEGARD_ALLOWED_EXPORTERS` in `.env`), and restart the collector.
2. Open UDP 2055 from those addresses in the host's firewall.
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

## Check that flows arrive

```bash
curl -s http://127.0.0.1:9090/metrics | grep tidegard_collector_
```

| Metric | What it tells you |
|---|---|
| `active_exporters` | How many routers are sending |
| `flow_datagrams_received_total` | Datagrams reaching the collector |
| `parsed_flow_records_total` | Flow records decoded |
| `datagrams_refused_total{reason="not_allowed"}` | A router not on the allowlist is sending |
| `unknown_templates_total` | Data arriving before its template; shorten the template refresh |
| `parser_failures_total` | Malformed datagrams; the collector's log names each error |

Drops before the collector reads a datagram are the kernel's; check them
with `netstat -su` or `nstat`.
