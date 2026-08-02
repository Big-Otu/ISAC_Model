\# Designing a Threat Intelligence Sharing Process with Industry Peers (ISAC Model)



\*\*Course:\*\* CY376 – Network Monitoring, Security and Auditing

\*\*Team:\*\* Blue Team

\*\*Author:\*\* Otu Aboah Dennis — FCM.41.018.223.23



\## Summary



This project designs a threat intelligence sharing process modelled on the

Information Sharing and Analysis Center (ISAC) framework, and validates the

design with a two-organisation proof-of-concept built on MISP (Malware

Information Sharing Platform). Two independent MISP instances, representing

two ISAC member organisations, are deployed via Docker and connected through

a sync relationship to demonstrate the full intelligence lifecycle: submission,

TLP classification, dissemination, and sighting feedback.



The full design rationale, literature review, and analysis are in the written

report: \[`docs/report/CY376\_ISAC\_Project\_Report.pdf`](docs/report/CY376\_ISAC\_Project\_Report.pdf)



\## Tools Used



\- \*\*MISP\*\* (Malware Information Sharing Platform) — official `misp-docker` deployment

\- \*\*Docker / Docker Compose\*\* — container orchestration

\- \*\*TLP taxonomy\*\* (built into MISP) — classification of shared intelligence

\- \*\*MITRE ATT\&CK galaxy\*\* (built into MISP) — adversary technique tagging

\- \[ADD ANYTHING ELSE YOU ACTUALLY USE]



\## How to Run This Lab



1\. Clone this repo.

2\. For each simulated member organisation, clone the official MISP Docker project separately (kept outside this repo for security — see `.gitignore`):





3\. Copy `configs/org-a.env.example` and `configs/org-b.env.example` into each respective `misp-docker` folder as `.env`, then fill in your own passwords (never commit real `.env` files).

4\. Run `docker compose up -d` in each.

5\. Access Org A at `https://localhost:8443` and Org B at `https://localhost:8444`.

6\. Follow the sync setup steps documented in `docs/lab-steps.md`.



\## Repository Structure



\- `docs/` — report (PDF), lab setup notes, diagrams

\- `configs/` — sanitised example `.env` files, sync configuration notes (no real secrets)

\- `scripts/` — any automation/helper scripts used

\- `evidence/` — screenshots and logs captured from the lab (referenced in the report)



\## Screenshots



See `evidence/` folder, referenced by figure number in the written report.

