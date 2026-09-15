# Solutions and passwords

Exercise solution controls connect a question ID to a solution ID:

```markdown
# Example question {#example .solved}

Question text.

## Solution {#exampleSolution .solution}

Solution text.
```

The [exercise heading hook](../../layouts/exercises/_markup/render-heading.html)
and [`exercises.js`](../../assets/js/exercises.js) connect the question ID plus
`Solution` to the solution block, and the page `params.id` to the password lookup.
Hugo generates a heading ID when none is supplied. Use an explicit ID to keep
solution controls working when you rename a question. Verify the modal and
collapse in a browser. Answers are present in delivered HTML.

## The password table

The `passwords` table stores lowercase hexadecimal SHA-256 hashes of exact UTF-8
passwords. Matching is case-sensitive and does not trim spaces. Choose memorable
course-themed passwords and share the plaintext list outside the repository;
do not put it in documentation, tests, or scripts. To replace a hash, run

```sh
python3 -c 'import getpass, hashlib; print(hashlib.sha256(getpass.getpass("New password: ").encode()).hexdigest())'
```

and paste the output into the entry for the sheet's `params.id`.
The browser uses Web Crypto, which requires HTTPS or localhost. Hashing only
obscures the password list; solutions remain in the HTML. Browser tests substitute
a test-only hash in the served script, keeping real passwords out of fixtures.

Self-checking app exercises do not need duplicate solution blocks. Retain
written solutions when an exercise also asks for explanations or an algorithm.

## Related

- [Solution disclosure](../design/components.md) — the button and its states.
- [Validation and known caveats](../technical/caveats.md) — why this is not access control.
