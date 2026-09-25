#!/usr/bin/env bash
# Build and publish only in an isolated worktree. The source checkout stays intact.
set -euo pipefail
cd "$(dirname "$0")"

if [[ "$(git config --local user.name)" != "imfangs" ]] || [[ "$(git config --local user.email)" != "mafangshuai@126.com" ]]; then
  echo 'Unexpected project-local Git identity.' >&2; exit 1
fi
case "$(git remote get-url origin)" in
  https://github.com/imfangs/hi.git|git@github.com:imfangs/hi.git) ;;
  *) echo 'Unexpected deployment repository.' >&2; exit 1 ;;
esac
if [[ -n "$(git status --porcelain)" ]]; then
  echo 'Commit the intended source changes before publishing; no files are auto-staged.' >&2; exit 1
fi
SOURCE_SHA=$(git rev-parse HEAD)
if [[ ! -d node_modules ]]; then pnpm install --frozen-lockfile; fi
pnpm build
SOURCE_SHA="$SOURCE_SHA" node --input-type=module -e '
import { writeFileSync } from "node:fs";
writeFileSync("dist/release.json", JSON.stringify({source:process.env.SOURCE_SHA,builtAt:new Date().toISOString()})+"\n");'

git fetch origin gh-pages
DEPLOY_DIR=$(mktemp -d /tmp/hi-deploy.XXXXXX)
cleanup() { git worktree remove --force "$DEPLOY_DIR" >/dev/null 2>&1 || true; }
trap cleanup EXIT
git worktree add --detach "$DEPLOY_DIR" origin/gh-pages
# This affects only the freshly created deployment worktree.
git -C "$DEPLOY_DIR" rm -r --ignore-unmatch . >/dev/null
cp -R dist/. "$DEPLOY_DIR/"
touch "$DEPLOY_DIR/.nojekyll"
printf '%s\n' 'hi.fangs.cc' > "$DEPLOY_DIR/CNAME"
git -C "$DEPLOY_DIR" add -A
if git -C "$DEPLOY_DIR" diff --cached --quiet; then
  echo 'Build unchanged.'; exit 0
fi
git -C "$DEPLOY_DIR" commit -m "${1:-Publish portfolio update}"
git -C "$DEPLOY_DIR" push origin HEAD:gh-pages
printf 'Published source %s. Verify https://hi.fangs.cc/release.json and public pages.\n' "$SOURCE_SHA"
