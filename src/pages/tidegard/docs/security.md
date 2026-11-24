---
layout: ../../../layouts/DocsLayout.astro
title: Security
description: How Tidegard protects its data, its users and your network, and what you should do on your side.
---

Tidegard sits next to your routers and can, when you allow it, change how
they forward traffic. It is built on that assumption.

## In transit

- **TLS everywhere off the host.** Connections to PostgreSQL, ClickHouse,
  the API and GoBGP use TLS off loopback, verified against a CA you choose.
  A connection that would fall back to plaintext over the network is
  refused, not attempted. Certificate verification cannot be turned off.
- **The Docker Compose stack** creates its own CA and a certificate per
  service; ClickHouse has no plaintext listener at all.

## People and tokens

- **Tokens are stored as hashes.** Tidegard never keeps a token it could
  show again, and never writes one to a log.
- **Browser sessions** use a secure, `HttpOnly`, `SameSite=Strict` cookie,
  end after 30 minutes idle or 12 hours, and need an anti-forgery header for
  every change.
- **Least privilege.** Four roles, from read-only to NOC lead, scoped to one
  tenant. Only NOC leads approve mitigations.
- **Rate limits** on sign-in and on every endpoint.
- **A strict Content Security Policy** on the web UI.

## Records

- **Every action is audited**, allowed or refused, with who, when, the state
  before and after, and the reason.
- **Notes are never silently changed.** An edit supersedes the original,
  which stays; a redaction is itself recorded.
- **Tenants are isolated.** Another tenant's record answers exactly like a
  record that does not exist.

## Facing the network

- **Exporter allowlist.** The collector accepts IPFIX and sFlow only from
  the routers and switches you list, and counts what it refuses.
- **Bounded memory.** Every table the collector keeps has a limit: exporters,
  templates, hosts, networks, ASNs and detection scopes. A flood of new
  addresses cannot exhaust it.
- **Fuzzed decoders.** The IPFIX and sFlow decoders are fuzz-tested, and every malformed
  input found becomes a permanent test.
- **Mitigation guard.** An allowlist per tenant, prefix floors that the
  configuration cannot override, time limits, four-eyes approval and a kill
  switch; see the [mitigation overview](../mitigation/).

## The software itself

- **Signed releases** with build provenance, and a software bill of
  materials for every package and image.
- **Hardened services.** Each runs as its own unprivileged user, with no
  Linux capabilities, a read-only root filesystem in containers, and
  hardened systemd units.
- **Dependencies are checked** for known vulnerabilities and licences on
  every change, and the full history is scanned for leaked secrets.
- **Security review.** The code is reviewed against a written threat model;
  no critical or high finding is open.

## Your side

- Keep the UI, API, Grafana and metrics reachable only from your
  management network. With Docker, filter published ports in the
  `DOCKER-USER` chain.
- Firewall UDP 2055 to your exporters, as well as setting the allowlist.
- Give each person their own token and the least role they need, and revoke
  tokens when people leave.
- On your edge routers, accept from Tidegard's BGP session only what the
  [RTBH](../rtbh/) and [FlowSpec](../flowspec/) guides describe.

## Reporting a vulnerability

Please report security issues privately to LogiXhare at
[info@logixhare.com](mailto:info@logixhare.com), with "Tidegard security"
in the subject. Do not open a public issue.
