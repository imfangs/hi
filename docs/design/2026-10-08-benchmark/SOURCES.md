# Hi：作品发现、体验与返回的标杆依据

核查日期：2026-10-08。采用 FBT「标杆设计」方法。核查时 Hi 源码为 `af66be9`，精选作品 17 件；本文件是实施前的机制判断，实际改动和验收由本目录后续记录负责。

理想体验：第一次来的人能凭真实画面和一句用途找到想看的东西，熟悉的人能迅速找到作品；既能直接打开作品，也能先读介绍，再顺着兴趣继续。保留纸白、宋体、Geist、朱砂红、TBS 标志和开放双栏画廊。

## 1. Apple HIG：把最可能的动作说明白

- 官方页面：<https://developer.apple.com/design/human-interface-guidelines/buttons>
- 本轮实际读取：<https://developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json>，HTTP 200。
- 证据类型：官方 DocC 文本文档；没有浏览 Apple 实际界面或进行视觉比较。页面未在本次取回内容中提供可引用的版本号，以核查日期为准。
- 关键原文："In general, use a button that has a prominent visual style for the most likely action in a view." 文档要求控制显著按钮数量，并建议标签用简短动词说明动作，给控件留足可识别和可操作的空间，提供按下状态。

**当前问题 → 适配决定**：Hi 首页卡片只有进入介绍页的一条链接，已经知道要玩什么的访客仍需多走一步。保留封面和标题进入介绍，另设一个明确的直达动作，如“开始一次专注”“画一张花纸”；使用现有 `links[0]` 的真实标签和地址。无外部入口的创作只提供“看作品”，不伪造可体验状态。Pocket 保留“个人部署（需登录）”的条件。

详情页已有主次动作，应保留；卡片上的体验动作采用克制的文字或边框处理，避免 17 件作品都成为争抢注意力的朱砂按钮。进入介绍用站内方向提示，前往外站用外链提示；不让同一种箭头暗示两种去向。卡片主链接和直达链接作为独立可聚焦链接，不嵌套链接。

**预期改善（待验证）**：从首页到实际作品减少一次页面跳转，同时保持介绍入口清楚。

**检查**：鼠标、触屏及键盘分别从同一卡片进入介绍和真实作品；链接目标、焦点顺序、点击区域互不冲突；无链接条目仍完整可读，登录/内测条件没有隐藏。

## 2. Apple HIG：搜索范围明确，输入即可收窄

- 官方页面：<https://developer.apple.com/design/human-interface-guidelines/search-fields>
- 本轮实际读取：<https://developer.apple.com/tutorials/data/design/human-interface-guidelines/search-fields.json>，HTTP 200。
- 证据类型：官方 DocC 文本文档；非视觉观察。
- 关键原文："Use placeholder text to help people know what they can search for."、"If possible, start search immediately when a person types."、"Use a scope bar to filter among clearly defined search categories."
- 文档同时说明：搜索可以与分类过滤组合；较宽范围帮助人理解可用内容，再进一步缩小。

**当前问题 → 适配决定**：17 件作品横跨应用、游戏、阅读和创作，现有四类筛选能探索，但找一个记得名字或用途的项目仍需扫完整个列表。增加一个就地搜索框，与现有分类并用；范围写成“搜索作品名称或用途”，匹配公开标题、副标题和类别等已展示信息。输入实时更新，保留稳定作品顺序，不引入不透明的推荐排序。

搜索结果数量与清除入口在控件附近；空结果提供“清除搜索”或“查看全部作品”，保留用户刚输入的词，避免突然回到全列表。查询和分类共同进入 URL，让刷新、复制链接与返回都能恢复。默认仍是全部作品，不以搜索遮挡首次浏览。

**预期改善（待验证）**：记得“花纸”“专注”或项目名的访客能用较少扫描找到作品，零结果也知道如何恢复。

**检查**：中文、英文大小写、前后空白、搜索与分类交叉、清空、零结果、浏览器前进/后退、刷新；键盘焦点不随每次过滤跳走，结果变化以低干扰状态文本告知。无 JavaScript 时仍展示全部作品。

## 3. GOV.UK Design System：返回原来的页面状态

- 官方页面及本轮实际读取：<https://design-system.service.gov.uk/components/back-link/>，HTTP 200。
- 证据类型：官方 HTML 文本；未做 GOV.UK 界面的视觉观察。
- 关键原文："Make sure the link takes users to the previous page they were on, in the state they last saw it."
- 官方说明还指出，不能只依赖用户认识或相信浏览器后退；其组件用于多页事务，并建议在可能时保留无 JavaScript 路径。

**当前问题 → 适配决定**：Hi 已通过 `view` 参数保存分类，详情页也有顶部和底部返回入口，这是有效基础。补上搜索条件后，返回应回到原分类、查询和作品位置，尽量恢复刚刚点击的卡片；显式返回与浏览器后退都要成立。直接打开的详情页则使用清楚的“回到全部作品”回退。

继续浏览也应遵循当前集合：在“阅读”中进入的详情继续到下一件阅读作品；带搜索词时，继续顺序应与实际结果一致，或明确返回结果再选。只有一件结果时不循环到自身，也不悄悄跳到无关分类。可以用下一件的真实封面、名称和类别帮助人决定是否继续，避免只有一个抽象箭头。

**预期改善（待验证）**：从详情返回后不用重新筛选或寻找原位置；继续浏览的去向可以预见。

**检查**：从列表中部进入详情，页面内返回和浏览器后退分别核对查询、分类与位置；刷新详情后返回；直接深链进入；单项集合、末项和无 JavaScript 的合理回退。下一件的标题、图片、链接与当前集合一致。

## 本轮不照搬的部分

1. Apple 的原生材质、胶囊形控件、底部搜索和系统单位属于具体平台。Hi 使用语义 HTML 链接/表单与自身版式，不引入 Liquid Glass 或底部悬浮栏。HIG 的点尺寸原则用于关注触达范围，不机械声称 Web CSS 像素等于原生点。
2. 搜索不扩成命令面板、复杂 token、多级标签或服务端全文系统。17 件作品先用公开元数据和现有分类解决找得到的问题。
3. GOV.UK 的“事务”定位与 Hi 不同；采用状态连续性，保留 Hi 的版式，不套政府站视觉或在现有返回入口旁再堆一套面包屑。下一件封面是 Hi 的适配判断，不冒称 GOV.UK 的官方机制。
4. 不以搜索或动作优化为由调整作品顺序、虚构热门/推荐、加入播放量与效果背书。新增交互是否让真实访客更容易找到作品仍待用户反馈。

## 未采用的候选与访问边界

Notion Gallery 与 Search 曾作为候选，官方 URL 为 <https://www.notion.com/help/galleries>、<https://www.notion.com/help/search>。本轮 Python HTTPS、系统 curl 和独立 Playwright Chromium 均在 TLS/SSL 阶段失败（`TLSV1_ALERT_INTERNAL_ERROR` / `ERR_SSL_PROTOCOL_ERROR`），未取得官方正文或界面；没有关闭 TLS 校验。因此本轮不把关于 Notion 的印象或旧经验用作设计依据，也不声称做过其视觉对照。Chromium 已关闭。

核查时已读 Hi 的 `ProjectRow.astro`、`index.astro`、`projects/[...slug].astro`、`gallery.ts`、`detail.ts` 与分类定义。上述“当前问题”来自这次源码回读，不代表已完成当前线上界面视觉审计。
