# SectorShare — ISAC Threat Intelligence Sharing Process

**CY376: Network Monitoring, Security and Auditing — End-of-Semester Project**
**Team:** Blue Team
**Topic:** Designing a Threat Intelligence Sharing Process with Industry Peers (ISAC Model)
**Author:**   Otu Aboah Dennis— Index Number: FCM.41.018.223.23
**Institution:** University of Mines and Technology (UMaT), Tarkwa
**Contact:** cy-dotu1123@st.umat.edu.gh

## Summary

This project designs a complete threat intelligence sharing process modelled on the
Information Sharing and Analysis Center (ISAC) framework, adapted to Ghana's
cybersecurity governance structure under the Cybersecurity Act, 2020 (Act 1038) and
the Cyber Security Authority (CSA) / National CERT-GH sectoral CERT structure.

The design covers three layers:

- **Governance** — membership charter, sharing agreement, and a dispute/escalation
  path anchored under CERT-GH oversight.
- **Classification** — [Traffic Light Protocol (TLP) 2.0](https://www.first.org/tlp/)
  for controlling how far a shared item may travel.
- **Technical exchange** — [STIX 2.1](https://docs.oasis-open.org/cti/stix/v2.1/stix-v2.1.html)
  indicator objects, intended for transport over
  [TAXII 2.1](https://docs.oasis-open.org/cti/taxii/v2.1/taxii-v2.1.html).

A working prototype, **SectorShare**, implements the full submission → validation →
TLP-tagging → anonymization → publication pipeline for four simulated member sectors
(Banking, Health, Energy, Telecom), and generates real STIX 2.1 indicator bundles.

## Repository Structure

```
├── src/
│   └── index.html          # SectorShare prototype (self-contained HTML/CSS/JS app)
├── docs/
│   ├── CY376_ISAC_Report.pdf     # Final submitted report (PDF copy)
│   ├── architecture-diagram.png  # ISAC information-flow diagram (Figure 1 in report)
│   └── sample-bundle.json        # Example STIX 2.1 indicator bundle output
├── scripts/
│   ├── generate-report.js        # Node/docx-js script used to build the report
│   └── architecture-diagram.svg  # Source SVG for the architecture diagram
├── evidence/
│   └── (screenshots referenced as Figures 2–6 in the report)
├── .gitignore
└── README.md
```

## Running the Prototype

No build step or server required.

1. Clone the repository.
2. Open `src/index.html` directly in any modern browser (Chrome, Edge, Firefox).
3. Select a member organization, an indicator type, a threat category, and a TLP
   marking, then click **Submit to ISAC**.
4. Watch the pipeline run through Submitted → Validated → TLP-Tagged → Anonymized →
   Published, and inspect the generated STIX 2.1 bundle and the live shared feed.

## Tools and Standards Used

- HTML5 / CSS3 / JavaScript (prototype)
- [Traffic Light Protocol (TLP) 2.0](https://www.first.org/tlp/) — FIRST.org
- [STIX 2.1](https://docs.oasis-open.org/cti/stix/v2.1/stix-v2.1.html) /
  [TAXII 2.1](https://docs.oasis-open.org/cti/taxii/v2.1/taxii-v2.1.html) — OASIS
- [MITRE ATT&CK](https://attack.mitre.org/) — referenced for indicator enrichment
- Node.js + [docx](https://www.npmjs.com/package/docx) — report generation
- Ghana Cybersecurity Act, 2020 (Act 1038) — governance framework

## Screenshots

See `docs/CY376_ISAC_Report.pdf`, Section 4 (Implementation), Figures 2–6, for
annotated screenshots of the prototype pipeline, generated STIX bundles at each TLP
level, and the resulting shared feed. Raw screenshot files are stored in `/evidence`.

## Report

The full report, covering background, literature review, methodology, implementation,
results, analysis, and recommendations for a real Ghanaian ISAC deployment, is at
[`docs/CY376_ISAC_Report.pdf`](docs/CY376_ISAC_Report.pdf).

## Scope Note

All member organizations (Aegis Regional Bank, Meridian Health Network, Coastal
Energy Co-op, Vantage Telecom) are fictional, and all indicator data used in testing
is synthetic. No real systems, networks, or third-party data were accessed or used
in this project.
