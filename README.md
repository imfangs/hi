# hi.fangs.cc

fangs 的项目集。

## 本地开发

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # 输出到 dist/
pnpm preview      # 预览构建结果
```

## 加新项目

在 `src/content/projects/` 下新建 `<slug>.mdx`：

```mdx
---
title: 项目名
subtitle: 一句话说清楚做的是什么。
year: 2026
status: 生产中    # 生产中 | 内测中 | 原型 | 探索 | 归档 | 暂停
stack:
  - Next.js
  - Mastra
links:
  - label: 访问
    href: https://example.com
  - label: GitHub
    href: https://github.com/...
order: 1         # 同年份内排序，越小越前
draft: false     # true 时不发布
---

## 为什么做

...

## 怎么实现

...

## 学到了什么

...
```

提交到 main 分支会自动通过 GitHub Actions 部署到 GitHub Pages，域名 hi.fangs.cc。

## 部署

仓库 Settings → Pages → Source 选 **GitHub Actions**。
DNS 在 fangs.cc 处加 CNAME：`hi → <username>.github.io`。
