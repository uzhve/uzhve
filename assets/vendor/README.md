# Self-hosted scroll helper

motion-scroll.js contains the tree-shaken `scroll` export of Motion14.0.0 (MIT), bundled locally with esbuild0.28.2. It drives navigation visibility only: the logo has no animation. It does not use an external CDN and the portfolio remains a static site without a build step for viewing.

Source documentation: https://motion.dev/docs/scroll
Animation documentation: https://motion.dev/docs/animate
Gallery arrows: Phosphor Icons core2.1.1, regular caret-left/right, MIT. Original SVGs and license are in icons/.
Source dependency lock: .impeccable/runtime-motion/pnpm-lock.yaml
Rebuild: run the esbuild CLI in .impeccable/runtime-motion/node_modules/.bin against .impeccable/runtime-motion/entry.js with bundle, iife, global-name UzhveMotion, minify and outfile assets/vendor/motion-scroll.js.
