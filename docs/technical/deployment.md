# Deployment

Pushing to `main` runs the
[build and deployment workflow](../../.github/workflows/build-and-deploy.yaml).
Its test job must pass before the deployment job can publish to GitHub Pages.
The deployment uses the files produced and checked by that run. Pull requests
run the same tests without publishing.

The workflow uploads `tmp/site/` with `actions/upload-pages-artifact` and publishes
it with `actions/deploy-pages` to the `github-pages` environment. Generated files
are stored in a Pages artifact rather than committed to a deployment branch.
Manual workflow runs on `main` also deploy after tests pass; runs on other
branches only check the site. Active runs on `main` finish before the next run
starts, so a new push does not interrupt publication.

## Repository settings

For repository setup or migration, select **Settings → Pages → Build and
deployment → Source → GitHub Actions**. Keep the custom domain set to
`logicalmethods.ai` in Pages settings; the workflow no longer sets it through
the branch-publishing action. Allow `main` to deploy to the `github-pages`
environment. The deployment job needs `pages: write` and `id-token: write`.
The old deployment branch and its history can be retained; this workflow does
not update them.

Actions run names include the commit message, PR title, or manual-run details.
The deployment job includes the domain, branch, and run number, and its
environment links to the published site. The environment keeps the stable name
`github-pages` so deployment history stays together.

See [Testing](../testing/README.md) for local setup and commands. Spelling
suggestions and external-link reports are available separately and do not block
deployment.
