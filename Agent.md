# Agent.md

How AI coding agents (Claude Code and others) work in this repo.

## Project

NASA Space Apps work. Current track: **Lunar Landing Site Navigation**: find safe routes from an
Artemis III candidate landing site to a target site, using NASA height and slope grids.
Code and data are in [`LunarLandingSiteNavigation/`](LunarLandingSiteNavigation/). The data sources are listed in
[`LunarLandingSiteNavigation/RESOURCES.md`](LunarLandingSiteNavigation/RESOURCES.md).
Active plan and task checklist: [`.agent/PLAN.md`](.agent/PLAN.md) (Moon Base Location Sim, **draft, not final**).

## Skills in use

Skills currently installed in our Claude Code setup. Use the one that fits the task.

### Coding style
| Skill | Use it for |
|---|---|
| `ponytail` (lite / full / ultra) | Default mode. Make the smallest change that fully solves the task. |
| `ponytail-review` | Review a change for correctness, safety, load and bloat |
| `ponytail-audit` | Audit the whole repo: bugs, security, what to delete |
| `ponytail-debt` | List every `shortcut:` comment as a debt ledger |
| `ponytail-gain` / `ponytail-help` | Show savings and give a quick reference |
| `simplify` | Clean up changed code (reuse, efficiency) |
| `code-review` | Review a diff or PR for bugs (`--fix`, `--comment`) |
| `security-review` | Review a security pass on pending changes |
| `run` | Launch the app to confirm a change really works |
| `init` | Generate a CLAUDE.md for a codebase |

### Data, math and visuals
| Skill | Use it for |
|---|---|
| `dataviz` | Any chart, heatmap or slope map. Read it before writing plot code. |
| `mathshow` | Render formulas (slope, A* cost and similar) in the terminal |
| `artifact-design` / `artifact-diagramming` / `artifact-capabilities` | Shareable HTML pages, diagrams and interactive route viewers |
| `xlsx` / `pdf` / `docx` / `pptx` | Read or produce spreadsheets, handbooks, reports and slide decks |
| `docs` | Shared, editable project docs and write-ups |

### Research and automation
| Skill | Use it for |
|---|---|
| `deep-research` | Multi-source research, for example lunar navigation papers |
| `claude-api` | Any LLM feature built on Claude |
| `workflow-authoring` | Multi-agent workflows, only when explicitly requested |
| `loop` / `schedule` | Recurring or scheduled agent tasks |
| `claude-in-chrome` / `built-in-browser` / `computer-use` | Browser or desktop automation, such as pulling Moon Trek tiles |
| `skill-creator` | Write a new project skill |
| `update-config` / `fewer-permission-prompts` / `keybindings-help` | Harness settings |
| `plugin-authoring` | Claude Code mods and hooks |

## Repo rules

- Raw data stays out of git (see `.gitignore`). Download it with the links in `RESOURCES.md`.
- Keep coordinates in the form NASA ships them (polar stereographic grid). Convert only at the edges.
- Every new algorithm (pathfinding, slope cost, parsers) gets one small test or an assert-based self-check.
- Any shortcut gets a comment in this form: `shortcut: <limit>, <when to upgrade>`.
- Commit or push only when asked. Branch off `main` before doing so.

## Agent checklist (per task)

Copy this list into the PR or task note, then tick each item.

### Before
- [ ] Read the task, plus `RESOURCES.md` if data is involved
- [ ] Identify which region and which files (Lat / Lon / Height / Slope) the task uses
- [ ] List every place the change must reach: callers, tests, notebooks, docs
- [ ] Check for an existing helper before writing a new one

### During
- [ ] Use the smallest change that fully works (no speculative options or config)
- [ ] Validate inputs at boundaries: grid shapes match, there are no NaNs, units are known (m, degrees)
- [ ] Respect safety limits in route logic, such as the maximum slope threshold, and document the value used
- [ ] Charts follow `dataviz`, with an accessible palette and axes labeled with units

### After
- [ ] Tests or self-checks pass, and the output was actually run, not just written
- [ ] No raw data files were committed
- [ ] Results are reproducible from the README steps
- [ ] Report what was skipped or left unchecked, and any known risks
- [ ] Update `RESOURCES.md` if any new source was used
