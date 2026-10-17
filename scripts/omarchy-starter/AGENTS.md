# Omarchy theme starter

A portable, local-first example for evaluating 23 Omarchy-derived daisyUI themes.

- Run npm install, then npm run dev; npm run build verifies the static output.
- Original palettes come from Omarchy revision 33783b1707d2fd5cdbab99aec183fc761d14bca0. The font, radius and spacing values are experimental fangs/Ged adaptations.
- themes.css owns theme variables; data-theme on an ancestor selects one. daisyUI consumes the color/radius/size values. style.css consumes --style-heading-font, --style-body-font and --style-space.
- main.js is a local interaction sample; inputs are not persisted or sent to a server. Preserve inputs when switching themes.
- Keep the included licenses and source links. Do not claim OS integration or that these presets are an official Omarchy web design system.
- Before adopting a theme in another project, check the actual content, contrast, font availability, forms, mobile width and state transitions.
