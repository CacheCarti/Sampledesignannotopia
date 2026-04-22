Product: NeuralArena — a competitive multiplayer web game where players are "neural detectives" solving visual intelligence tasks on images (clicking, marking, painting) to answer questions like "Where should a robot not walk?" or "Find every choking hazard in this kitchen." Players believe they are training a personal AI companion and competing for rewards; the experience is a timed detective arena.

Core loop:
1. Players enter with a loadout of AI companions (represented as cute Pokémon-style creatures, or "Logic Drones" — editable team).
2. Before each round they see upcoming theme (e.g. spatial, verbal, indoor, kitchen) and pick a "deck" or formation (like Slay the Spire or football formations): which 3–4 companions to use for the round. Tier rules apply (e.g. minimum 2 regression-type, 1 SVM-type, up to 2 MLP-type; total roster ~10). One-click default suggested squad based on tier.
3. During the round: timed countdown (~7 min), 3 tools per round — each tool is one companion. Tools are:
   - Probe: single-click on objects (snaps to object boundary); for point detection, tagging, identifying.
   - Sweep: brush/paint on image to mark regions or zones (floors, paths, hazard areas).
   - (Future) Logical Links: link objects in sequence (e.g. lid → container → fridge).
4. Each image shows one question; player uses the selected tool; their companion "flash trains" in real time (show "⚡ Training..." or similar). Other players' progress is visible; music and tension ramp; accurate shots get satisfying audio/visual feedback.
5. Round ends → "Test Reveal": the player's trained companions run on 20–40 unseen test images. Show heatmaps (e.g. green confidence regions) then overlay the answer key. Players whose models match the answer key get bigger reward shares. This is the payoff moment.
6. Rewards and quality feedback: honeypot accuracy gate (e.g. below 80% = boot); consensus with other players; bonus messages like "2x bonus", "Great work!". Leaderboard.

Companion cards (FIFA / Dream League style):
- When user clicks a Pokémon/Logic Drone, show a stat card: PACE, VERBAL, SPATIAL, ACCURACY, TYPE (and/or: speed, accuracy percentile, spatial reasoning, verbal reasoning). Card should feel like a collectible sports/TCG card.
- Roster of up to ~10; companions reset after every round (no carry-over); they are the "weapons" for that round only.

Market:
- Transfer market (Dream League Soccer style, not FIFA): buy and sell companions/models to build your roster and ensembles. Browsing, filters, buy/sell flows.

Round types (reflected in UI where relevant):
- Dojo: warm-up, practice tools, must pass accuracy threshold to enter live rounds.
- Standard Round: main competitive round.
- Expert Round: harder images, higher rewards.
- Tournament / Bounty: extended or B2B events.

Tone and feel:
- Competitive, detective-sprint, arena. "You are the neural detective." Training and testing should have clear visualizations and animations (models learning, evolving, heatmaps, confidence blooms, answer key reveal). Mobile and desktop friendly; modern game UI, not enterprise.
```
