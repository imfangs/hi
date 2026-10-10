# Fangs · 三角之力新标志提案

日期：2026-10-10。状态：两条新方向已制成矢量稿，**推荐「品·三窗」，尚待方帅选择**。本轮是本地设计探索，未替换或发布 hi.fangs.cc 的标志。

打开 [对比与试用页](index.html)，可切换两稿、纸白/墨黑/朱砂背景和尺寸；[对比图](comparison.png) 可直接保存。

## 本轮输入与选择

方帅的要求是试用 FBT logo-design，继续考虑 Taste / Build / Sell 的三角之力，且不回读旧 logo 设计。设计输入仅为这个命题、项目 AGENTS 中的文字气质和项目已有的许可字体。没有打开线上首页、旧 logo、旧设计稿或旧 logo 研究。

- **01 品·三窗（推荐）**：三个等大的方窗按“品”字结构排列，整体构成三角。向中心削去一个角，在中间形成松弛的空间。Taste 与“品”有直接记忆联系；三单元等大承载 Taste、Build、Sell 的平等关系。它更像作品集的签名或印记，三角语义更含蓄。可能被读成“品/品质、窗口、作品宫格”，是否形成品牌记忆仍待实际观看反馈。
- **02 三页相生（备选）**：三个同形折角旋转 120°，共同围出开放三角。它更直接呼应三角之力；但独立评审和主设计者都看到了回收循环联想，因此保留为对照，不作为首推。

第一轮连续拼接方案缩小后只剩空心三角，后续打开缝隙仍有回收联想，最终转向三窗结构。这些判断来自本轮新图比较，不是对旧稿的评审。

## 文件怎么用

| 用途 | 文件 |
| --- | --- |
| 推荐主图，朱砂 / 墨黑 / 反白 | `assets/pin-symbol-{vermilion,ink,white}.svg` |
| 推荐主图透明 PNG | `assets/pin-symbol-vermilion.png`，1024 × 1024 |
| 16px 专用图，原始像素画布 | `assets/pin-favicon-{ink,vermilion,white}.svg` |
| 推荐主图 + fangs 字标 | `assets/pin-lockup-{ink,vermilion,white}.svg` |
| 备选主图 / 组合稿 | `assets/fold-symbol-*`、`assets/fold-lockup-*` |
| 独立字标 | `assets/fangs-wordmark-*.svg` |
| 浏览器 favicon / Web 图标交付 | `export/`，仅是本地资产包 |
| 可编辑几何与生成入口 | `source/geometry.json`、`source/build.py` |
| 审计与预览 | `checks/asset-qa.md`、`checks/asset-qa.json`、`checks/fbt-preview.html` |

主图的孔为真实负空间；字标和示例口号已转轮廓，使用时无需安装字体。网页示意仅用于比较标志，不是站点改版。

在当前 workspace 中可用 `python3 source/build.py` 重建 SVG，再用 `python3 source/render.py` 调用 FBT 渲染及导出；第二条命令使用 `--preserve-favicon-viewbox` 保留小尺寸稿画布。Python 需要 fontTools，字体输入仍为本项目 `public/fonts/` 下的许可文件。

## 最小使用规范

- 颜色：朱砂 `#B44732`、墨黑 `#242420`、纸白 `#F6F3EB`。全标一色，三单元不分别着色。
- 常规三窗符号建议 32px 起；16px 使用专用稿。专用稿三个孔均为 2 × 2px，模块间保留至少 2px 透明间隙。
- 圆头像用常规 `pin-symbol` 或带留白的 icon；16px 专用稿为方形浏览器标签设计，不能直接圆裁切。
- 折页备选在 16px 的分离缝比较弱，建议至少 32px，保留更宽圆形安全留白。
- 组合字标建议至少 100px 宽。图形外留白至少为一个窗框笔画宽度（主图画布中为 22 单位）；三单元保持等大，不单独拉伸或拆分。
- 字体：Instrument Serif Italic，作者与 SIL OFL 1.1 见项目 `public/fonts/instrument-serif-OFL.txt`。交付字标由该字体生成轮廓，不宣称为从零绘制的独创字形。

## 验证与边界

使用了 FBT 的参考库检索、SVG 审计、概念对比、PNG 渲染、变体导出和小尺寸预览。参考库仅研究构造和相似联想（Framer、Unity、Google Drive），未使用它们的路径作为新稿几何。

独立灰阶并排比较：三窗依靠“三个独立方孔＋品字排列”与 Framer 的实心折字、Unity 的连通立方体、Google Drive 的三角环形成区分。折页备选仍处在三角环/回收箭头的视觉家族内。这只是在这一组参考里的比较。

- 已完成 SVG/XML、独立路径、透明孔、像素尺寸、ICO 解码与圆裁切检查，详细数值见 `checks/`。
- 浏览器实际回读：1440px / 390px 均无横向溢出；所有图像加载；六组方向/背景组合正常切换；16/32/64 均以对应 CSS 像素显示；滑杆 240px 时实际宽度 240px。截图渲染来自 FBT 的独立 Chrome 后端。
- 导出器原来的 bbox 自动归一化会破坏像素稿；本轮修复保留原画布路径后再验收最终 favicon，前后证据留在检查报告。
- 能力修复已回到 FBT：`794f72f7010bdb0798e56b0c5bfa21fe27476662`，新增 `--preserve-favicon-viewbox`，5 项能力回归通过；此项目真实重导出后 16px RGBA 与原生稿一致，半透明边缘像素由 98 恢复为 6。
- 原创辨识、公众第一眼联想及真实品牌使用效果尚未验证；库内参考和几何检查不能证明商标可用。

后续若方帅选择一稿，先在选定方向内继续精修；采用到线上属于下一步明确选择与实施。本目录是本轮接续事实源。
