# Hi · fangs 作品集

遵循 Side 上层约定。公开站点 https://hi.fangs.cc ，源码仓库 `imfangs/hi`；本仓库只维护作品介绍与页面，不修改被介绍的产品。

## 接续

- 当前交付和核验见 `CURRENT.md`；运行与新增作品见 `README.md`。
- 宣传片批次从 `docs/promo-series/README.md` 与 `docs/promo-series/queue.json` 接续；制作并行，Hi 发布与 FBT 回写由协调者串行收口，协调者独占队列状态。
- Astro 5 + MDX + Tailwind 4，纯静态输出，pnpm 管理依赖。
- `src/content/projects/*.mdx` 是作品内容源；`src/content.config.ts` 校验 frontmatter；主页与详情均从同一 collection 构建。
- `featured: true` 的项目在主列表展示，必须有真实封面；未精选且非 draft 的条目仅生成详情；增删记录与当前主列表见 CURRENT。
- 公开文案按产品事实源核对：App 公开版本看 Apple 商店与项目发布记录；网页看正式 URL 与项目 CURRENT。截图、模拟器通过、目录存在不证明学习效果或用户增长。

## 内容与图片

- 图片放 `public/images/projects/`，来源与加工方式见 `docs/ASSETS.md`。默认用真实产品界面截图；截图可排版和压缩，不伪造功能或效果。
- 产品正文讲用途、体验与使用条件；平台内部 ID、密钥、用户资料和发布调试日志不放进页面或 public 目录。
- WBW、Dan Koe 是非官方中译整理；保留原作者和原文入口，不把原作写成自己的创作。不复制长篇原文来充实作品详情。
- 新增作品同时维护图片、正文、实际体验/下载链接；技术栈按当前实现核对。不要保留未经证实的“留存翻倍”等效果声明。

## 设计与验证

- 颜色与文字样式统一在 `src/styles/global.css`：纸白、宋体中文、Geist 工具文字与少量朱砂红；英文主标题 Taste. Build. Sell. 统一使用 Instrument Serif 斜体、同字号和基线；正常视口单行，文字放大时按词换行。字体自托管于 `public/fonts/` 并保留许可；主题支持系统/浅色/深色。
- 视觉、字体或展陈调整先读 `docs/design/2026-10-09-simplification/README.md`；10-08 的展陈依据保留为历史。当前为作品选集：桌面少量大小组合，分类/搜索时规整双列，手机单列；原图完整，详情正文680px。展陈顺序与尺度仅维护于 `src/lib/exhibition.ts`，与项目优先级/管理标记分开。
- 画廊入口在 `ProjectRow.astro`；图片与题签链接共同保留 `view/q`，键盘主入口仅一个，外部体验独立。`group` 名称来自 `src/lib/projects.ts`；MDX `order` 留作内容顺序/同类接续。返回恢复原卡片和焦点，更多同类清除旧查询；不得重复或遗漏作品。
- 短剧片集用 `FilmCollection.astro`，保留9:16原画幅、原生控制、playsinline、preload=none。作品名称、概念片/镜头实验的区分与未完成资产，依据 `docs/school-secret-lab-overview.md`；不要把媒体文件可播放写成整季或完整资产库完成。
- 检查筛选数量与前进/后退、类别内下一件、主题系统变化与Escape、键盘焦点、移动无横溢和reduced-motion。JS禁用时全部作品可见，动态控件隐藏。
- `pnpm build` 后用实际浏览器检查首页 → 全部作品详情 → 返回，核对图片和按钮；覆盖桌面、390px 手机与深色模式。构建通过不能替代界面和导航核验。
- 截图使用 FBT Safe Image View；临时 QA 图、日志留 `/tmp` 等构建目录之外，正式作品封面按资产记录保留。

## Git 与发布

- 本地 Git 身份固定 `imfangs <mafangshuai@126.com>`，不修改全局身份。
- 当前 GitHub Pages source 是 `gh-pages` 分支根目录；不依赖 Actions。动态配置通过 GitHub API 回读，不从历史 billing 状态推断。
- 先检查本任务 diff，构建与浏览器验证通过后提交明确文件，再推送源代码与运行 `./deploy.sh`。
- 发布脚本要求干净源码，使用临时 detached worktree 更新 `gh-pages`；不切换/清空源目录、不自动 git add 全部源文件。
- 发布后核对 `release.json` 的 source SHA、线上首页/详情、封面及关键导航；必要时复用 FBT public-preview 的逐文件校验。
- 更新本项目 CURRENT 和 Side 的 DEPLOYMENTS 对应 Hi 条目；只提交各自仓库的本任务文件。
