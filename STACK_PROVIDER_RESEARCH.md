# Wider software stack — Northworks Pharma

Official product references reviewed 8 September 2026. These are relevant provider examples, not a market ranking, a procurement recommendation or a claim that interfaces are installed.

## CRM

**Role:** Customer intent → demand review.

For the oral-solution plant, a distributor requests additional volume next quarter. Sales records the opportunity, confidence and requested date. Planning reconciles this with firm ERP orders to avoid counting demand twice.

**Implementation contract:** Customer/product mapping, forecast version, probability, units and order reconciliation. A sales opportunity is not a production order.

Provider references: [Salesforce Manufacturing Cloud](https://trailhead.salesforce.com/content/learn/modules/manufacturing-cloud-basics/track-sales-with-agreement-terms); [Microsoft Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/configure-forecast).

## S&OP

**Role:** Demand + supply + finance → agreed plan.

Compare the added demand with production capacity, laboratory turnaround and stock policy. Agree the business response before translating it into MPS quantities and APS work.

**Implementation contract:** Approval owner, planning grain, financial assumptions, scenario version and exception cadence. S&OP is a process; it need not be a separate software purchase.

Provider references: [SAP IBP](https://www.sap.com/uk/products/scm/integrated-business-planning/features/sales-and-operations-planning.html); [Kinaxis Maestro](https://www.kinaxis.com/en/solutions/sales-and-operations-planning?language=en).

## PLM / product definition

**Role:** Approved product revision → site implementation.

A formulation or packaging change needs approved specifications and effectivity. Map that definition into the SAP BOM/master recipe, MES master batch record and LIMS methods without treating them as one interchangeable document.

**Implementation contract:** Change identity, approved revision, plant/date/lot effectivity and downstream acknowledgments. Evaluate formulation/specification coverage separately from mechanical BOM management.

Provider references: [Siemens Teamcenter / Opcenter RD&L](https://www.siemens.com/en-us/solutions/product-formulation/); [Dassault Systèmes BIOVIA](https://www.3ds.com/products/biovia/all-products).

## Data historian

**Role:** Timestamped process values → contextual evidence.

Retrieve temperature, agitation and tank-level history for the batch phase. Preserve source quality, units and timestamps; relate the time window to the MES order and phase. Investigators can then inspect what the process recorded.

**Implementation contract:** Tag-to-equipment mapping, sampling/compression, clock alignment, missing data, retention and batch context. A historian is not the control system, a reviewed laboratory result or an electronic batch record.

Provider references: [AVEVA PI System](https://www.aveva.com/en/products/aveva-pi-system/); [Aspen InfoPlus.21](https://www.aspentech.com/en/products/msc/aspen-infoplus21?src=email-global-nonrspnd).

## Connections, not a single chain

CRM informs demand planning and S&OP; ERP order history is reconciled alongside it. S&OP agrees a plan, MPS translates supply by product/site/period, and APS tests the detailed schedule. SAP PP-PI owns the process order in this proposed design. MES executes the batch; LIMS provides reviewed laboratory evidence; QMS coordinates quality events and actions. Product-definition changes and historian evidence support multiple parts of this network.

AVEVA PI System and SAP PP-PI are unrelated product names. Historian collection does not itself authorize batch release. Controllers remain responsible for process control.

## Demonstration boundaries

Existing PLM and S&OP design pages record contracts; their worked trials share the separate Dosing kit case. CRM and historian stops are narrated contracts in the stack overview, with no live CRM or historian runtime. No automatic reconciliation into MPS, APS or the oral-solution MES is implied.

## Customer acceptance cases

- Convert the distributor opportunity to a firm order without duplicating planned demand.
- Reject a stale S&OP revision at the downstream handoff; preserve the accepted scenario and approver.
- Apply a new product revision from the agreed effectivity point without silently replacing an executing MES batch snapshot.
- Retrieve historian data for the correct equipment/phase; identify a clock offset, a missing interval and a bad-quality value.
- Keep a historian excursion, LIMS result and QMS investigation linked but distinguish their authority.
