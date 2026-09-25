# Hi · fangs 作品集

遵循 Side 上层约定。公开站点 https://hi.fangs.cc ，源码仓库 `imfangs/hi`；本仓库只维护作品介绍与页面，不修改被介绍的产品。

## 接续

- 当前交付和核验见 `CURRENT.md`；运行与新增作品见 `README.md`。
- Astro 5 + MDX + Tailwind 4，纯静态输出，pnpm 管理依赖。
- `src/content/projects/*.mdx` 是作品内容源；`src/content.config.ts` 校验 frontmatter；主页与详情均从同一 collection 构建。
- `featured: true` 的项目在主列表展示，必须有真实封面；其他非 draft 条目在“早期探索”保留，既有详情 URL 保持兼容。
- 公开文案按产品事实源核对：App 公开版本看 Apple 商店与项目发布记录；网页看正式 URL 与项目 CURRENT。截图、模拟器通过、目录存在不证明学习效果或用户增长。

## 内容与图片

- 图片放 `public/images/projects/`，来源与加工方式见 `docs/ASSETS.md`。默认用真实产品界面截图；截图可排版和压缩，不伪造功能或效果。
- 产品正文讲用途、体验与使用条件；平台内部 ID、密钥、用户资料和发布调试日志不放进页面或 public 目录。
- WBW、Dan Koe 是非官方中译整理；保留原作者和原文入口，不把原作写成自己的创作。不复制长篇原文来充实作品详情。
- 新增作品同时维护图片、正文、实际体验/下载链接；技术栈按当前实现核对。不要保留未经证实的“留存翻倍”等效果声明。

## 设计与验证

- 颜色与文字样式统一在 `src/styles/global.css`。沿用纸色背景、宋体中文、Geist 英文与少量朱砂红；跟随系统深色模式。
- 2026-09-26 将短文本双栏页改成居中 880px 图文列表；手机保持图文列表、标题允许折行。详情正文宽度 680px。
- 行入口在 `ProjectRow.astro`；整行进入本站详情，详情主按钮去实际产品或 App Store。保证键盘焦点、图片尺寸、移动无横向溢出和 reduced-motion。
- `pnpm build` 后用实际浏览器检查首页 → 八个详情 → 返回，核对图片和按钮；覆盖桌面、390px 手机与深色模式。构建通过不能替代界面和导航核验。
- 截图使用 FBT Safe Image View；临时 QA 图、日志留 `/tmp` 等构建目录之外，正式作品封面按资产记录保留。

## Git 与发布

- 本地 Git 身份固定 `imfangs <mafangshuai@126.com>`，不修改全局身份。
- 当前 GitHub Pages source 是 `gh-pages` 分支根目录；不依赖 Actions。动态配置通过 GitHub API 回读，不从历史 billing 状态推断。
- 先检查本任务 diff，构建与浏览器验证通过后提交明确文件，再推送源代码与运行 `./deploy.sh`。
- 发布脚本要求干净源码，使用临时 detached worktree 更新 `gh-pages`；不切换/清空源目录、不自动 git add 全部源文件。
- 发布后核对 `release.json` 的 source SHA、线上首页/详情、封面及关键导航；必要时复用 FBT public-preview 的逐文件校验。
- 更新本项目 CURRENT 和 Side 的 DEPLOYMENTS 对应 Hi 条目；只提交各自仓库的本任务文件。
