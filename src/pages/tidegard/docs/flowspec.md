---
layout: ../../../layouts/DocsLayout.astro
title: BGP FlowSpec
description: Drop or rate-limit only the attack traffic with BGP FlowSpec, so the victim stays online - the rules Tidegard sends and what your routers need.
---

**BGP FlowSpec** (RFC 8955 for IPv4, RFC 8956 for IPv6) tells your edge
routers to drop or rate-limit only the traffic that matches a rule, such as
UDP from port 53 to one host, so the victim stays reachable. The approval,
the guard and the kill switch are the same as for [RTBH](../rtbh/).

## The two actions

| Action | Effect at the edge | Extended community |
|---|---|---|
| `flowspec_discard` | Matching traffic is dropped | `traffic-rate` 0 |
| `flowspec_rate_limit` | Matching traffic is limited to a rate | `traffic-rate` *N* |

The rate is in **bytes per second**, as RFC 8955 defines it. For
100 Mbit/s, ask for 12,500,000. FlowSpec redirect, to a VRF or another next
hop, is not offered.

## The match

The destination is always the mitigation's prefix, checked by the guard
like any other. The other parts are optional and match exactly:

| Component | CLI flag | UI field |
|---|---|---|
| Destination prefix | `--prefix` | Prefix |
| Source prefix | `--source` | Source prefix |
| IP protocol (17 is UDP, 6 is TCP) | `--protocol` | Protocol |
| Destination port | `--destination-port` | Destination port |
| Source port | `--source-port` | Source port |

For example, to limit DNS reflection towards one host to 1 Mbit/s for 30
minutes:

```bash
tidegardctl mitigations request --prefix 203.0.113.9/32 \
  --action flowspec_rate_limit --protocol 17 --source-port 53 \
  --rate 125000 --for 30m --reason "DNS reflection, WNM-2026-000123"
```

A NOC lead then approves it, and the mitigator announces it in the IPv4 or
IPv6 FlowSpec family. FlowSpec rules never carry `BLACKHOLE`.

## What your edge routers must do

1. **Negotiate FlowSpec** (`ipv4-flowspec`, and `ipv6-flowspec` if you use
   it) on the iBGP session with Tidegard's `gobgpd`.
2. **Install FlowSpec rules in the forwarding plane** on the interfaces that
   face your upstreams. Many platforms need this turned on, and many limit
   how many rules the hardware holds. Know your limit.
3. **Accept the rules.** FlowSpec validation compares a rule with the best
   unicast route to its destination, and platforms differ in how they treat
   rules from an iBGP peer that does not send that unicast route. Configure
   the session so Tidegard's rules are accepted, and import **only** rules
   whose destination is inside your own space.
4. **Never send these rules to another AS** unless you have arranged it with
   that network.

Test it as you would RTBH: in a maintenance window, rate-limit a test flow
to a test address, see the rule on each edge router, measure the limit,
withdraw it, and see it go.

## Choosing between them

- **FlowSpec discard** when the attack has a clear signature, such as a
  protocol and port, that legitimate traffic to the victim does not share.
  The victim stays online.
- **FlowSpec rate limit** when the signature is shared with legitimate
  traffic, such as DNS to a resolver. Some good traffic is lost; the link
  survives.
- **RTBH** when nothing separates the attack from good traffic, or the
  routers cannot install the rule. The victim goes offline; the network is
  saved.

The attack sample on each incident, with its protocol mix, top source
ports and top sources, is usually enough to tell which one fits.
