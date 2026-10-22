# margreenie — Margarita Samsonova (Greenfluencer)

Personal brand site for Margarita Samsonova (@margreenie): greenfluencer, conservationist,
founder of Behind the Greens, storyteller connecting green brands with greenfluencers.

Live: https://wgt-edutech.github.io/margreenie/

## Pages

- `index.html` — scroll-story clone of the portfolio pattern: Instagram-post hero,
  name/title reveal, ring gallery with reflections (projects), whale meditation story,
  event tour list, donation placeholders (EU + crypto), socials footer.
  Cherry-blossom petals + snowflakes replace the original glowing spheres (matte,
  NormalBlending, no illumination). Loading bars/glow removed.
- `blog.html` — "The Knysna Question: Can an Elephant Talk to a Whale?" — her current
  quest into interspecies communication, with Lyall Watson's 2000 Knysna-coast legacy.
- `network.html` — clickable brand/project cards (Behind the Greens, Whale Passage,
  Greenfluencers in the Wild, Terra Incognita, Mercedes Oceanic Lounge, Mangrowth,
  Sacred Soul Fest, Voyage Michigan, Knysna Quest, EU Young Energy Ambassador).

## Content notes (honesty rules)

- All facts sourced from interviews/feature articles (Voyage Michigan 2026, Wherever
  Magazine, jeromemaas.com, Elephant Listening Project). No fabricated stats.
- `images/hero-post.jpg` is a PLACEHOLDER slot — replace with her actual most-liked
  Instagram post; the frame falls back to a "picture coming soon" state until then.
- Donation buttons are placeholders (`data-donate` chips) — wire real payment links
  and wallet addresses before launch.
- The 7 Nov 2026 Cape Town tour card is a placeholder — venue (likely Light House
  Holistic, 50 Bree St) and time to be confirmed via @margreenie.

## Orbit room + animation lab + variable proximity

Three additions to `index.html` (see `.hermes/plans/orbit-room-and-lab-controls.md`):

- **Orbit room (r6)** — a matte teal sphere with three aquamarine orbit rings and
  orbiting satellites, pure CSS 3D (`preserve-3d`), scrubbed by GSAP on r6's scroll
  progress. No canvas, no Three.js — scroll-driven only. The gallery moved to **r7**
  (rooms are read from the DOM in document order; the gallery is looked up by id).
- **Animation lab** — a vendored lil-gui 0.21 panel (`js/lil-gui.min.js`, MIT) driving
  every engine parameter live. Open it with the floating **lab** button, or with
  `?lab=1`. Folders: Orbit room / Scroll engine / Gallery / Text · proximity, plus
  **Reset to defaults** and **Copy share link** (bakes the state into `?cfg=<base64url>`).
- **Variable proximity on all text** — cursor distance drives variable-font weight
  (and opsz where the font has an optical axis). Body text uses variable Inter
  (`Inter:opsz,wght@14..32,100..900`); the name keeps its per-character treatment.
  Pure maths lives in `js/vp-engine.js` and is unit-tested in Node.

One source of truth: the lab writes `SITE`, every engine reads `SITE`.

## Colophon

Cloned from the owner's portfolio (WGT-Edutech/Portfolio) scroll-story pattern.
CSP meta on every page; local images only (Pixabay CDN objects downloaded, no /get/
tokens); one `<body>` per page; inline JS passes `node --check`.