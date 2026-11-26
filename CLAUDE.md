# CLAUDE.md

@AGENTS.md

## Claude Code only

- `.claude/rules` is a symlink into `.agents/rules`. `.claude/skills/` holds one link per shared skill into `.agents/skills/`, plus Impeccable's Claude copy. Edit shared files under `.agents/`, never through a link path in links or docs.
- Rules under `.claude/rules/` load automatically; `figma.md`, `vue.md` and the `project/` rules load once a matching file is read or edited. Contracts and `DESIGN.md` are not rules: open them yourself.
- Subagents: `coursework-checker` runs `coursework-check`; `quality-reviewer` runs `quality-review`. Use both before saying a prototype is done. The `impeccable-*` agents belong to Impeccable.
- Visual checks use Claude in Chrome: load the `claude-in-chrome` skill before the first `mcp__claude-in-chrome__*` call (see `visual-verification.md`). It runs in the user's signed-in Chrome, so it cannot prove a link is public; use the Playwright browser for that.
- The Figma MCP is the tool for the low-fi. Load the Figma plugin's `figma-use` and `figma-generate-design` skills before calling `use_figma`.
- Impeccable's design hook is configured in `.claude/settings.local.json` (local, not committed). Its findings on UI files are part of the work: fix them.
