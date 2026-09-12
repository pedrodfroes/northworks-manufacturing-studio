# Decision workspace migration

12 September 2026

The old journey separates introductions, settings and previews even when they concern one decision. Business domains also separate their requirement forms from their worked trial. This pass consolidates these routes while keeping saved state and historical URLs compatible.

- Capacity, bottleneck, tank, cleaning and workforce introductions/previews resolve to their decision workspace.
- S&OP, PLM, MRP, LIMS and QMS open a working trial with an expandable implementation contract and retained evidence review.
- Project welcome resolves to scope. Navigation and workspace counts use canonical routes.
- No planning rules or evidence gates were removed. A worked trial does not satisfy missing implementation requirements.

Still requiring deeper redesign: system-landscape object ownership, taxonomy selection, the six attribute forms, and master-planning contracts. The legacy renderer remains an integration boundary for those screens; they are not yet fully redesigned.

Verification: all 52 model/navigation tests passed. Browser checks covered changing an assay in the combined workspace and an old tank-preview URL resolving to volume storage.
