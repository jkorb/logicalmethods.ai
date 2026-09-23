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
entry per line in alphabetical order, below the two general patterns the file
opens with. This also covers acronyms, possessives, and words in
foreign-language bibliography titles. Check the word in context before adding
it; formatting problems and spelling errors should stay flagged.

Entries are **regular expressions, matched case-insensitively**. So a lowercase
entry also covers the sentence-initial and title-case uses, `callouts?` covers
the singular and the plural, and a case-variant pair such as `modus` and `Modus`
is redundant. Vale joins the file into one alternation, which has two
consequences worth knowing before adding a pattern:

- An inline `(?-i)` does not stay in its own entry: it makes **every following
  entry** case-sensitive, which silently stops accepting words further down the
  file.
  Do not use inline flags.
- Because matching ignores case, a pattern like `[A-Z]{2,}s` for acronym plurals
  accepts any word ending in "s" — including misspelled ones. The file therefore
  names the acronyms explicitly. Possessives are the one safe generalization:
  `[A-Za-z]{2,}['’]s` accepts the possessive of any word, at the cost of not
  catching a typo that only appears in possessive form.

After changing the file, run the full `npm run lint:prose`: a green run is the
check that a new pattern has not switched off a rule somewhere else.
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
