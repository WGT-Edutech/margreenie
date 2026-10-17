# HANDOFF — margreenie hero page (2026-10-17)

## TL;DR
- Repo: `C:/Users/irieb/Documents/William-Projects/2-websites/margreenie` (git, remote WGT-Edutech/margreenie, branch main). Live: https://wgt-edutech.github.io/margreenie/
- **UNCOMMITTED WORK IN index.html** — top-bar socials/motto + footer removal + full reflections + whales-visible-from-start. Verified locally, NOT committed/pushed. Most urgent action: review + commit + push.
- User's last 3 asks NOT done: (1) "revert to js scroll and autoscroll. your video is way more janky than before", (2) "why didn't you do the stuff I asked for" = whale story/tour never added to blog.html, donate never added to network.html (sections were stripped from index only!), (3) "full gallery reflection should come into view when scrolling down. nothing should truncate reflections" — implemented but uncommitted.
- Session got context-compressed repeatedly and dropped user messages; user is frustrated. Be terse, execute immediately, no re-litigating.

## Git state
- HEAD: 944748d (live, verified clean — Greenfluencers card removed from ring)
- 944748d hero: remove Greenfluencers in the Wild card from ring gallery
- b4fd100 gallery: card-front padding removed (pictures fill cards edge-to-edge)
- a899a7b fix: title-entry glitch — backdrop-filter removed from slate cards (over playing video), opaque fill; drift transform removed
- 43625a9 buttery video bg (30fps H.264 loop + scroll-scrub hybrid); focused-card title pill; hero ends at gallery; coral accent #ff8a4d; one-line slate
- `git status` shows ONLY `M index.html` (uncommitted).
- Commit identity: `-c user.name="WGT-Edutech" -c user.email="wgt.edutech@gmail.com"`.
- Pages rebuild ~40–230s; verify with `curl -s "https://wgt-edutech.github.io/margreenie/?cb=$RANDOM" | grep -c "<marker>"` polls.

## Uncommitted changes in index.html (browser-verified, ready to ship — but double-check)
1. **Top bar = socials + motto, footer removed**: nav-brand "margreenie"; `.nav-strip` under nav links with motto ("Live consciously, create passionately, act boldly.") + 7 social links (Instagram, Behind the Greens, YouTube, Threads, Substack, LinkedIn, Podcast); strip hidden ≤768px; `.site-footer` HTML + CSS deleted. Verified: nav visible, no footer, gallery last, page = 16vh tall.
2. **Reflections not truncated**: card `margin-top:-420px` (card+reflection pair centered — card top ~50%-420px); reflect gap 150px→40px; removed gradient mask on `.ring-card-reflect img` (opacity .5, no fade); `#r6 .sticky{overflow:visible}`. CAVEAT: on short viewports (~568px) card top goes negative (off-screen top) — needs a vh-based clamp or media query for short screens.
3. **Whales visible from first frame**: removed "keep scrolling" label + `#loader` div + dead CSS; tick fade-in deleted (`fadeIn=clamp01(rp1*2)` gone; opacity = exit only); loader null-guard removed since div gone. Whale video now visible at scroll 0.

## The video engine (current, pushed state 944748d)
- `images/whales-loop.mp4` = Pexels 27941813 (Cabo 3 whales), 1920x1080, crf30, 14.8MB, 30fps, 31.865s, H.264 + faststart.
- Hybrid in `updateOceanZoom()`: plays natively; on scroll, `currentTime = p * duration` (p mapped over rooms r1–r5), pauses; resumes play ~0.6s after scroll stops. Fade out via `exit=1-smoothstep(rp5)` (r5), so gallery sits on black.
- **USER SAYS IT'S JANKY vs. the old frame-scrub.** Next session must address ("revert to js scroll and autoscroll"): either (a) re-tune the seek mapping / throttle scroll-seeks (seek only when delta > 0.05s already; consider RAF-throttle + larger min delta + easing back into playback), (b) drop resolution to 1440x810 crf 28 (~8MB) to cut decode cost, (c) restore the frame-based scrubber (239-frame engine, `FRAME_MS`, hybrid_scrub pattern — but that was what user called "2x too fast and janky" at 5fps; frames were also heavy), (d) check real-browser behavior FIRST — headless Chrome cannot decode H.264 (readyState sticks, currentTime won't advance), so every playback claim must be user-tested at https://wgt-edutech.github.io/margreenie/.
- Old 239-frame dir `images/frames/` DELETED (don't recreate unless asked).

## NOT DONE — carry over from user asks
1. **"revert to js scroll and autoscroll, video janky"** — see above. This is the immediate next task.
2. **Whale story + tour → blog.html** and **donate → network.html**: sections were stripped from index (commit 43625a9 era) but the content was NEVER moved. The removed HTML block is saved at `C:\Users\irieb\AppData\Local\hermes\cache\scratch\removed_sections.html` (whale meditation story + tour list + donate chips). blog.html (whale story + tour) and network.html (donate, incl. EU platforms + crypto placeholders) still need that content; nav Donate link already points to `network.html#donate`.
3. **Full reflection visible on scroll** — implemented, uncommitted (see above). Short-viewport clamp still needed.
4. Earlier user corrections (in order): no "keep scrolling" label; whales visible immediately; titles enter without glitch (done, a899a7b); card images fill card (done, b4fd100); remove Greenfluencers card from hero ring (done, 944748d).

## Environment / gotchas
- Local preview: `python -m http.server 8125 --bind 127.0.0.1` in the repo dir (may still be running; restart if dead).
- **Patch tool corrupts JS strings** (mangled `toFixed(`, duplicated braces, `;;` from deletions). Use Python replace scripts in `C:\Users\irieb\AppData\Local\hermes\cache\scratch\` — user said "rewrite from scratch if it mangles again."
- After HTML edits: `grep -c "<body>"` must be 1; `node --check` on extracted script block.
- 30fps decode over a `backdrop-filter` card = glitch (fixed a899a7b). Keep no backdrop-filter over the video; pills/slates use solid rgba fills.
- Starfield bg uses CSS radial-gradient dots (no canvas now). CSP meta strict, all images local (no CDN images in index).
- Don't touch: `images/whales-loop.mp4` (17MB total images dir); 9 Pixabay card images; `images/hero-post.jpg` (giraffe, post stage); `images/marga-stencil.png`.
- Marga facts: @margreenie, 88K followers, conservationist, Behind the Greens founder, whale meditation, Knysna elephant-whale quest, blog.html has the story posts already (check before duplicating).

## First actions for next session
1. `git -C <repo> diff index.html` → sanity-check uncommitted work → commit + push → poll live.
2. Ask-to-do (don't ask, DO): fix video jank — start by verifying in the user's real browser; likely re-tune hybrid seek (throttle, easing, or lower-res encode). Deliver + let user judge.
3. Move saved sections: whale/tour → blog.html, donate → network.html (they exist already as pages; add the stripped content).
4. Short-viewport clamp for gallery reflections (media query ≤768px or `max()` on margin-top).