# 作品封面来源

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
