# QMS shortlist — Northworks Pharma

Reviewed 8 September 2026. Four established providers relevant to a life-sciences enterprise QMS evaluation; this is not a verified market-share ranking. Sources describe vendor offerings, not guaranteed fit, cost, validation status or connector compatibility for this project.

## Veeva QMS

Published quality workflows connect deviations, investigations, root causes, CAPAs and change controls.

**Ask to see:** Demonstrate an MES deviation linked to laboratory evidence, controlled documents and training; identify any separate applications or licenses.

[Official evidence](https://quality.veevavault.help/en/lr/34814).

## TrackWise Digital

Life-sciences quality suite with manufacturing quality, supplier collaboration and risk-management capabilities.

**Ask to see:** Show cross-site containment, investigation ownership and the supported SAP/MES/LIMS integration approach.

[Official evidence](https://www.spartasystems.com/manufacturing-quality/).

## MasterControl Quality Excellence

Pharmaceutical offering covers document and change control, training, audits and CAPA.

**Ask to see:** Follow a recurring dispensing issue through CAPA, revised instructions, training and effectiveness evidence.

[Official evidence](https://www.mastercontrol.com/industries/pharma/).

## ETQ Reliance

Enterprise quality platform with published life-sciences laboratory-investigation and quality-event capabilities.

**Ask to see:** Demonstrate OOS investigation links, affected-lot scope and controlled closure using the current offered configuration.

[Official evidence](https://www.etq.com/app/uploads/2022/01/ETQ-Lab-Investigation-data-sheet.pdf).

## Proposed ownership

| Object or decision | Owner in this example |
| --- | --- |
| Process order and manufacturing status | SAP PP-PI |
| Execution evidence and immediate execution gates | MES |
| Sample, method, result and laboratory review | LIMS |
| Cross-functional quality event, investigation, CAPA and change control | Enterprise QMS |
| Inspection, usage-decision and stock transactions | Configured SAP QM / inventory processes |
| Batch disposition authority | Authorized site quality role, with the controlling application explicitly agreed |
| Schedule and supply response | APS and MPS consume confirmed restrictions and availability |

Enterprise QMS and SAP QM can overlap. Agree authority per object and action rather than making both independently release the same lot. Do not confuse either quality scope with SAP PP-PI or integration middleware.

## Common vendor acceptance demonstration

1. **Intake:** Link the MES blocked 12 kg dispensing attempt to a quality event, preserving source event, order, batch, recipe version and corrected attempt. Retrying the intake must not create a second investigation.
2. **Triage:** Determine the actual event and affected scope. A prevented input error is not automatically proof that incorrect material was physically charged. Apply the site's escalation and risk criteria.
3. **Containment:** Identify potentially affected lots, equipment, orders and sites from evidence. Track confirmation of holds in MES/SAP and communicate restrictions to APS.
4. **Laboratory investigation:** Link an OOS record from LIMS without overwriting its raw result or assuming a later passing result invalidates it. Assign laboratory and manufacturing investigation responsibilities.
5. **Root cause:** Evaluate evidence and related events; record an approved conclusion with rationale. Do not pre-label every deviation as operator error.
6. **Disposition:** Demonstrate an authorized batch decision supported by the applicable evidence. Keep batch disposition, investigation closure and CAPA closure as distinct milestones under site policy.
7. **CAPA:** Where justified by the investigation, define actions, owners, due dates and an effectiveness criterion. Immediate correction and long-term recurrence prevention are separate records.
8. **Change and training:** Approve instruction or configuration changes; identify impacted SAP recipe/production-version references, MES MBRs and LIMS methods. Address effectivity, existing batches and training readiness before use.
9. **Effectiveness:** Review evidence over an agreed observation period and reopen or escalate an ineffective action. Completed tasks alone do not establish effectiveness.
10. **Broader scope:** Demonstrate supplier quality, audit findings, complaints, document control, training, periodic trends and external-party collaboration. Confirm which modules are included.
11. **Interface failure:** Reject a hold/disposition message downstream, show unresolved reconciliation, retry without duplicate effects, and preserve later supersession.
12. **Acceptance:** Show permissions, signatures, audit evidence, migrations and recovery in the proposed deployment; define site-specific validation responsibilities.

These are proposed acceptance cases, not statements that each vendor implements every step without configuration. No actual batch disposition is advised by this synthetic demonstration.

## Current configurator boundary

The QMS design screen captures requirements and ownership. The Dosing kit QMS trial models hold/reject/release with a passing reviewed LIMS gate and retains owner/action text. It does not enforce investigation completeness, signatures, CAPA effectiveness, training or audit history. The oral-solution MES separately retains execution exceptions and simulated QA review. Neither is connected to an enterprise QMS or SAP.

## Demonstration approach

Keep the main walkthrough vendor-neutral and use the same dispensing exception and laboratory failure throughout. Compare all four providers against this case instead of assigning unsupported connector capabilities to one vendor.
