# MRP, S&OP, QMS, LIMS and PLM extension

The implementation map now contains 13 areas and 46 screens. The five new capabilities can be selected independently in Scope and opened directly from their scope cards. Existing APS and implementation decisions remain intact.

## Connected worked model

- S&OP: one monthly demand/supply/stock balance, visible unmet demand, explicit trial approval.
- PLM: approved A/B BOM revision with week-based effectivity and component usage.
- LIMS: completed sample result against lower and upper specification limits.
- QMS: hold/reject/release disposition, investigation owner and corrective-action record. Release requires passing completed laboratory evidence; unavailable stock is excluded from MRP.
- MRP: gross-to-net explosion, usable stock and firm receipts, safety stock, lot rounding and lead-time offset. Past-due release is flagged. An enabled but unapproved S&OP plan blocks proposals.

The shared synthetic case is a dosing kit and a component lot. Each screen recalculates from the same persisted project inputs. Module selection is independent from the original APS scope choice. New selected modules appear in the validation review worklist. Reviews use the existing owner/source/rationale mechanism; all inputs are retained in the implementation record. A connected trial export contains all five input sets and their calculated results.

## Verification

27 automated tests pass, including seven new tests for netting, approval blocking, revision effectivity, stock exclusion, laboratory gating, late release and input immutability. All five screens and their Next navigation were inspected in the running app. A resume-time initialization error found during navigation was corrected by waiting for extension registration.

## Scope of this extension

These are initial working slices, not complete enterprise products. The example uses one product, one component, one laboratory test and one planning bucket. It does not implement full multilevel MRP, multibucket S&OP/financial reconciliation, CAD/document management, instrument integration, electronic signatures or a production CAPA workflow. Planned MRP orders do not automatically create APS operations or external purchase orders. These boundaries are stated in the screens and the trial export.

## Unified scope revision

Replaced the bolt-on capability panel and old scope cards with a single eight-capability catalog grouped by business purpose. The unrelated industry example is removed from Scope. The original selections are read through one adapter, so existing projects migrate without losing their inputs. Selection drives area visibility, applicable shared-data screens, Next/Back navigation, validation requirements and APS entry-point visibility. Unselected upstream domains are external interfaces, not silently selected dependencies.

Each new domain has a configuration screen before its trial: required behavior, owner, system of record, upstream/downstream contracts, cadence and acceptance case. These records travel in the implementation export. Fifty-one screens are available; only applicable screens are included in a project's journey.

Verification: 31 automated tests pass. Browser testing exercised a QMS-only journey, its external LIMS interface and configuration form, then restored the original APS-only selection. No errors appeared in the inspected latest-version flows.
