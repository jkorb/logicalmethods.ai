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

Keep the relevant `/docs` guide current when changing documented behavior or
conventions. Record facts supported by the repository; distinguish proposed
improvements from implemented features. Keep this file a short entry point.
