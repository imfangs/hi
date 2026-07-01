#!/bin/bash
# 部署脚本：本地构建 Astro 并推送到 gh-pages 分支
# 用法：./deploy.sh [commit message]
# 说明：绕过 GitHub Actions（避开 billing 锁），走"本地 build + push gh-pages"老式部署。

set -e

MSG="${1:-deploy: update site}"
DIST_TMP="/tmp/hi-astro-dist-$$"
ON_GHPAGES=false

# 异常退出时确保回到 main 分支
cleanup() {
  if [ "$ON_GHPAGES" = true ]; then
    echo "⚠️  异常退出，切回 main..."
    git checkout main --force
  fi
  rm -rf "$DIST_TMP"
}
trap cleanup EXIT

# 确保在 main 分支
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
  echo "❌ 当前不在 main 分支（在 $BRANCH），请先切回 main"
  exit 1
fi

# 检查未提交改动
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "⚠️  main 分支有未提交的改动，先提交："
  git add -A
  git commit -m "$MSG"
  git push origin main
  echo "✅ main 已提交并推送"
else
  echo "✅ main 分支干净"
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  pnpm install
fi

# 构建
echo "🔨 构建中..."
pnpm build

# 复制构建产物到临时目录
rm -rf "$DIST_TMP"
cp -r dist "$DIST_TMP"

# 检查 gh-pages 分支是否存在（本地）
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
elif git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch origin gh-pages
  git checkout -b gh-pages origin/gh-pages
else
  echo "🆕 首次部署，创建孤立分支 gh-pages"
  git checkout --orphan gh-pages
fi
ON_GHPAGES=true

# 清除旧文件（保留 .git）
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '.git' \
  -exec rm -rf {} +

# 复制新构建产物
cp -r "$DIST_TMP"/* .
# 隐藏文件（比如 .nojekyll 如果 Astro 生成的话）也拷贝
cp -r "$DIST_TMP"/.[!.]* . 2>/dev/null || true

# GitHub Pages 关键：告诉 Jekyll 不要处理这些文件
touch .nojekyll

# CNAME
echo "hi.fangs.cc" > CNAME

# 提交并推送
git add -A

if git diff --cached --quiet; then
  echo "ℹ️  产物没有变化，跳过部署"
else
  git commit -m "$MSG"
  git push origin gh-pages
  echo "✅ 已部署到 gh-pages"
fi

# 切回 main
git checkout main --force
ON_GHPAGES=false

echo "🎉 完成！等 1-2 分钟后刷新 hi.fangs.cc 查看"
