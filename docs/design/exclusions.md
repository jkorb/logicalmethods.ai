# Excluded from the redesign

`layouts/tutoraat/` and `layouts/verdiepingspakketten/` keep their own shells and
were deliberately left alone; they are due to be migrated elsewhere. They still
carry known issues (`lang=""`, no `main` landmark, small touch targets) and are
therefore not covered by `tests/browser/a11y.spec.mjs`.

## Related

- [Learning material](../project/learning-material.md) — what these sections are for.
