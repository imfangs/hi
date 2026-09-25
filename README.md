# hi.fangs.cc

fangs 的作品集：原生 App、网页游戏与中文阅读站。首页是带真实界面封面的作品列表，点击进入介绍页，再从详情页打开作品。

- 网站：[hi.fangs.cc](https://hi.fangs.cc)
- 接续入口：[AGENTS.md](AGENTS.md)
- 当前状态：[CURRENT.md](CURRENT.md)
- 图片来源：[docs/ASSETS.md](docs/ASSETS.md)

## 本地开发

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
```

Astro 生成纯静态文件到 `dist/`。

## 加一个作品

在 `src/content/projects/<slug>.mdx` 添加条目。既有 slug 就是对外详情 URL，改名时保留 URL。

```yaml
---
title: 项目名
subtitle: 一句话介绍体验。
year: 2026
category: 网页 · 游戏
status: 可体验
featured: true
cover:
  src: /images/projects/example.webp
  alt: 真实界面的说明
stack:
  - TypeScript
links:
  - label: 打开作品
    href: https://example.com/
order: 1
---
```

正文使用 Markdown / MDX，介绍做什么、怎么玩、使用条件。`featured: true` 会进入首页作品列表；其他非 draft 条目仅生成详情；`draft: true` 不生成页面。八个主要项目按 `order` 排序。

封面统一为 1200×750 WebP，保存到 `public/images/projects/`，并补资产来源。网页截图完整缩放留边，App 截图组合展示，不裁掉关键界面或混入私人资料。

## 发布

当前使用 **本地构建 + GitHub Pages 的 gh-pages 分支**，不是 GitHub Actions。

1. 检查 diff，完成构建与浏览器验证，只提交本任务文件。
2. `git push origin main` 保存源码。
3. `./deploy.sh 'Publish portfolio update'` 在隔离 worktree 构建发布；源码工作区保持原样。
4. 等待 Pages 完成，核对 [release.json](https://hi.fangs.cc/release.json) 的 `source` SHA；浏览器检查首页、详情和图片，更新 CURRENT。

Pages 设置为 `gh-pages` / root。域名 `hi.fangs.cc` CNAME 指向 `imfangs.github.io`；`public/CNAME` 随构建保留。发布脚本不会自动提交脏源码，也不会修改其他仓库。
