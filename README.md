# hi.fangs.cc

fangs 的作品集：原生 App、网页游戏、艺术阅读、双语学习与创作。首页是带真实画面封面的作品列表，点击进入介绍页，再体验作品。

- 网站：[hi.fangs.cc](https://hi.fangs.cc)
- 接续入口：[AGENTS.md](AGENTS.md)
- 当前状态：[CURRENT.md](CURRENT.md)
- 图片来源：[docs/ASSETS.md](docs/ASSETS.md)

## 本地开发

项目依赖使用 `package.json` 固定的 pnpm 10.19.0。若运行环境忽略该字段并注入其他版本，先把已安装的 10.19.0 可执行目录放到 PATH 首位，再运行构建与发布；不要因此强制重装依赖。

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
group: apps # apps / games / reading / creations
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

正文使用 Markdown / MDX，介绍做什么、怎么玩、使用条件。`featured: true` 会进入首页作品列表；其他非 draft 条目仅生成详情；`draft: true` 不生成页面。项目按 `order` 排序；`group` 定义应用、游戏、阅读或创作分类。筛选与详情返回使用 `?view=`，浏览器可恢复选择。当前画廊设计与交互约定见 `docs/design/2026-09-30/DIRECTION.md`。

菌侠原画集 `junxia-comic.mdx` 使用 `format: comic`，详情正文采用画幅宽度，首页cover不在详情重复展示。`ComicReader.astro` 保存五页原稿顺序、可缩放翻页阅读器、两条完整动画和五段独立分镜。无JavaScript时仍可顺序阅读、打开大图和播放原生视频。图片只校正方向，视频为已有实验原件；出处见ASSETS。

封面统一为 1200×750 WebP，保存到 `public/images/projects/`，并补资产来源。网页截图完整缩放留边，App 截图组合展示，不裁掉关键界面或混入私人资料。

有宣传片的作品可添加可选 `video: { src, poster, caption, credits }`：MP4与公开素材署名放 `public/videos/projects/`，poster放 `public/images/projects/`。详情主画面改为原生视频播放器，首页仍使用cover；不自动播放或预下载视频。例子见 `junlugu.mdx`。发布前检查桌面/手机播放、拖动、完整画幅和素材入口。

竖屏短片合集可在 MDX 正文中使用 `FilmCollection.astro`，每条定义名称、时长说明、视频与封面，完整示例见 `school-secret-lab.mdx`。片集保持9:16，不套用宣传片的16:9布局。用 `scripts/verify-film-collection.mjs --url <origin> --out <临时目录> --playwright-root <已安装Playwright的项目>` 检查五支短片、分类往返与移动版布局。

批量验收使用 `scripts/verify-promos.mjs`，从作品 frontmatter 读取媒体、片注、来源和CTA，支持原生播放器的主动播放、完整片尾、前后跳转及桌面/390/320px布局。它只证明记录范围内的功能，完整公开MP4哈希仍用FBT public-preview核对。使用已安装Playwright的绝对项目路径，不自动安装依赖：

```bash
node scripts/verify-promos.mjs --url http://127.0.0.1:4218 \
  --slugs snow-duel --out /tmp/hi-promo-qa \
  --playwright-root /absolute/project-with-playwright --full
```

本地先构建并使用 Astro preview；临时服务器需支持 Range。`--engines chromium,webkit` 可增加WebKit对照；帧统计和真实设备/听验边界在回执中保留。`--views phone` 可做局部复验。退出码0为全部通过，1为失败，2为已明确记录的未验证边界（例如WebKit商店链接接管），不能把2当作完整通过。完整批次入口见 `docs/promo-series/README.md`。

## 发布

当前使用 **本地构建 + GitHub Pages 的 gh-pages 分支**，不是 GitHub Actions。

1. 检查 diff，完成构建与浏览器验证，只提交本任务文件。
2. `git push --progress origin main` 保存源码。
3. `./deploy.sh 'Publish portfolio update'` 在隔离 worktree 构建发布；源码工作区保持原样。
4. 等待 Pages 完成，核对 [release.json](https://hi.fangs.cc/release.json) 的 `source` SHA；浏览器检查首页、详情和图片，更新 CURRENT。

源代码与产物 push 显式启用 `--progress`，使非交互终端中的视频大文件上传也有传输进度；耗时较长时结合远端分支 SHA 回读判断状态。

Pages 设置为 `gh-pages` / root。域名 `hi.fangs.cc` CNAME 指向 `imfangs.github.io`；`public/CNAME` 随构建保留。发布脚本不会自动提交脏源码，也不会修改其他仓库。
