#!/usr/bin/env bash
# Regroup the open, UNASSIGNED, non-data / non-Rust / non-pipeline issues into six UI issues.
# Closed issues, assigned issues and every PIPE/ENG/DATA/EPH issue are left untouched.
# Dry run by default. Apply with:  bash docs/handoff/remap-issues.sh --apply   (needs `gh auth login`)
set -euo pipefail
REPO=AJSuddu15243/NasaSpaceApps
APPLY=${1:-}
DIR="$(cd "$(dirname "$0")" && pwd)/issues"
run() { if [[ "$APPLY" == "--apply" ]]; then "$@"; else printf 'DRY: %q ' "$@"; echo; fi; }

# Guard: only touch an issue if it is still open and unassigned.
safe() {
  local n=$1 state assignees
  state=$(gh issue view "$n" -R $REPO --json state -q .state)
  assignees=$(gh issue view "$n" -R $REPO --json assignees -q '.assignees|length')
  [[ "$state" == "OPEN" && "$assignees" == "0" ]]
}

create() { # title assignee bodyfile absorbed... -> prints issue number
  local title=$1 who=$2 file=$3; shift 3
  local body url; body=$(mktemp)
  # Context first: append every absorbed issue's original text so nothing is lost.
  { cat "$file"; echo; echo "## Context carried over"; echo "This issue absorbs: $(printf '#%s ' "$@"). Their original text follows."
    for n in "$@"; do
      echo; echo "<details><summary>#$n $(gh issue view "$n" -R $REPO --json title -q .title)</summary>"; echo
      gh issue view "$n" -R $REPO --json body -q .body; echo; echo "</details>"
    done; } > "$body"
  if [[ "$APPLY" == "--apply" ]]; then
    url=$(gh issue create -R $REPO --title "$title" --assignee "$who" --body-file "$body")
    echo "${url##*/}"
  else
    echo "DRY: create '$title' for $who ($(wc -c <"$body") bytes, absorbs $*)" >&2; echo "NEW"
  fi
}

supersede() { # new-number issue...
  local new=$1; shift
  for n in "$@"; do
    if safe "$n"; then
      run gh issue comment "$n" -R $REPO --body "Folded into #$new so the UI work has fewer, sharper issues. All context here still applies; read it before starting #$new."
      run gh issue close "$n" -R $REPO --reason "not planned"
    else
      echo "skip #$n (closed or assigned)"
    fi
  done
}

UI1=$(create "[UI-1] Landing: Moon story, real LOLA relief, dive into the navigator" AnikethB6 "$DIR/UI-1-landing.md")
UI2=$(create "[UI-2] Workspace shell: one demo screen in the landing design system" shaypat112 "$DIR/UI-2-workspace-shell.md" 34 47 33)
UI3=$(create "[UI-3] Time: timeline scrubber + launch-delay comparison" anirvin-dev "$DIR/UI-3-time-launch-delay.md" 36 37 38)
UI4=$(create "[UI-4] Horizon panorama + Sun/Earth tracks from real Horizons data" anirvin-dev "$DIR/UI-4-horizon-panorama.md" 41 42)
UI5=$(create "[UI-5] Evidence: method drawer, validation numbers, determinism" AnikethB6 "$DIR/UI-5-evidence-panel.md" 45 43 46)
UI6=$(create "[UI-6] Workspace 3D: real tiles, ephemeris Sun, site markers" Advait-Chandrakar1 "$DIR/UI-6-workspace-3d.md" 51 52 53 54 56)

supersede "$UI2" 34 47 33        # WEB-4 scenario controls, WEB-15 states/a11y, WEB-3 site picker follow-ups
supersede "$UI3" 36 37 38        # WEB-6 timeline, WEB-7 launch delay, WEB-8 calendar
supersede "$UI4" 41 42           # WEB-9 panorama, WEB-10 charts
supersede "$UI5" 45 43 46        # WEB-13 validation, WEB-11 weights (stretch), WEB-14 export (cut)
supersede "$UI6" 51 52 53 54 56  # SCN-3, SCN-4, SCN-5, SCN-6, SCN-8

# Keep with new owners (still open and unassigned, so no context is lost):
safe 5  && run gh issue edit 5  -R $REPO --add-assignee shaypat112     # FND-3 deploy (demo URL)
safe 48 && run gh issue edit 48 -R $REPO --add-assignee AJSuddu15243   # INT-1 real engine end to end
echo "Done. New issues: UI-1 #$UI1, UI-2 #$UI2, UI-3 #$UI3, UI-4 #$UI4, UI-5 #$UI5, UI-6 #$UI6"
