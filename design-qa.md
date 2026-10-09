# 2026-10-09 首屏与页尾精简

18页构建与TypeScript、原浏览回归通过。桌面与320px共34详情布局检查；隐藏且未打开的漫画灯箱空src不属于损坏图片。字体请求失败及200%文字曾复现横溢，修复后10个场景通过。最终同尺寸对照、机器回执和审美判断边界见 [本轮记录](docs/design/2026-10-09-simplification/README.md)。

---

# Hi visual design QA · 2026-10-08

final result: passed

## Comparison target and state

- Visual direction: `docs/design/2026-10-08-visual/concepts/editorial-atelier.png` (1536×1024).
- Matching rendered frame: `docs/design/2026-10-08-visual/after/concept-frame.png` (1536×1024), Codex in-app browser, light theme, homepage, scrollY=0.
- Combined comparison: `docs/design/2026-10-08-visual/comparison-concept.webp`.
- Previous design baseline: e54ea82 / runtime c064194; baseline and final desktop1440×1000 / mobile390×844 originals are linked from the visual README. The homepage's complete17-work collection is unchanged, while display order is intentionally curated. Same-project detail comparison holds the image/text constant.
- The concept is an art-direction reference, not a pixel-exact clone. It contains redrawn source imagery and imperfect text that are deliberately replaced with the original verified assets and copy.

## Required surfaces

1. Typography: Instrument Serif italic gives Taste a display signature; Build/Sell remain Geist and Chinese headings retain Song. Actual local font load returned true. The original slogan and work titles are readable, and all17 titles/actions stay within320px. The mock's exact glyph shapes are not a specification.
2. Layout/rhythm: Large floral lead with an adjacent title/caption, smaller original drawing beside the larger island, and selected wide works establish hierarchy. The later directory remains regular. Default display order equals DOM order, while search/filter use regular tracks. Spacing has group/within-group differences without a masonry dense reorder.
3. Color/tokens: Existing warm paper, charcoal and vermilion are retained. Reference websites supply compositional ideas, not their brand colors. Dark mode keeps original artwork colors. No generated texture, gradient or fake background asset was introduced.
4. Imagery: All original cover bytes are unchanged and render at8:5 without cropping. The actual floral image is taller than its redrawn concept counterpart, an accepted difference to preserve the product interface. TBS remains the approved original SVG; no model logo or fabricated UI enters production.
5. Copy/content:17 MDX content hashes match baseline; labels and actual destinations remain. Display indices express sequence only. The generated alternative's dates and placeholder copy are excluded. Personal deployment, internal testing and spoiler notices remain.

## Findings and comparison history

The combined1536×1024 concept/implementation comparison was inspected as a single input. The implemented signature is narrower than the model glyphs, and the complete8:5 first image places the next row lower; these are accepted differences for a real font and unmodified imagery.

No actionable P0/P1/P2 visual issue remains. Main-agent and independent controlled comparisons found a clearer personal signature and image hierarchy without covering the works. A temporary462×1000 screenshot produced during a viewport transition was rejected as evidence and replaced by a verified1440×1000 capture; no product change was made to conceal it.

Focused checks supplemented the full-view comparison: browser DOM and font-loading state verified the font; CTA/heading geometry and all17 detail pages verified wrapping; per-element rectangles verified filter/search separation at intermediate widths; image dimensions verified original proportions. Small text is not judged from a contact sheet alone.

## Functional checks

Actual IAB checks cover: search + category, regular/exhibition layout switch, equal view/q on image and title links, image-click navigation, return anchor and focus, zero-result recovery, history, dark theme, all17 desktop and320px details, no-JavaScript fallback, and reduced motion.24 native players retain controls, playsinline, preload=none and no autoplay. No page console errors were returned in the checked tab. IAB did not expose the target=_blank handoff from the external CTA. A separate CUA Chrome check clicked the actual card link, created a new tab, and read back https://chenchen.fangs.cc/ with its expected title; both temporary Chrome tabs were closed. Public read-back is recorded separately after deployment.

## Boundaries

This is an independent design judgment, not evidence of visitor preference, conversion or long-term usefulness. No new physical-phone/Safari or human IME test. No new continuous listening/viewing of the existing media. All temporary emulation and theme choices are restored before closeout.

## Public delivery

Published source11776af / Pages aafb2fb.43/43 scoped static files match, original media are unchanged, and the formal IAB page shows the new first work and loaded display font.390px search/image entry/return-focus pass on a fresh tab. A timed-out same-page navigation wait was treated as tool-state uncertainty and the relevant flow repeated; no product changes were made to conceal it. See docs/releases/2026-10-08-visual-publish.json.
