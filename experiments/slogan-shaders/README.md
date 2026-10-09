# Taste. Build. Sell. — 三种表达

2026-10-09，本地口号互动样例，未替换或发布 Hi 首页。沿用 Instrument Serif 斜体、整行同字号、纸白与朱砂；真实使用 `shaders@4.0.3`。

- 墨色：SolidColor + InkFlow，文字 alpha 遮罩。指针划过字形，墨色中出现朱砂流体。
- 成形：本地字体栅格 → ImageTexture → Pixelate。拖动滑块从颗粒到完整口号。
- 回响：Ripples + 字形遮罩；点击/Enter 改变波源并启动短暂流动，外圈使用 CSS。不是每个动画都由 Shader 绘制。

## 打开

双击 `打开样例.command`，或在此目录运行 `npm run dev`，打开 http://127.0.0.1:4329 。终端 Ctrl+C 停止；没有注册常驻服务。首次缺依赖时 `npm ci --registry=https://registry.npmjs.org`，本机默认镜像曾缺 tinyest 0.3.2，官方源安装成功。

`npm run build` 生成 dist。构建只包含样例与两套本地字体，不复制 Hi 的项目封面/视频；页面不在 Astro 的 src/pages 路由中。

## 验证与边界

IAB 真 WebGPU 初始化、墨色拖动后字内变色、成形滑块 15%/100%、回响 Enter 生成外圈、暂停按钮切换；桌面和390px手机视口。视觉检查发现桌面初始化后手机画布仍固定像素，已改成内联100%尺寸，复核画布与容器同宽同高。

缺 GPU 时保留 HTML 口号并提示；减少动态默认暂停，离屏/后台暂停；销毁旧实例后切换，关闭遥测。本轮未模拟 GPU 丢失或实测实体触屏/Safari/耗电；不把桌面视口当真机。上游出现一条 `external-omitted in.uv` 警告，当前三个效果未见对应错误或无法渲染。

当前原生 JS 入口导入整个组件注册表，构建 JS 约2.6MB（gzip约727KB），适合独立样例。正式首页接入前要做按需打包或更轻实现；不建议把这个样例入口原样塞进首页。

## 来源

- Shaders 4.0.3：MIT，许可见 THIRD-PARTY-LICENSE.txt；使用自行组合的基础组件，没有复制官方付费预设。
- 字体来自 Hi 已自托管的 Instrument Serif / Geist，OFL文件随 public/fonts 保留。
- 设计基础：../../docs/design/2026-10-09-simplification/README.md。
