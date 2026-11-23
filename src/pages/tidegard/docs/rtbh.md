---
layout: ../../../layouts/DocsLayout.astro
title: BGP blackhole (RTBH)
description: Remotely triggered blackhole routing with Tidegard - the route it announces, and what your edge routers must do to accept it safely.
---

During an attack on one address, **RTBH** makes your edge routers drop all
traffic to that address, attack and legitimate alike. The victim goes
offline; the rest of your network keeps working. It is the bluntest tool:
use it when the attack threatens the network and [FlowSpec](../flowspec/)
cannot separate the attack from good traffic.

## The route Tidegard announces

The mitigator announces one route per mitigation to its `gobgpd`, which
peers over iBGP with your edge routers.

| | RTBH | Parent prefix |
|---|---|---|
| Prefix | The attacked address only: a /32 or /128 | An allowlisted covering prefix, such as a /24 |
| Next hop | Your configured blackhole next hop | The same |
| Communities | `65535:666` (`BLACKHOLE`, RFC 7999), any you add, and `NO_EXPORT` | The same |
| Ownership | The large community `<your ASN>:5721677:1` | The same |
| Lasts | The requested time, at most the guard's maximum | The same |

The next hop and communities come from the mitigator's settings:

```json
{
  "routes": {
    "local_asn": 64500,
    "rtbh_next_hop_ipv4": "192.0.2.66",
    "rtbh_next_hop_ipv6": "2001:db8::66",
    "communities": ["65535:666"],
    "no_export": true
  }
}
```

The **parent prefix** blackholes a whole block, for an attack spread across
many addresses. The guard allows it only where the allowlist lists
`parent_prefix` for that prefix, and never wider than the prefix floor.

## What your edge routers must do

1. **Route the next hop to a discard interface.** Point the blackhole next
   hop addresses at a null interface on every edge router, using addresses
   from your own space that are used for nothing else. Blackholed traffic
   follows the BGP route there and is dropped.
2. **Peer over iBGP with Tidegard's `gobgpd`**, with an import policy that
   accepts **only**:
   - routes carrying `BLACKHOLE`;
   - /32 and /128 routes, plus the parent prefixes you allowlisted;
   - routes inside your own address space.

   Reject everything else from this session. Do not rely on Tidegard's
   guard alone.
3. **Never re-advertise these routes.** `NO_EXPORT` keeps them inside your
   AS; make sure no export policy strips it. Asking an upstream to
   blackhole for you is a separate arrangement with that provider, and
   Tidegard does not do it.

Tidegard does destination-based RTBH only.

## Test before you rely on it

In a maintenance window, with BGP on and dry-run off:

1. Request an RTBH for a test address in your space that carries no
   traffic, and approve it.
2. Check that each edge router received it, with `BLACKHOLE` and
   `NO_EXPORT`.
3. Check that traffic to the address is dropped.
4. Withdraw it, and check it is gone from every router.

## Watching it

- The **Mitigations** page in the NOC UI, or
  `tidegardctl mitigations list --live`, shows what is requested and what
  is active.
- `tidegardctl bgp routes` shows what was announced, exactly as recorded.
- `tidegardctl bgp peers` shows each iBGP session. A session that drops is
  notified as `bgp.peer_down`.
