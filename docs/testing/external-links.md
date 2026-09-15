# External links

```sh
npm run check:external
```

This builds the site and checks external links and embeds over the network.
Results are saved to `tmp/external-report.json`. GitHub also runs this check
weekly and makes the report available in the workflow's artifacts.

Review each finding before replacing a link: some websites reject automated
requests or limit their frequency. The check tests whether a URL responds; it
does not inspect remote heading anchors or the contents of an embedded slide deck.
External-link findings do not block deployment.

## Related

- [GitHub Actions](github-actions.md) — the weekly workflow.
