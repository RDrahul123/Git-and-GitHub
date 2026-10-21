# 02 — Git Basics

**Previous:** [01 — Installation & setup](../01-installation-setup/README.md) · **Home:** [Course home](../README.md) · **Next:** [03 — Git internals](../03-git-internals/README.md)

## The first useful mental model

Git separates edits from the next snapshot. The **working directory** is where files are edited; the **staging area** (index) is the exact selection for the next commit; the **local repository** stores committed history; a remote can share it with others.

**Analogy:** editing is drafting a letter, staging is selecting pages for an envelope, commit is sealing and labeling the copy, and push is mailing it to the team archive.

```mermaid
flowchart LR
  W[Working directory<br/>edit files] -->|git add| I[Staging area / index<br/>choose snapshot]
  I -->|git commit| L[Local repository<br/>record commit]
  L -->|git push| R[(Remote repository)]
  R -->|git fetch / pull| L
```

## Essential command table

| Command | What it does | Common options |
|---|---|---|
| `git init` | Create a repository in current directory | `-b main` |
| `git clone URL` | Copy a repository and its history | `--depth 1` for limited history |
| `git status` | Show branch and working/index state | `--short`, `--branch` |
| `git add PATH` | Stage current file content | `-A` all changes; `-p` interactively select hunks |
| `git commit` | Create a commit from the index | `-m`, `-a` (tracked files only), `--amend` |
| `git log` | Inspect history | `--oneline --graph --decorate`, `-p`, `-n 5` |
| `git diff` | Compare working tree/index/commits | `--cached`, `--staged`, `--check` |
| `git rm PATH` | Remove a tracked file and stage removal | `--cached` stop tracking, keep file |

## Walkthrough: create a first snapshot

```bash
mkdir recipe-notes
cd recipe-notes
git init -b main
```

Create `README.md` containing `# Recipe notes`, then run:

```console
$ git status --short
?? README.md
$ git add README.md
$ git status --short
A  README.md
$ git diff --cached
diff --git a/README.md b/README.md
new file mode 100644
... (diff body omitted)
$ git commit -m "docs: add recipe notes"
[main (root-commit) abc1234] docs: add recipe notes
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

The abbreviated hash and output wording vary by Git version. Confirm with `git log --oneline --decorate` and `git status --short` (no output means clean).

## Read and compare changes

```bash
git diff                 # unstaged working-tree changes
git diff --staged        # staged changes vs HEAD
git diff HEAD            # all tracked changes vs latest commit
git log --oneline --graph --decorate --all
```

`git diff` does not display untracked file contents. Add a new file before reviewing its staged patch, or open it directly in your editor.

## Ignore generated and local-only files

Create `.gitignore` at the repository root. Example:

```gitignore
# Dependencies and build output
node_modules/
dist/
build/
# Local environment; never commit real credentials
.env
.env.*
!.env.example
# Editor / OS noise
.DS_Store
Thumbs.db
```

Patterns are relative to the `.gitignore` location; `!` can re-include a path unless an excluded parent directory prevents traversal. A `.gitignore` does not untrack files already committed. To keep a local file but stop tracking it: `git rm --cached -- path/to/file`, then commit the removal. Use `git check-ignore -v path` to learn which rule matches.

## Common mistakes

- **Staging everything blindly:** `git add -A` includes all changes under the current directory. Inspect `git status` and `git diff --cached` before committing.
- **Expecting `git add` to mean “add a file permanently”:** it stages a snapshot; a later edit must be staged again.
- **Using `git commit -a` for new files:** it includes modifications/deletions of tracked files, not untracked files.
- **Accidentally committing secrets:** remove the secret from history, revoke/rotate it, and follow [security practices](../11-best-practices/README.md). Deleting it in a later commit is not enough.
- **Confusing `git diff` and `git diff --staged`:** they compare different areas.

> [!TIP]
> A reliable commit routine is `git status` → inspect `git diff` → stage intentionally → inspect `git diff --staged` → commit.

## Quick recap

- `add` selects content; `commit` snapshots the index.
- `status`, `diff`, and `log` are safe inspection commands—use them often.
- `.gitignore` prevents future untracked files from appearing; it does not remove tracked content.

**Previous:** [01 — Installation & setup](../01-installation-setup/README.md) · **Home:** [Course home](../README.md) · **Next:** [03 — Git internals](../03-git-internals/README.md)
