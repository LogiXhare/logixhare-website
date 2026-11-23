---
layout: ../../../layouts/DocsLayout.astro
title: Incidents
description: How detections become incidents, the seven states an incident moves through, and what your NOC can do with one.
---

A **detection** is the engine's statement that traffic crossed a threshold.
An **incident** is the NOC's record of dealing with it. One incident
gathers every detection for the same target while it is open, so an attack
that flaps produces one incident with a history, not a page of alerts.

## The seven states

| State | Meaning |
|---|---|
| `Open` | Created, and nobody has taken it yet |
| `Acknowledged` | Someone has taken responsibility |
| `Investigating` | Active work is in progress |
| `Monitoring` | Understood, and being watched, with no active work |
| `Recovering` | The traffic has cleared; a confirmation period is running |
| `Resolved` | Recovery confirmed, or resolved by an operator |
| `Closed` | The NOC has finished with it. The only final state |

`Resolved` and `Closed` mean different things. **Resolved** is about the
network: the traffic condition is over. **Closed** is about the people:
review and handling are complete. A closed incident can be reopened, with a
reason.

### What happens on its own

- When an open incident's detections clear, it moves to `Recovering`, and
  after the confirmation period to `Resolved`.
- `major`, `minor` and `info` incidents can close themselves after a delay.
  **`critical` incidents are closed by hand**, so every serious attack gets
  a human review.
- If the attack comes back within the reopen window, the new detection
  reopens the incident instead of starting a new one.

## What the NOC can do

| Action | Notes |
|---|---|
| Acknowledge, investigate, monitor | Move the incident through its states |
| Assign | To a person or a team |
| Add a note | Every note is on the timeline; an author can supersede their own note, and a NOC lead can redact one, both on the record |
| Change severity or priority | A reason is required when lowering severity |
| Suppress | Silence notifications until a set time, with a reason. A suppression always expires |
| Tag | Key/value tags for your own reporting |
| Resolve and close | Closing takes a reason: `resolved`, `false_positive`, `duplicate`, `expected_traffic`, `no_action_required` or `other` |
| Request a mitigation | See the [mitigation overview](../mitigation/) |
| Export | The incident, its timeline, detections and audit, as one JSON bundle |

Operators can also open an incident by hand, for example for an attack
reported by a customer before it crossed a threshold.

## What is recorded

Every incident carries:

- a number, such as `WNM-2026-000123`, to quote in tickets and chat;
- the **detections** that opened and updated it, with the policy and its
  version, so an alert can be traced to the exact threshold that raised it;
- an **attack sample**: the totals, protocol mix, top sources with their
  ASNs, top ports, and the first flow records of the attack;
- a **timeline** of every change, note and notification attempt;
- an **audit trail** of every action, allowed or denied, with who did it,
  the state before and after, and why.

## Concurrency and safety

Two people acting on the same incident at once cannot overwrite each
other: each change carries the version it was based on, and a stale one is
refused with the current state. Retried requests with the same idempotency
key are applied once.
