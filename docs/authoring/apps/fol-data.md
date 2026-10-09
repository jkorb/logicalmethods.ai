# Model data

Each `model="key"` selects `data/fol/key.json`. Language and object choices
belong to the configuration, so exercises can supply their own signatures and
palettes without changing the app. The signature remains fixed within an instance.

| Field | Contents |
| --- | --- |
| `language` | `constants`: names; `functions` and `predicates`: name-to-arity maps |
| `objects` | Catalog of stable `id`, accessible `label`, and optional asset-relative SVG `image` or `emoji` |
| `model.domain` | IDs of the initial domain objects |
| `model.constants` | Constant-to-object map |
| `model.functions` | Symbol-to-table maps, keyed by JSON-encoded input tuples |
| `model.predicates` | Symbol-to-array-of-tuples maps |
| `columns` | Optional predicate column names for tables and SQL |
| `queries` | Optional `label`/`formula` examples |

Objects can have `group` for graph columns and `badge` for a short emoji label.
Emoji decorations never replace the underlying object IDs in query evaluation
or SQL. Native emoji appearance depends on the device. The `world` example uses
flags, landmarks or illustrative sights, and language speech bubbles; its
`CityIn` table includes New York without treating it as a capital.

`people-domain`, `people-constants`, `people-functions`, and `people-relations`
introduce components separately; `people` combines them. Empty signatures are
valid. Empty domains and missing constant or function values are editable
intermediate states, but cannot be evaluated as complete models.

The pure modules `fol-parser.js` and `fol-model.js` share typed trees and local
assignment copies. Limits: 32 objects, arities 1–3, 10,000 candidate tuples,
50,000 calls per evaluation, and 100,000 per query. Raw traces retain 2,500
entries plus the result. Exceeding a computation limit returns no truth-value.

## Related

- [Model canvas](fol.md), [SQL correspondence](fol-sql.md), [chapter apps](README.md).
