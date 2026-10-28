# Contributing

This repository follows a simple workflow so the history stays clean and easy to scan.

## Workflow

1. Create a branch from `main` named `type/short-description`, for example `docs/update-readme` or `fix/contrast-audit`.
2. Commit your changes on that branch.
3. Open a pull request into `main` with a Conventional Commits title.
4. Before merging, confirm every check on the pull request is green. To run them locally first, see Local development in the [README](README.md).
5. Squash merge the pull request. The commit on `main` takes the pull request title plus its number, for example `docs: update README (#12)`.

## Commit and pull request titles

Use the [Conventional Commits](https://www.conventionalcommits.org) format: `type: short summary in the imperative mood`.

| Type | Use it for |
|---|---|
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting or visual polish with no change in behavior |
| `refactor` | Code restructuring with no change in behavior |
| `test` | Adding or updating tests |
| `ci` | GitHub Actions and other automation |
| `chore` | Maintenance, dependencies, and configuration |
| `security` | Security hardening or fixes |

Guidelines:

- Keep the summary under 72 characters, in lowercase after the colon, with no trailing period.
- Describe what changed, not how you felt about it: `fix: correct DNS record example`, not `fixed stuff`.
- Never include passwords, tokens, personal email addresses, or other private details in titles or messages.

## Commit identity

Commit with GitHub's private noreply address so a personal email address never appears in the history:

```bash
git config user.email "60675702+khaneilcampbell@users.noreply.github.com"
```

## GitHub Actions

- Pin every action to a full commit SHA with the version in a comment, for example `uses: actions/checkout@<sha> # v7.0.1`. Dependabot keeps them current.
- Give each workflow `permissions: contents: read` and grant more only to the job that needs it.
- Check out with `persist-credentials: false` and set a `timeout-minutes` on each job.
- `workflow-lint.yml` runs zizmor on every pull request and fails on unpinned actions, saved credentials, template injection or broad permissions.

## Security

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md), never in a public issue.
