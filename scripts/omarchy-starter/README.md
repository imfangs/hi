# Omarchy theme starter

A Vite + Tailwind CSS 4 + daisyUI 5 starter with 23 portable theme presets.

```sh
npm install
npm run dev
```

Run `npm run build` for the static production site.

Set `data-theme="omarchy-catppuccin"` (or another id from presets.json) on a parent element. daisyUI buttons, fields, badges and cards consume the `--color-*`, `--radius-*` and size variables automatically. Layout code uses `--style-heading-font`, `--style-body-font` and `--style-space`; these extra variables are our webpage adaptations, not Omarchy's official tokens. Frameworks such as Astro, React and Vue can reuse this CSS without changing their data layer.

Color palettes are copied from Omarchy commit 33783b1707d2fd5cdbab99aec183fc761d14bca0. Typography, radii and spacing are experimental fangs/Ged adaptations; test with real content and accessibility needs before migrating a product. Button foreground colors are chosen for black/white contrast. Wallpapers are not included. See OMARCHY-LICENSE.txt and the daisyUI package license.

Source: https://github.com/omacom/omarchy
Gallery: https://hi.fangs.cc/omarchy/themes/
