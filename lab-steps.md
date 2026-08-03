# Lab Setup and Sync Configuration Steps

This document records the exact steps taken to build the two-organisation MISP
lab used in this project. It is the detailed companion to Section 3
(Methodology) of the written report.

## 1. Environment

- Host OS: Windows 11 (with WSL2 + Docker Desktop)
- Deployment: two independent `misp-docker` Docker Compose stacks, one per
  simulated member organisation, run directly on the host (not in separate
  VMs — Docker's own container isolation is sufficient for this blue-team,
  non-malicious lab; see report Section 3.3 for justification).

| | Org A | Org B |
|---|---|---|
| MISP URL | https://localhost:8443 | https://localhost:8444 |
| Admin email | admin@org-a.test | admin@org-b.test |
| Admin org | OrgA | OrgB |

## 2. Deployment Steps

1. Cloned the official MISP Docker project separately for each organisation:
   ```
   git clone --depth 1 https://github.com/MISP/misp-docker.git
   ```
2. Copied `template.env` to `.env` in each folder and set (uncommented and
   filled in) the following keys:
   - `MYSQL_PASSWORD`
   - `BASE_URL`
   - `CORE_HTTPS_PORT`
   - `ADMIN_EMAIL`
   - `ADMIN_ORG`
3. Brought each stack up independently:
   ```
   docker compose up -d
   ```
4. Waited for all containers to reach a healthy/running state
   (`docker compose ps`), which took several minutes on first run while
   MISP initialised its database.
5. Logged into each instance with the default credentials
   (`admin@admin.test` / `admin`) and immediately changed the password when
   prompted.

## 3. Sync Configuration (Org A → Org B)

[FILL IN ONCE COMPLETED — steps will be approximately:]

1. On Org B, created a dedicated **sync user** (Administration > List Users >
   Add User), assigned the "Sync user" role.
2. Generated an API key for that sync user (Administration > List Auth Keys).
3. On Org A, navigated to Administration > Server Settings & Maintenance >
   List Servers > New Server, and entered:
   - Org B's base URL (`https://misp-org-b.local:8444` or equivalent
     reachable address)
   - The sync user's API key from Org B
4. Tested the connection ("Test Connection" button) to confirm Org A could
   reach Org B.
5. Configured pull/push settings for the new server entry as appropriate.

## 4. Demonstration Event

[FILL IN ONCE COMPLETED]

1. Created a new event on Org A representing a simulated phishing/malware
   campaign.
2. Added simulated indicators (IP address, file hash, domain — all fictional,
   no real-world data) as attributes.
3. Applied a TLP tag and a relevant MITRE ATT&CK galaxy tag.
4. Published the event.
5. Triggered synchronisation and confirmed the event appeared on Org B.
6. Logged a sighting on Org B against one received indicator.

## 5. Issues Encountered (for transparency / interview prep)

- Initial `docker compose up -d` failed with a disk-related
  "read-only file system" error during image pull, caused by low free disk
  space on the host. Resolved by freeing disk space and resetting the WSL2
  Docker data distro (`wsl --unregister docker-desktop-data`) to clear
  corrupted partial image layers.
- A transient DNS resolution failure ("no such host" for
  registry-1.docker.io) occurred immediately after the WSL2 reset while
  Docker Desktop's internal networking was still initialising; resolved by
  retrying the pull once Docker Desktop had fully settled.


