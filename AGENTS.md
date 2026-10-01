# Hi · fangs 作品集

遵循 Side 上层约定。公开站点 https://hi.fangs.cc ，源码仓库 `imfangs/hi`；本仓库只维护作品介绍与页面，不修改被介绍的产品。

## 接续

- 当前交付和核验见 `CURRENT.md`；运行与新增作品见 `README.md`。
- 逐项宣传片批次从 `docs/promo-series/README.md` 与 `docs/promo-series/queue.json` 接续；单项制作、发布和FBT回流完成后才启动下一项，协调者独占队列状态。
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

- 颜色与文字样式统一在 `src/styles/global.css`。沿用纸白、宋体中文、Geist 英文与少量朱砂红；字体自托管在 `public/fonts/`。主题支持跟随系统/浅色/深色，偏好保存在本机。
- 2026-09-30 从880px图文列表改为最大1320px的开放双栏画廊，手机单栏大图，使真实作品封面更易看清。原口号保留；依据与对照见 `docs/design/2026-09-30/DIRECTION.md`。详情正文仍为680px。
- 画廊入口在 `ProjectRow.astro`，整件进入详情，主按钮去实际产品或App Store。`group` 必须为 apps/games/reading；`order` 决定精选展示顺序。分类参数 `?view=` 保留返回状态，详情下一件在有分类时沿同类接续。
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
