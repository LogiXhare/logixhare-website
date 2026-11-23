---
layout: ../../../layouts/DocsLayout.astro
title: FAQ
description: Straight answers to the questions network teams ask before deploying Tidegard.
---

## Does Tidegard block attacks by itself?

Not unless you decide it should. Out of the box, detection only raises
incidents, and BGP is off in dry-run. Mitigation is requested by one person
and approved by a NOC lead. If you want attacks blackholed at night without
waiting for anyone, [automatic mitigation](../mitigation/#automatic-mitigation-opt-in)
can be turned on per prefix, with limits on how many and how often.

## Does it sit in the traffic path?

No. Tidegard reads flow records your routers export, and mitigates through
BGP announcements to your own edge routers. It never forwards customer
traffic, so if the Tidegard host fails, your network carries on; you lose
visibility and detection until it is back.

## Which routers work with it?

Any router or switch that exports **IPFIX** or **sFlow version 5**.
[Router setup](../router-setup/) has IPFIX examples for MikroTik RouterOS 7,
Cisco IOS XR and IOS XE, and Juniper MX, and sFlow examples for Cisco
NX-OS, Arista EOS and Juniper EX and QFX. NetFlow v5 and v9 are not
supported yet.

## How fast does it detect an attack?

As fast as your policy's window and trigger allow, plus your routers' flow
export delay. With the 40-second window that worked best in our pilot, an
attack is typically detected within one to two minutes of starting. Shorter windows
detect sooner and raise more false alarms; see
[Choosing the window](../detection-policies/#choosing-the-window).

## How much traffic can it handle?

One collector core handled 200,000 flow records a second with no loss in
our load test, using 13 MiB of memory. Because routers sample, that is far
more traffic than it sounds: at 1-in-1,000 sampling, each record stands for
a thousand packets. See [Requirements and sizing](../requirements/).

## Will its numbers match my router's interface counters?

They should agree within a few percent once sampling is set correctly. If
they differ by about your sampling rate, see
[Sampling](../router-setup/#sampling).

## Can we run it for several customers?

Yes. Each customer is a tenant, with its own prefixes, policies, people,
alerts and mitigation allowlist, and sees only its own records. For
customers who need isolation even from a database administrator, run one
deployment each.

## Can we keep our flow data in house?

Yes. Tidegard runs on your own server or virtual machine; flow data, traffic
history and incidents stay on it. Nothing is sent to LogiXhare.

## Can we use our existing Grafana?

Yes. The dashboards are files for Grafana 13 with the ClickHouse and
Prometheus data sources; load them into the Grafana you already run.

## How do we get it, and who supports it?

Through LogiXhare. We install it with you, connect your routers, tune
detection on your real traffic during a pilot, set up alerts and train your
NOC, then support it. [Contact us](../../../contact/) to start.
