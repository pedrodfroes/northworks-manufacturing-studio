# LIMS shortlist — Northworks Pharma

Research reviewed 8 September 2026. This is a shortlist of established enterprise providers relevant to pharmaceutical manufacturing QC, not a verified market-share ranking. Evidence is vendor-published; price, delivery effort and current connector compatibility require a scoped demonstration.

## LabWare

Broad manufacturing QC scope: lot testing, stability and environmental monitoring. Published PAS-X integration makes it a useful reference for this scenario.

**Ask to see:** Demonstrate the installed PAS-X/SAP versions, sample identity mapping and corrected-result handling.

Sources: [Product / industry overview](https://www.labware.com/lims); [integration / implementation evidence](https://www.koerber.com/en/about-us/news-and-press/labware-mes-lims-integration).

## LabVantage Pharma

Pharma-focused configuration alongside LIMS, LES, ELN and SDMS capabilities; published SAP and enterprise interfacing.

**Ask to see:** Show where the pharma template fits our methods and where site configuration, validation and custom work remain.

Sources: [Product / industry overview](https://www.labvantage.com/industries/pharma-biotech/); [integration / implementation evidence](https://www.labvantage.com/informatics/lims/).

## Thermo Scientific SampleManager

Manufacturing QA/QC reference with laboratory execution, scientific data management and instrument integration. Published pharma deployment evidence.

**Ask to see:** Show our chromatography workflow, raw-data traceability and the supported SAP/MES connector scope.

Sources: [Product / industry overview](https://www.thermofisher.com/us/en/home/industrial/pharma-biopharma/pharmaceutical-data-management.html); [integration / implementation evidence](https://documents.thermofisher.com/TFS-Assets/CMD/Reference-Materials/CS-80032-LIMS-Pharma-Laboratory-Productivity-CS80032-EN.pdf).

## STARLIMS

Quality Manufacturing documentation covers external master data, sample/results exchange, SAP QM and investigation links.

**Ask to see:** Confirm current product and connector versions; demonstrate inspection-lot mapping and quality-event reconciliation.

Sources: [Product / industry overview](https://www.starlims.com/resources/starlims-36-years-of-evolutional-technology-supports-laboratories-in-their-digital-transformation-article/); [integration / implementation evidence](https://www.starlims.com/wp-content/uploads/2023/08/starlims-qm-interfacing-with-third-party-systems-whitepaper.pdf).

## Recommendation for the demonstration

Use LabWare as the named reference alongside PAS-X because the published Körber integration describes the sample-request, collection-confirmation and results-return flow. Keep the configurator vendor-neutral and evaluate all four against the same scripted case. This is a demonstration choice, not a procurement award.

## One customer story, clear ownership

SAP PP-PI owns the process order. MES requests the in-process sample against the order, phase and batch. LIMS owns sample registration, laboratory tests, method/specification references and reviewed result publication in this proposed design. A QMS investigation handles unresolved quality events. The site's authorized quality process owns disposition and SAP quality/stock updates.

SAP QM inspection lots, LIMS samples, SAP material batches and PP-PI process orders are separate identities. Specify their relationships and cardinalities. Select a single originating trigger per sampling purpose so SAP and MES do not create duplicate sample requests.

## Common vendor demonstration

1. Receive an incoming-material lot and register its sampling plan; preserve container, location and collection/receipt identity.
2. Request an in-process oral-solution sample from MES. Return a sample identity and label details; acknowledge collection without creating a duplicate on retry.
3. Apply the effective approved method and specification. Demonstrate qualified analysts, instruments, reagents and standards.
4. Show the laboratory queue and expected result time. Separate elapsed turnaround from instrument run time; communicate a late result to manufacturing.
5. Import an assay result with units and raw-data provenance. Show review before publication; preserve method/specification versions.
6. Challenge the design with 94% against the synthetic 95–105% range. Preserve the original result and route the investigation; a later passing result must not silently erase the original.
7. Publish a reviewed result, then supersede it. Show who is notified, affected batch containment and safe handling of out-of-order or duplicate messages.
8. Keep result acceptance separate from batch disposition. Reconcile the authorized quality decision with SAP and manufacturing status.
9. Demonstrate stability pulls, environmental monitoring and microbiology with their distinct schedules, incubation/reading stages and trend review.
10. Export traceable evidence and show controlled configuration migration, restore, roles and signature behavior for the customer acceptance plan.

The numerical assay range above is synthetic, not a product specification. These are requested acceptance demonstrations, not claims that every shortlisted product delivers every item without configuration.

## What the current app actually shows

- LIMS configuration records requirements and ownership.
- The existing LIMS trial checks one assay for LOT-001; the QMS trial uses completed passing evidence as a release gate.
- That connected example is labeled **Dosing kit** in the UI. It is distinct from the oral-solution MES batch.
- The oral-solution MES has a local sample gate. It is not connected to the separate LIMS trial.
- Chain of custody, instrument acquisition, lab capacity, OOS workflow, stability and real SAP/LIMS interfaces are design topics, not implemented by this presenter update.
