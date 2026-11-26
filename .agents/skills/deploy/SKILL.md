---
name: deploy
description: Publish the high-fi app to GitHub Pages from a public repository and confirm the public links open for someone who is not logged in. Use when the user asks to deploy, publish, put the app online, create the repository, or fix the live link.
---

Read first: [`brief.md`](../../contracts/brief.md) (B-07, B-09, U-02), [`project/submission.md`](../../rules/project/submission.md), [`project/hifi.md`](../../rules/project/hifi.md).

Creating a public repository and pushing to it are visible to everyone and hard to undo. **Ask the user before each of those two steps**, every time.

## 1. Before anything is pushed

1. `npm run build` passes in `prototypes/high-fi`.
2. The repository exists locally (`git init` on first run) with the root `.gitignore`.
3. Prove nothing private is tracked. Both commands must print nothing:

```bash
git ls-files | grep -E '^context/|node_modules/|/dist/|\.env|settings\.local'
git status --short | grep -E 'context/'
```

4. Read the list of files about to be committed. Stop and ask if anything looks like a secret or personal data.

## 2. Repository

1. Agree the repository name with the user. The Vite `base` must be `/<repository-name>/`.
2. Create it public with the GitHub CLI and push, after the user says yes.

## 3. GitHub Pages

1. Add a GitHub Actions workflow that installs, builds `prototypes/high-fi` and publishes its `dist` folder with the official Pages actions. Check the current action versions in GitHub's documentation.
2. Set the repository's Pages source to GitHub Actions.
3. Push and wait for the workflow run to finish. Read the run result; a failed run is not a deploy.

## 4. Confirm from outside

All of these, from a client that is not logged in:

- The live link returns 200 and the page is not blank: fetch the HTML, then fetch each script and stylesheet it names and confirm 200. A 404 here means the `base` is wrong.
- The repository link returns 200.
- A deep link, for example `<live link>#/admin/debtors`, opens that screen, and a refresh stays on it.
- Ask the user to open both links in a private window. Say plainly if you could only check with `curl`.

## 5. Record

- Put the repository link and the live link in the root `README.md` and in `handoff/links.md`.
- Add a row to [`decisions.md`](../../contracts/decisions.md) with the repository name.

## Before saying it is done

Run the `coursework-check` skill with scope "deploy". Report each link with how it was checked.
