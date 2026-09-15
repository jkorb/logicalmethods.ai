# When you change something

Reuse a token; put section-specific rules in that section's stylesheet; keep shared
page furniture in `pages.css`. Then run `npm test` — the accessibility, keyboard and
reflow suites will catch a regression that a visual check will not.

## Related

- [Running only what your change affects](../testing/targeted-runs.md).
- [Color](color.md) — re-check the accent contrast if you touch `--grid` or `--paper`.
