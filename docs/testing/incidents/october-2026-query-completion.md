# Lecture 8 query completion

[Run 38707342442, attempt 1](https://github.com/jkorb/logicalmethods.ai/actions/runs/38707342442/attempts/1)
tested `25c2e787` and hit the thirty-minute job limit during `npm test`.
The test job left no downloadable log or browser diagnostics. Its cause cannot
be established from the surviving metadata. The verification runner buffers each
check's output and writes its log when the child process exits, so an interrupted
check can lose its progress and failure details.

[Attempt 2](https://github.com/jkorb/logicalmethods.ai/actions/runs/38707342442/attempts/2)
tested the same commit with debug logging. Tests finished in 9m 35s: 546 browser
tests passed and one failed initially and on retry. All six new slide tests passed.
This layout failure does not establish the cause of the earlier timeout.

At 1280×720, the completed binary query in the FOL chapter measured 665.84px
against its 660px height limit. The Linux screenshot shows an explanation wrapping
onto an extra line compared with macOS, where the app measured 641.16px. The new
completion panel also inherited roughly 14px of trailing prose paragraph margin.

Query completion panels now omit that trailing margin, retaining their text size,
padding, and answers. The existing layout test keeps its height limit, waits for
fonts and the completed query, and reports the viewport and measured bounds on
failure. Local verification does not establish a Linux pass; the correction
still needs to run on GitHub after it is committed and pushed.

See [CI failure diagnosis](../ci-failures.md).
