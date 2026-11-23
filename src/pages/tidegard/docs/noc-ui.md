---
layout: ../../../layouts/DocsLayout.astro
title: NOC web UI and roles
description: The NOC web UI's pages, how people sign in with tokens, and what each role is allowed to do.
---

The NOC web UI is served by the API, on the same HTTPS address, by default
port 8443. There is nothing extra to install.

## Pages

| Page | What it shows |
|---|---|
| **Overview** | Active incidents, traffic and top hosts over the last hour, and the routers exporting flows |
| **Incidents** | Every incident, filtered by state, severity, priority and direction |
| **Incident detail** | One incident: its state and actions, detections, attack sample, notes, timeline and audit trail |
| **Mitigations** | Requested, approved and active mitigations; request, approve, reject and withdraw; the kill switch; BGP session status |

Everything the UI does goes through the API, so it can only do what the
signed-in person's role allows; the API refuses anything else.

## Signing in

People sign in with a **token**. The UI exchanges it for a browser session,
so the token is not kept in the page. Sessions use a secure cookie, and
every change made through a session needs an anti-forgery header the UI
adds for you.

Issue one token per person, for the least role they need:

```bash
tidegard-api token create --tenant default --actor-id alice --role operator \
  --days 90 --description "Alice, NOC day shift"
```

- The token is printed **once**. Tidegard keeps only its hash. Hand it over
  through a secure channel.
- A token expires after the days you give it. Issue a new one before then.
- Revoke one the moment it is no longer needed:
  `tidegard-api token revoke --token-id <id>`. `token list` shows what is
  live, never the tokens themselves.

## Roles

Each role includes everything in the roles above it.

| Role | Adds |
|---|---|
| `viewer` | Read incidents, traffic and mitigations |
| `operator` | Acknowledge, assign, investigate, and add notes |
| `senior_operator` | Change severity and priority, resolve, close and reopen, open an incident by hand, request and withdraw mitigations |
| `noc_lead` | Suppress, tag, export, read the audit trail, redact notes, **approve mitigations**, and engage the kill switch |

A typical NOC gives first-line staff `operator`, shift leads
`senior_operator`, and only the people who may authorise a BGP announcement
`noc_lead`.

## Several customers on one deployment

A token belongs to one **tenant**. A person signed in to one tenant sees
only that tenant's incidents, traffic and mitigations; another tenant's
records answer as if they did not exist. Managed service providers can give
their own staff provider roles that work across tenants, with every such
access recorded in the audit trail.
