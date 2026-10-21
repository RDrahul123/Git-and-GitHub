# 01 — Installation & Setup

**Previous:** [00 — Introduction](../00-introduction/README.md) · **Home:** [Course home](../README.md) · **Next:** [02 — Git basics](../02-git-basics/README.md)

## Install Git

Git is the executable that creates and reads repositories. Installing it gives your terminal the same basic version-control commands across operating systems.

**Analogy:** installing Git is like installing a workshop's tools; configuration labels your workbench, and SSH keys are its secure access badge.

| Platform | Typical installation | Verify |
|---|---|---|
| Windows | Install Git for Windows from [git-scm.com](https://git-scm.com/download/win); Git Bash is included. | `git --version` |
| macOS | `xcode-select --install`, or install Git with Homebrew: `brew install git`. | `git --version` |
| Debian/Ubuntu | `sudo apt update && sudo apt install git` | `git --version` |
| Fedora | `sudo dnf install git` | `git --version` |
| Arch Linux | `sudo pacman -S git` | `git --version` |

Prefer your operating system's trusted package manager or the official Git downloads. Avoid running unrelated shell commands copied from unknown sources.

## Configure identity and defaults

Git records author and committer names/emails in commits. These values are metadata, not credentials. Set them globally for your user or locally per repository.

| Command | Effect |
|---|---|
| `git config --global user.name "Your Name"` | Set identity for all your repositories |
| `git config --global user.email "you@example.com"` | Set commit email; choose a GitHub-verified or private noreply address if desired |
| `git config --global init.defaultBranch main` | Use `main` for newly initialized repositories |
| `git config --global core.editor "code --wait"` | Use VS Code as the commit-message editor (if installed) |
| `git config --list --show-origin` | Inspect values and where they were set |

```console
$ git config --global user.name "Ada Lovelace"
$ git config --global user.email "ada@example.com"
$ git config --global init.defaultBranch main
$ git config --get user.name
Ada Lovelace
```

**Walkthrough:** run the three configuration commands, create `git-setup-check`, run `git init`, then `git status --short --branch`. To override one repository only, run the same `git config` commands there without `--global`.

## SSH authentication

SSH keys authenticate your computer to a hosting service without typing an account password for each Git operation. A public key is uploaded to GitHub; keep the private key on your device.

```mermaid
sequenceDiagram
  participant You as Local machine
  participant Host as GitHub
  You->>You: Create private/public key pair
  You->>Host: Add public key in account settings
  You->>Host: Connect using SSH remote URL
  Host->>You: Verify key; allow repository access
```

| Step | Command / action |
|---|---|
| Create an Ed25519 key | `ssh-keygen -t ed25519 -C "you@example.com"` |
| Start agent (macOS/Linux shell) | `eval "$(ssh-agent -s)"` |
| Add key | `ssh-add ~/.ssh/id_ed25519` |
| Copy public key | macOS: `pbcopy < ~/.ssh/id_ed25519.pub`; Windows PowerShell: `Set-Clipboard -Value (Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub)`; Linux: use your desktop clipboard tool |
| Add to GitHub | Settings → SSH and GPG keys → New SSH key; paste the **public** key |
| Test connection | `ssh -T git@github.com` |

Expected success resembles `Hi USER! You've successfully authenticated, but GitHub does not provide shell access.` The greeting may not appear until the host key is accepted. Never share `id_ed25519` (no `.pub` suffix).

## Signed commits with GPG (overview)

Signing attaches a cryptographic signature to a commit, allowing a host or team to verify that a key signed it. It is useful when a project requires verified commits, but it does not encrypt the commit or prove the code is correct. Create/import a GPG key using your OS's trusted GPG package and follow the host's current instructions to publish the public key.

| Command | Purpose |
|---|---|
| `gpg --list-secret-keys --keyid-format=long` | Find your signing key ID |
| `git config --global user.signingkey KEY_ID` | Select key |
| `git config --global commit.gpgsign true` | Sign commits by default |
| `git commit -S -m "docs: explain setup"` | Sign one commit |
| `git verify-commit HEAD` | Verify a local commit signature |

Check that the Git signing program is configured correctly for your platform if signing fails. You can set the signing format explicitly with `git config --global gpg.format openpgp` for GPG.

## Common pitfalls and good practice

- **Wrong identity:** inspect `git config --show-origin --get user.email`; repository-level config overrides global config.
- **SSH permission denied:** confirm the public key was added to the correct account, agent has the private key, and remote uses `git@github.com:OWNER/REPO.git`.
- **Private key exposed:** remove/revoke it immediately, generate a replacement, and inspect public repository history for exposure.
- **Signing fails on Windows:** ensure GPG is installed and configure `gpg.program` to its executable if Git cannot locate it.

> [!WARNING]
> A public SSH/GPG key is safe to upload; its matching private key is secret. Never commit private keys, tokens, or credentials.

## Quick recap

- Install Git and verify with `git --version`.
- Configure author metadata and inspect config origins.
- SSH authenticates access; GPG signs commit metadata. Neither should expose private keys.

**Previous:** [00 — Introduction](../00-introduction/README.md) · **Home:** [Course home](../README.md) · **Next:** [02 — Git basics](../02-git-basics/README.md)
