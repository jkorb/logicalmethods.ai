# Spelling and style

[Vale](https://docs.vale.sh/) checks spelling, repeated words, and terminology.
Its suggestions are for review and do not block deployment.

Install the project's Vale version on macOS or Linux:

```sh
npm run setup:prose
```

The installer downloads the version in [`.vale-version`](../../.vale-version),
checks its checksum, and puts the executable in `tmp/bin/`. To review one chapter:

```sh
VALE_BIN=tmp/bin/vale npm run lint:prose -- content/textbook/boolean/index.md
```

Omit the filename to review all course content and documentation. If the same
Vale version is already on your PATH, you can omit `VALE_BIN=tmp/bin/vale` too.
Results appear in the terminal and in `tmp/prose-report.json`.

## The course vocabulary

Add accepted names and technical terms to the
[course vocabulary](../../.vale/styles/config/vocabularies/Course/accept.txt), one
entry per line in alphabetical order. This also covers acronyms, possessives,
and words in foreign-language bibliography titles. Check the word in context
before adding it; formatting problems and spelling errors should stay flagged.
The spelling dictionary is American English, with some British variants accepted.
English spelling and terminology checks are disabled for the Dutch study-track
section and the mixed-language tutoring guide. Repeated-word checks still apply.

Code, formulas, and shortcode tags are excluded; text inside paired shortcodes
is checked. Unusual notation may need a local exception. Vale supports
[comments for disabling a rule](https://docs.vale.sh/formats/markdown#comments)
around a passage. It does not check mathematical correctness or provide a full
grammar review.

After changing the Vale rules or notation handling, run:

```sh
VALE_BIN=tmp/bin/vale npm run test:prose
```

This checks that spelling mistakes are found and notation is ignored. A missing
tool or invalid configuration is reported as a failure, even though ordinary
editorial findings are advisory.
