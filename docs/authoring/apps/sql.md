# Executable SQL examples

`sql-app` renders an editable SQL block with syntax highlighting, Run, Stop,
Reset, and result tables. The hand-drawn SQL badge sits at the upper right,
editor tools at the upper left in a fixed header outside the scrolling source,
and Run/Stop at the lower right of the code box.
Results use the course’s hand-ruled table style in a paper output box, with
green success and red error notices. Single results omit the visible count
caption; empty results say No rows. Its body is SQL text, without a Markdown code fence:

```go-html-template
{{</* sql-app model="world" title="European countries" */>}}
SELECT country FROM LocatedIn WHERE continent = 'Europe';
{{</* /sql-app */>}}
```

`model` names a relational configuration in `data/fol/` (default `world`). Each
run creates a fresh database from that model. Use `empty="true"` for an
initialization example that supplies its own CREATE TABLE and INSERT statements.
Instances do not share databases or save student data. Reset restores the
original SQL text. The pencil unlocks the editor; a successful Run freezes it.
Ctrl/Command+Enter runs the editor too.

The FOL correspondence apps use the same runtime. Initialization runs on an
empty database and updates the model after validating its tables. Query runs
start from the displayed model and leave it unchanged. Run accepts SQLite
syntax beyond the narrower [FOL translation fragment](fol-sql.md).

## Runtime

The unmodified sql.js 1.14.2 loader and WASM binary are in
`assets/vendor/sql.js/`, with their MIT license, AUTHORS list, provenance, and hashes. The visible
“Powered by sql.js” link opens the full bundled license and author notices. Hugo emits
fingerprinted URLs. A dedicated worker fetches the engine only after Run;
all requests stay on the course origin. Both production artifacts total
704,945 bytes before compression. The test server serves WASM with its MIME type.

Each run owns a worker and a fresh database. Completion, Stop, edits, and page
exit terminate the worker. Loading has a 30-second deadline; SQL execution has a
five-second deadline. Termination discards any partial changes. A later Run
starts clean, including after a loading failure or SQL error.

Results include at most eight tables, 40 columns per table, and 200 rows per
table. Long cell text is truncated at 2,000 characters; blobs display their
byte length. Empty SELECT results retain their column headings. Scripts without
query results list the resulting database tables and row counts. Output uses
text nodes, including SQL error messages and strings that resemble HTML.

`sql-condition "NOT (query(A))"` renders an inline SQL template using Hugo’s
SQL highlighting, for translation tables. `query(A)` is pedagogical notation,
not an executable SQL function.

## Related

- [FOL exercises](fol-practice.md), [SQL correspondence](fol-sql.md), [model data](fol-data.md), [chapter apps](README.md).
