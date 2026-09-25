# 当前状态

**2026-09-26：八作品图文目录已发布至 https://hi.fangs.cc/ 并完成公网回读。**

## 当前交付

- 主列表：单词合合乐、歇会鸭、PocoFocus、菌露谷物语、雪仗／夜雪俱乐部、奇芽药草铺、Wait But Why 中译、Dan Koe 中文阅读站。
- 每个作品有真实界面封面、本站详情、体验/阅读/App Store 入口。封面为 1200×750 WebP，来源见 `docs/ASSETS.md`。
- qiyuclone 与 fastvideo 已按方帅要求从 Hi 列表、详情路由与 sitemap 移除；独立产品仓库和线上服务未改。
- 修正单词合合乐旧 Web 技术栈与未经证实的效果描述；WBW 从旧 gh-pages 产物补回源码；非官方译站明确原作者与来源。
- 发布脚本改用隔离 worktree，要求干净源码，不自动暂存源文件或切换/清空开发目录。

## 发布与验证

- 发布源代码：`dc4e4bf8c2411b6d158c55b6fe643d1f43e9d3d8`。
- GitHub Pages 产物提交：`a7f631ade81d1c3518b91c34e6fae56a77af1347`；source 为 `gh-pages` 根目录。
- 公开 `release.json` 返回上述源 SHA；后续记录性提交不代表重建部署。
- 最终构建 9 个页面（首页 + 8 个详情）；全部本站路由、封面和 CNAME 检查通过。两个移除路由在公网均为 HTTP 404。
- FBT public-preview 独立匿名 HTTP 校验 23 个公开文件，字节/哈希全部一致；报告保存在本轮临时目录 `/tmp/hi-refresh-20260926/public-integrity-final.json`，可按 README 与 FBT 命令重新核验。
- 浏览器逐个完成八个作品的详情与返回；“进入夜雪俱乐部”真实打开正式产品 URL。公网首页、歇会鸭详情、图片与下载链接回读通过。
- 视口覆盖 1280×800、390×844、320×740；无横向溢出，深色与 reduced-motion 正常，无相关页面控制台错误。
- 视觉回读：列表单栏、封面比例完整；中文标题/正文无截断；详情按钮在手机上排列清晰；保留纸色、宋体和朱砂红体系。

## 工具边界与后续

内置浏览器可做桌面内容与导航核验，但本轮 viewport setter 未生效，CDP 截图存在像素缩放差异；移动与视觉验收改用 CUA 控制的 Chrome。测试覆盖后已恢复临时视口/媒体设置。实体手机、Safari 与八个作品本身的完整业务链路不属于本轮验收。

新增作品从 README / `src/content.config.ts` 开始。修改发布后，回读真实页面和 `release.json`，再更新本页及 Side `DEPLOYMENTS.md`。
