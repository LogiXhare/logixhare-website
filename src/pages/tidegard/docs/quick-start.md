---
layout: ../../../layouts/DocsLayout.astro
title: Quick start
description: From a fresh Docker Compose install to signing in, receiving your first flows and seeing a first detection, in about fifteen minutes.
---

This walks through the [Docker Compose installation](../installation/) on
one host. You need the stack started, `docker compose ps` showing every
service healthy, and a router that can export IPFIX to this host.

## 1. Create your first sign-in token

People sign in to the NOC UI and the API with a token. Issue the first one
from the API container:

```bash
docker compose exec -T api tidegard-api token create \
  --tenant default --actor-id you --role noc_lead --days 30 \
  --description "first sign-in"
```

The token is printed once. Keep it somewhere safe; Tidegard stores only its
hash and cannot show it again.

## 2. Sign in

Open `https://127.0.0.1:8443/` (or the address you published the API on).
Your browser needs to trust `tls/ca.pem` from the Compose directory, or you
can install a certificate from your own CA in its place. Paste the token to
sign in. The UI opens on the Overview page.

## 3. Send flows

Point your router's IPFIX exporter at this host, UDP port 2055. Make sure
its source address is in `TIDEGARD_ALLOWED_EXPORTERS`.
[Router setup](../router-setup/) has examples for common platforms.

Within a minute the counters move:

```bash
curl -s http://127.0.0.1:9090/metrics | grep -E 'parsed_flow_records_total|active_exporters'
```

- `parsed_flow_records_total` climbs: flows are arriving and decoding.
- `active_exporters` counts your routers.
- If `datagrams_refused_total{reason="not_allowed"}` climbs instead, the
  router's source address is not on the allowlist.

The Overview page now shows your traffic and busiest hosts.

## 4. Your first detection

The stack ships with an example detection policy in
`../config/detection-policy.json`: a `major` incident when one host
receives more than 1 Gbit/s for 30 seconds. Set its tenant prefixes to
yours, lower the threshold to something your traffic crosses for a test,
check the file, and restart the collector:

```bash
docker compose run --rm --no-deps \
  -v "$PWD/../config/detection-policy.json:/check.json:ro" \
  collector --check-policy /check.json
docker compose restart collector
```

An incident appears on the Incidents page, with the detection that opened
it and, a few seconds later, an attack sample. Put the threshold back when
you are done.

Nothing is ever mitigated on its own. Mitigation needs a request, an
approval and BGP turned on; see the [mitigation overview](../mitigation/).

## Next

- [Prefixes and hostgroups](../prefixes-and-hostgroups/): describe your
  address space properly.
- [Detection policies](../detection-policies/): thresholds for your real
  traffic.
- [Notifications](../notifications/): get incidents to the people on call.
- [NOC web UI and roles](../noc-ui/): tokens for your team, with the least
  role each person needs.
