# Function tables

Use `function-table` for a finite operation table: the first argument runs down
the first column, the second across the first row. The name occupies the corner.
Only the input/output boundaries are ruled. Ordinary truth tables with a column
per input should remain Markdown tables.

```text
{{< function-table name="AND" >}}
{"rows":["0","1"],"columns":["0","1"],"values":[["0","0"],["0","1"]]}
{{< /function-table >}}
```

For unary operations, use `"columns":["output"]` and one output per row.
The shortcode validates row lengths. Wrap adjacent tables in
`<div class="function-tables">` to arrange them side by side with wrapping.
The addition apps reuse the same CSS for discovered sums; `function-table.js`
provides the DOM renderer for circuit targets and checked outputs.


## Written addition

`column-addition` presents authored binary digits in aligned columns, using the
same table styling as the live two-bit adder:

```text
{{< column-addition top="1101" bottom="1001" result="10110" carries="1  1 " >}}
```

The result determines the width. Other rows are padded on the left. `carries`
aligns with the destination columns: show `1` where a carry comes in and spaces
elsewhere. Carries appear as small red subscripts on the lower left of the destination digit in the second summand,
immediately above the calculation rule. The shortcode checks digit syntax and row widths but does not calculate
or verify the supplied arithmetic. Its page-local CSS is shared with the app's
`column-addition.js` renderer.
