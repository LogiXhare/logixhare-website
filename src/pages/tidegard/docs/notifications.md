---
layout: ../../../layouts/DocsLayout.astro
title: Notifications
description: Send incident, mitigation and BGP alerts to Telegram, Slack, Microsoft Teams, email and signed webhooks, routed by tenant, event and severity.
---

The notifier, `tidegard-notifier`, delivers alerts through five kinds of
channel: **Telegram**, **Slack**, **Microsoft Teams**, **email** and
**generic webhooks** signed with HMAC. Every attempt is recorded on the
incident's timeline, and every incident message says where its mitigation
stands, for example `Mitigation: none` or `Mitigation: active`.

## Running it

| Setting | Default | Meaning |
|---|---|---|
| `TIDEGARD_NOTIFY_DATABASE_URL` | required | The incident database |
| `TIDEGARD_NOTIFY_CONFIG` | required | The channels-and-routes file below |
| `TIDEGARD_NOTIFY_METRICS_BIND` | `127.0.0.1:9093` | Metrics and health checks |

## The configuration file

Secrets are never written in the file. It names the files that hold them:
the Telegram bot token, the Slack and Teams webhook URLs, the SMTP password
and the webhook signing secret.

```json
{
  "channels": {
    "noc-telegram": {
      "kind": "telegram",
      "bot_token_file": "/run/secrets/telegram-token",
      "chat_id": "-1001234567890"
    },
    "noc-mail": {
      "kind": "email",
      "smtp_host": "smtp.example.net",
      "smtp_tls": "starttls",
      "username": "tidegard",
      "password_file": "/run/secrets/smtp-password",
      "from": "Tidegard <noc@example.net>",
      "to": ["oncall@example.net"]
    },
    "noc-slack": { "kind": "slack", "url_file": "/run/secrets/slack-url" },
    "ticketing": {
      "kind": "webhook",
      "url": "https://tickets.example.net/hooks/tidegard",
      "secret_file": "/run/secrets/ticketing-hmac"
    }
  },
  "routes": [
    {
      "tenant": "default",
      "events": ["incident.opened", "incident.reopened", "incident.attack_sample", "incident.severity_changed"],
      "min_severity": "major",
      "channels": ["noc-telegram", "noc-mail"]
    },
    {
      "tenant": "default",
      "events": ["incident.opened", "incident.resolved", "incident.closed"],
      "channels": ["ticketing"]
    }
  ],
  "allowed_hosts": ["api.telegram.org", "hooks.slack.com", "tickets.example.net", "smtp.example.net"],
  "ca_file": "/etc/ssl/certs/ca-certificates.crt",
  "ui_base_url": "https://noc.example.net:8443",
  "rate_limit_per_minute": 30,
  "dedup_seconds": 300
}
```

A **route** matches a tenant, a list of events and, optionally, a minimum
severity, and sends to its channels. A message no route matches is sent
nowhere.

## Events

| Events | When |
|---|---|
| `incident.opened`, `incident.reopened` | A new or returning attack |
| `incident.attack_sample` | 10 to 30 seconds after opening: what the attack is made of. Route it with `incident.opened` |
| `incident.acknowledged`, `incident.recovering`, `incident.resolved`, `incident.closed` | Lifecycle steps |
| `incident.severity_changed`, `incident.priority_changed`, `incident.assignment_changed`, `incident.suppression_changed` | Changes made by the NOC |
| `mitigation.requested`, `mitigation.proposed` | A mitigation waits for approval |
| `mitigation.active`, `mitigation.withdrawn`, `mitigation.failed` | A route was announced, taken down, or refused |
| `mitigation.kill_switch_engaged`, `mitigation.kill_switch_released` | The kill switch changed |
| `bgp.peer_down`, `bgp.peer_up` | An iBGP session to an edge router dropped or came back |

BGP session events belong to the deployment as a whole: route them with
`"tenant": "platform"`.

## Safety

- **Destinations are allowlisted.** A channel's host must be on
  `allowed_hosts`, must resolve to public addresses, and is reached over
  HTTPS with certificate checks and no redirects. A receiver inside your
  own network needs `"allow_private": true` on its channel.
- **Storms are bounded.** One message per channel, incident and event in
  each `dedup_seconds`, and at most `rate_limit_per_minute` per channel.
- **Failures are retried.** A timeout, `429` or `5xx` is retried with
  backoff, to the failed channel only, and set aside after the retry limit.
  A `4xx` is recorded and not retried.

**Check it:** open a test incident, see the message arrive, and watch
`tidegard_notifier_notifications_total{result="delivered"}` rise.
