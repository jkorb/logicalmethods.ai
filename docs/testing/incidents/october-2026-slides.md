# October 2026 slide regression

The Chapter 9 release exposed a failure in our validation process: a successful
macOS run was followed by another failed Ubuntu run after an attempted fix.

| Commit | Local result | GitHub result |
| --- | --- | --- |
| `b1a5a961` | Full suite passed | 745 passed, 3 failed; browser suite 27m 26s |
| `b7b4854d` | 472 passed; all checks 4m 4s | 471 passed, 1 failed; browser suite 10m 28s |

The [first run](https://github.com/jkorb/logicalmethods.ai/actions/runs/38002629037)
failed on the Chapter 9 learning-goals slide in both viewports and a scrollable
Lean pane without keyboard access. The pane was copied after the static
accessibility setup. It now receives an explicit focus target. The slide fitter
was extended to observe ordinary text as well as formulas and applications.

The [second run](https://github.com/jkorb/logicalmethods.ai/actions/runs/38006131130)
passed those original checks. A newly added mobile regression failed while
checking the initial slide, before changing the text layout it intended to test.
The regression entered through a cold-load slide fragment; the existing deck
traversal entered through normal navigation and passed. The trace did not report
actual overflow dimensions, so the precise Linux layout cause was not established.

The regression now starts from the initialized deck, waits for fonts, navigates
to the slide, and checks its active state before changing text layout. It checks
that the fitted zoom decreases and reports overflow on each axis. This isolates
the refitting behavior; it does not establish that every cold-load deep link is
free of layout defects. Linux validation of the revised test remains pending.

Follow [CI failure diagnosis](../ci-failures.md): do not treat a local pass or a
synthetic reproduction as confirmation that the original CI failure is resolved.
