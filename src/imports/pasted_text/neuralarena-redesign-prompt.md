# NeuralArena Figma Redesign Prompt v2

Create a complete, production-ready web game UI redesign for **NeuralArena**.

## 0) Design Direction (global)

Design language: **serious competitive strategy game**, inspired by:
- **Balatro**: strong hierarchy, premium card framing, dramatic contrast, clean game readability
- **Magic: The Gathering Arena**: competitive polish, tactical clarity, professional HUD composition
- **Slay the Spire** (for map): node-path progression readability and route planning feel

Tone:
- Not childish, not toy-like, not cartoon-heavy
- Premium, tactical, modern, esports-ready
- Clear information density without clutter

Visual rules:
- Strong typographic hierarchy for critical game info (timer, score, question state, focus, leaderboard)
- Distinct semantic colors for 3 question lanes (Q1, Q2, Q3) used consistently across all screens
- Card UI should feel collectible + strategic (rarity, architecture, stat bars)
- Add subtle but meaningful motion cues (entry stagger, score pop, ping pulses, reveal sweeps)
- Avoid generic SaaS UI look

Gameplay framing to respect:
- Training round uses **3 questions per image**
- Each question has a linked ensemble/tool context
- Core tools include probe/rectangle/sweep behavior
- End-of-round reveal shows ensemble/question performance and answer-key comparison
- PvP/PvP2 and ghosts exist; show light multiplayer presence

Current card-and-combat systems to represent accurately:
- Focus economy exists (0-100), and cards consume focus by rarity (common/rare/epic) plus tactical overrides, focus is filed up only when annotations are done in game and the focus meter keeps going down when idling.
- Fixed tactical hand in rounds is card-heavy and strategic (parts + boosts + tactical)
- Card roles include:
  - **Part cards**: architecture-compatible upgrades for question lane heroes
  - **Boost cards**: lane activations and runtime buffs
  - **Tactical cards**: global role cards (`sabotage`, `defense`)
- Global tactical slots exist and are always visible in training arena:
  - `sabotage` slot (offense disruption)
  - `defense` slot (shield/counter blocks)
- Hero skill-tree board exists per lane (Q1/Q2/Q3), with 4-node progression feel (root/branches/peak)
- Compatibility matters:
  - architecture-mismatch part cards are rejected (node not destroyed)
  - tactical slots accept only matching role cards
- Inference/reveal phase must visually communicate that played cards affected performance

---

## 1) Deliverable Structure

Design full responsive flows (desktop-first, mobile-aware) for:
1. Home
2. Mission Type Select
3. Game Select (Kitchen/Outdoor/etc.)
4. Loadout/Ensemble Builder
5. Training Arena (most important)
6. Results + Reveal + Leaderboard
7. PvP2 Arena shell (with subtle other-player presence)
8. Dispatch / Detective mode shell
9. Bucket Map progression screen

For each screen provide:
- Primary desktop frame
- Mobile adaptation frame
- Component variants/states (hover, active, disabled, loading)

Also provide reusable design system pages:
- Color tokens
- Type scale
- Spacing scale
- Card component anatomy
- HUD components
- Status chips/badges

---

## 2) Critical Screen: Training Arena (highest priority)

Build this as the hero experience.

Layout target:
- **Left rail**: Question stack (Q1/Q2/Q3), tiny avatar strip, live action pings feed
- **Center stage**: image annotation canvas + tool controls + question prompt visibility
- **Right rail**: Pokémon/ensemble cards, focus meter, active buffs/cards, mini combat telemetry
- **Bottom HUD**: high-priority controls, phase state, quick actions

Must include:
- Current image + all three question contexts clearly visible and switchable
- Minimal interruption flow (no unnecessary break screens)
- Tiny-avatar multiplayer presence:
  - small player/ghost icons
  - pulse ping events ("annotated", "combo", "focus spike")
  - lightweight race/progress indicators
- Real-time focus economy visibility
- Ensemble/card identity visible without overpowering canvas

Interaction goals:
- Zero confusion about "what to mark now"
- Tool/question relationship always obvious
- Fast actions in under 1 click mental load

---

## 3) Loadout / Ensemble Builder

Design as tactical pre-match board:
- 3 question lanes (Q1, Q2, Q3)
- 3-4 selectable slots per lane (support duplicates)
- Roster pool visible, sortable, searchable
- Drag-and-drop preferred, click-select fallback state included
- Team aggregate stat panel updates live:
  - PACE
  - VERBAL
  - SPATIAL
  - ACCURACY
  - OVR

Card identity system:
- Pokémon fantasy retained, but architecture tags are explicit (MLP/Regression/SVM/CNN/Transformer)
- Rarity tiers and role readability
- Professional collectible-card treatment (Balatro/MTG seriousness)

Add a dedicated **Card System Reference panel** in this screen (or linked overlay):
- Explain lane card taxonomy clearly:
  - Parts (`part_common_1`, `part_common_2`, `part_rare`, `part_epic` visual tiers)
  - Boost (`boost`)
  - Tactical (`sabotage`/`defense`)
- Show card chips/badges for:
  - role
  - rarity
  - focus cost
  - compatibility architectures
- Include "invalid placement" state styling and feedback language

---

## 4) Results / Reveal / Leaderboard

Design cinematic but readable flow:
- Reveal on **4 test images** sequentially
- Layered heatmaps with distinct question colors
- Answer-key overlays shown clearly
- Per-question ensemble accuracy blocks
- Round leaderboard appears in same flow

Need states:
- auto-play reveal
- manual next image
- expanded details
- compact summary

Card impact telemetry required in Results:
- Per-question block should include compact "active cards applied" strip
- Show tactical influence moments (sabotage applied, defense blocked) in timeline/log style
- Keep this readable and competitive, not noisy

---

## 5) Bucket Map (Slay-the-Spire-inspired)

Design a gamey progression map:
- Branching nodes with route choice clarity
- Node states: available/completed/locked/current
- Better environmental storytelling than current plain map
- Background art/atmosphere evolves by progression depth
- Keep deployment CTA obvious

Style references:
- Slay-the-Spire path readability
- Tactical node glow language
- Rugged exploration mood, but still clean and legible

---

## 6) PvP2 + Ghost Presence

Keep subtle presence (not noisy):
- Tiny live opponent strip
- Event pings (small, non-blocking)
- Relative progress/race indicators
- Distinct self vs ghost/opponent identity

No heavy visual spam. Preserve annotation focus.

Also show tactical readability parity with solo battle:
- compact focus meter
- compact cards-in-hand indicator
- active boost icons
- subtle sabotage/defense status indicators

---

## 7) Dispatch / Detective Future Hook

Design current shell with future-ready affordances for:
- "Why labeled this way?" evidence-based mode
- Object evidence board
- Scene/case framing vocabulary
- Single companion assistant for detective mode
- Agency progression hooks (quests/scouting/passive ops)

Do not overbuild; make it extensible.

Future direction to embed in component language (for scalability):
- Detective agency progression meta-layer (quests/scouting/passive income)
- Companion evolution/mentorship visual affordances (manager-like, not pet-sim cartoon)
- Question mining pipeline UI hooks (author question, mark evidence, dispatch companion to find similar scenes)
- Keep same premium art direction and HUD vocabulary across current + future modes

---

## 8) Card System Visual Spec (must include)

Create a full Figma page for card mechanics used in live game now:
- Card anatomy (title, icon, rarity, role, focus cost, compatibility, effect summary)
- Hand UI states:
  - selectable
  - selected
  - unaffordable focus (disabled)
  - dragging
- Placement targets:
  - skill-tree node target states (available/filled/blocked/locked/mismatch)
  - global tactical slots (`sabotage`, `defense`) with empty/occupied/replace states
- Activity feed token set for events:
  - good
  - warning
  - ghost/opponent
- Motion mocks:
  - card hover lift
  - magnetic drop affordance
  - tactical slot equip flash
  - blocked/mismatch micro-feedback

---

## 9) Quality Bar (non-negotiable)

- Production-ready, not concept art only
- No placeholder-only generic cards
- Full visual consistency across flow
- Accessibility-conscious contrast and readable sizes
- Responsive behavior shown
- Components reusable by engineering

---

## 10) Handoff Expectations

Provide in Figma:
- Named component library
- Auto-layout discipline
- Tokenized styles
- Variant sets and interaction notes
- Redlines/spec-ready spacing + sizes
- Export-friendly assets

Include an explicit frame called:
**"NeuralArena Training Arena v2 (Implementation Target)"**

This frame should be the most polished and implementation-ready screen in the file.

Include an explicit frame called:
**"NeuralArena Card Combat Spec v2 (Parts/Boost/Tactical)"**

This frame should fully document current lane-card + tactical-slot UX so engineering can implement without guessing.
