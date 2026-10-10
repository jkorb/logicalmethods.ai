# CI failure diagnosis

A local pass does not resolve a failure on GitHub. `CI=1` uses CI budgets and
reporting; it does not reproduce Ubuntu rendering on macOS.

## Required procedure

1. Read the failing assertion and the relevant trace from that exact run.
   Record the commit, project, failing phase, and observed state. Separate
   observations from a suspected cause.
2. Decide what the test promises: navigation, refitting, keyboard access, or
   another user-visible behavior. Establish its prerequisites explicitly.
   Do not combine cold startup with an unrelated interaction regression.
3. Use condition-based waits. For layout, wait for the intended slide or pane
   to be active and visible, and for the fonts used by the scenario to load.
   A mounted application alone does not establish those conditions.
4. Compare content with its current container, or compare the before/after
   behavior. Do not hard-code platform font metrics or elapsed delays. Use a
   rounding allowance only when it follows the component's documented behavior.
5. Report useful measurements: available and content dimensions, overflow on
   each axis, selected slide, or focus target. A bare `false` is insufficient
   for a layout regression.
6. Run the affected tests first. Run the full local suite once before pushing.
   Preserve existing coverage; do not skip a failing platform, increase a
   timeout, or weaken an assertion just to make a release pass.

A regression should fail because the behavior it tests is broken. If it fails
before the action under test, diagnose its setup separately. A synthetic local
failure is evidence for that scenario, not proof of the original CI cause.

## Release reporting

Report local success, push success, CI success, and deployment success separately.
Only a successful run for the exact commit establishes CI success. Confirm the
Pages deployment before calling the site deployed. Do not promise a GitHub
runtime from a local measurement. If asked to stop after local validation and
push, stop there and state that CI and deployment remain unconfirmed.

See [Matching CI locally](ci-parity.md) and [the October incident](incidents/october-2026-slides.md).
