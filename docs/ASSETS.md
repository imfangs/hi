# 作品封面来源

## 2026-10-01 · 菌侠漫画与动画实验

- 原作是方帅儿子提供的五页手绘漫画，依上传的 `1.jpg` 至 `5.jpg` 顺序整理。`public/images/projects/junxia-comic/page-1.jpg` 至 `page-5.jpg` 从原始照片逆时针旋转90度，移除EXIF，JPEG quality93，保留完整1707×1280画面；未裁掉边缘、重画或替换手写对白。原文件在本机Downloads中保留。
- `junxia-comic.webp` 由第4页完整缩放、纸色补边为1200×750；单图动画poster从对应视频首帧抽取并转WebP。其余播放器使用对应原画作为poster。
- `public/videos/projects/junxia-comic/` 收录8.08秒单图动画 `i-am-here.mp4`、29.302秒合成片 `five-scenes.mp4`，及 `scene-01.mp4` 至 `scene-05.mp4` 五段各6.06秒分镜。全部逐字节复制2026-08-16已有MP4，不重新生成、剪辑或修改音轨；原件和发布件SHA-256全部一致，见 [媒体回执](releases/2026-10-01-junxia-comic-assets.json)。
- 方帅2026-10-01明确要求漫画及这些视频放入Hi。页面署名原作归儿子，整理/动画实验为爸爸和格得，并说明生成动作、声音、细节不完全等于原作；不使用早期不可靠OCR给孩子的故事编写剧情梗概。此前成片质量未获认可，本次是如实收录旧实验，不宣称质量已改善。
- 只发布画作、成片、poster与阅读页面；原始OCR、含本机路径的生成manifest、聊天记录与操作日志不进入public。页面保留7个按需原生播放器，不自动下载MP4，播放下一段时暂停上一段。

2026-09-26。以下封面用于 hi.fangs.cc 的作品展示，全部来自真实产品界面；未生成虚构 UI，也未将原图批量放入公开目录。输出为 `public/images/projects/<slug>.webp`，1200×750，WebP quality 88。

| 文件 | 原始来源 | 加工 |
| --- | --- | --- |
| lehh.webp | `../lehh/operations/app-store-release/evidence/1.1.0/screenshots/iphone65/01-discovery.png` 与 `05-collection.png`（相对于 Hi 项目根） | 已发布版本的两张演示截图，等比缩放并排置于深色底，不修改界面 |
| little-pause.webp | `../little-pause/build/appstore/1.1-5/screenshots/01-home.png` 与 `02-rule.png` | 已发布版本的两张演示截图，等比缩放并排置于浅绿色底，不修改界面 |
| pocofocus.webp | https://pocofocus.fangs.cc/ | 2026-09-26 内置浏览器首页截图；等比缩放完整留边 |
| junlugu.webp | https://junlugu.fangs.cc/ | 同上；等待森林加载完成后拍摄 |
| snow-duel.webp | https://snow-duel.fangs.cc/ | 同上；当前夜雪俱乐部首页 |
| qiya-herbarium.webp | https://qiya.fangs.cc/ | 同上；温室与采集背包界面，未执行生成或修改进度 |
| wbw.webp | https://wbw.fangs.cc/ | 同上；只展示阅读站首页，原作归 Tim Urban / Wait But Why |
| dankoe.webp | https://dankoe.fangs.cc/ | 同上；只展示阅读站首屏，原作归 Dan Koe 及原权利人 |

网页原截图为 1280×720，完整缩放到统一封面中。App 展示用产品演示图，不使用个人照片、真实提醒人或私人聊天。原产品素材的权利边界继续由各项目维护，此处不扩大素材授权。临时采集和视觉 QA 文件位于 `/tmp/hi-refresh-20260926/`，不属于恢复依赖；封面成品已纳入本仓库。

## 2026-09-28 新增作品

| 文件 | 原始来源 | 加工 |
| --- | --- | --- |
| taste.webp | https://taste.fangs.cc/ | 内置浏览器真实首页截图，1280×800；包含当期艺术来信与希尔玛·阿夫·克林特作品，原图出处在原站保留；等比完整缩放，纸色留边 |
| aiedu.webp | https://aiedu.fangs.cc/ | 内置浏览器中文首页截图，1280×720；课程目录与语言切换，课程及品牌归 Khan Academy 与相应权利人；等比完整缩放，浅色留边 |

新增封面同为 1200×750 WebP、quality 88，不修改产品界面。原始截图与本轮 QA 证据在 `/tmp/hi-new-works-20260928/`，成品在本仓库留存。

## 2026-09-30 你品与海拉鲁

| 文件 | 原始来源 | 加工 |
| --- | --- | --- |
| taste.webp | https://taste.fangs.cc/ | 替换旧六扇窗截图；Chrome 真实首页，1280×800，包含新站名、分类与当前作品入口 |
| hyrule.webp | https://zelda.fangs.cc/ | Chrome 真实游戏入口，1280×800；等待场景加载完成与开始按钮可用，保留标题、场景与控制提示 |

两图等比缩放为 1200×750 WebP、quality 88，未改写页面或游戏画面。海拉鲁为个人非官方 Demo，素材归属继续以作品的「制作与素材」入口为准。原始截图与核验记录位于 `/tmp/hi-refresh-20260930/`；成品纳入本仓库。

## 2026-09-30 · 作品集画廊优化

11张既有作品封面全部保留原文件与画面，首页增大显示尺寸，比例仍为8:5；生成概念中的重绘封面不进入生产。新增 `public/fonts/geist-latin.woff2`（29288 bytes）与 `noto-serif-sc-subset.woff2`（114052 bytes），来自 Google Fonts 的 Geist / Noto Serif SC。中文子集覆盖站点标题与导航；其余文字有系统宋体回退。两份 SIL Open Font License 同目录保留。浏览器不再请求 Google Fonts。设计概念、提示与来源说明见 `design/2026-09-30/`。

## 2026-10-01 · 菌露谷宣传片

- `public/videos/projects/junlugu-promo-20261001.mp4`：直接复制菌露谷项目 `videos/promo-2026-10-01/final.mp4`，30.8秒、1920×1080、25fps、H.264/AAC，22,339,312字节；SHA-256 `36954752bd2172a5e471583c8f3468dd4b175ad62b5f635590f85a7bda7552c2`，未重剪或转码。
- `public/images/projects/junlugu-promo-20261001.webp`：同次成片的 `cover.png` 转WebP quality 88，保留完整1920×1080画面。用于播放器poster；首页原封面保留。
- 画面为生产范围的真实游戏操作，不含mire开发稿；片内配乐和动作音为Juhani Junkala/SubspaceAudio CC0资源。画面中的Kenney素材及Diarandor/Solarus黄蝶分别保留原许可。公开署名见同视频目录的 `junlugu-promo-20261001-credits.txt`，播放器下方有入口。完整制作与许可记录留原作品工程，内部日志不发布。
- 详情用浏览器原生控制、`playsinline`、`preload="none"`，不自动播放，保持16:9完整画面；只有主动播放才请求MP4。

## 2026-10-01 · PocoFocus 宣传片

- `public/videos/projects/pocofocus-promo-20261001.mp4`：直接复制 PocoFocus 项目 `videos/promo-2026-10-01/final.mp4`，30 秒、1920×1080、25fps、H.264/AAC 双声道；SHA-256 `9b07d35b09c0d74d75c8e86eab951d659e46008819610da714c1726f9a98aa74`，未重剪或转码。
- `public/images/projects/pocofocus-promo-20261001.webp`：同次 `poster.jpg` 转 WebP quality 88，保留完整1920×1080画面。用于播放器 poster；首页原封面保留。
- 画面为正式版本真实界面和演示操作，专注与培育等待已压缩。后期配乐《Zona》由 Lena Selyanina 创作，CC BY 3.0，已剪辑与淡入淡出；界面 OpenMoji 图标为 CC BY-SA 4.0。来源、许可和改动声明见播放器下方的 `pocofocus-promo-20261001-credits.txt`。
- 复用现有原生播放器：controls、playsinline、preload=none，保留完整16:9画面。仅成片、poster 与必要公开署名进入 public；捕获、演示状态与工具日志留在制作工程。

## 2026-10-01 · 海拉鲁宣传片

- `public/videos/projects/hyrule-promo-20261001.mp4`：直接复制海拉鲁项目 `videos/promo-2026-10-01/final.mp4`，29.28秒、1920×1080、25fps、H.264/AAC，21,238,164字节；SHA-256 `a0f518bedee8b4a9b70b1aa9233009ea901a4a416ad838e4700f9c2ac78392aa`，未重剪或转码。
- `public/images/projects/hyrule-promo-20261001.webp`：直接复制同次 `cover.webp`，完整1920×1080画面，126,258字节；SHA-256 `fd0420818646744f4566a7ddbdff377dde0221c11ed33309d6c9edb1c473074b`。用于播放器 poster；首页原封面保留。
- 画面来自当前个人非官方 Demo 的独立 QA 存档与真实输入，展示蓝焰收集、磁力机关和跃崖滑翔。画面中的 Kenney Castle Kit、Zelda UI Kit 与相关角色/名称归属按原作品说明；新增字幕与素材加工均保留出处。
- 配乐《Town3 - Sunshine Coast》由 Juhani Junkala / SubspaceAudio 创作，CC0；风声为确定性合成。两者为后期重建声轨，并非现场录音。片注与公开 `hyrule-promo-20261001-credits.html` 说明此边界、许可链接和加工方式；仅视频、封面和必要署名入站，完整工程及内部日志留在游戏项目。

## 夜雪俱乐部宣传片（2026-10-01）

- 详情采用31秒1920×1080/25fps真实v0.5.0电脑练习宣传片。正式站新匿名对局，无日常数据；原游戏速度不变，剪去部分等待及中间回合。
- MP4：`public/videos/projects/snow-duel-promo-2026-10-01.mp4`；同次封面：`public/images/projects/snow-duel-promo-2026-10-01.webp`。首页原封面保留。
- 源工程：`../snow-duel/videos/promo-2026-10-01/`。音乐Moon Mischief为项目程序合成，Kenney CC0音效用于重建；录像本身无音轨。公开说明在同目录`-credits.html`。
- 成片SHA-256：`0ae249f54ff5e56bf35cd04c628e5a00a55db08c22d4e39f0bd2a8cf3c572430`。真实观看吸引力与听感仍待反馈。

## 你品宣传片（2026-10-01）

- 源工程：`../taste-blog/videos/promo-2026-10-01/`；31秒正式站实录，1920×1080/25fps，无旁白。MP4直接复制，SHA-256 `88e70ebfbd66048950cb589527f00d8472a1c725024ab6850a2e671ee883a245`。
- 成片 `public/videos/projects/taste-promo-2026-10-01.mp4`，封面由同次 `poster.jpg` 转为WebP（quality90），保留完整16:9；首页原封面保留。
- 广重原作与局部来自Met JP2522，CC0；文字导览格得，原创程序合成配乐为后期声轨。公开署名见 `public/videos/projects/taste-promo-2026-10-01-credits.html`。

## AI 教育 · 中英双语宣传片（2026-10-01）

- 源工程：`../ai-for-education-zh/videos/promo-2026-10-01/`；30秒正式站实录，1920×1080/25fps。MP4直接复制，SHA-256 `7b615231c55861f534c89be10cf9e032b93a93ae24ce9723a12024c6c70f42b2`。
- 成片 `public/videos/projects/aiedu-promo-2026-10-01.mp4`，同次poster.jpg转WebP（quality90），保留16:9；首页原封面保留。原作者、非官方身份和后期配乐来源见 `public/videos/projects/aiedu-promo-2026-10-01-credits.html`；完整工程与日志不公开。

## Wait But Why 中译宣传片（2026-10-01）

- 源工程：`../wbw/videos/promo-2026-10-01/`；31秒正式站实录，1920×1080/25fps。MP4直接复制，SHA-256 `44697f390a483b764d94b24d32f85a0767f9325aa113561ae679a479704dfebe`。
- 成片 `public/videos/projects/wbw-promo-2026-10-01.mp4`，同次poster.jpg转WebP（quality90），保留16:9；首页原封面保留。原作者、非官方身份和后期配乐来源见 `public/videos/projects/wbw-promo-2026-10-01-credits.html`；完整工程与日志不公开。

## Dan Koe 中文阅读站宣传片（2026-10-01）

- 源工程：`../dankoe/videos/promo-2026-10-01/`；30秒正式站实录，1920×1080/25fps、SAR1:1。MP4直接复制，SHA-256 `686c86eb152d245380f19be0357bee99e4c9f51ce8cb3a07364abc0a416cfe84`。
- 成片 `public/videos/projects/dankoe-promo-2026-10-01.mp4`；同次poster.jpg转WebP（quality90），保留16:9；首页原封面保留。原作者、非官方身份与后期原创配乐见同前缀credits.html；完整工程留消费项目。

## 奇芽药草铺宣传片（2026-10-01）

- 源工程：`../qiya-herbarium/videos/promo-2026-10-01/`；28秒v0.9.3界面实录，独立演示存档与既有生成图，非实时生成。1920×1080/25fps；MP4直接复制，SHA-256 `a6cc23ce6a1b28371d1a288d50b3273ef01b218a47d904d36cae54db2c3085be`。
- 成片 `public/videos/projects/qiya-herbarium-promo-2026-10-01.mp4`；同次poster.jpg转WebP（quality90），保留16:9；首页原封面保留。项目生成美术、场景准备和后期原创配乐见同前缀credits.html；完整工程留消费项目。

## 单词合合乐宣传片（2026-10-01）

- 源工程：`../lehh/videos/promo-2026-10-01/`；31秒1.1.0独立模拟器实录，1920×1080/30fps、930帧。MP4直接复制，SHA-256 `4f81f3de349380911cb43439d21bb313b79bc3039f4c1e1a61a3e93272307a17`。
- 成片 `public/videos/projects/lehh-promo-2026-10-01.mp4`；同次poster.jpg转WebP（quality90），保留16:9；首页原封面保留。后期原创配乐、系统示范语音与阅读停留见同前缀credits.html；完整工程留消费项目。

## 歇会鸭宣传片（2026-10-01）

- 源工程：`../little-pause/videos/promo-2026-10-01/`；31秒1.1独立模拟器与系统卡实录，1920×1080/30fps、930帧。MP4直接复制，SHA-256 `b23d2f4d434511c19691bb3f580c2715ac7791b9acd6130d785e13553dca08b9`。
- 成片 `public/videos/projects/little-pause-promo-2026-10-01.mp4`；同次poster.jpg转WebP（quality90），保留16:9；首页原封面保留。15秒提醒试用、后期原创配乐与静态停留见同前缀credits.html；完整工程留消费项目。
