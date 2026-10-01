# Hi 宣传片海报黑弧：只读诊断

日期：2026-10-01。目标：现有 `http://127.0.0.1:4218/projects/snow-duel/?view=games`；只读现有站点，所有脚本和证据写在 `/tmp`，未修改 Hi 源码或预加载策略，未重启 4218 服务。

## 结论

这是本次 headless Chrome 环境中原生媒体控件初始化时短暂显示的 loading panel，被约 650–800 ms 的海报截图捕获。原始海报不含黑弧；本轮观测中，到 3 秒时已经消失，3 秒与 10 秒的播放器截图逐字节相同。不能把它写成持续加载、成片故障或真人浏览器中的已证实问题。

该现象同时在 Chrome 154.0.8037.58 和 Chrome for Testing 151.0.7922.34 复现；154 的 reduced-motion 开、关均复现，不能归因为 154 新版独有或减少动态效果设置。未测实体手机、普通用户的 headed Chrome、Safari；本诊断只覆盖一个 390×844 合成视口和雪仗详情。

## 直接证据

- 三个隔离上下文分别为 `chrome-reduce`、`chrome-normal`、`bundled-reduce`，均没有点击播放；约 0.7、3、10 秒记录中 `readyState=0`、`networkState=1` (NETWORK_IDLE)、`paused=true`、`currentTime=0`、`preload=none`，MP4 请求数始终为 0。
- 中心 100×100 像素裁剪确认：三个上下文的约 0.7 秒截图有黑色半圆弧，3/10 秒无此弧；各上下文 3 秒与 10 秒 PNG SHA-256 完全相等，详见 `timing-comparison.json`。
- 独立的原生控件 CDP 读取在 709 ms 得到 `-internal-media-controls-loading-panel`、`aria-label=buffering`、`display=block`；3006 ms 得到同一原生面板 `display=none`。见 `loading-panel-timing.json`。这是浏览器自身控件状态证据，不是对浏览器源码的推测。
- 实际 public 海报 `/Users/fangs/workspace/side/hi/public/images/projects/snow-duel-promo-2026-10-01.webp` 没有黑弧；先前网页验收已确认浏览器海报响应字节匹配本地源。
- 关掉 controls 的临时 DOM 对照截图同时去掉正常控制条渐变；因此 controls-on/off 的总中心像素差不能单独检测黑弧。应以相同 controls 状态的时间对照或 loading panel 状态判定。

## 证据入口

- `chrome-reduce.json`、`chrome-normal.json`、`bundled-reduce.json`：媒体状态、请求、原生控件样式和截图路径。
- `loading-panel-timing.json`：0.7 秒显示、3 秒隐藏的直接 CDP 证据。
- `timing-comparison.json`：相同控件状态的截图哈希与中心像素差。
- `center-comparison.jpg`：154 reduced-motion 的 0.7 秒、10 秒与 controls-off 中心裁剪。
- `version-motion-comparison.jpg`：第一行 151 reduced-motion 0.7/10 秒，第二行 154 no-preference 0.7/10 秒。
- `first-comparison.jpg`：包含原始 public 海报的受控比对图。

## 对主线程的建议

保留当前功能验收通过结果和 `preload=none`。如主线程要改善 QA 截图，可在不点击播放的条件下等待短暂 loading panel 消失后再取海报截图，并继续保留 `paused=true/currentTime=0/MP4请求=0` 断言；本轮 3 秒已稳定。不要改成等待 `readyState>0` 或 `preload=metadata`，它们会改变原本的不预取语义。无需据此修改公开页面。

## 更正记录

曾在低分辨率整图中把控件正常渐变与黑弧混淆，初步说过“10 秒仍存在”；原尺寸中心裁剪与相同控件状态的像素比较推翻了这个初判，已立即向主线程更正。最终结论以本页和时间对照为准。

## 复现命令

```sh
node /tmp/hi-promo-spinner-probe.mjs chrome-reduce
node /tmp/hi-promo-spinner-probe.mjs chrome-normal
node /tmp/hi-promo-spinner-probe.mjs bundled-reduce
node /tmp/hi-promo-spinner-panel.mjs
```

脚本仅创建独立匿名浏览器上下文、读取现有页面、保存截图和样式证据，并在结束后关闭各自的上下文与浏览器。
