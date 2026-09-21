# Party promise tracker

Tracks German state party promises from election program through coalition agreement to implementation. Every published status is backed by reviewed evidence. No tech stack is chosen yet.

Read `docs/project-brief.md` before working on scope, the promise data model, statuses, sources, the AI pipeline, anything published on the site or in posts, or the roadmap. It holds the aim, the editorial rules every change must follow, and the open decisions.

Reports and write-ups stay as Markdown in `docs/reports/`. External writes are limited to the private GitHub repository, the configured S3 backup bucket, allowlisted exports to the public GitHub repository, and Wayback snapshot requests. Upload nothing to Postplan, gists or pastebins.

Keep every file this project creates inside this folder. Scratch and temporary files go in `tmp/`. Agent run logs and transcripts go in `runs/`.

Development happens in the private `party-comp-backup` repository. Track raw archives, run logs and vendor files so worktree merges carry them. Credentials stay ignored. Read `docs/repository-backups.md` before changing remotes, backups, publication rules or worktree storage. The separate `~/Developer/party-comp-public` checkout is the public export destination.

Read `docs/promise-format.md` before extracting promises or reading or writing anything in `data/promises/`.

Read `docs/archive-format.md` before scraping, fetching, or reading or writing anything in `archive/` or `data/`. It defines captures, party facts and their sources.
