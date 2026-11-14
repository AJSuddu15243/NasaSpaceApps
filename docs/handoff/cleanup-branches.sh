#!/usr/bin/env bash
# Delete remote branches that hold no work: 0 commits ahead of origin/main and no open PR.
# Dry run by default. Apply with:  bash docs/handoff/cleanup-branches.sh --apply
set -euo pipefail
REPO=AJSuddu15243/NasaSpaceApps
git fetch -q --prune origin "+refs/heads/*:refs/remotes/origin/*"
open_heads=$(gh pr list -R $REPO --state open --json headRefName -q '.[].headRefName')
for ref in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin | grep -v -e '^origin/HEAD$' -e '^origin/main$' -e '^origin$'); do
  b=${ref#origin/}
  ahead=$(git rev-list --count origin/main.."$ref")
  if [[ "$ahead" == "0" ]] && ! grep -qx "$b" <<<"$open_heads"; then
    if [[ "${1:-}" == "--apply" ]]; then git push -q origin --delete "$b" && echo "deleted $b"; else echo "would delete $b"; fi
  else
    echo "keep   $b ($ahead ahead$(grep -qx "$b" <<<"$open_heads" && echo ', open PR'))"
  fi
done
