# Hi App Store CTA / WebKit 只读诊断与验收边界

日期：2026-10-01。目标：Hi `lehh` 详情上的 `https://apps.apple.com/cn/app/id6785151750`。未改变实际链接、Hi 内容或产品，未操作本机 App Store；只修改获授权的 `scripts/verify-promos.mjs`，未 commit。

## 事实与解释

- 原始批量回执 `/tmp/hi-promo-batch-local-lehh/qa.json` 中，Chromium 三视口均真实点击打开正确 App Store 页面；WebKit 三视口的媒体、完整播放/跳转、署名等已通过，仅等待 popup 超时。
- 单链接探针 `probe.json`：WebKit 26.5 点击 Hi 的 App Store `_blank` 链接后，15 秒内未观察到 popup、新 page 或 Apple 导航请求，Hi 留在原 URL。相同上下文另建页面直接 `goto` 同一 URL 后，经 301 到正确应用页，HTTP 200，标题为「单词合合乐 App - App Store」。独立 HTTP GET 也成功。
- `markup.json` 的无脚本纯 HTML 对照：App Store `_blank` 和 `_self` 的真实点击均为 `trusted=true/defaultPrevented=false`，4 秒内无浏览器导航请求；只把链接 URL 改为 `https://example.com/` 后，WebKit 正常创建 popup 并请求目标。
- 因此问题不依赖 Hi 页面脚本，且 App Store 网页可达。证据将边界定位到该 WebKit 运行环境对 App Store 链接激活的外部导航处理。是否真正打开了本机商店没有观察到，不能宣称接管成功或精确断言 WebKit 内部机制。

## 脚本记录

`schemaVersion: 2`，把 `cta-links-and-http` 和 `cta-links-open` 拆开。

只有同时满足以下条件才记录为未验证外部导航边界：WebKit、官方 `https://apps.apple.com` App ID 链接、真实且未阻止的 `_blank` 点击、Hi 原页未导航、期间零浏览器导航请求、等待 popup 的错误确为 TimeoutError、独立 HTTP GET 成功，以及另建 WebKit 页面直接导航到相同 App ID 并取得成功响应与非空标题。

普通 CTA 超时、错误 HTTP、链接被阻止、错误 App ID、直接浏览器导航失败等仍走失败路径；不能用 Apple 域名或 HTTP 200 单独免除真实错误。

- 媒体结果：`result.mediaVerification.passed`。
- 未验证点击：`cta-links-open.passed=null`、`status=unverified`，保留原始 `popupError`、真实点击证据、`popupObserved=false`、`nativeAppStoreHandoffVerified=false`。`openedByClick=false` 表示没有观察到由该点击打开的浏览器页面，不用于推断原生商店状态。
- 主动直接导航：独立的 `directBrowserNavigation`，明确 `method` 是测试器另发 `page.goto`，不冒称此前 CTA 点击成功。
- 整体：`status=partial`、`passed=false`、`partialResults=1`、`failures=0`，退出码 **2**。正常通过为 0，真实失败或执行不完整为 1。
- 新增 `--views desktop,phone,narrow-dark`，用于局部复验；默认仍全视口。

## 本次复验

```sh
node scripts/verify-promos.mjs \
  --url http://127.0.0.1:4218 --slugs lehh \
  --out /tmp/hi-appstore-webkit-partial \
  --playwright-root /Users/fangs/workspace/side/snow-duel/videos/promo-2026-10-01 \
  --engines webkit --views phone
```

实际退出码 **2**；回执 `/tmp/hi-appstore-webkit-partial/qa.json`：1 个结果，mediaVerification=true，CTA href/HTTP 通过，直接 WebKit 应用网页导航通过，点击/原生商店接管未验证，返回 apps 分类成功，无 Hi 页面/控制台错误。没有重跑完整六组；原始 Chromium 实开与 WebKit 媒体结果保留。`node --check` 通过。

用于交接的脚本 SHA-256：`14ab2c19317b43fb2d80ee46eb83fd6a5d856ed18f872d3a7c14bea05856f1ef`。
