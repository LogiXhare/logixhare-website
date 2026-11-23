---
layout: ../../../layouts/DocsLayout.astro
title: Mitigation overview
description: How Tidegard announces BGP blackholes and FlowSpec rules through GoBGP, the approval and safety guard around every one, and how to turn it on in stages.
---

Tidegard mitigates by **BGP**: it announces routes to your edge routers
that make them drop or rate-limit attack traffic. Three actions are
available:

| Action | Effect | Guide |
|---|---|---|
| `rtbh` | Drop all traffic to one attacked address (/32 or /128) | [RTBH](../rtbh/) |
| `parent_prefix` | Drop all traffic to a covering block, such as a /24 | [RTBH](../rtbh/) |
| `flowspec_discard`, `flowspec_rate_limit` | Drop, or limit, only the traffic matching a rule | [FlowSpec](../flowspec/) |

## How a mitigation happens

1. **It is requested**, by an operator from an incident, or **proposed** by
   the mitigator for a new critical attack on a host.
2. **A NOC lead approves it.** By default the requester cannot approve their
   own request.
3. **The guard checks it**, at request, at approval and again just before
   announcing.
4. **The mitigator announces it** to the `gobgpd` beside it, which passes it
   over iBGP to your edge routers.
5. **It ends**: when its time runs out, when someone withdraws it, or when
   the kill switch is engaged. Expiry withdraws the route.

Every step is in the mitigation's history and its incident's timeline, and
can be sent as a [notification](../notifications/).

## The safety guard

One guard file, read by both the API and the mitigator, decides what may
ever be announced. Its defaults announce nothing.

```json
{
  "dry_run": true,
  "bgp_enabled": false,
  "max_duration_seconds": 3600,
  "approval_window_seconds": 900,
  "allow_self_approval": false,
  "allowlist": [
    { "prefix": "203.0.113.0/24", "tenant": "acme", "actions": ["rtbh", "flowspec_discard", "flowspec_rate_limit"] },
    { "prefix": "198.51.100.0/24", "tenant": "acme", "actions": ["rtbh", "parent_prefix"] }
  ]
}
```

- **Allowlist.** Only listed prefixes can be mitigated, each bound to one
  tenant and the actions allowed on it. An empty allowlist allows nothing.
- **Prefix floors.** Nothing wider than /24 for IPv4 or /48 for IPv6 by
  default, and never wider than /16 or /32 whatever the file says.
- **Every mitigation ends.** One hour at most by default.
- **Four eyes.** The requester cannot approve their own request unless
  `allow_self_approval` is on.
- **Kill switch.** Any NOC lead can engage it from the UI or the CLI. It
  withdraws everything live and refuses new mitigations until it is
  released on the API host. It survives a database restore.
- **Route attributes are configuration**, never part of a request: next
  hop, communities, `NO_EXPORT` and the ownership community all come from
  the mitigator's settings.

## Automatic mitigation (opt-in)

Some networks need attacks blackholed at night without waiting for a
person. Tidegard can do that, within limits you set:

- It is **off by default**, and turned on in the mitigator's settings.
- It applies only to allowlist entries marked `"automatic": true`. The most
  specific entry decides, so a NAT pool left manual inside an automatic
  block stays manual.
- It acts only on new incidents of the severities you choose, for a set
  duration, optionally extended while the attack continues.
- `max_live` and `max_per_hour` cap it. Past either, an attack gets a
  proposal for a person instead.
- Everything else is unchanged: the guard checks again, the history records
  it, and the kill switch stops it.

Run automatic mitigation under dry-run for a week first, and compare each
automatic decision with what your NOC would have done. Keep shared address
space, such as CGNAT pools, manual: an even spread of legitimate traffic
across a pool can cross a total threshold.

## Turning it on, in stages

1. **BGP off** (as installed). Request and approve a mitigation for a test
   address. It goes `active`, marked dry-run, and nothing connects to BGP.
   This proves the people, the permissions and the notifications.
2. **BGP on, dry-run on.** The mitigator connects to `gobgpd` and shows
   each edge router's session, still announcing nothing.
3. **Dry-run off**, in a maintenance window. Blackhole a test address that
   carries no traffic, check each edge router received it with `BLACKHOLE`
   and `NO_EXPORT` and drops the traffic, then withdraw it and see it go.
4. **Automatic mitigation**, if you want it, under dry-run first.

## Where it runs

The mitigator talks only to a `gobgpd` (GoBGP 4.9) on the same host, over
its gRPC API on `127.0.0.1:50051`. GoBGP's API has no authentication, so it
must never listen on any other address. For this reason BGP runs from the
systemd packages, beside `gobgpd`, and not from inside the Docker Compose
stack. A second mitigator can run as a standby and takes over if the first
stops.
