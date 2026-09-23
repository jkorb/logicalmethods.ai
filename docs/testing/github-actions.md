# GitHub Actions

The [build and deployment workflow](../../.github/workflows/build-and-deploy.yaml)
has a `verify` job that runs `npm test`. The `deploy` job requires `verify` to
succeed, then publishes the tested files through GitHub's Pages artifact and
deployment actions. Pushes and manual runs on `main` deploy; pull requests and
manual runs on other branches just check the site. See
[Deployment](../technical/deployment.md) for the required Pages settings.

The README badge links to this workflow, using GitHub's native status badge for
pushes to `main`. It shows the overall build and deployment status, including
tests. Badge images can lag behind a run; follow the link for the current result.

## Reading a run

The `verify` job writes a summary to the run's own page: how many browser tests
passed, which failed, and which only passed on a retry, each with its file and
line. Read that before downloading anything — it is written by
[`scripts/ci-summary.mjs`](../../scripts/ci-summary.mjs) from the JSON report,
and `gh run view` prints it.

Failures are also annotated on the offending line by Playwright's `github`
reporter, which writes annotations without printing a line per test, so the raw
log stays short. Traces and failure screenshots are in the
**browser-diagnostics** artifact, for when the summary is not enough.

A test listed as **flaky** passed only on its retry. CI retries once so a stalled
runner cannot fail a deploy, but a flaky test is a defect: it depends on machine
speed rather than on the site. [Matching CI locally](ci-parity.md) explains the
budgets and the fix.

The job allows 30 minutes, which is headroom for a slow runner and the retry,
not an expected duration; a genuine hang is caught by the per-test budget long
before it fires.

## The other workflows

The `prose` job runs separately and uploads its report. The
[external-link workflow](../../.github/workflows/external-links.yaml) runs on
Mondays or on request. Neither report is a deployment prerequisite. In GitHub
Actions, open a run and look under **Artifacts** for reports and browser
diagnostics.

## Related

- [Matching CI locally](ci-parity.md) — timing budgets, retries, reproducing a run.
- [Test output](output.md) — what the same commands print on your machine.
