---
layout: ../../../layouts/DocsLayout.astro
title: Prefixes and hostgroups
description: Tell Tidegard which address space is yours, which tenant owns it, and how to group it, so every flow gets a direction and every policy a target.
---

Tidegard decides whether a flow is coming in or going out by comparing its
addresses with **your local prefixes**. Without them, every flow is
classified as `unknown`, and host and network detection has nothing to
work on.

## Setting your prefixes

`TIDEGARD_COLLECTOR_LOCAL_PREFIXES` is a comma-separated list. Each entry
is a prefix, optionally followed by `@tenant` and `@hostgroup`:

```bash
TIDEGARD_COLLECTOR_LOCAL_PREFIXES=192.0.2.0/24@acme@hosting,198.51.100.0/24@acme@broadband,2001:db8::/32@acme@v6
```

| Part | Required | Default |
|---|---|---|
| `network/length` | Yes | IPv4 or IPv6 |
| `@tenant` | No | `default` |
| `@hostgroup` | No | None |

`@` is the separator because it can never appear in an IPv6 address. The
collector reads the list at start, so restart it after a change.

## How a flow is classified

| Source | Destination | Direction |
|---|---|---|
| outside | one of your prefixes | `incoming` |
| one of your prefixes | outside | `outgoing` |
| one of your prefixes | one of your prefixes | `internal` |
| outside | outside | `other` |

Detection watches `incoming` and `outgoing` traffic; there is nothing to
defend in the other two.

## Overlapping prefixes

Overlaps are allowed, and useful: a covering prefix for the whole block,
and a more specific one for a part of it that belongs to another hostgroup
or tenant. The most specific match wins. An exact duplicate is a
configuration error, logged and dropped at start.

```bash
TIDEGARD_COLLECTOR_LOCAL_PREFIXES=203.0.113.0/24@acme@core,203.0.113.128/26@acme@cgnat
```

## Hostgroups

A hostgroup is a name for a set of prefixes that behave alike, such as
hosting servers, broadband customers or a CGNAT pool. Hostgroups give you:

- a **per-hostgroup traffic dashboard**, inbound and outbound;
- **hostgroup-total detection**: one policy on the combined traffic of the
  whole group, for attacks spread across many addresses;
- a way to give **different thresholds** to each kind of address, with a
  per-host policy that names a network.

A typical ISP layout is three to five hostgroups: servers and hosting,
business customers, residential or broadband pools, and CGNAT pools, each
with its own thresholds.

## Tenants

Each prefix belongs to one tenant. Incidents, tokens, notes and
mitigations belong to a tenant, and a person signed in to one tenant never
sees another's. A single-operator deployment uses one tenant, `default`.
Managed service providers use one tenant per customer.

Declare the same ownership in the detection policy's `tenants` block, so a
policy aimed at a range its tenant does not own is refused when it is
loaded; see [Detection policies](../detection-policies/).

## Leased or excluded space

Leave out any prefix you do not want watched, such as space leased to
another network. Traffic to it then counts as `other`, and no policy can
alert on it.
