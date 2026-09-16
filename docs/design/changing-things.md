# When you change something

Reuse a token; put section-specific rules in that section's stylesheet; keep shared
page furniture in `pages.css`. After the edit batch, build and run the relevant
suites from the [change-to-suite map](../testing/targeted-runs.md), including
accessibility, keyboard and reflow checks for styles or page furniture. Inspect
the changed component on representative affected pages. Broaden visual review
only for a named unresolved concern; run the full `npm test` before pushing.

## Related

- [Running only what your change affects](../testing/targeted-runs.md).
- [Color](color.md) — re-check the accent contrast if you touch `--grid` or `--paper`.
