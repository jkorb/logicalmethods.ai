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

The `prose` job runs separately and uploads its report. The
[external-link workflow](../../.github/workflows/external-links.yaml) runs on
Mondays or on request. Neither report is a deployment prerequisite. In GitHub
Actions, open a run and look under **Artifacts** for reports and browser
diagnostics.
