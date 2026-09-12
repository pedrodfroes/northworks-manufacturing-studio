# Presenter script — implementing SAP PP-PI, MPS, APS life-sciences MES, LIMS and QMS

A continuous walkthrough of the current Northworks configurator, using an oral-solution manufacturer as the customer.

**Audience:** manufacturing, planning, quality and implementation stakeholders.  
**Full walkthrough:** approximately 55–80 minutes, including clicks and discussion.  
**Short walkthrough:** use the screens marked **Core**; approximately 36–45 minutes.  
**Terminology:** MPS means Master Production Schedule. In this application its configuration screens are called **Master planning**. MRP and S&OP are separate capabilities.

## SAP ownership in this example

This is the proposed Northworks Pharma implementation, not a claim that every SAP/MES deployment has the same ownership.

| Responsibility | Owner in this story |
| --- | --- |
| Manufacturing master data and process orders | SAP PP-PI, using material/BOM data and production versions |
| Finished-product supply plan | MPS planning function; may run within SAP |
| Detailed resource sequence and proposed dates | APS; accepted changes reconcile with SAP order status |
| Detailed instructions and executed batch evidence | MES; approved MBR mapped to the SAP recipe/order |
| Laboratory sample, test and reviewed-result lifecycle | LIMS; named reference LabWare, subject to vendor evaluation |
| Inventory postings and quality/stock status | Agreed SAP inventory/quality processes, reconciled with MES evidence |

SAP PP-PI means **Production Planning for Process Industries**, not SAP Process Integration middleware. SAP master recipe, order-specific control recipe, MES master batch record and executed batch record are distinct objects. The script describes their intended mapping.

SAP stops revisit relevant configurator screens for narration. They do not open SAP screens, create SAP orders or demonstrate a live connector.

## LIMS extension

See the [provider shortlist](https://pedrodfroes.github.io/northworks-manufacturing-studio/lims-providers.html) and [research / vendor acceptance cases](LIMS_PROVIDER_RESEARCH.md). The oral-solution story now includes laboratory contracts. Its live assay illustration uses the separate **Dosing kit / LOT-001** trial: enable LIMS and QMS, set 95–105% limits, show 98% pending/completed review, then 94% and a blocked QMS release. It does not update the MES batch or connect to a vendor. Broader sample, instrument and laboratory scheduling workflows are design requirements.

## QMS extension

Use the [QMS shortlist](https://pedrodfroes.github.io/northworks-manufacturing-studio/qms-providers.html) and [research / vendor acceptance case](QMS_PROVIDER_RESEARCH.md). Follow the existing blocked dispensing attempt into a proposed quality-event lifecycle. Preserve the distinction between a prevented entry error and physical material impact. QMS design stops describe investigation, containment, CAPA, change, training and effectiveness; they do not claim an executable enterprise QMS. The Dosing kit disposition trial and MES exceptions remain separate local examples.

## Wider stack

The [software stack overview](https://pedrodfroes.github.io/northworks-manufacturing-studio/software-stack.html) and [provider research](STACK_PROVIDER_RESEARCH.md) cover CRM, S&OP, PLM and the historian. Enable S&OP and PLM to use their existing screens. CRM and historian are narrated external-system contracts. Distinguish the Dosing kit PLM/S&OP trials from the oral-solution MES example; do not imply automatic data transfer.

## Before presenting

- Open the implementation map at https://pedrodfroes.github.io/northworks-manufacturing-studio/ and the MES at https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html in separate tabs.
- Select **Master planning**, **APS**, **Life sciences MES**, **Dispatch & execution**, **LIMS** and **QMS**. Keep unrelated capabilities out of this demonstration unless the audience asks.
- Use **Liquid medicine** as the implementation/APS reference and **Oral solution** in MES. Describe the customer as a hypothetical plant, **Northworks Pharma**.
- Use 16 working hours from 06:00, one available filling specialist, a liquid buffer of 250 L and an order volume of 100 L for the APS exercise. Ensure **Volume storage is present** so the liquid axis is enabled.
- Keep the normal MES oral-solution recipe for the main demonstration: 1,000 L batch; 10 kg nominal active; 98% potency; 1% dispensing tolerance; 18–25 °C process range; 95–105% assay; 240-minute hold; 95% minimum yield. Added verification blocks increase its step count and duration, so read actual totals from the screen.
- Prepare the MES failure: enter **12 kg** at dispensing, record the blocked attempt, then correct it to **10.204 kg**. Keep the exception open until the QA review screen.
- Have a saved APS scenario available for the MES **System handoffs** demonstration. Linking it copies the first order's identity/revision into subsequent MES trials; it does not transfer recipe quantities.
- The examples are synthetic. MPS arithmetic currently uses demand **100**, opening stock **20**, and lot multiple **25**. APS generates **12 sample orders**. MES executes **one reference batch**. Do not claim these are already one automatically reconciled quantity chain.
- Use the app's area navigation or the presenter links to move between areas. Do not click every Next button if it takes you away from this demonstration sequence.
- If an embedded topic opens blank, reopen its direct configuration URL, shown in the presenter. Do not narrate a blank workspace as a completed design.

## Opening line

“Today we are implementing SAP PP-PI, planning and manufacturing execution for an oral-solution plant. We need to decide how much to make, find a workable production sequence, and capture the evidence needed to release each batch. I’ll use the configurator to make those decisions visible, then challenge the resulting models.”

## How to read this script

**Do** is the presenter action. **Say** is the text to speak. **Check** identifies the evidence to point at or the boundary to retain. The spoken paragraphs are written to follow each other without additional explanation.

## 01. Opening — Implementation map · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html)

**Do:** Point to the implementation areas and the APS/MES entry points.

**Say:**

> Start with the whole business: CRM contributes customer demand, S&OP agrees the business plan, MPS translates supply and APS tests the sequence. SAP PP-PI holds the process order; MES executes it, LIMS supplies laboratory evidence and QMS manages quality issues. PLM controls product definitions, while the historian preserves contextual process data.

**Check:** MPS is a planning function that may run within SAP; it is not necessarily a separate application.

## 02. Foundation — Welcome · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/welcome)

**Do:** Show the purpose of the configurator briefly.

**Say:**

> Our first job is to describe the operation and agree what the implementation must support. The working examples help us test those choices before we turn them into customer-specific configuration and interfaces.

**Check:** Keep this screen brief; the demonstration is about decisions and consequences.

## 03. Foundation — Implementation intent · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/scope)

**Do:** Select Master planning, APS, Life sciences MES, Dispatch & execution, LIMS and QMS. Include S&OP and PLM; capture CRM and historian as external-system contracts in the landscape.

**Say:**

> Our scope includes the production plan, finite scheduling, controlled execution and the laboratory evidence needed for quality decisions. We include LIMS and the QMS handoff explicitly. SAP PP-PI remains the process-order backbone; laboratory and batch-release responsibilities must also be agreed.

**Check:** Selecting scope records a requirement; it does not establish a live connection.

## 04. Foundation — Application ownership · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/architecture)

**Do:** Point to the capabilities carried forward from Project scope. Assign an application, an existing/new choice and an accountable owner for each responsibility; review assignments individually.

**Say:**

> We already decided what this project must support. Now we decide which actual application owns each responsibility and which team is accountable. The same application can serve several capabilities. ERP, CRM, historians and other supporting systems can be recorded as connections without changing the selected scope.

**Check:** This is the proposed customer architecture. The configurator has no live SAP connection. SAP PP-PI is not SAP Process Integration middleware. Enterprise QMS and SAP QM are distinct scopes with possible overlap; agree authority per quality decision.

## 05. Foundation — Stack responsibilities · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/software-stack.html)

**Do:** Use the three relationship bands to orient the audience.

**Say:**

> The stack is a network, not one long conveyor belt. Product changes affect planning, manufacturing and testing. Process evidence supports execution review and investigations. This overview explains the responsibilities; the implementation map organizes the work needed to configure them.

**Check:** Arrows are proposed handoffs, not installed interfaces.

## 06. LIMS — Provider shortlist · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/lims-providers.html)

**Do:** Show the four providers and open LabWare's integration evidence.

**Say:**

> We are evaluating LabWare, LabVantage, SampleManager and STARLIMS for manufacturing QC. For this story, LabWare is the reference because Körber describes its PAS-X sample and result exchange. That gives us a concrete handoff to examine; selection still depends on the customer's methods, instruments and supported software versions.

**Check:** This is an evidence-backed shortlist, not a numerical market ranking or an approved vendor selection.

## 07. QMS — QMS provider shortlist · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/qms-providers.html)

**Do:** Compare the four QMS providers against the same manufacturing and laboratory case.

**Say:**

> Our QMS shortlist is Veeva, TrackWise Digital, MasterControl and ETQ Reliance. We ask each to follow the same event from source evidence through investigation, action and effectiveness. Their published scope helps frame the evaluation; the actual modules and interfaces need a customer-specific demonstration.

**Check:** A relevant shortlist, not a market ranking. No vendor integration has been selected or built.

## 08. Foundation — Industry context · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/industry)

**Do:** Choose the appropriate pharmaceutical context and Liquid medicine reference.

**Say:**

> This plant makes oral solutions, so lot status, recipe revision, liquid handling and cleaning matter. We choose an industry context to bring those questions forward, then verify them against the actual process. The industry label itself does not configure the factory.

**Check:** Use Liquid medicine consistently in the reference selector.

## 09. Foundation — Archetype · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/archetype)

**Do:** Describe batch compounding followed by filling; choose the matching available patterns.

**Say:**

> Our process is batch-oriented upstream and line-oriented at filling. That combination matters: a vessel can finish making liquid while the filling line is still unavailable. We need the model to preserve the relationship between those stages.

**Check:** Do not describe compounding and filling as interchangeable resources.

## 10. Foundation — Dialect · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/dialect)

**Do:** Point to the ERP terminology mapping.

**Say:**

> Here the SAP business document is a process order. Its operations and phases describe the manufacturing work; the material batch identifies the stock being produced or consumed. We keep those identities distinct and map the APS operations and MES execution records back to them.

**Check:** A process order, material batch and MES batch record are distinct objects; do not assume their identifiers are interchangeable.

## 11. Foundation — Migration · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/migration)

**Do:** Show current/target systems and the migration disclosure.

**Say:**

> If the ERP or MES is changing during the project, we must preserve order identity, recipe versions and ownership through cutover. This screen captures coexistence and recovery decisions. A migration milestone is an integration dependency, not evidence that the manufacturing model works.

**Check:** If migration is not relevant, record that and move on.

## 12. CRM — CRM — demand without double counting · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/software-stack.html#crm)

**Do:** Use the distributor request as the start of the customer scenario.

**Say:**

> A distributor asks for additional oral solution next quarter. Sales records the opportunity, confidence and requested date. We reconcile it with existing forecasts and firm ERP orders before planning supply. When the opportunity becomes an order, we must not count the same demand twice.

**Check:** This is a narrated CRM contract. No opportunity is created in Salesforce or Dynamics.

## 13. S&OP — S&OP — agree the business response · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/sop-design)

**Do:** Capture demand ownership, capacity tradeoffs, approval and the downstream plan version.

**Say:**

> Sales, operations and finance compare the demand increase with capacity, inventory and financial assumptions. S&OP agrees the response and its unresolved risks. MPS will translate that approved direction into product and site requirements; APS will test the operational sequence.

**Check:** The form captures requirements. Financial reconciliation and automatic MPS transfer are not implemented.

## 14. S&OP — S&OP — test the supply gap · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/sop)

**Do:** Explain the separate Dosing kit example. Set demand 1200, capacity 1000 and opening stock 100; show the remaining shortfall.

**Say:**

> This teaching bucket has demand of 1,200 and 100 already in stock. Capacity allows 1,000 more, leaving 100 uncovered. Approving the feasible volume does not eliminate that gap. The business must decide how to address it.

**Check:** This trial can pass approved supply to its MRP example, not automatically to the MPS/APS/MES scenarios. Units are synthetic.

## 15. MPS — Master purpose · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/master-purpose)

**Do:** Choose a finished-product/site planning grain and the relevant demand and supply inputs. Show the calculated weekly example.

**Say:**

> MPS answers what finished goods we plan to make by period. The example has demand of 100 units and opening stock of 20, leaving 80. In our proposed SAP landscape, that supply requirement feeds the planning and order-creation process. It is not yet an instruction to start a batch.

**Check:** The on-screen example is a generic quantity bucket. Do not relabel its units as liters.

## 16. MPS — Master policies · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/master-policy)

**Do:** Show the lot multiple of 25, then change it to 20 and restore 25.

**Say:**

> Our replenishment policy changes the answer. With a multiple of 25, the 80-unit shortage becomes a planned receipt of 100 and closing stock of 20. With a multiple of 20, we can plan exactly 80 and close at zero. That is the inventory consequence of a policy choice.

**Check:** At 25: 20 + 100 − 100 = 20. At 20: 20 + 80 − 100 = 0.

## 17. MPS — Master handoff · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/master-handoff)

**Do:** Select the intended handoff outputs and inspect interface details.

**Say:**

> The master plan hands over product, plant, quantity and required date. For our SAP design, we distinguish a planned order from an executable process order and retain their relationship when supply is converted. We must agree when APS schedules each type and when an accepted plan becomes released work.

**Check:** This is the intended contract. The MPS teaching bucket does not create SAP planned orders or automatically populate APS.

## 18. Plant — Capacity basics · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/calendar-gantt-intro)

**Do:** Compare Reference and Current trial.

**Say:**

> A resource only contributes capacity while it is available. This comparison keeps the orders and routes fixed while changing the working window. We can see whether the same work now needs another day.

**Check:** Read the displayed comparison; do not promise a fixed number of delayed orders.

## 19. Plant — Calendars & capacity · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/calendar)

**Do:** Set Daily working hours from 06:00 to 16; point to hierarchy and exceptions below.

**Say:**

> For the reference run we have two shifts, giving sixteen working hours from six in the morning. The implementation also needs holidays, maintenance and resource-specific exceptions. The current executable example applies the daily working window; the richer calendar hierarchy remains a design requirement.

**Check:** Distinguish applied hours from selected calendar categories.

## 20. Plant — Capacity preview · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/calendar-gantt-preview)

**Do:** Show the current trial and its changed completion times.

**Say:**

> Here is the consequence of that working window. The useful evidence is the displaced work and affected promises, not simply the number of shifts selected. We will keep this same logic when we work directly on the APS board.

**Check:** Use the displayed metrics rather than memorized values.

## 21. Plant — Bottleneck basics · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/bottleneck-intro)

**Do:** Point at the load and affected-order information.

**Say:**

> A busy resource is a bottleneck candidate. To decide whether it actually limits delivery, we look at the orders passing through it and the time window in which they are waiting. High utilization on its own does not prove that adding capacity helps.

**Check:** Avoid calling every full row a demonstrated bottleneck.

## 22. Plant — Bottleneck · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/constraint)

**Do:** Capture a filling-stage constraint hypothesis for the example.

**Say:**

> Our initial hypothesis is that filling limits the flow at certain points in the week. We record that as a hypothesis to test, not a permanent label. A material hold or a missing specialist could become the real constraint in another scenario.

**Check:** Tie the hypothesis to a resource, time window and order consequence.

## 23. Plant — Bottleneck preview · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/bottleneck-preview)

**Do:** Compare the named assets and late orders using them.

**Say:**

> This view lets us examine the hypothesis against the same orders. We look for the binding period and the delivery consequence, then decide whether to change capacity, sequence or release timing. That is more useful than optimizing a utilization percentage in isolation.

**Check:** If no orders are late, say that this trial does not demonstrate a delivery bottleneck.

## 24. Plant — Department taxonomy · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/areas)

**Do:** Show production, warehouse, quality and supporting areas as applicable.

**Say:**

> We need to place the manufacturing objects in a recognizable organization. Compounding, filling, material staging and quality support have different responsibilities. The taxonomy is the structure for those records; the project still needs actual sites, areas and owners.

**Check:** Do not equate a taxonomy category with a fully configured department.

## 25. Plant — Resource taxonomy · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/workcenters)

**Do:** Show Compounding vessel, Reserve vessel, Bottle filler and Alternate filler.

**Say:**

> These are the named assets that appear in the scheduling case. We distinguish the primary equipment that holds an operation from secondary resources such as people and tools. Eligibility determines where a job can run; availability determines when.

**Check:** Resource names entered here carry into the reference scenario.

## 26. Product — Classification · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/attr-classification)

**Do:** Point to product family and its planning effect.

**Say:**

> Product family is more than a reporting label when it drives cleaning. We use classification to identify which products can share a campaign and which transitions require extra work. Other classification fields may remain descriptive.

**Check:** A/B/C are sample families, not validated customer product categories.

## 27. Product — Descriptive · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/attr-descriptor)

**Do:** Show the representative product description.

**Say:**

> Operators and planners should recognize what they are handling. Descriptions and identifiers improve selection, search and labels, but we do not treat every descriptive field as a scheduling constraint. We make that distinction explicit.

**Check:** Avoid claiming a description changes schedule timing.

## 28. Product — Planning fields · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/attr-planning)

**Do:** Point to the editable compounding and filling durations.

**Say:**

> This is where a product record begins to affect the schedule. The current case uses explicit processing durations for compounding and filling. A customer implementation would derive those from rates, quantities and setup rules where appropriate; we should not hide an assumed duration behind a product name.

**Check:** The reference duration does not automatically scale with order quantity.

## 29. Product — Variants · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/attr-variant)

**Do:** Show the available product-option attributes.

**Say:**

> A different strength, pack size or presentation can change materials, instructions or equipment eligibility. We capture those product options here. Later, when we save a planning scenario, that is a different kind of alternative: a different plan for the same operational model.

**Check:** Distinguish product options from planning scenarios.

## 30. Product — Batch / serial · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/attr-batchSerial)

**Do:** Point to the representative lot identity.

**Say:**

> The batch is the thread that connects material consumption, production evidence and disposition. Planning may need lot eligibility; MES needs to preserve exactly which lot was used. We will inspect that genealogy in the executable batch example.

**Check:** The APS attribute screen alone does not enforce expiry or complete genealogy.

## 31. Product — Quality params · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/attr-quality)

**Do:** Show the selected quality/process fields.

**Say:**

> A quality parameter can be a measured value, a specification limit or a release restriction. Those are different objects. In MES we will demonstrate a measurement against a limit and show why passing a test still does not, by itself, release a batch. We will associate the approved method and specification version with the sample, rather than treating a number alone as evidence.

**Check:** Keep laboratory evidence separate from final release authority.

## 32. Product — BOM profile · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/bom)

**Do:** Show the reference parent/component structure and consumption point.

**Say:**

> In SAP PP-PI, the production version connects the applicable alternative BOM and master recipe. For our oral solution, we check the date, lot-size range, ingredients and phase assignments before creating the process order. MES needs a compatible approved instruction version, with a deliberate mapping between the two.

**Check:** The reference BOM is illustrative. No SAP production-version selection or recipe download is executed here.

## 33. PLM — PLM — approved product definition · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/plm-design)

**Do:** Capture change ownership, effectivity and downstream product-definition references.

**Say:**

> A formulation or packaging revision changes what we intend to make. PLM or the agreed product-definition system controls that approved change. We map it to the SAP BOM and recipe, MES master record and LIMS specification, with acknowledgments and an effectivity decision for each consumer.

**Check:** Formulation management and mechanical engineering PLM are different evaluation needs. These mappings are not live.

## 34. PLM — PLM — revision effectivity trial · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/plm)

**Do:** Use the separate Dosing kit case: revision B, effective week 2, component quantities A=2 and B=3. Read the requirement week shown.

**Say:**

> The applicable revision changes the component requirement. This example uses two components per product under revision A and three under B. The effective week determines when B applies; a newer revision does not automatically rewrite all existing requirements or executing batches.

**Check:** This single-level trial affects its linked MRP case, not SAP master data or the oral-solution batch.

## 35. SAP PP-PI — Recipe and order identity · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/bom)

**Do:** Stay on BOM profile. Explain the proposed SAP mapping against the visible reference formulation.

**Say:**

> For the intended customer test, take one 1,000-liter oral-solution order. Record its SAP material, plant, production version, master-recipe identity and BOM alternative, then identify the compatible MES master record. These are the references we must reconcile before the operator starts; changing a version needs a controlled decision.

**Check:** The 1,000 L matches the MES reference batch only. The MPS and APS sample quantities are still independent. These SAP fields are talking points, not populated SAP records on this screen.

## 36. Product — Critical supplies · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/supplies)

**Do:** Show the receipt time for the material linked to the first order.

**Say:**

> This material receipt is a real gate in the scheduling example. If I move its availability later, the consuming operation must wait. The broader supply policy—stock allocation, substitutes and shelf life—still needs explicit implementation beyond this timing example.

**Check:** Only the explicitly linked reference material/order relationship is enforced.

## 37. Constraints — Tank basics · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/tank-intro)

**Do:** Point to the rising and falling liquid profile.

**Say:**

> Making liquid and consuming liquid occur over time. The curve rises while compounding produces material and falls while filling consumes it. That tells us something a machine-only Gantt cannot show: whether intermediate inventory is accumulating.

**Check:** The liquid profile is continuous; do not describe it as a completion-only receipt.

## 38. Constraints — Volume storage · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/volume-storage)

**Do:** Set storage present, 250 L buffer capacity and 100 L per reference order.

**Say:**

> We are modeling an intermediate liquid buffer, with a stated capacity and order volume. The physical implementation may also require exclusivity, minimum heel and residence-time rules. We record those requirements separately from the simple balance that runs in this example.

**Check:** Confirm the liquid axis is enabled before entering APS.

## 39. Constraints — Tank preview · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/tank-preview)

**Do:** Compare capacity lines and highlight any exceedance.

**Say:**

> Reducing tank capacity changes whether the liquid profile exceeds its limit. In this build, that is a diagnostic result: it does not automatically reschedule the orders. The useful design question is whether this must become a hard feasibility constraint for the customer.

**Check:** Do not claim the scheduler has prevented an overflow.

## 40. Constraints — Transition basics · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/transition-intro)

**Do:** Point to productive work and cleaning occupancy.

**Say:**

> The material can be finished while the equipment is still occupied by cleaning. That distinction matters for both scheduling and execution. We preserve processing completion separately from the time at which the resource becomes free.

**Check:** Use the purple clean segment, not the entire occupied bar, as active cleaning time.

## 41. Constraints — Setup & cleaning · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/transitions)

**Do:** Show A→B at 0.5 h and B→A at 1.5 h in the reference matrix.

**Say:**

> Cleaning depends on the pair and the direction. In this example, going from A to B is cheaper than returning from B to A. That gives the sequencing rule a reason to prefer some campaigns, while delivery promises may pull it in another direction.

**Check:** These are synthetic transition times; final-run cleaning is zero in this case.

## 42. Constraints — Transition preview · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/transition-preview)

**Do:** Compare cleaning disabled/enabled on the same reference case.

**Say:**

> We can now see the cost of including cleaning in resource occupancy. We inspect both cleaning hours and downstream completion. A more realistic model is valuable because it exposes the work that an optimistic plan would otherwise leave out.

**Check:** Do not call adding cleaning an optimization improvement; it is a model-fidelity change.

## 43. Constraints — Workforce basics · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/workforce-intro)

**Do:** Point to a filling operation and its required specialist.

**Say:**

> A filling line may be mechanically available while the qualified person is not. Equipment and skill capacity need to be considered together. Otherwise, the plan promises two simultaneous operations to the same person.

**Check:** Keep the resource and staffing evidence visible together.

## 44. Constraints — Workforce planning · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/workforce)

**Do:** Set the reference filling-specialist headcount to one.

**Say:**

> For this trial, one qualified filling specialist is available and each filling operation needs one person during processing. That gives us a concrete contention case. Detailed qualifications, absences and labor used during cleaning remain separate customer rules.

**Check:** The reference headcount is enforced; the full workforce-policy catalog is not imported.

## 45. Constraints — Workforce preview · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/workforce-preview)

**Do:** Show the comparison with higher specialist availability.

**Say:**

> The comparison shows the consequence of that shared person. If work moves even though a filler is free, we can explain the delay. This is the kind of operational explanation the planner needs before accepting a generated sequence.

**Check:** Read actual changed work from the current result.

## 46. Execution contract — Dispatch intent · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/dispatch-purpose)

**Do:** Capture the intended release and floor-dispatch responsibility.

**Say:**

> A calculated schedule and an authorized shop-floor instruction are not the same thing. We decide who releases work, what is frozen, and what the operator is allowed to resequence. Those boundaries keep planning flexibility from creating uncontrolled execution changes.

**Check:** The current live dispatch integration is a captured contract.

## 47. Execution contract — Dispatch rules · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/dispatch-control)

**Do:** Show ranked-work and release-policy options.

**Say:**

> We need a default rule for which eligible job should go next, and a reason when the recommendation changes. Due date, priority and cleaning can all influence that decision. The planner should see the tradeoff instead of receiving an unexplained rank.

**Check:** Operational rule comparisons happen in the APS workspace next.

## 48. Execution contract — Execution feedback · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/execution)

**Do:** Open interface details and identify order/event keys, actual time and quantity.

**Say:**

> MES returns actual progress and remaining work so APS can replan. SAP PP-PI also needs the relevant order or phase confirmations, while inventory postings follow the agreed SAP process. We identify the order, phase, event and correction relationship so a retry cannot count the same production twice.

**Check:** These are interface requirements; there is no live SAP or MES-to-APS event ingestion.

## 49. APS — Build a working scenario · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#experiment)

**Do:** Choose Liquid medicine; inspect Applied, Assumed and Diagnostic entries; Build scenario.

**Say:**

> We are moving from captured requirements into an executable scheduling case. This screen tells us which assumptions are actually used. The twelve sample orders are a scheduling experiment; they have not been automatically generated from the earlier MPS quantity bucket.

**Check:** Use Build only when ready to replace the working APS scenario; keep any wanted comparison first.

## 50. APS — Orders and delivery promises · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#experiment)

**Do:** Point to the resource lanes, order bars, dispatch rule and metrics.

**Say:**

> Here is the actual sequence. Each bar places an operation on an eligible resource, and the summary shows delivery and cleaning consequences. This is where we test whether the intended capacity and sequencing policy can produce a workable plan.

**Check:** Read the displayed on-time count and cleaning total; they depend on the configured state.

## 51. APS — Resources & calendars · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#experiment)

**Do:** Open Resources & calendars controls; compare 16 hours with 8 and restore 16.

**Say:**

> I will remove one shift while keeping the same orders. Work that no longer fits must move to an available window, and the delivery consequences update. We can now discuss the value of the extra shift in terms of orders and dates.

**Check:** Wait for Revision … current result before interpreting or saving.

## 52. APS — Demand & priorities — live drag · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#experiment)

**Do:** Select WO-001, drag its compounding operation later, observe dependent filling and then Undo.

**Say:**

> Now I will delay the preceding operation. While I drag, the dependent operation is test-sequenced so we can see where it would land. The trial also updates the secondary profiles. On release, the move becomes an override; Undo returns us to the previous inputs.

**Check:** A manual move gives the whole order priority. Do not describe it as an isolated bar move.

## 53. APS — Sequence & cleaning · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#experiment)

**Do:** Compare Earliest due date, Minimize cleaning and Cleaning feedback search.

**Say:**

> The cleaning rule evaluates which product would follow the current one. The feedback search revisits the sequence because choosing the next operation can change the current operation’s occupied end. We compare cleaning savings with lateness; a lower cleaning total is not automatically the best business outcome.

**Check:** This search is bounded and prioritizes cleaning before lateness. Do not claim a global optimum or a guaranteed improvement.

## 54. APS — Tank & material flow / Materials & people · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#experiment)

**Do:** Show liquid and staffing axes; point to capacity/headcount lines.

**Say:**

> These axes explain constraints beyond machine occupancy. Liquid accumulation is diagnostic here, while the reference skill headcount and linked material timing affect scheduling. We keep that difference visible so a convincing chart is not mistaken for enforcement of every plant rule.

**Check:** If the tank axis is absent, return to volume-storage scope and rebuild rather than claiming it is hidden in the data.

## 55. APS — Saved scenarios · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#experiment)

**Do:** Name a comparison, save it after a current result, then open Saved scenarios.

**Say:**

> We save inputs together with results and revision, so this comparison is reproducible. A useful planning discussion is not just which picture looks better. It is what changed, what improved, what became worse and why we would accept the alternative.

**Check:** Saving a comparison does not authorize production release.

## 56. SAP PP-PI — Accept the schedule and release the order · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/master-handoff)

**Do:** Return to Master handoff. Describe the acceptance gate after the APS scenario comparison.

**Say:**

> The planner accepts the sequence. In our proposed workflow, SAP retains the process order and an authorized user releases it after the required checks. MES receives the approved order and instruction references. If APS later moves this work, we reconcile the change with its release and execution status before replacing the shop-floor plan.

**Check:** This screen captures a handoff decision; it neither updates SAP dates nor releases an order. Agree the scheduling owner and frozen-work policy with the customer.

## 57. MES — Design overview · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#overview)

**Do:** Switch to MES and select Oral solution.

**Say:**

> We have explored the schedule. Now we move to the execution design for one oral-solution batch. MES must guide the work, verify the required conditions and preserve the evidence. This reference batch is 1,000 liters; its quantity is configured here rather than transferred automatically from APS.

**Check:** The MES process selector creates a fresh reference design while retaining earlier batch records.

## 58. MES — Master batch record · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#recipe)

**Do:** Show the instruction sequence, durations, predecessor relationships and design approval.

**Say:**

> SAP's master recipe describes reusable manufacturing operations, phases and material requirements. The MES master batch record defines the detailed execution instructions and evidence in this design. We map their approved versions; they are not the same document. Each MES batch snapshots its instructions so later edits cannot silently change work already running.

**Check:** The current snapshot is local MES behavior. SAP master-recipe and MES MBR alignment is a proposed implementation contract.

## 59. MES — Materials & dispensing · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#materials)

**Do:** Point to 10 kg nominal active, 98% potency, 10.204 kg target and ±1% tolerance.

**Say:**

> The recipe requires ten kilograms of active material. At ninety-eight percent potency, the gross target is about ten point two zero four kilograms. Before accepting the dispense, the model also checks the lot’s status, expiry, available quantity and independent witness.

**Check:** This is the model’s potency example, not a validated instruction for a real product.

## 60. MES — Equipment & people · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#equipment)

**Do:** Show clean/calibrated equipment, qualification and a different witness name.

**Say:**

> The batch needs the right equipment in the right state, and a person qualified to execute the work. These conditions are checked when the step runs. The names and roles in this demo are simulated; production identity and electronic-signature services are implementation requirements.

**Check:** Use Alex as operator and Sam as witness for the clean path.

## 61. MES — Process & packaging · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#process)

**Do:** Show temperature, assay, hold and yield controls plus the output equation.

**Say:**

> Here we configure what acceptable execution means: process limits, sample limits, the allowed hold before filling and output reconciliation. Good output, rejects and documented loss must balance. We can vary a yield threshold without pretending that unexplained missing quantity is acceptable. The reviewed in-process laboratory result is a gate before filling in this example; other sampling purposes may have different gates.

**Check:** Keep the clean oral defaults for the prepared failure demonstration.

## 62. LIMS — Laboratory scope and ownership · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/lims-design)

**Do:** Select the relevant laboratory requirements. Capture the QC laboratory owner, proposed LIMS and upstream/downstream contracts.

**Say:**

> The laboratory scope starts before a result is entered. We need sample custody, approved methods and limits, analyst and instrument readiness, review, and publication. For our oral solution, distinguish incoming-material testing, the in-process sample that gates filling, and final-product testing. Each serves a different decision.

**Check:** Requirements are recorded here. The current trial executes only a single assay comparison.

## 63. LIMS — Request, collect and receive a sample · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#interfaces)

**Do:** Point to the LIMS handoff. Describe the request, returned sample identity and collection confirmation.

**Say:**

> MES requests the sample against the process order, phase and batch. LIMS returns the sample identity and label details; collection and laboratory receipt then establish where the sample is. If SAP also supplies inspection context, we map that identity instead of creating a second request for the same purpose.

**Check:** This proposed flow follows the published PAS-X/LabWare pattern. The view does not execute registration, barcode printing or chain of custody.

## 64. LIMS — Methods, specifications and instruments · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/lims-design)

**Do:** Use the method/specification and laboratory allocation requirements to describe the acceptance case.

**Say:**

> The analyst must use the applicable approved method and specification. We also need the instrument, calibration status, reagents, standards and raw-data reference behind the reported value. A result copied without those references can look complete while leaving the reviewer unable to reconstruct the test.

**Check:** The existing design form captures requirements, not instrument data or version-controlled laboratory methods.

## 65. LIMS — Late laboratory result · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/lims-design)

**Do:** Capture an acceptance case: a delayed reviewed IPC result postpones permission to fill. Explain the scheduling consequence.

**Say:**

> Suppose the liquid is ready but the reviewed result is late. Filling remains blocked under our chosen rule. APS needs the expected availability time and hold status to test a new sequence; MPS may need an exception if the delay threatens the period's supply. Laboratory turnaround includes queues and review, not just instrument run time.

**Check:** This is a proposed integration acceptance case. The scheduler does not receive laboratory events or model laboratory queues automatically.

## 66. LIMS — Assay trial — reviewed is different from entered · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/lims)

**Do:** Announce the separate Dosing kit trial. Set limits to 95 and 105, result to 98, and clear Test complete and result reviewed. Then select that checkbox.

**Say:**

> We briefly use the existing Dosing kit trial to isolate one rule. A value of 98 is inside these example limits, but it becomes usable evidence only when the test is marked complete and reviewed. This illustrates the gate; it is not the oral-solution batch or a real instrument result.

**Check:** The review checkbox is a simulation, not authenticated laboratory approval. Do not imply this result flows into the MES batch.

## 67. LIMS — Assay trial — failure and investigation · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/lims)

**Do:** Keep the review flag selected and change the result to 94. Point to Outside specification. Describe investigation rather than overwriting it with a passing value.

**Say:**

> The trial now detects a value outside its limits. In the intended laboratory workflow, the original evidence remains available and the quality investigation determines the next authorized action. A retest is a linked record with a reason; a later passing value must not silently erase the first result.

**Check:** This trial overwrites its input and has no OOS record history. Describe the required investigation; do not demonstrate editing back to 98 as a valid retest process.

## 68. LIMS — Quality disposition remains separate · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/qms)

**Do:** With LIMS and QMS enabled and the reviewed result still at 94, select Release. Show the blocked release and held stock.

**Say:**

> The release request is blocked by the failed laboratory evidence. A passing test would still be only one input to the site's authorized quality decision. In the SAP design, we reconcile that decision with the inspection and stock processes, while keeping PP-PI order completion separate.

**Check:** This QMS trial is linked to the Dosing kit LIMS trial, not the MES oral-solution batch or SAP. Return to MES for the original batch demonstration. Owner and action text are captured, but this trial does not enforce investigation completeness or approval signatures.

## 69. QMS — Quality scope and authority · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/qms-design)

**Do:** Capture the quality owner, proposed system of record, affected-lot contract and acceptance case.

**Say:**

> QMS is more than the release selector we just saw. It coordinates quality events, containment, investigations and justified corrective actions. We define how it uses MES and LIMS evidence and who authorizes disposition. SAP QM may hold inspection and stock decisions; we must avoid competing authorities.

**Check:** The design form records this contract. The current QMS trial is not a full investigation workflow.

## 70. MES — System handoffs — link the order · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#interfaces)

**Do:** Use Link first order from saved APS scenario before creating the MES batch.

**Say:**

> The production design must preserve the SAP process-order and phase identities alongside the APS schedule revision and MES batch record. This button currently links only the first saved APS order to a new MES trial. It demonstrates provenance; the SAP order download, approved recipe mapping and release checks still need implementation.

**Check:** Link before creating the MES batch. No SAP process order is fetched or released by this action.

## 71. SAP PP-PI — Order instructions into MES · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#interfaces)

**Do:** Use the interfaces view to explain the order-to-instruction mapping; do not imply a SAP transaction is visible.

**Say:**

> SAP PP-PI process management can send order-related instructions through control recipes and receive process messages. A control recipe is distinct from the reusable SAP master recipe and the MES master batch record. For this site, we choose the supported interface and decide exactly which instructions SAP supplies and which MES controls.

**Check:** Control-recipe/process-message references come from SAP ERP documentation. Confirm the actual SAP release, MES connector and supported mechanism; no such connector runs in this prototype.

## 72. MES — Run a batch — readiness · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#execute)

**Do:** Create New trial batch; show the snapshot revision; record clearance.

**Say:**

> We now have an electronic batch record created from the approved design. The panel shows the next instruction and the conditions that permit it to execute. We record clearance first, then move to dispensing without losing the batch context.

**Check:** New trial batch performs simulated design approval; it is not a production approval signature.

## 73. MES — Run a batch — fail, correct, continue · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#execute)

**Do:** Enter 12 kg, leave the field, click Record step. Then enter 10.204 kg, leave the field and record again.

**Say:**

> I will enter an incorrect dispense quantity. Execution stops and records the exception; no material is consumed. Correcting the value allows us to proceed, but it does not erase the failed attempt. That difference is essential to an interpretable batch record.

**Check:** Expect one open dose exception, then successful dispense with the exception still open.

## 74. QMS — From execution exception to quality event · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#review)

**Do:** Inspect the blocked dispensing attempt and corrected evidence. Explain the proposed quality-event link.

**Say:**

> The attempted 12-kilogram entry was blocked. First we determine what physically happened; a prevented input error is not the same as an incorrect charge. Under the site's criteria, we either resolve the local exception or open a linked quality investigation, keeping the original evidence and source identity.

**Check:** Do not assume material was charged. No external QMS event is created by the MES review screen.

## 75. QMS — Containment and affected scope · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/qms-design)

**Do:** Describe the affected batch, related lots and equipment; capture the expected hold acknowledgments.

**Say:**

> If the investigation identifies a potential product impact, quality defines the containment scope from evidence. MES and SAP must confirm the relevant restrictions, and APS must know which work or material is unavailable. Sending a hold request is not proof that every receiving system applied it.

**Check:** Containment propagation and genealogy-based scope analysis are proposed requirements. The current trial holds only its reference lot.

## 76. MES — Run a batch — process and reconcile · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#execute)

**Do:** Record charge, process at 22 °C, assay at 99%, and 1,000 good / 0 reject / 0 loss. Stop before review.

**Say:**

> We continue through charging, processing, the sample result and filling. Each successful step adds evidence to the same batch record. Even with acceptable measurements and a balanced output, the batch is still waiting for review of the earlier exception.

**Check:** With the unmodified route: six recorded steps, 255 elapsed minutes, one open exception. Added steps change these totals. The MES sample input is local; the separate LIMS trial does not populate it.

## 77. Historian — Historian — evidence over the whole phase · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/software-stack.html#historian)

**Do:** Describe temperature and agitation traces for the batch's processing interval.

**Say:**

> A single entered temperature cannot describe the entire phase. The historian can supply timestamped process values, linked to the equipment and MES phase window. We need quality flags, units and clock alignment to interpret them. The controller operates the process; the historian records evidence; quality decides its significance.

**Check:** No historian trace is fetched here. AVEVA PI System is unrelated to SAP PP-PI.

## 78. Historian — Historian — missing or suspect data · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/software-stack.html#historian)

**Do:** Use a missing temperature interval as the acceptance challenge.

**Say:**

> Suppose the trend has a missing interval or an equipment clock is offset. We must expose that uncertainty rather than draw a reassuring uninterrupted line. The reviewer needs the source context and the site's rule for incomplete evidence, with any investigation linked to the batch.

**Check:** This is a proposed data-quality acceptance case, not a simulated excursion or automated release rule.

## 79. MES — Exceptions & release · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#review)

**Do:** Open the exception; enter the prepared rationale; Record QA review.

**Say:**

> The MES reviewer sees the blocked dispensing attempt, its correction and the retained execution evidence. We explain the actual event before deciding whether it needs a wider quality investigation. A corrected entry does not erase the first attempt, and reviewing a local exception does not automatically close an enterprise QMS record.

**Check:** Rationale: “The 12 kg entry was rejected before consumption. The corrected 10.204 kg value meets tolerance; dispense evidence and lot balance reviewed.”

## 80. QMS — Investigation and root cause · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/qms-design)

**Do:** Use the investigation requirement and acceptance field to describe evidence, owner and conclusion.

**Say:**

> We combine the execution record with any relevant laboratory investigation, equipment history and previous events. The investigator evaluates causes and records a supported conclusion. We do not choose operator error in advance or treat a later passing test as permission to discard the original evidence.

**Check:** This is a narrated acceptance case; the form does not run root-cause analysis or an OOS workflow.

## 81. QMS — Correction, CAPA and effectiveness · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/qms-design)

**Do:** Describe a hypothetical recurring entry problem and the action, owner, due date and effectiveness evidence it would require.

**Say:**

> Correcting this entry addresses the immediate issue. If the investigation justifies CAPA, we define the change needed to prevent recurrence and how we will test its effectiveness. Completing the action and proving it worked are different milestones. Batch disposition follows its own authorized evidence requirements.

**Check:** Do not imply every exception requires CAPA or every CAPA must close before batch disposition. The site defines the applicable gates.

## 82. QMS — Controlled change and training · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#recipe)

**Do:** Point to the MES instruction revision and explain change-control effects across systems.

**Say:**

> Suppose the approved action changes a dispensing instruction. The change process assesses the MES master record, any affected SAP recipe references, laboratory methods and training. We agree effectivity and treatment of existing batches before use, preserving the instructions already captured in an executing batch.

**Check:** The local MES snapshots batch instructions. Cross-system approvals, training readiness and SAP effectivity are not implemented here.

## 83. MES — Run a batch — QA release · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#execute)

**Do:** Return to batch; attempt release as operator, then choose QA reviewer and release.

**Say:**

> The operator cannot perform this release action. With the execution evidence complete and the exception reviewed, the simulated QA role can release the batch. The result is a retained batch disposition, not simply a completed list of tasks. In our SAP design, MES batch disposition, SAP quality or stock status, and process-order completion remain separate decisions. Finishing production does not by itself authorize product release.

**Check:** Expect released and read-only execution controls. Standard route completes at 285 minutes.

## 84. MES — Batch genealogy · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#genealogy)

**Do:** Trace the input lot through the batch to output; inspect recorded steps and history.

**Say:**

> We can now explain which material was consumed, which recipe revision was used, which equipment and people were involved, and what was released. The corrected measurement and original exception both remain part of the explanation. This is the as-executed view of the batch.

**Check:** The local browser history is a demonstration record, not a secure regulated audit repository.

## 85. MES — System handoffs — return actuals · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#interfaces)

**Do:** Inspect outbound event identities, types and times; show Export message envelope.

**Say:**

> MES produces the evidence for SAP order or phase confirmations and material postings. A confirmation, goods issue, goods receipt and quality disposition are distinct business events, even if configured automation links some of them. We reconcile each accepted posting and handle rejected messages without duplicating stock or output.

**Check:** The displayed envelopes are local examples, not SAP-ready payloads or accepted SAP postings. Agree backflush and automatic receipt behavior before implementing the adapter.

## 86. LIMS — Publish and correct laboratory results · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#interfaces)

**Do:** Describe the result contract alongside the LIMS handoff: sample, test, version, status, units and source event.

**Say:**

> A published result carries its sample and batch identity, method and specification versions, value, units and review state. If an approved result is later superseded, we retain the relationship and notify affected consumers. MES, quality and planning must assess the impact rather than quietly accepting whichever message arrived last.

**Check:** Duplicate protection, superseded results and downstream containment are proposed acceptance cases, not implemented vendor messaging.

## 87. SAP PP-PI — Rejected posting and reconciliation · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#interfaces)

**Do:** Stay on the exported event envelope. Walk through a hypothetical SAP rejection using its source identity.

**Say:**

> Suppose MES reports consumption but SAP rejects the posting. The physical consumption has still happened. We retain that evidence, show the posting as unresolved, and let its owner correct and retry it with duplicate protection. We distinguish message delivery from SAP business acceptance before declaring the order reconciled.

**Check:** This is a spoken acceptance scenario, not a simulated SAP response in the current UI. Specify acknowledgment, retry, reversal and reconciliation behavior during implementation.

## 88. QMS — Quality decision acknowledgment · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#interfaces)

**Do:** Describe the disposition message and receiving-system acknowledgment using batch and decision versions.

**Say:**

> An authorized quality decision carries its scope, identity and version to the receiving systems. If SAP rejects the update, the discrepancy remains visible for reconciliation. A retried or older decision must not reverse a newer restriction. Investigation closure, batch disposition and successful stock update remain traceable separately.

**Check:** These are proposed integration acceptance cases; the current envelope export does not change SAP or an enterprise QMS.

## 89. MES — Test the design · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#validate)

**Do:** Try Incoming lot on hold, Failed laboratory result and Hold time exceeded; save a comparison if useful.

**Say:**

> A clean batch is only one acceptance case. We also test conditions that should stop execution and compare the observed behavior with the configured rule. If we relax a control, we inspect what changes and decide whether that behavior is acceptable for this implementation. For SAP integration, add acceptance tests for a wrong recipe version, an unreleased order, a duplicate confirmation and a rejected goods movement.

**Check:** These are functional sketch tests, not completed GMP validation. Those SAP integration tests are proposed; the local runner does not execute them.

## 90. MES — Deployment & rollout · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#rollout)

**Do:** Show pilot site, owner, hosting and the twelve-domain coverage matrix.

**Say:**

> The implementation extends beyond the executable example. We need a site template, ownership, availability and recovery requirements, interface delivery, validation and a rollout approach. This matrix keeps the wider scope visible while distinguishing working behavior from requirements that still need implementation.

**Check:** Avoid reading every catalog row aloud. Highlight the customer’s main gaps.

## 91. QMS — Broader quality processes · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/qms-design)

**Do:** Add supplier quality, audits, complaints, documents, training and trends to the acceptance scope where needed.

**Say:**

> The batch example is one route into the quality system. Supplier issues, audit findings and complaints can also trigger investigation and action. We scope those processes, controlled documents, training and trend review explicitly, including who participates outside the site.

**Check:** The existing form is a requirements record. These additional quality workflows are not executed by the trial.

## 92. LIMS — Stability, microbiology and environmental monitoring · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/lims-design)

**Do:** Add the relevant broader laboratory requirements to the acceptance contract and refer to the provider research checklist.

**Say:**

> The single assay is only our entry point. A complete laboratory scope must consider stability pulls, retained samples, microbiology incubation and readings, environmental monitoring, trends and reporting. We ask each provider to demonstrate these distinct workflows using our site data and responsibilities.

**Check:** Do not claim these workflows are implemented by the single-assay trial; add them to the customer scope and vendor demonstration.

## 93. MES — Research & coverage · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/mes.html#research)

**Do:** Show the PAS-X, Siemens, Emerson and regulatory primary-source links.

**Say:**

> The functional structure is informed by published life-sciences MES material, including PAS-X and Opcenter Pharma. We use that research to ask better design questions. It does not make this prototype a certified implementation or a substitute for the customer’s validation and quality process.

**Check:** This is a vendor-neutral configurator, not a PAS-X product demonstration.

## 94. Close — Try a variant · Detail

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/variant)

**Do:** Mention the retained graph exercise only if presenting every screen.

**Say:**

> This screen is an illustrative model-branching exercise. For the operational comparisons we just discussed, use the saved APS scenarios and MES fault trials. Those preserve the inputs and outcomes relevant to this manufacturing example.

**Check:** Do not show the graph merge as evidence that an MES or APS scenario was accepted.

## 95. Close — Readiness · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/readiness)

**Do:** Show missing decisions, stale/unreviewed items and owner/evidence actions.

**Say:**

> We finish by examining what is still unresolved. Capturing a choice, testing a model behavior and obtaining customer acceptance are different milestones. The useful outcome is a clear list of the decisions, evidence and owners needed to move the implementation forward.

**Check:** The existing readiness list covers the main configurator; the MES has its own design/test export.

## 96. Close — Handoff · Core

[Open screen](https://pedrodfroes.github.io/northworks-manufacturing-studio/index.html#topic/handoff)

**Do:** Show implementation record, APS snapshot and MES design/batch/message exports as distinct packages.

**Say:**

> The handoff now covers SAP PP-PI ownership, the master plan, the APS scenario and the MES design with batch evidence. The implementation team can see which order and recipe versions must align, what authorizes execution, and how actuals return to SAP and planning. We finish with named owners for the mappings and acceptance tests. The LIMS package adds sample and result ownership, vendor evidence and laboratory acceptance cases. QMS adds investigation ownership, containment acknowledgments, CAPA and change-control acceptance cases.

**Check:** Export the MES package separately. The script describes SAP integration requirements; the application does not export a configured SAP adapter.

## If the audience asks “Is SAP already connected to these models?”

> “The working models are local examples. SAP order exchange and posting acknowledgments are proposed contracts, not a live connection. The current build does not yet reconcile MPS quantities into APS orders or feed MES actuals back into the scheduler automatically. Those are concrete integration tasks, and this walkthrough shows the objects and evidence they must carry.”

## If the audience asks “Is this a validated MES?”

> “It is a design and execution sketch. It demonstrates how the controls behave and lets us test requirements. A production implementation needs validated services, authenticated identities, secure records, site procedures and the appropriate quality approvals.”

## SAP references for the presenter

The SAP-specific lifecycle description is grounded in the following SAP ERP documentation. Interface selection and ownership choices above are proposed design decisions; confirm them against the customer's SAP release and MES connector.

- [Master recipes](https://help.sap.com/docs/SAP_ERP_SPV/0ceda61afeae4ec5a3bb021661b342e7/5107bd53d34ab64ce10000000a174cb4.html): reusable manufacturing master data.
- [Material data maintenance](https://help.sap.com/docs/SAP_ERP/0ceda61afeae4ec5a3bb021661b342e7/0884bf53f106b44ce10000000a174cb4.html): production versions, BOM alternatives and phase allocations.
- [Creating process orders with material and master recipe](https://help.sap.com/docs/SAP_ERP/698b19fa88b846359bc611f11184c810/1886bf53f106b44ce10000000a174cb4.html): version applicability and copying recipe data to the order.
- [Process order management](https://help.sap.com/docs/SAP_ERP/698b19fa88b846359bc611f11184c810/0986bf53f106b44ce10000000a174cb4.html?locale=en-US): control recipes and execution feedback through process messages.
- [Confirmations in process orders](https://help.sap.com/docs/SAP_ERP/698b19fa88b846359bc611f11184c810/2887bf53f106b44ce10000000a174cb4.html): confirmation and configured goods-movement behavior.

## LIMS sources and scope

The [research note](LIMS_PROVIDER_RESEARCH.md) documents LabWare, LabVantage, Thermo Scientific SampleManager and STARLIMS, with primary-source links and a common vendor demonstration. The [published Körber/LabWare flow](https://www.koerber.com/en/about-us/news-and-press/labware-mes-lims-integration) informs the sample exchange narrative. Laboratory timing, ownership and acceptance cases are our proposed implementation design, not proof of delivered vendor functionality.

## QMS sources and scope

The [QMS research note](QMS_PROVIDER_RESEARCH.md) links official Veeva QMS, TrackWise Digital, MasterControl and ETQ Reliance material. The proposed customer lifecycle and integration acceptance cases are design choices, not a claim of out-of-the-box compatibility or regulatory approval.

## Wider stack sources

See [STACK_PROVIDER_RESEARCH.md](STACK_PROVIDER_RESEARCH.md) for official CRM, S&OP, product-definition and historian references, proposed ownership and acceptance cases.
