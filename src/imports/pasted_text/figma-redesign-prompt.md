# META-PROMPT: Generate Complete Figma Redesign Prompt

Copy and paste this entire prompt into ChatGPT/Claude to generate the final Figma redesign prompt.

---

You are a senior game UI/UX strategist and Figma systems designer with deep expertise in:
- Competitive card game UI (MTG Arena, Balatro)
- Roguelite progression systems (Slay the Spire)
- Companion/pet simulators (Tamagotchi, Persona social links)
- Operations dashboard design
- Visual cognition under pressure (geo-image challenge games)

**Your Task:**
Generate one complete, production-grade Figma redesign prompt for Annotopia/NeuralArena frontend.

**Critical Grounding Rule:**
Do NOT invent gameplay mechanics. All mechanics must be derived from the existing codebase 

The frontend exists at: `ThemeforFrontend/` directory (this is the real, functional frontend). Your redesign must build on top of this existing functional implementation and make it much better from a game and UI/UX perspective.

**Product Direction:**
- Theme: Detective agency operations center. Real-world grounded aesthetic. No fantasy city, no whimsical worldbuilding.
- Tone: Cute, premium, tactical, emotionally warm through companion care. Professional operations dashboard meets strategic command center.
- Visual inspiration: Blend tactical clarity of competitive card games, progression readability of roguelite map runs, emotional bond systems of companion simulators, operations dashboard clarity from sports management sims.

**Core Gameplay Mechanics You Must Preserve (from codebase):**

1) **Map-First Progression**
   - Slay-the-Spire style branching node map (encounter, elite, rest, shop, boss, benchmark)
   - Node selection shows route strategy and progress tracking
   - Visual hierarchy for completed vs available vs high-risk nodes

2) **Single Active Pokemon Identity Per Round**
   - One active hero shared across question lanes during round execution
   - Companion identity persists through training → test → results
   - Agency management shows single active Pokemon with role/specialization badges

3) **Battle Phase Flow**
   - Phases: intro → preview → playing → autotest → done
   - Phase transitions must be visually communicated
   - Intro/preview shows card hand preview before gameplay begins
   - Playing is active annotation with card tactics
   - Autotest is model evaluation phase
   - Done is results entry point

4) **Skill Tree Inside Arena (Core)**
   - In-battle skill tree with part slots and progression gating
   - 4 nodes per hero lane: root, branch, merge, peak
   - Node states: empty, filled, blocked (locked by prerequisites)
   - Dependency logic must be visually understandable
   - Shared skill tree across Q1/Q2/Q3 lanes
   - Node placement accepts part cards only
   - Locked nodes show lock icon, filled nodes show card emoji imprint

5) **Card Taxonomy and Tactical Slots (Core)**
   - Card categories: part cards, boost cards, sabotage tactical card, defense tactical card
   - Card hand composition: fixed multi-type hand with part/boost/sabotage/defense blend
   - Global tactical layer: single-occupancy sabotage slot + single-occupancy defense slot
   - Latest play replaces prior in tactical slots
   - Card focus cost: visible on each card, affordability state obvious

6) **Focus Economy**
   - Focus bar consumed by cards, replenished through play behaviors
   - Card costs range 10-30% focus (scaled by rarity)
   - Affordability feedback: cards dim when unaffordable, cost badge turns red
   - Focus regen: probes restore focus over time
   - Segmented bar with dynamic color states (red low, amber mid, green high)

7) **Training/Test Structure**
   - Training rounds constrained (10 images per round)
   - Test rounds separate evaluation flow
   - Hidden-check/trust integrity loop: honeypots seeded into rounds, accuracy affects trust score
   - Honeypot badges visible on affected images
   - Trust integrity score (0-100) composite of accuracy gate, hidden-check quality, consensus, model fidelity

8) **Agency + Management Arc**
   - Agency HQ as primary companion management hub
   - Single active Pokemon roster with role progression/achievements
   - Companion specialization: Pokemon specialize into roles (chef, detective, etc.) based on training images
   - Achievement badges displayed per Pokemon
   - Role tracks visible (e.g., "Master Chef," "Lead Detective")
   - Training history and milestones

9) **PvP + Ghost Ecosystem**
   - PvP mode flow: mode select → matchmaking → scouting → battle → reveal → results
   - Ghost opponent training: mirror ghost ensemble trained from saved annotation heatmaps
   - Split-screen reveal: player vs ghost predictions side-by-side
   - Per-tool accuracy/match deltas in reveal
   - Ranked rewards with diamond stakes

10) **Deck/Run Structure**
    - Deck drafting: smart deck building from inventory with architecture-based weighting
    - Redraft cadence: redraft every 2 rounds (configurable)
    - Deck size fixed at 11 cards: 6 parts, 3 boosts, 1 sabotage, 1 defense
    - Run-round continuity: deck persists across run, clears after run ends
    - Loadout management: glue strategy selection, deck mode toggles, redraft buttons

**Product UX Architecture to Rebuild:**

Design the entire information architecture with these top-level modules:

1) **Command Hub** - "What should I do next?" (active theme, mission tracks, game mode, economy snapshot)
2) **Map Run** - Route planning and progress tracking (branching node map, node progress, deploy CTA)
3) **Loadout** - Pre-match tactical planning (active Pokemon, glue strategy, deck mode, deploy CTA)
4) **Deck Draft** - Build deck for run (smart draft from inventory, deck composition preview)
5) **Battle** - Active gameplay with annotation, cards, skill tree (most important screen)
6) **Results** - Round debrief and progression update (multi-metric summary, progression update, next action)
7) **Agency HQ** - Companion management and specialization (single active hero, role progression, achievements)
8) **Market** - Procurement and roster expansion (buy/sell loop, filtering, comparison)
9) **PvP** - Competitive play with ghost modeling (mode select, matchmaking, scouting, battle, reveal, results)
10) **Profile/Meta** - Player identity and settings (stats, settings, account management)

**Output Format Requirements:**

Return one final Figma redesign prompt only (no extra commentary before or after). Structure it with these sections:

A) Creative Direction (theme, tone, visual inspiration, design philosophy)
B) Absolute Non-Negotiable Gameplay Mechanics to Preserve (10 detailed sections with bullet points)
C) Product UX Architecture (10 modules with purpose and what each shows)
D) Screen-by-Screen Requirements (for each of 10 screens: layout, visual requirements, states)
E) Card + Skill Tree Visual Spec (part cards, boost cards, sabotage cards, defense cards, focus cost, skill tree panel)
F) Motion & Interaction Design Rules (micro interactions, phase transitions, meaningful effects, card hand animations, skill tree animations)
G) Visual System / Design Tokens (colors, typography, spacing/radius/shadow, component library)
H) UX Quality Constraints (desktop-first, high contrast, accessibility, no prior knowledge required, battle clarity)
I) Deliverables Expected from Figma Output (full high-fidelity screens, interactive prototype, component library with states, motion spec page, design token page, gameplay mechanism annotation layer)
J) Open Questions for Product/Engineering (for any unclear mechanics from code reference)
K) Implementation Notes for Figma Designer (Auto Layout, Components, Smart Animate, Prototyping, Design System features)
L) Success Criteria (what makes the redesign successful)

**Design Quality Requirements:**

- Desktop-first, scales to laptop/tablet
- Strong hierarchy and tactical readability under pressure
- Avoid generic SaaS UI
- Premium game feel, high contrast, legible at glance
- Every major mechanic represented in UI states and transitions
- Battle screen must be legible in <2 seconds (focus, phase, active card, skill tree state)

**Important:**
If any mechanic from the code reference is unclear, include explicit "Open Questions for Product/Engineering" section at the end of the prompt.

**Now generate the complete Figma redesign prompt.**
