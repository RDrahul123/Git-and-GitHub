# 03 — Git Internals: Objects, References, and `HEAD`

**Previous:** [02 — Git basics](../02-git-basics/README.md) · **Home:** [Course home](../README.md) · **Next:** [04 — Branching & merging](../04-branching-merging/README.md)

## What a repository stores

Git makes snapshots by storing objects in `.git/objects` and names that point to commits in refs. This content-addressed design makes history verifiable and lets many commits reuse identical file content.

**Analogy:** objects are labeled archive boxes whose labels are calculated from their contents; refs are index cards that point to the box representing a named version. A branch name moves; its commits do not mutate.

### Commit object structure

```mermaid
flowchart TD
  C[Commit object<br/>tree, parent(s), author, committer, message]
  C --> T[Tree object<br/>directory entries + modes]
  T --> B1[Blob object<br/>file bytes]
  T --> T2[Subtree object<br/>nested directory]
  T2 --> B2[Blob object<br/>another file]
```

### Repository layout (simplified)

```text
.git/
├── HEAD                 # symbolic ref or detached commit ID
├── config               # local repository settings and remotes
├── index                # proposed next snapshot (staging area)
├── objects/             # blobs, trees, commits, annotated tags
├── refs/heads/          # local branch names -> commit IDs
├── refs/remotes/        # remote-tracking names -> observed commit IDs
└── logs/                # reflogs, when enabled
```

## Object IDs and plumbing commands

Git hashes a typed object representation (including its type and size) to identify it. Modern Git repositories commonly use SHA-1 or SHA-256; the algorithm depends on repository initialization. A hash is an identifier, not encryption. Do not assume every repository has 40-character SHA-1 IDs.

| Command | Use |
|---|---|
| `git cat-file -t OBJECT` | Show object type |
| `git cat-file -p OBJECT` | Pretty-print object content |
| `git rev-parse HEAD` | Resolve a revision to object ID |
| `git ls-tree HEAD` | List a tree's entries |
| `git show-ref` | List refs and object IDs |
| `git count-objects -v` | Inspect loose/packed object storage |

### Walkthrough: inspect a commit

In the repository created in the previous lesson:

```console
$ git rev-parse --short HEAD
abc1234
$ git cat-file -t HEAD
commit
$ git cat-file -p HEAD
tree 8f00... (object ID varies)
author Your Name <you@example.com> 1710000000 +0000
committer Your Name <you@example.com> 1710000000 +0000

docs: add recipe notes
$ git ls-tree HEAD
100644 blob ...    README.md
```

The outputs are representative. Run `git cat-file -p HEAD^{tree}` to inspect the root tree. `HEAD` usually names the current branch; the branch ref then points at the current commit.

## `HEAD`, refs, and tags

| Name | Meaning |
|---|---|
| `HEAD` | Current checkout; usually a symbolic reference such as `ref: refs/heads/main` |
| Local branch | Movable pointer to a commit, e.g. `refs/heads/main` |
| Remote-tracking branch | Local record of a remote branch, e.g. `refs/remotes/origin/main` |
| Lightweight tag | A name directly pointing to an object, often a commit |
| Annotated tag | A tag object with tagger, date, message, and optionally signature |

```bash
git symbolic-ref HEAD
git show-ref
git tag v1.0.0
git tag -a v1.1.0 -m "Release 1.1.0"
```

## Common pitfalls and pro tips

- Never edit `.git` files manually unless recovering with a well-understood procedure; use Git commands.
- `.git/objects` may be packed, so a missing loose-object file is normal.
- Hash IDs change when relevant object content changes; a commit also changes when its tree, parent, or metadata changes.
- Use `git cat-file` and `git show` to inspect; these are read-only.
- Reflogs record recent local ref movement and are useful recovery aids, not a substitute for backup or remote publishing.

> [!NOTE]
> The index is a Git data structure often called the *cache* or *staging area*. It is not a separate commit and is not the working directory.

## Quick recap

- Blobs contain file data; trees describe directories; commits point to trees and parent commits.
- `HEAD` identifies what is checked out; refs give human-friendly movable names to commits.
- Content hashes provide object identity and integrity checks; they do not hide data.

**Previous:** [02 — Git basics](../02-git-basics/README.md) · **Home:** [Course home](../README.md) · **Next:** [04 — Branching & merging](../04-branching-merging/README.md)
