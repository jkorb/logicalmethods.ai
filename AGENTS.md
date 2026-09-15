# Working on logicalmethods.ai

Start with [docs/README.md](docs/README.md), the shared knowledge base for humans
and agents. Read the relevant guide before changing content, templates, or assets:

- [Project](docs/project.md): purpose, audience, curriculum, and licensing.
- [Technical setup](docs/technical.md): Hugo, source layout, build, and deployment.
- [Design](docs/design.md): visual language and interaction conventions.
- [Authoring](docs/authoring.md): front matter, notation, resources, and validation.

Edit source files, not generated `public/` output. Preserve existing page paths,
anchors, and IDs unless the task calls for changing them. Treat bundled libraries
as dependencies; prefer project CSS, JavaScript, and templates for site changes.

Validate site changes with `hugo -D` and inspect affected pages when rendering or
interaction changes. CI includes drafts in the published site. `hidden`, `locked`,
and exercise passwords do not provide access control.

Run the narrowest check that covers your change — `npm run check` for content,
one spec for one interaction — and the full `npm test` before pushing. The
change-to-suite map and the targeted-run syntax are in
[Testing](docs/testing.md#running-only-what-your-change-affects). Read a browser
failure from the assertion and code frame it prints; the `error-context.md`
files under `tmp/test-results/` are whole-page dumps and are not worth opening.

Keep the relevant `/docs` guide current when changing documented behavior or
conventions. Record facts supported by the repository; distinguish proposed
improvements from implemented features. Keep this file a short entry point.

Keep temporary review checklists, scratch notes, and validation artifacts in the
Git-ignored root `tmp/` directory. Do not commit these files unless the user
explicitly asks to retain them in the repository. Use `/docs` for lasting project
guidance. `npm run clean` reclaims regenerated build and test output from `tmp/`
and leaves those notes alone.
