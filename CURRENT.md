# 当前状态

## 排版与画廊精修（2026-10-03，已发布并回读）

- 方帅在单色03字徽上线后，要求从 taste 角度优化网站审美，并允许使用 design skill 或其他方法。本轮借用 Product Design 审阅方法，在原系统内精修：桌面口号降重，手机改成 `Taste. Build.` / `Sell.` 两行；作品入口少一道分隔线，名称与说明字体分工更清晰，封面圆角收至2px。
- 保留03字徽、纸白/宋体/Geist/朱砂配色、全部文案、13件作品及原始封面/排序。前后可见文字规范空白后一致；对照图、独立审阅与取舍见 [精修记录](docs/design/2026-10-03/REFINEMENT.md)。
- Astro14页构建与TypeScript、本地全13详情往返/筛选/主题/无JS通过。公网1440/390/320px、你品详情→保留阅读筛选返回、logo回首页、深色刷新、Escape、无JS13作品通过，无脚本错误或横溢。浏览器重验显式等待带分类的详情返回链接，避免过早点击造成测试竞态；未改产品逻辑。
- 正式源码 `f652222b1bb63c9d89943f8c4dc71a1c99679448`，Pages `cc7b288c80c5b6e7dd907ae2e635dabd44cbdb36`；API built，默认release.json匹配，28个HTML/CSS/logo/release文件逐字节一致。见 [发布回执](docs/releases/2026-10-03-taste-refinement.json)。仅验证合成手机视口，未声称真实访客审美偏好或转化提升。

## TBS 三角字徽（2026-10-03，已发布并回读）

- 方帅选定第二轮 03「三角字徽」，随后收窄为轻量换 logo。首页与全部详情的页头、页脚改用完整 T/B/S 镂空字徽；浅色深灰、深色米白，沿用文字色。浏览器小图标使用同轮廓简化版并加版本参数。
- 保留原页面布局、色板、Taste. Build. Sell. 文案、13 件作品及既有链接。没有扩展主题、分享图或新栏目。来源与小图标取舍见 [品牌资产](docs/brand/ASSETS.md)。
- 构建 14 页与 TypeScript 通过；本地及公网首页→13 详情→logo 返回、分类返回、主题持久化/Escape、1440/390/320px、无 JS 回退通过，未见脚本错误或横向溢出。受控截图核对原字徽与浅/深色实际页面。IAB 不可用、Chrome 扩展连接超时后，采用隔离 Playwright Chromium 验收；未用实体手机。
- 正式源码 `a6733d4d277324a96b0e026e96bee7ad2515d9e9`，Pages `9e4da562a77d7da9591ac870e51e8628a245df96`；API built，默认公网 release.json 匹配。28 个 HTML/CSS/logo/release 文件逐字节一致，既有视频未重新下载。详见 [发布回执](docs/releases/2026-10-03-tbs-logo.json)。

## 柚子的小岛互链（2026-10-03，本地已准备、尚未发布）

- `src/components/SiteFooter.astro` 新增「柚子的小岛」入口，目标 `https://youzi.fangs.cc/`；保留格得、GitHub、联系与回顶入口。新站在 `../yuzu-island/`，本轮 youzi 域名等待小岛发布，线上 Hi 未改变。
- 沿用现有依赖构建通过（`pnpm --config.verify-deps-before-run=false build`，14 页）；14 个站点页面均含新链接。独立 Chromium 检查首页与菌侠详情的 1440 / 390 / 320px：无横向溢出，footer 链接在边界内，新入口可聚焦。320px 受控截图确认文字完整、焦点圈可见、保留原样式。证据：[本地互链检查](docs/releases/2026-10-03-yuzu-link-local.json)。
- 用户最终指定 `youzi.fangs.cc` 后，仅修正 href，重新构建并逐页回读精确新链接通过；上述布局和键盘检查来自 href 修正前，文字与样式未变。未部署、未 push；此次仅准备返回入口。公开发布后仍需验证 youzi 目标和三站往返，当前正式版本继续以下方已发布记录为准。

## 爱养蘑菇的小学生与创作分类（2026-10-01，已发布并回读）

- 新增 `/projects/school-secret-lab/`，以《爱养蘑菇的小学生》介绍校园奇幻世界、与柚子的共创、三支概念短片及两个后续镜头实验；如实保留完整资产库尚未完成的进度。内容回源见 `docs/school-secret-lab-overview.md`。
- 五支原MP4逐字节复制；真实成片抽帧作为poster和三联封面。播放器保持9:16、按需加载、原生控制；播放下一支会暂停上一支。来源与字节见 `docs/school-secret-lab-media.json`。
- 新增creations「创作」类别，合并菌侠任务的 `fc79ff9` 并将菌侠漫画归入同类；保留 `c9c4622` 的8项宣传片及 `26f088c` 的发布记录。首页共13件作品、14个静态页面。分类可返回恢复，两件创作可沿下一件互相浏览。
- Astro构建与TypeScript检查通过。五支短片桌面正常速度完整播放，390/320px播放及前后跳转、片尾、互斥播放、无预下载、无JS原生播放器与13详情回归通过。菌侠合并后桌面与390/320/WebKit390的阅读器、7视频、分类返回回归通过。手机指合成视口，未做实体设备或主观听感评价。
- 本地证据：`docs/releases/2026-10-01-school-secret-lab-local.json`、`2026-10-01-school-secret-lab-merged-local.json`、`2026-10-01-creations-junxia-merged-desktop.json`、`2026-10-01-creations-junxia-merged-mobile.json`。首次菌侠手机回归因立即读取分类按钮状态导致脚本竞态，补等待后通过；初次整站重建期间的poster请求失败未作为成片缺陷。
- **正式站已发布**：源码 `5de9e63cb9cb2b19900b339f6aff71741dad364b`，Pages `86d39a1f154b38ff23f40b7feba819024e0efcca`；API built，公开release.json匹配。匿名逐文件回读98/98字节与SHA一致。火凤菇视频Range206且前1024字节匹配；五支短剧桌面完整播放、390/320px播放与跳转/片尾、互斥播放、分类返回和13详情回归通过。菌侠独立公网Chromium三视口、WebKit390及无JS回退通过。
- 发布证据见 [总回执](docs/releases/2026-10-01-creations-publish.json)、[文件校验](docs/releases/2026-10-01-creations-integrity.json)、[短剧在线播放](docs/releases/2026-10-01-school-secret-lab-live.json)、[菌侠独立复验](docs/releases/2026-10-01-junxia-comic-live.json)。后续记录性提交（含promo queue完结）不代表再次部署；公开源码版本以上述release.json为准。

## 宣传片批次（2026-10-01，已发布并回读）

- 补齐夜雪、奇芽、单词合合乐、歇会鸭、你品、AI教育、WBW、Dan Koe 共8支28–31秒首版；原有11件作品均有宣传片，保留既有菌露谷/PocoFocus/海拉鲁。每片有同次封面和公开署名，按需播放、完整16:9、原生控制，原首页封面保留。
- 发布源码 `c9c46221e0a2f5fcc1f09e62c93502b3ca9e591c`，Pages `f28f5d98742925803ac7c6172fa5d980b9282fa2`，API built，默认及查询参数release.json均一致。66/66公开文件字节/哈希匹配，8/8 Range206与本地前1024字节一致；Chromium桌面/390px/320px共24/24场景通过，8支均桌面从头完整播放到ended。详见 [发布回执](docs/releases/2026-10-01-promo-batch.json) 与 [交付清单](docs/promo-series/2026-10-01-deliverables.json)。
- WebKit奇芽手机视口通过；歇会鸭媒体操作通过，App Store点击/系统接管保持partial未验证。此前本地部分WebKit整片播放有掉帧，未定因；实体手机、实际听感和宣传效果待真实反馈。原生两片为独立模拟器演示，奇芽明确独立演示存档与既有插画，均保留来源边界。
- FBT已回流结构化媒体事件与时序检查、批次接续、稀疏原生录屏、SAR及统计字段处理；11项专项测试通过。项目工程与问题回各自videos目录；批次状态以 [queue](docs/promo-series/queue.json) 为准。
- 本轮通过固定c9提交的隔离worktree发布，保留同期菌侠/短剧任务的本地新增；它们由独立任务后续接入。后续记录性提交不代表再次发布。3个制作任务已按方帅要求归档，旧串行heartbeat保持暂停。


## 菌侠漫画与动画实验（2026-10-01，随创作分类发布）

- 新增 `/projects/junxia-comic/`，五页原画依上传顺序展示，保留手写对白与完整纸张；支持点开放大、原尺寸滚动、前后翻页、Escape关闭、页码直达。
- 收录既有8.08秒《我来啦》、29.302秒五幕合成片和五段6.06秒独立分镜，共7个视频，未重新生成或修改；均与本机原件哈希一致。页面标注动画实验与原画的差异，不新增原作剧情解读。公开署名与来源见ASSETS，技术回执见 `docs/releases/2026-10-01-junxia-comic-assets.json`。
- 本地构建、TypeScript、Chromium1280/390/320深色、WebKit390检查通过：五页加载/放大/翻页/关闭、7视频主动播放与到片尾、单音轨播放、折叠分镜、分类返回、无横溢与无JS回退。桌面两条完整视频从头播放到片尾，其余使用跳转片尾检查；未试听内容或使用实体手机。既有11详情播放器保留。见 `docs/releases/2026-10-01-junxia-comic-local.json`。
- 当前暂属reading；短剧介绍任务负责统一creations分类，合并两项后串行发布，避免覆盖正在上线的8项宣传片。公开上线状态必须以后续release.json与正式页面回读为准。

## 海拉鲁宣传片（2026-10-01，已发布并回读）

- 海拉鲁详情接入29.28秒真实3D试玩片、同次横版封面和素材署名，展示营地解谜与跃崖滑翔。复用原生播放器，按需播放、手机内嵌，保留首页原封面、个人非官方Demo说明及全部其他作品。片注明确配乐与风声为后期重建。
- **正式站发布回读完成**：源码 `b5b080062aae6005dc40710417cf7caccb4e0bae`，Pages `0103e4b099f97258dce9895e5459ae9eac469080`；API为built，默认与唯一查询参数的release.json均匹配。42/42公开文件字节/哈希一致，视频SHA-256 `a0f518bedee8b4a9b70b1aa9233009ea901a4a416ad838e4700f9c2ac78392aa`，HTTP206支持Range且前1024字节一致。
- 构建、TypeScript与本地/线上网页检查通过。Chrome桌面完整播放29.28秒、732帧、零丢帧；桌面及390/320px实际拖动原生进度条后到达片尾，静音/全屏入口可用。素材入口、分类返回、正式游戏CTA实开和11详情回归通过，保留PocoFocus/菌露谷视频。受控截图确认手机16:9完整、无横溢。证据 [发布回执](docs/releases/2026-10-01-hyrule-promo.json)、[本地回执](docs/releases/2026-10-01-hyrule-promo-local.json)。
- **WebKit边界**：390px跳转和独立完整播放均到达片尾、无媒体错误，但headless完整播放报告238/700掉帧、headed对照148/700。原因未定位，不能声称所有浏览器顺畅或据此认定媒体损坏；实体Safari/手机未验。原始计数与对照见 [WebKit记录](docs/releases/2026-10-01-hyrule-promo-webkit.json)。
- 发布首次Pages状态持续building超过10分钟且无对应Actions任务；对同一gh-pages提交请求一次rebuild后，28秒内built，未生成新产物或重复上传。源push曾因非TTY缺进度而判断信息不足；README与deploy.sh增加`--progress`，不固化协议、不推断HTTP/2根因。证据与恢复边界保存在发布回执。
- 临时预览与浏览器上下文已清理。制作与许可细节回游戏项目 `videos/promo-2026-10-01/`；听感和宣传效果待实际反馈。后续记录性提交不代表重新部署。

## PocoFocus 宣传片（2026-10-01，已发布并回读）

- PocoFocus 详情接入30秒真实界面宣传片与同次封面，复用原生播放器和制作素材入口。首页画廊封面保留；视频不自动播放，`preload="none"` 避免介绍页访问即下载7.6MB成片。片注说明专注与培育等待已压缩。
- 构建、TypeScript 检查、Chromium桌面/390px/320px深色与WebKit 390px主动播放、前后跳转、播放至片尾、制作素材入口和应用分类返回通过；试玩CTA实际打开正式 PocoFocus。11详情回归通过，菌露谷原视频与其余静态封面保留。证据 [本地回执](docs/releases/2026-10-01-pocofocus-promo-local.json)。
- 本地手机视口保持完整16:9画面，标题、CTA、说明与素材入口无横向溢出。实体手机与音频听感不属于这些页面验收的已验证范围。

- **正式站发布回读完成**：源码 `f96a1c642f1434baa410532c2b6c3c9a1be9ef4c`，Pages `ab4e6ae7ebe9a67a1c8dea9443c3a935c101e96a`；API为built，公开release.json一致。39/39公开文件字节/哈希匹配，视频HTTP 206支持Range。桌面从头完整播放30秒至ended；390px、320px深色与WebKit390px前后跳转并播放到片尾，制作素材入口、应用分类返回和试玩CTA实开通过。11详情回归通过。证据 [发布回执](docs/releases/2026-10-01-pocofocus-promo.json)。临时预览与浏览器上下文已清理；后续记录性提交不代表重新部署。

## 菌露谷宣传片（2026-10-01，已发布并回读）

- 菌露谷详情主画面接入30.8秒真实宣传片与同次封面，完整16:9，原生播放/音量/进度/全屏控制，手机内嵌播放。默认不自动播放，`preload="none"`避免访问介绍页就下载22.3MB视频。
- 首页画廊封面保留；其他作品沿用静态详情封面。新增可选video内容字段，素材出处与公开署名入口已保存。本地构建、类型检查及Chromium桌面/390px/320px深色与WebKit 390px播放、跳转到片尾、素材入口和返回分类通过；11个详情静态封面回归通过。证据 `docs/releases/2026-10-01-junlugu-promo-local.json`。

- **正式站发布回读完成**：源码 `71b75bc2e0128787f9900ec000086570b1da57d4`，Pages `2376bf153f2457e19ebd68b5dcdfcbd90d271d0c`；API为built，release.json匹配。36/36公开文件字节/哈希一致；视频HTTP 206支持Range。桌面完整播放30.8秒，390px、320px深色及WebKit 390px播放/跳转/片尾/返回分类与素材入口通过，全部11详情回归通过。证据 [发布回执](docs/releases/2026-10-01-junlugu-promo.json)。实体手机未验证；后续记录性提交不代表重新部署。

## 作品集画廊优化（2026-09-30）

- 保留原问候、Taste. Build. Sell.与中文解释，强化首屏字号；11件作品改为桌面双栏/手机单栏真实封面画廊，应用、游戏、阅读分类。
- 分类写入URL并支持返回恢复；详情可在当前类别中继续浏览下一件。新增系统/浅色/深色主题、关于与联系，保留最佳拍档互链。
- 本地构建、TypeScript检查、11详情逐个打开与返回、三分类数量、同类下一件、390px/320px、主题持久化、系统配色、Escape与reduced-motion检查通过。11篇产品正文与所有封面保持不变。
- **2026-09-30 12:06 发布回读完成**：源码 `73ef079992ea8317b8ac259a33935edcc4b65426`，Pages产物 `2c7cae3e84b627db0a70e930665b5fcb256ed9ec`，GitHub API为built，公开release.json与源码一致。匿名curl回读33/33文件，字节与SHA-256匹配。
- 正式站完成阅读筛选→你品→下一件AI教育→返回保留阅读，深色刷新保持；390px首页无横溢、封面完整；Hi→格得→Hi双向入口再次实走。设计、交互与边界见 [验收记录](docs/design/2026-09-30/QA.md)，结构化证据见 [发布回执](docs/releases/2026-09-30-gallery.json)。后续记录性提交不代表重新发布。

## 你品与海拉鲁更新（2026-09-30）

- 「六扇窗」更新为「你品」，保留 `/projects/taste/`。标题、简介、正文、按钮、图片说明与真实封面同步；介绍更新为可反复浏览的品味集，区分原创文章、译文与历史六项来信。
- 新增「海拉鲁 · 蓝焰余响」与 `/projects/hyrule/`，置于 PocoFocus 与菌露谷之间，首页共11项作品、12个静态页面。使用正式站真实封面，链接游戏与素材说明；标明个人非官方 Demo、当前玩法与设备/声音限制。
- 基于已提交的 `83e21ee`，保留同期新增的「最佳拍档 · 格得」页脚入口。本任务未修改被介绍的产品。
- 双向互链已实走：Hi → 格得 → Hi；独立核对当前 Pages 提交的 30 个文件（含空 `.nojekyll`）一致。互链交付与部署切换说明见 [最佳拍档互链](docs/releases/2026-09-30-ged-link.md)。
- 本地构建通过；Chrome 在1280×850、390×844、320×740深色/reduced-motion下完成首页→全部11详情→返回，共33组。图片加载、详情标题、目标链接与无横向溢出检查通过，未见控制台警告/错误。受控截图确认手机标题换行、按钮、封面及深色模式无明显遮挡。
- 本地证据：`/tmp/hi-refresh-20260930/local-qa.json`、对应截图与 `local-preview.jpg`；封面来源见 `docs/ASSETS.md`。本轮未重测被介绍产品的完整业务流程、实体手机或 Safari。
- 2026-09-30 11:31发布回读完成：源码 `fc968a158663a3fa7d7d4eeed7ce96816ed28952`，Pages产物 `044134840e4ea26be667df8bcd222babe77d748a`。GitHub API为built，正式 `release.json` 与源码一致；匿名curl回读29/29公开文件，字节与SHA-256全部匹配。
- 正式域名在1280px桌面与390px手机下通过首页→你品/海拉鲁详情→返回、Enter键进入、名称/图片/外链与无横向溢出检查，无控制台警告/错误。受控视觉确认新封面、新标题及手机按钮正常。证据 `live-qa.json`、`public-integrity.json` 与 `live-preview.jpg` 均在上述临时目录。
- 首次线上返回首页命中过旧版浏览器缓存；GitHub Pages响应为 `max-age=600`。保留 `live-cache-observation.json`，强制刷新一次后，使用默认缓存的完整往返复查通过；未修改站点缓存策略或系统设置。后续记录性提交不代表重新部署。

## 新增两项作品（2026-09-28）

- 新增「六扇窗 · 艺术与思想」与「AI 教育 · 中英双语」，排在首页前两项；原八作品相对顺序与内容保留。共10作品、11个静态页面。
- 新增 `/projects/taste/`、`/projects/aiedu/`，详情分别连接正式站点；六扇窗另提供文章和开发者视频入口，AI 教育保留 Khan Academy 原课程入口并标注非官方双语译本。
- 两张封面来自正式站点的真实首页，统一为1200×750 WebP；来源、采集尺寸与加工见 `docs/ASSETS.md`。
- 本地构建通过。内置浏览器在1280×850桌面、390×844手机、320×740深色/reduced-motion三种设置下完成首页→全部10详情→返回；无横向溢出、缺图或控制台警告/错误。受控视觉预览确认标题、封面和按钮无明显遮挡，沿用原有纸色、宋体与朱砂红。
- 证据：`/tmp/hi-new-works-20260928/qa.json`、对应截图及 `preview.jpg`。本轮验证作品集展示与入口，未覆盖实体手机、Safari或被介绍产品的完整业务流程。
- 发布源码 SHA：`cd4dc04f60f86dca3ac31f5e46a18943d1ff34f6`；Pages 产物 SHA：`db83410fa31212e5f8dbcb1f91225e784f9d9d6b`。GitHub API 返回 `built`，公开 `release.json` 与本次源码 SHA 一致；随后记录性提交不代表重新部署。
- FBT public-preview 经匿名 curl 回读27个公开文件，字节与SHA-256全部一致。正式域名在1280px桌面、390px手机下完成首页→两项新作详情→返回，封面加载、目标链接与无横向溢出检查通过；两产品正式首页亦已在浏览器直接打开核对。键盘Tab焦点和Enter进入详情通过。证据为同目录 `public-integrity.json`、`live-qa.json` 与 `live-1280.png`、`live-390.png`。

## 此前 slogan 发布（2026-09-28）

- 首页在自我介绍下展示 **Taste. Build. Sell.**，中文说明为“判断什么值得做，把它做出来，让真实的人愿意用。”；首页 description / Open Graph 摘要同步。保留纸色、宋体中文、Geist 英文和朱砂红句点。
- 八作品列表及其内容、封面和产品链接保持原样。
- 发布源 SHA：`618a62dd8325802ea2edb974a0b4f521730d882e`；Pages 产物 SHA：`aaf5fd37c688cc271881277622be2280215edd26`。GitHub API 确认本次 build 为 `built`，公开 `release.json` 返回上述源 SHA。后续记录性提交不代表重新部署。
- 本地构建生成 9 页；Playwright Chromium 在 1280×850、390×844、320×740 深色/reduced-motion 三组设置下完成首页 → 八个详情 → 返回；无横向溢出、缺图或页面脚本/控制台错误。
- 公网首页在桌面与390px手机均显示精确中英文文案，真实进入单词合合乐详情并返回；独立匿名 HTTP 回读23个公开文件，字节/哈希全部一致。
- 受控视觉预览确认 slogan、中文说明与作品列表层级清楚，窄屏文案完整，深色模式无明显遮挡。证据目录：`/tmp/hi-slogan-20260928/`，包括 `qa.json`、`live-qa.json`、`public-integrity.json` 和本地/线上截图；临时证据不入库。
- 工具适配：Browser plugin 不可用，使用已有 Playwright。运行环境注入的 pnpm 11 尝试重装 pnpm 10 依赖并因非交互终端退出；本次通过已安装的 pnpm 10.19.0 构建与发布，并在 package.json 固定版本、README 记录显式 PATH 选择方式，未重装依赖。
- 本轮未验证实体手机、Safari 或作品自身业务流程。

## 此前作品集交付（2026-09-26）

- 主列表：单词合合乐、歇会鸭、PocoFocus、菌露谷物语、雪仗／夜雪俱乐部、奇芽药草铺、Wait But Why 中译、Dan Koe 中文阅读站。
- 每个作品有真实界面封面、本站详情、体验/阅读/App Store 入口。封面为 1200×750 WebP，来源见 `docs/ASSETS.md`。
- qiyuclone 与 fastvideo 已按方帅要求从 Hi 列表、详情路由与 sitemap 移除；独立产品仓库和线上服务未改。
- 修正单词合合乐旧 Web 技术栈与未经证实的效果描述；WBW 从旧 gh-pages 产物补回源码；非官方译站明确原作者与来源。
- 发布脚本改用隔离 worktree，要求干净源码，不自动暂存源文件或切换/清空开发目录。

## 此前发布与验证（2026-09-26）

- 发布源代码：`dc4e4bf8c2411b6d158c55b6fe643d1f43e9d3d8`。
- GitHub Pages 产物提交：`a7f631ade81d1c3518b91c34e6fae56a77af1347`；source 为 `gh-pages` 根目录。
- 公开 `release.json` 返回上述源 SHA；后续记录性提交不代表重建部署。
- 最终构建 9 个页面（首页 + 8 个详情）；全部本站路由、封面和 CNAME 检查通过。两个移除路由在公网均为 HTTP 404。
- FBT public-preview 独立匿名 HTTP 校验 23 个公开文件，字节/哈希全部一致；报告保存在本轮临时目录 `/tmp/hi-refresh-20260926/public-integrity-final.json`，可按 README 与 FBT 命令重新核验。
- 浏览器逐个完成八个作品的详情与返回；“进入夜雪俱乐部”真实打开正式产品 URL。公网首页、歇会鸭详情、图片与下载链接回读通过。
- 视口覆盖 1280×800、390×844、320×740；无横向溢出，深色与 reduced-motion 正常，无相关页面控制台错误。
- 视觉回读：列表单栏、封面比例完整；中文标题/正文无截断；详情按钮在手机上排列清晰；保留纸色、宋体和朱砂红体系。

## 此前工具边界与后续（2026-09-26）

内置浏览器可做桌面内容与导航核验，但本轮 viewport setter 未生效，CDP 截图存在像素缩放差异；移动与视觉验收改用 CUA 控制的 Chrome。测试覆盖后已恢复临时视口/媒体设置。实体手机、Safari 与八个作品本身的完整业务链路不属于本轮验收。

新增作品从 README / `src/content.config.ts` 开始。修改发布后，回读真实页面和 `release.json`，再更新本页及 Side `DEPLOYMENTS.md`。
