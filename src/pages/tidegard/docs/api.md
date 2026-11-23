---
layout: ../../../layouts/DocsLayout.astro
title: REST API
description: Authenticate to the Tidegard REST API, read and change incidents and mitigations safely, and handle its errors.
---

Everything the NOC UI and the CLI do goes through one HTTPS REST API,
under `/api/v1`. Use it to connect Tidegard to your ticketing system,
customer portal or automation. The full contract is an OpenAPI document,
provided with each release.

## Authentication

Send a token as a bearer credential:

```bash
curl --cacert ca.pem -H "Authorization: Bearer $TIDEGARD_TOKEN" \
  https://noc.example.net:8443/api/v1/whoami
```

`whoami` returns who the token belongs to, its tenant and the permissions
it carries. Issue a token for an integration with the least role it needs,
as for a person; see [NOC web UI and roles](../noc-ui/).

The API only speaks HTTPS off the local host, and certificate verification
cannot be turned off in Tidegard's own clients.

## What it covers

| Area | Endpoints |
|---|---|
| Incidents | List with filters and cursors, read one, timeline, detections, notes, audit trail, export |
| Incident changes | Acknowledge, investigate, monitor, assign, resolve, close, reopen, suppress, severity, priority, notes, tags, and opening one by hand |
| Mitigations | List, read, history, request, approve, reject, withdraw |
| Kill switch and BGP | Kill switch status and engage; the announced routes and BGP sessions |
| Traffic | Summary, top hosts and networks, and the exporters sending flows |
| Tokens | List, issue and revoke tokens for a tenant, for roles allowed to |
| Health | `/healthz` (the process runs) and `/readyz` (it can reach its database) |

## Changing things safely

Every state change takes two safeguards:

- **`expected_version`** in the body: the version of the incident or
  mitigation you read. If someone changed it since, the API answers `409`
  with the current version and state, and you decide again.
- **An `Idempotency-Key` header**, 16 to 255 characters, new for each
  change and reused on its retries. A retry with the same key and body
  returns the first outcome instead of applying the change twice.

```bash
curl --cacert ca.pem -X POST \
  -H "Authorization: Bearer $TIDEGARD_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 0b9e6a4c-2f53-4c4e-9d0a-6a1d1f6c2b11" \
  -d '{"expected_version": 3}' \
  https://noc.example.net:8443/api/v1/incidents/<id>/acknowledge
```

Request bodies are strict: a field the endpoint does not define is an
error, never silently ignored.

## Errors

Every error is an RFC 9457 problem document (`application/problem+json`)
with a stable `error` code. **Switch on `error`**, never on the title or
detail text, which may change. A code, once published, never changes
meaning.

```json
{
  "type": "https://logixhare.com/tidegard/problems/incident-version-conflict",
  "title": "Version conflict",
  "status": 409,
  "error": "incident.version_conflict",
  "current_version": 4,
  "current_state": "acknowledged",
  "request_id": "…"
}
```

Each code's `type` links to its page in the
[problem type registry](../../problems/).

## Limits

- Requests are rate-limited per person, for example 120 reads and 60
  changes a minute. Over the limit, the answer is `429` with `Retry-After`.
- Bodies are limited to 64 KiB.
- If the database cannot be reached, the API fails closed with `503` and
  `Retry-After`.
- Another tenant's incident or mitigation answers exactly like one that does
  not exist.
