# hi.fangs.cc — Claude 上下文

fangs 的个人项目集，域名 hi.fangs.cc。

## 技术栈

- **Astro 5** + **MDX** + **Tailwind 4**（CSS-first `@theme` 配置，不用 tailwind.config.js）
- **pnpm** 管依赖，Node 22+
- **GitHub Pages** 托管，自定义域 `hi.fangs.cc`
- 纯静态输出，无后端

## 目录结构

```
src/
├── content.config.ts        # projects collection 的 zod schema
├── content/projects/        # 项目 MDX，每个项目一个文件
├── layouts/Base.astro       # 全站 layout（<html>、meta、暗色模式脚本）
├── components/              # Container、SiteFooter
├── pages/
│   ├── index.astro          # 首页：签名 + 按年份分组的项目列表
│   └── projects/[...slug].astro  # 项目详情页（渲染 MDX）
└── styles/global.css        # 所有设计 token 都在这里，Tailwind 4 @theme 语法
public/
├── CNAME                    # hi.fangs.cc（GitHub Pages 自定义域）
└── favicon.svg
deploy.sh                    # 本地 build + 推 gh-pages 分支的部署脚本
```

## 部署

**不走 GitHub Actions**（imfangs 账号有 billing 锁），走"本地 build + push 到 `gh-pages` 分支"的老式流程。

```bash
./deploy.sh "commit message"
```

脚本会：main 分支已提交检查 → `pnpm build` → 切到 `gh-pages` → 覆盖产物 → push → 切回 `main`。GitHub Pages 直接从 `gh-pages` 分支 serve。

**如果 imfangs 的 Actions 解锁了**：可以改回 workflow 部署，但没有必要，本地脚本足够。

## Git 身份

**本仓库本地 git 配置为 `imfangs <mafangshuai@126.com>`**，不要用全局的 sankuai 身份。检查：

```bash
git config --get user.email  # 应该是 mafangshuai@126.com
```

如果不对，在这个目录内执行：

```bash
git config user.email "mafangshuai@126.com"
git config user.name "imfangs"
```

**不要动全局 git config**，那会污染其他仓库。

## 加新项目

在 `src/content/projects/` 新建 `<slug>.mdx`，frontmatter schema 定义在 `src/content.config.ts`：

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
order: 1         # 同年份内排序，越小越前；不填按 999 排最后
draft: false     # true 时不发布
---

## 为什么做
...
## 怎么实现
...
## 学到了什么
...
```

三段式结构（为什么做 / 怎么实现 / 学到了什么）不是硬约定，是当前风格。可以打破。

## 设计系统（关键约定）

设计 token **全部在 `src/styles/global.css`**，通过 Tailwind 4 的 `@theme {}` 暴露。改样式先看这个文件。

**颜色**：`--color-bg`、`--color-ink`、`--color-ink-muted`、`--color-ink-faint`、`--color-accent`（朱砂红 `#B8451F`，暗色模式提亮为 `#D97757`）。整页 accent 只出现 3-5 次。

**字体**：中文用**思源宋体**（Noto Serif SC），英文用 **Geist**，等宽用 **Geist Mono**。中文正文 17px、行高 1.85、字距 0.02em。

**版心**：单栏最大 640px，居中，桌面 padding 48px。**不要做满屏铺开**，约束宽度是极简的关键。

**动效克制**：
- 项目卡 hover 只做 `translateX(4px)` + accent 色变
- 入场用 `.fade-up` 类（`opacity + translateY`，60ms stagger）
- **不要**加 parallax / scroll-driven / 粒子背景 / aurora / bento

**暗色模式**：跟系统 `prefers-color-scheme`，无手动切换按钮。逻辑在 `src/layouts/Base.astro` 的 inline script。

**反 slop 清单**：不用紫粉渐变、三列图标网格、"Building the future of X"、装饰 blob、全居中堆叠、Inter 当中文搭档。

## 常用命令

```bash
pnpm dev          # 开发服务器 http://localhost:4321
pnpm build        # 输出到 dist/
pnpm preview      # 本地预览构建结果
./deploy.sh       # 部署到 gh-pages
```

## 域名

- GitHub 默认 URL：https://imfangs.github.io/hi/（会 301 到自定义域）
- 生产：https://hi.fangs.cc
- DNS：`fangs.cc` 域下加 CNAME `hi → imfangs.github.io`，Cloudflare 用户走 DNS only（灰云）

## 相关信息

- 姐妹项目：`../novel/ai-novel/`（VitePress 版个人小说站，story.fangs.cc），deploy.sh 思路来自那里
- 设计讨论历史：本仓库首次开工时定的极简文字流方案，参见 README 和 global.css 的注释
