# Interface color decisions

Reviewed 8 September 2026. Replaced the pervasive sage/green interface tint with neutral white and gray surfaces, charcoal type and restrained blue actions. Operational chart series retain their distinct colors; success, warning and failure remain separate states with existing labels.

Sources informing the approach:

- [IBM Carbon color overview](https://carbondesignsystem.com/elements/color/overview/): dominant neutral surfaces organize dense interfaces.
- [Atlassian color foundations](https://atlassian.design/foundations/color): distinguish neutral, accent and semantic color roles.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): text contrast, non-text contrast and information that does not depend on color alone.

Shared palette lives in chromatics.css, used by the presenter, provider comparisons, implementation map, embedded configuration and MES. Existing surface declarations were neutralized in the active component styles. Blue marks actions and selection; it is not a new batch status. Existing chart series and patterns are preserved.

Checked the primary text, secondary text, blue-button and success-label pairs against 4.5:1, and the input boundary against 3:1. These are palette checks, not a claim of a complete WCAG audit. Desktop previews were inspected for the presenter, map and MES; responsive rules and application behavior remain unchanged.
