# Agent.md

How AI coding agents (Claude Code and others) work in this repo.

## Project

NASA Space Apps 2026: **Lunar Landing Site Navigator**. Compare south-pole landing sites and dates by Sun and
Earth position against the real terrain horizon (solar power, thermal exposure, direct-to-Earth comms), with a
deterministic Rust/WASM engine, a weighted greedy site evaluator, heatmaps and a three.js front end.
- Team proposal: [`docs/PROPOSAL.md`](docs/PROPOSAL.md) (wins if it disagrees with the spec).
- **Read [`SPEC.md`](SPEC.md) first.** It is the build spec: features, stack, guardrails, simulation model,
  file contracts and workstreams. Stay inside your workstream's folder.
- Official challenge text: [`docs/CHALLENGE.md`](docs/CHALLENGE.md).
- Folder guides: [`pipeline/AGENTS.md`](pipeline/AGENTS.md), [`engine/AGENTS.md`](engine/AGENTS.md). Task board and team roles: [`docs/TASKS.md`](docs/TASKS.md). Quality bar for every PR: [`docs/QUALITY.md`](docs/QUALITY.md).
- Draft plan and stack review this spec builds on: [`.agent/PLAN.md`](.agent/PLAN.md),
  [`.agent/STACK_REVIEW.md`](.agent/STACK_REVIEW.md). Scoring + greedy design: [`.agent/GREEDY.md`](.agent/GREEDY.md).
- Older ADC terrain grids and links: [`LunarLandingSiteNavigation/`](LunarLandingSiteNavigation/) (high-res local terrain only).

## Demo-day plan (read first)

[`docs/handoff/START-HERE.md`](docs/handoff/START-HERE.md): MVP scope, who owns what, and a ready prompt per person. UI work runs on the six
`[UI-n]` issues described in `docs/handoff/issues/`.

## Active Work

Ananth owns the Rust → WASM simulator work (all ENG issues) as of 2026-11-14; status: **in progress**: ENG-1 to ENG-9 and PIPE-8 merged in #120; web fixes #109/#111/#112 (incl. `web/vercel.json`) merged in #121. Open: the rest of INT-1 (#48), the engine-api schema follow-up PR, and the demo-ready PRs in flight (thresholds and defaults, slip re-scores the cards, hash in the UI, baked engine heatmap, real `sites.json`). Scope and details are in
the [Active Work section of `.agent/PLAN.md`](.agent/PLAN.md#active-work).

Other agents: coordinate with Ananth before implementing a duplicate simulator or modifying the simulation
core / native-WASM interface. This ownership note does not claim UI, rendering, or data work.

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

- Check GitHub with `gh` before starting or resuming work: current `main`, relevant issues/comments, and linked PRs. Do not assume the local checkout is current; treat unmerged PRs as proposals and preserve local changes when syncing.
- Keep Ananth in the decision loop, but he is the bottleneck: batch a task's decisions into one ask, each with options, a recommended default, and the factors that affect it; pick conventional defaults yourself. Wait for Ananth's answers before finalizing algorithms, interfaces, thresholds, or scope, and get explicit approval before implementation.
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
