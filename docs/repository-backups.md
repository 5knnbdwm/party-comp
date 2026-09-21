# Development, backups and public exports

`5knnbdwm/party-comp-backup` is the private development repository. Its main checkout remains at `~/Developer/personal-party-comparison`. All development branches and worktrees use its `origin`.

`~/Developer/party-comp-public` is an independent clone of the existing public `5knnbdwm/party-comp` repository. It retains its public history and receives copied file contents only. Private commits are never merged or pushed into it.

## Files and worktrees

Commit code, data, raw archive files, agent logs in `runs/`, and vendor files. Git LFS stores `archive/blobs/` and `vendor/`. Install it with `brew install git-lfs`, then run `git lfs install --local` and `git lfs pull` when setting up a new clone. Preserve the custom pre-push hook if Git LFS asks to replace it.

New worktrees inherit committed files. Existing branches need the migration commit merged before they gain archive tracking. Use real files in each worktree, not symlinks to another checkout's archive. Commit newly collected evidence with the data that cites it.

`tmp/` stays outside Git and is included in S3 snapshots. `node_modules/` is excluded from both Git and S3; restore it with `bun install`. `.env`, `.env.*`, credential files, and private key files stay local and out of backups. Keep credentials in a password manager. These filename rules are not a content scanner: never put secrets in ordinary source files or logs.

## Push hook

Install from the main checkout with:

```sh
git config core.hooksPath "$PWD/.githooks"
```

The hook accepts only pushes to the private repository, verifies that it is still private, and refuses pushes when the pushing checkout has untracked durable files or any worktree still has shared archive symlinks. Ignored scratch files do not block it. Other worktrees can keep working while a branch is pushed. Uncommitted edits in every worktree are captured in S3 but still need a commit to participate in merges.

It backs up all worktrees to S3, uploads Git LFS objects, and, for updates to `main`, publishes the allowlisted committed snapshot to the public checkout. Feature branch pushes remain private. A failure stops the original push. Git's pre-push hook runs before the private push succeeds, so the S3 snapshot or public export may succeed even if the later private push fails. Retrying is safe. `--no-verify` skips these steps; `--dry-run` can still invoke them.

On a new machine, set up the main `.env`, authenticate `gh` and Git, install Bun, AWS CLI and Git LFS, and clone the public repository to the export location before enabling the hook.

## S3 snapshots

The main checkout's `.env` supplies `S3_URL`, `S3_REGION`, `S3_BUCKET_NAME`, `S3_ACCESS_KEY`, and `S3_SECRET_ACCESS_KEY`. Worktrees use that file without copying its contents. Credentials are passed to AWS CLI through its environment and never placed in command arguments.

```sh
bun scripts/backup-s3.ts
```

Each run creates a new `party-comp/snapshots/<timestamp-and-id>/` prefix. It contains a Git bundle of all branches and tags, plus a compressed working-directory snapshot for every worktree, including ignored scratch files and uncommitted changes. Symlinks are preserved without following them. Dependencies, Git metadata, credentials and backup scratch output are excluded. The working snapshots contain actual LFS files from checked-out worktrees; historical LFS objects remain on GitHub LFS and are not embedded in the Git bundle.

Each uploaded file has SHA-256 metadata and is checked for matching size and metadata. `manifest.json` is uploaded last, so its presence marks a completed snapshot. Failed uploads can leave an incomplete prefix. Backups never delete older S3 objects. Configure bucket lifecycle rules if you want retention limits. These are full snapshots, so frequent pushes consume storage and bandwidth.

For a consistent snapshot, pause other writers while it runs. Git history and working files are captured sequentially, not through a filesystem snapshot.

To restore, download a completed prefix with AWS CLI configured for the bucket. Compare each artifact's SHA-256 against `manifest.json`. Clone `repository.bundle`, restore the private GitHub URL as `origin`, and run `git lfs pull`. Extract the desired `worktree-N.tar.gz` into its checkout to recover working files and scratch space. The manifest records each original checkout path, branch and HEAD. Restore `.env` separately from your password manager and run `bun install`.

## Public exports

`public-files.txt` lists individual public paths. New files stay private until explicitly added. Raw archives, logs, scratch files, vendor files and credentials are rejected even if listed. Exported paths must be regular committed files; symlinks and submodules are rejected.

To stage a preview from a committed revision:

```sh
bun scripts/publish-public.ts main
git -C ~/Developer/party-comp-public diff --cached
```

Review and then commit and push from the public checkout. Alternatively, `bun scripts/publish-public.ts main --push` exports, commits and pushes in one command. Main pushes invoke this automatically. The exporter requires a clean public checkout, fast-forwards its public history, and copies only the revision's allowlisted blobs. It does not copy the private working directory or Git history. Public files removed from the list are removed in the next export; their existing public history remains.
