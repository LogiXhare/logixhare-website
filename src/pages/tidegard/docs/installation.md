---
layout: ../../../layouts/DocsLayout.astro
title: Installation
description: Install Tidegard with Docker Compose on one host, or as systemd services from the release packages, and verify what you install.
---

There are two ways to install Tidegard. Both run the same five services.

| | Docker Compose | systemd packages |
|---|---|---|
| Suits | A quick start, a pilot, or a host that already runs Docker | A production host where you run PostgreSQL and ClickHouse yourself |
| Databases | Included in the stack | Yours to install, secure and back up |
| TLS between services | Set up for you by `setup.sh` | You provide certificates |
| BGP mitigation | Not from inside the stack; see the [mitigation overview](../mitigation/) | Supported, with `gobgpd` on loopback |

## Get the release

Tidegard is licensed software: you need a subscription agreement with
LogiXhare before installing it. LogiXhare then provides the release bundle
for your version: the Compose stack, the installation packages for x86_64
and aarch64, and their checksums. It also issues registry credentials for
the container images, `ghcr.io/logixhare/tidegard-<service>`, for
`collector`, `incident-manager`, `api`, `notifier` and `mitigator`, for
amd64 and arm64. Sign in with them (`docker login ghcr.io`) before pulling.

### Verify what you install

Every release is built and signed by an automated release pipeline, with
build provenance attached. Check an image's signature before you deploy it:

```bash
version=1.0.0
identity="https://github.com/LogiXhare/tidegard/.github/workflows/release.yml@refs/tags/v$version"
issuer=https://token.actions.githubusercontent.com
cosign verify "ghcr.io/logixhare/tidegard-collector:$version" \
  --certificate-identity "$identity" --certificate-oidc-issuer "$issuer"
```

Deploy the digest that `cosign verify` reports, not the tag: a tag can be
moved, a digest cannot. Check the package checksums with
`sha256sum -c SHA256SUMS`.

## Docker Compose

From the unpacked bundle:

```bash
cd tidegard-$version/deployments/docker-compose
sudo ./setup.sh "$version"        # once: the CA, every key and password, and .env
```

`setup.sh` creates a certificate authority for the stack, a certificate for
each service, and a random password for each database user. It never
overwrites a file, so running it again is safe. To reach the API by a host
name, set `TIDEGARD_API_HOSTNAME` before the first run so the certificate
names it.

Tell it your address space and your routers in `.env`:

```bash
TIDEGARD_LOCAL_PREFIXES=192.0.2.0/24@default,2001:db8::/32@default
TIDEGARD_ALLOWED_EXPORTERS=198.51.100.1,198.51.100.2
```

Start it, and check every container is healthy:

```bash
docker compose up -d
docker compose ps
```

| Container | Listens on the host |
|---|---|
| `api` | `127.0.0.1:8443`, HTTPS. Set `TIDEGARD_API_PUBLISH` to reach it from your management network |
| `collector` | UDP `2055` for your routers; metrics on `127.0.0.1:9090` |
| `incident-manager`, `notifier`, `mitigator` | Metrics and health checks on `127.0.0.1:9091`, `9093` and `9094` |
| `postgres`, `clickhouse` | Nothing outside the stack |

Every Tidegard container runs as a non-root user with a read-only root
filesystem, no Linux capabilities and `no-new-privileges`. ClickHouse has no
plaintext listener, and PostgreSQL requires TLS.

> **Docker bypasses the host firewall for published ports.** If the API or
> port 2055 is published on a public address, filter it in the `DOCKER-USER`
> chain, not only with `ufw` or `firewalld`.

## systemd packages

On Ubuntu 22.04 or 24.04, or Debian 12 or 13:

```bash
tar -xzf tidegard-$version-linux-$(uname -m).tar.gz
sudo ./tidegard-$version-linux-$(uname -m)/install.sh
```

`install.sh` puts the binaries and the web UI in `/opt/tidegard`, creates
one system user per service, copies the example settings to
`/etc/tidegard/` where none exist, and installs hardened systemd units. It
enables and starts nothing. Then:

1. Create the PostgreSQL role and database for Tidegard.
2. Replace every `CHANGE_ME` in `/etc/tidegard/*.env`. A database that is
   not on the same host needs its CA file set: plaintext is only ever used
   over loopback.
3. Start the incident manager first. It applies the database migrations:

   ```bash
   sudo systemctl enable --now tidegard-incident-manager
   ```

4. Then the API and the collector:

   ```bash
   sudo systemctl enable --now tidegard-api tidegard-collector
   ```

5. The notifier when you have [configured it](../notifications/), and the
   mitigator only after reading the [mitigation overview](../mitigation/).

Every service answers `/healthz` and `/readyz`: the API on its own address,
the others on their metrics address.

## After installing

- [Quick start](../quick-start/): sign in, send flows, see a first detection.
- [Router setup](../router-setup/): export IPFIX from your routers.
- [Backup, restore and upgrade](../backup-and-upgrade/): take a first
  backup before anything you would miss is in it.
