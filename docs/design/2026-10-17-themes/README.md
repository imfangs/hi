# Omarchy 设计风格图鉴 · 2026-10-17

方帅先要求把源码23套主题做成列表与详情，随后明确扩展为23种可供未来项目借鉴/迁移的网页风格，以某个UI库做不同theme。本轮沿用Hi发布授权，保留原素材与来源，并完成可操作、可导出的网页适配。

## 范围与设计

- `/omarchy/themes/`：23套同结构组件样张、浅/深筛选、名字/气质/用途搜索。
- `/omarchy/themes/<id>/`：原始色板、风格解读、可操作daisyUI样张、23主题即时对照、原桌面图/壁纸/解锁图和迁移配置。
- daisyUI 5.7.50 +现有Tailwind4。库组件用`ds-`前缀，关闭自带主题且只包含当前所需组件。主题变量只在`data-theme="omarchy-*"`容器下生效，不把Hi整站切成所选主题。
- 原色板直接来自Omarchy；字体、圆角、尺寸、间距、场景判断是我们的试验性延伸。并非23套完全不同的信息架构，也不是Omarchy官方网页设计系统。按钮文字按黑/白对比选择。
- 同一套工作室样张支持输入、选择、添加、完成、过滤、重置、主题切换保留输入和CSS复制；只修改当前页面，不发送或持久化表单数据。

## 来源与数据

Omarchy本地只读源码：`/Users/fangs/workspace/study/omarchy`，commit `33783b1707d2fd5cdbab99aec183fc761d14bca0`。

- 23份colors.toml：5浅色、18深色。
- 23官方桌面预览，22官方解锁预览，97壁纸。预览生成800/1600px，壁纸1440px受控WebP，总165个图片文件，保留每个原文件路径/URL/SHA与派生文件SHA。
- 原图是上游附带截图，非本机运行OS验收；部分截图和当前色板可能来自不同上游生成时点。图片版权回原作者，不把仓库MIT自动表述为所有壁纸的独立授权证明。
- 文档依据：https://daisyui.com/docs/config/ 、https://daisyui.com/docs/themes/；Omarchy docs/theming.md。依赖固定5.7.50，MIT随站和starter保留。

## 权威文件与更新

- `src/data/omarchy-themes.json`：只存上游事实与导入素材；`scripts/import-omarchy-themes.py`从固定本地源码导入。不执行主题中的Lua/配置。
- `src/lib/omarchy-themes.ts`：中文解读与网页适配参数，以及统一CSS token映射。
- `ThemeMiniature.astro`与`ThemePlayground.astro`：列表样张与可操作样张。
- `scripts/export-omarchy-presets.mjs`生成23套CSS/JSON及合并CSS；之后运行`python3 scripts/package-omarchy-starter.py`打包最小项目。两者改动后不能只更新聊天或下载文件而漏掉来源。
- `scripts/omarchy-starter/`是可移植源码；ZIP不包含依赖、绝对路径、凭据、壁纸或Hi私有内容。解压后`npm install && npm run dev`；`npm run build`构建。
- 更新文案后用`pnpm fonts:build`，再同步global.css中的Hi Song/Sans内容hash查询参数。当前1076汉字覆盖。

## 验证

- `node scripts/verify-omarchy-themes.mjs`：23色板/映射、23个CSS导出及165图片哈希通过。
- Astro 45页面构建、TypeScript通过。
- ZIP在独立临时目录解压、安装声明依赖、Vite生产构建通过；与Hi的node_modules隔离。
- IAB：23套主题的背景、主色与圆角实际回读；23详情页的标题/主题/原作入口/4下载入口和390px无横溢。
- 浅色筛选5项、搜索“纸上”1项；Flexoki详情切Hackerman保留输入；真实加入条目、完成/过滤/重置、CSS复制成功提示、官方图片弹层打开/关闭通过。
- 1280×960和390×844受控视觉回读：列表三列/单列；纸色、暗色和终端绿；表单/表格/状态清楚。新添加行最初未继承Astro scoped样式，改为容器内global子选择器后复验。
- 320px详情代码区原被grid最小内容宽度撑大，给子项min-width:0后，整页scrollWidth=320、代码框280px；本轮修复已回读。
- 首页仍为37种轮播、19作品，无横溢。全站没有安装系统主题，尚未在真实消费项目中迁移，也未做实体手机或全项WCAG审计。

发布状态、source/Pages SHA和正式浏览器回读见CURRENT与releases回执。
