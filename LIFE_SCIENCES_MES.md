# Life-sciences MES: research, configurator and executable model

Research and implementation: 8 September 2026. Open `mes.html` through the existing local preview server, or choose **Life sciences MES** from the implementation header. The capability is also available in the shared scope selector.

## Research conclusions

The useful comparison with APS is the ability to configure a model, run a recognizable scenario and interpret its consequences. The primary MES object is an executed batch record, with its recipe, materials, equipment, people and evidence. A schedule alone cannot represent that work.

Körber describes MBRs as manufacturing instructions that provide the basis for executed records, including materials, procedures and process/quality data. That informed the versioned recipe and batch snapshot. Its EBR material describes guided electronic execution and focused exception review. These are functional patterns, not a claim that this application duplicates proprietary PAS-X behavior or interfaces.

- [Körber: MBR design](https://www.koerber.com/en/insights-and-events/mbr-design-successful-mes-implementation)
- [Körber: electronic batch recording](https://www.koerber.com/en/insights-and-events/electronic-batch-recording-efficiency)

The PAS-X dispensing material emphasizes weighing operations, scale readiness, documentation and labels. The configurator therefore makes lot eligibility, gross-dose calculation, tolerances, witness identity and recorded consumption visible together. Scale communication and label printing remain integration requirements.

- [Körber: weighing and material dispensing](https://www.koerber.com/en/solutions/software-and-ai/life-sciences-mes/digital-manufacturing/weighing-and-material-dispensing)

Siemens provides a useful breadth check: its Pharma scope spans MBR design, material flow, weighing, equipment, packaging, EBR and enterprise/automation integration. This supported a twelve-domain design catalog rather than reducing MES to electronic instructions. The public description does not establish identical availability in every release, license or deployment.

- [Siemens: Opcenter Execution Pharma](https://www.siemens.com/en-gb/campaigns/pharma-industry-opcenter-execution/)

Körber's cell-therapy material distinguishes identity and custody. The cell-therapy reference consequently has a patient token and custody instruction; a wrong patient token blocks its entry check. It does not apply this rule to an oral-solution batch. Emerson's current life-sciences overview provides another MES reference, but was not used to infer a detailed proprietary feature matrix.

- [Körber: cell and gene therapy](https://www.koerber.com/en/insights-and-events/mes-for-cell-gene-therapy)
- [Emerson: life-sciences automation and DeltaV MES](https://www.emerson.com/en/automation-systems/automation-systems-for-life-sciences)

Regulatory sources inform the implementation questions, not a compliance badge. The European Commission's Volume 4 page identifies its published GMP annexes, including Annex 1 and Annex 11; its 2025 consultation material must not be confused with an effective replacement. FDA's Part 11 guidance discusses scope and application. Actual applicability, validation and release authority require a site-specific assessment.

- [European Commission: EudraLex Volume 4](https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en)
- [European Commission: 2025 consultation](https://health.ec.europa.eu/consultations/stakeholders-consultation-eudralex-volume-4-good-manufacturing-practice-guidelines-chapter-4-annex_en)
- [FDA: Part 11 scope and application](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application)

No vendor marketing performance percentages were used as model inputs or acceptance targets.

## Product design

The workspace has a single scrolling surface, contextual editing, a named reference batch and a persistent route. Configuration and execution are separate: a design change marks the recipe draft and affects new batches and tests; existing batch records retain their original rules, instructions and specifications.

The lifecycle is **define → prepare → execute → review**. The twelve views are:

| View | Primary representation | User can do |
|---|---|---|
| Design overview | Batch purpose, lifecycle and active controls | Choose the reference process and enter a working trial |
| Master batch record | Ordered instructions and time projection | Edit names/durations, add verification blocks, reorder within dependencies, approve a design |
| Materials & dispensing | Incoming lot and dose balance | Configure status, expiry, potency, quantity, tolerance and material gates |
| Equipment & people | Asset/operator readiness | Configure clean/calibrated states, qualifications and independent verification |
| Process & packaging | Limits, hold window and output balance | Change batch size, nominal dose, specifications, hold and yield controls |
| Run a batch | Live EBR progression and next-step panel | Enter measurements, record evidence, inject conditions, advance time and release through a simulated QA role |
| Exceptions & release | Focused exception queue | Record investigation rationale, inspect full evidence and return to a blocked batch |
| Batch genealogy | Material → batch → output | Inspect consumption, equipment, people, recipe revision and history |
| System handoffs | Object-level contracts and message list | Capture ownership/mode/key/retry policy, link a local APS order, export trial messages |
| Test the design | Fault trial and expected/observed outcomes | Compare current rules against a saved result and inspect the stopping point |
| Deployment & rollout | Pilot operating model and capability matrix | Capture site/hosting/owner/recovery/rollout requirements and export the design |
| Research & coverage | Primary sources and implementation boundaries | Inspect the basis and scope of the model |

## Five authored reference processes

All quantities, durations, parameter ranges and routes are illustrative engineering examples, not product specifications or manufacturing instructions.

| Process | Distinguishing case behavior |
|---|---|
| Oral solution | Active-mass potency correction, compounding temperature, assay and liquid-volume reconciliation |
| Sterile fill-finish | Sterile-path instruction, filtration pressure, fill-volume IPC, vial reconciliation and hold-time risk |
| Biologics drug substance | Single-use assembly, media preparation, culture duration/temperature, viability and transfer |
| Autologous cell therapy | Patient identity gate, custody transfer, viability and single-dose output |
| Small-molecule API | Starting-material dispensing, reaction temperature, purity and mass reconciliation |

Potency correction defaults on for the oral/API examples and off for the volume/starting-material examples. Detailed aseptic interventions, EM trends, filter integrity results, upstream control loops and clinical logistics are captured as requirements, not silently simulated.

## Executable semantics

- A batch starts only from an approved design. Creation copies the recipe, policy, specification, lot, equipment and people into that trial.
- Added verification blocks can move after their clearance dependency. Core instructions cannot move across their predecessors. Execution is sequential; the timeline displays recorded and projected intervals, including user-added waits.
- Lot release and expiry gates, potency-adjusted target, quantity availability and tolerance apply before consumption. Failed attempts do not decrease stock. A successful dispense decreases the trial lot once.
- Resource clean/calibration state and operator qualification gate production steps. The dispense witness must differ from the operator when enabled.
- Process and sample readings are checked against the batch's frozen specification. Corrected readings do not delete exceptions.
- Hold time is measured from processing completion to the start of filling, including the intervening sample duration and additional clock advances.
- Good output, rejected quantity and documented loss must sum to the configured batch quantity. Minimum yield is a separate rule.
- An exception review records a rationale. It does not waive an execution gate or fabricate missing evidence.
- QA release requires the recipe to have reached review, all exceptions resolved, and selection of the simulated QA role. Released records cannot be edited through the execution UI.
- Batch and event exports retain configuration revision and linked APS source metadata. The outbound messages include evidence payloads. No messages are transmitted to external systems.

The lot balance belongs to an isolated trial. Two batches do not compete for shared inventory or equipment in this model. Cross-batch reservation and dispatch sequencing remain APS/integration work.

## Integration boundary

The existing capability selector now includes Life sciences MES. The implementation header links directly to its workspace; selecting the capability adds an MES card to the map. Existing APS/MRP/quality screens remain available.

The MES can read the first order from the saved local APS scenario and retain its order ID, scenario and revision on subsequent MES batches. This is an explicit reference-recipe linkage, not automatic product/routing/material equivalence. ERP, APS, PLM, LIMS, QMS and automation contracts are captured separately. MES step events, laboratory result examples, deviation events and release disposition can be exported as local message envelopes for discussion or adapter development.

There is no vendor connector, authenticated electronic signature, production data historian, regulatory retention store, secure audit repository, multiuser service or validated deployment. The public-source research does not grant access to PAS-X APIs. Browser history is intentionally described as a demonstration record.

## Verification

The model tests cover all five clean/fault scenarios; policy-dependent results; draft/approval behavior; frozen recipe and specification snapshots; potency and one-time consumption; expiry and independent witnessing; retained failures; QA role and exception requirements; hold time; reconciliation; patient identity; unique event identities; invalid dependencies; and changed quantitative definitions.

Browser verification exercised a failed dispense, corrected measurement, retained exception, simulated QA investigation, operator-role release rejection, successful QA release and persistence after reload. The review also checks navigation, reference-process switching, recipe verification insertion, and the integration entry point. Full production validation and user acceptance are separate activities.
