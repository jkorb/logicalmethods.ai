# Commit scope and messages

## Scope

A dirty worktree is normal: several tasks may be in progress. A request to commit
covers the current task and the supporting changes needed for it to work, not
everything modified in the repository. Proceed without asking about unrelated
changes; ask only when ownership or a required dependency is genuinely ambiguous.

Inspect the existing index first. Stage explicit files or individual hunks; avoid
`git add .`, `git add -A` and `git commit -a`. For mixed files, stage only the
task's changes. Preserve unrelated working edits and pre-existing staged changes;
use a separate index when necessary to keep them out of the commit. Do not stash,
reset or revert other work to make the worktree clean.

Review the exact staged diff and run `git diff --cached --check`. Validate with
the [narrowest relevant checks](../testing/targeted-runs.md); a commit request
alone does not require the full suite. Run `npm test` before pushing. When
validation uses a mixed worktree, do not claim it tested only the staged snapshot.
A commit request does not authorize a push.

## Message

Use a short imperative subject describing the concrete change, preferably under
72 characters: `Document scoped validation and slide review policies`.
Avoid vague subjects such as `Update files` or `Fix things`. No type prefix is
required; use one only when it helps communicate the change.

For a nontrivial change, add a brief body explaining the problem, resulting
behavior and relevant validation or limitations. Describe the final change for
a reader without the conversation; omit agent activity logs and abandoned plans.
Keep one coherent purpose per commit. Report the resulting hash and any checks
run, noting material limitations.
