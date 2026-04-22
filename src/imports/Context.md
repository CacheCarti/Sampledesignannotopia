NEURALARENA  
Comprehensive Project Writeup (Current-State Rewrite)  
Last updated: April 2026

This file is a full rewrite of the old proposal doc and reflects current project reality across gameplay, frontend (\`ThemeforFrontend\`), backend (\`neuralarena/backend\`), and company vision. The future changes are very very important and the current reality may have to be changed since it was only made with the demo in mind. Proposed changes are not final, Future changes are final and to be implemented if not done already…

Core thesis:  
\- High-value supervision is often logic-heavy and context-heavy, not only simple object outlines.  
\- Gameplay incentives can improve consistency and retention versus repetitive labeling workflows.  
\- Integrity systems (hidden checks \+ consensus \+ audits \+ consensus vocabulary \+ vocabulary checks \+ Pokemons as managers philosophy \+ checking for spam, patterns \+ Trust staking and future payouts \+ Paid gateway for ranked modes) are essential for turning game activity into reliable data.

\-------------------------------------------------------------------------------  
1\) What NeuralArena Is  
\-------------------------------------------------------------------------------

NeuralArena operates as a dual-system product that combines a competitive Tomagatchi annotation game with a quality-controlled data platform. The game aspect presents players with tactical labeling decisions under time pressure, while the platform aspect transforms those player actions into usable training and evaluation assets. The core thesis driving this design is that high-value supervision is often logic-heavy and context-heavy rather than consisting of simple object outlines alone. By wrapping annotation work in gameplay incentives, the system aims to improve consistency and retention compared to repetitive labeling workflows. However, turning game activity into reliable data requires integrity systems including hidden checks, consensus mechanisms, and audits to ensure quality. The core annotations are different to the standard way, the players do not label individual objects or affordances. Players only point to “answers” of 3-6 questions per round.

\-------------------------------------------------------------------------------  
2\) Current Product Vision (Player \+ Company)  
\-------------------------------------------------------------------------------

From the player's perspective, NeuralArena should feel like being a Neural Detective operating in a fast tactical arena. Players train browser-side model companions (Pet Detectives) while they annotate, using cards, Machine slots, and a focus/energy economy to influence outcomes. They can see their model performance through reveal and results loops that provide immediate feedback on their tactical decisions.

From the company's perspective, the product aims to produce verified and structured annotation outputs backed by quality controls. The system captures spatial, semantic, and reasoning-layer supervision that is difficult to obtain through conventional annotation workflows. The long-term vision builds toward scalable enterprise data operations with emphasis on quality, throughput, and traceability. For the short-term we will use Open-Soure datasets and “enrich” them with human logical questions so we can build goodwill in the community and fame and also attract good actors and companies. After we gain enough traction within the ML community we will switch to a B2B2C model, where startups/companies can approach us to improve the common sense logic/domain logic/visual attention of their CV models. The company datasets will just be new “themes” of the main game.

\-------------------------------------------------------------------------------  
3\) Gameplay: current and future changes  
\-------------------------------------------------------------------------------

The primary gameplay flow moves players through deck drafting, loadout preparation, battle, and results screens via the route sequence \`/deck-draft\` to \`/loadout\` to \`/battle\` to \`/results\`. Beyond this core loop, the frontend provides additional active surfaces including a hub, a dojo for practice, PvP and PvP2 competitive modes, a market for card acquisition, a leaderboard, rewards tracking, profile management, and settings configuration. PvP is outdated, /deck-draft is kinda useless now, PvP2 is the only one that works.

Current   
During a round, players experience timed annotation pressure with tool-based interactions including probe and sweep actions during live play. A focus meter governs card actions, creating resource management decisions throughout the round. At the end of each round, a reveal phase compares player outputs against answer-key signals to determine performance outcomes.

Current+Future Vision:  
The player enters the game, registers/logs in, and then from the active themes selects one of them, say kitchens dataset, he opens the map (Which is like the map from Slay the Spire), the map’s nodes are “subsets” and the subsets are essentially the rounds (Each bucket has a theme and 3-6 relevant questions), currently I think each bucket is to be used for two rounds, for the demo. A round has like 15-20 questions with 30-35% honeypots(Ground truth images)...(Possible change, not final: have a mid round switch, currently the rounds only ask questions that are static, later on we could add a half-time after which 3 new questions are asked, it has been noted in the demo diminishes after image 7 drastically\!). A round should be like 3-5 minutes maximum\! I have designed a greedy algorithm that automatically assigns buckets to players to maximise coverage of images and questions and also maintains high level consensus… The 5 player PvP modes will be the Bread and Butter of the game for now\! Ideally synchronous rounds, but async also ok… I will tell you this part later.

The player clicks on a node and gets redirected to pick his “Squad”(Future Change: The Pokemon for all three to possible questions in a round will only be one pokemon\! The player picks his pokemon for the three questions based on the Questions… The pokemons have types and archetypes, and some are better at logical, some at spatial, some verbal, etc. so the player has to pick the best one for the three questions…) rn the player can pick one pokemon per question, so 3 pokemons in total per round. Say he picked Alkazam(Dino Transformer), Charizard(IDK CLIP regressor?), Pikachu(CLIP CNN?), he proceeds to cards draft, you see the pokemons in the rounds will not actually what they say they are… the transformer, cnn,regressor are actually broken :( not fully formed\! The cards will help to rebuild them in the game\! The cards that can be drawn are missing parts(like lenses, weights, etc, idk too much of ML), Boosters(ML learning/performance boosters), Defense/Sabotage cards to attack or defend against other players. So the player gets a combination of these, i think he get 12 cards rn in th training arena. So he proceeds to the training arena, he is presented with an image in the centre and the three questions in the left, he can click on either of them and mark, they may be of different types, right now q1 is a probe, q2 is a sweep, q3 is a probe… There are several cards in the bottom of the screen like in Slay the spire but they are locked, there is a focus meter in top right, three pokemons below focus bar and they have like a tree structure underneath each of them. This structure has slots that seem empty. There is also a Red-strinfg detective board like board in the bottom left which hows the “thinking” of the pokemons(Proposal, this may be removed to make way for PvP stuff).  
(Future: Later on every question will have a “negative sweep” with which players can color the objects that in their opinion may confuse the model and should be explicitly mentioned as not the answers\! Also later on we will have many more tools, like logic links \[Sequential(How do i make sandwich, point from bread to mayonnaise to jam…etc), Relational(Where should these eggs go to not get spoilt? Use line between eggs to fridge), Belonging(To whom does this office telephone belong to?), etc…\]; Lasso\[instead of sweeps cze it is easier\]; Trajectories \[(if i drop this water where will it spill, if i throw this glass at a bed what trajectory will it follow and bounce?, how do i cut this tomato perfectly?, etc.)\], Grab here mode\[Where do i grab this cup?\])  
The player sees the first question and clicks the wrong answer on the image(hes being a troll initially), his focus meter builds up lightly, he cycles through the questions doiing the annotations wrongly and get his focus meter to say 30 and he is able to afford he cards in the bottom, he picks one (They are all color coded and the player is guided to where it can be dropped in the skill trees) and puts it in the right place, he goes to next image and does the same wrong stuff, he goes to the next one and in a few annotations, he is kicked\!\! With a message telling him why. This was because this image was a “honeypot”, a ground truth known image\! They are random but in demo rn i think theyre only in certain positions… He is kicked and his annotations in backend are deemed shit because we have low honeypot acc. And we also have a huge list of verification systems that were mentioned in the start, may are to be implemented, currently i thnk only honeypoot check(no forced kick from lobby), pokemon accuracy, consensus(but this is wong type of consensus, later it has to be in lobby or check historical) are kinda implemented?

The player returns, ok he think he wont be a troll, picks his squad and reenters the arena, this time more carefully thinking about the questions and doing the correct things, after  a few images he sees a bigger boost to his focus meter, this is because he is being rewarded for his accuracy on the honeypots this round… He finishes rebuilding his model and also using boosts… he also has a view of PvP, others are playing the same round and the game makes their presence known(IDK how to do this yet, maybe a live race, accuracy progress, graph?, their annotations on images?, etc.?), our player sees one of the opponents advancing too fast, he applies a sabotage card on a random opponent hoping it will affect this opponent in th etesting phase… the round ends and the player has half buit his model and has two boosts on his pokemons… The testing happens on new images, there are unseen images that the pokemon has not been trained on, the same three questions are asked to it on these images and the 3 pokemons show their predictions of the answers based on the player’s annotations, they perform ok but they have too thick attention maps(The testing animation only shows the heatmap of the predictions, 3 colors for the 3 questions, answers are also shown in darker shade of the same colors), the pokemons have good recal but bad precision, half decent accuracy, hmm net time the player should use the negative sweeps and also wait to rebuild the pokeons instead of just boosting it, he has to think tis through strategically (Future change to skill tree and testing and “fighting”… Skill tree of single pokemon in future right, the skill tree looks like an electrical circuit resembling body parts like brain, eyes, heart, legs, etc(brain-\>Architecture, eyes-\>Lens, hands-\>Defence/sabotage, etc…).. these are missing parts body part runes, there are also minor runes that are in between body parts and block new body part addition until they are finished. This will create an intuitive way of rebuilding ML model in real time\! Testing future changes: The heatmaps of pokemnos changed to “Crosshairs” like in video games, they shoot their predicitons for probes, with the attention heatmap in lighter color still persisting, it will be like a shooting animation and stuff… Fighting: Currently there is light “fighting” between pokemons, just lightning effects between cards, but layter on this will be improve and made more fighting like and like pokemon cards fighting…like a pokemon card battle underneath a screen of images from this theme and questions, maybe like smash bros). His pokemon gain XP and have slight increase in their stats like PACE, VER, SPA, etc… He keeps playing and progresses in the map, he realizes that the diamonds he receives from the round end is actually convertible to real world money. This impulses him further and he is on his toes from now on, competition is very tough since money is involved. He realizes that there is a “Ranked mode” for which he would need to pay a modest fee of 3$ per month to enter.

He realizes the first round was just the “Dojo”, the tutorial for this theme, (Future change: he sees the map and sees the nodes like in slay the spire, he sees a “Benchmark node” it looks strange, he clicks it and this is where he can put up his pokemon that he has trained on a certain theme/bucket to test against others’ pokemons, he puts up his 3 pokemons he trained, he doesnt have to annotate anything, this is just like a giant testing round where the theme images and questions are used t “benchmark” models and winner get rewards, this is just like a pokemon card battle underneath a screen of images from this theme and questions, like smash bros?…)

He also realizes that there is boss battles on the map, Dispatch in the main menu(Future change: A place where you can send your pokemon out on case discovery across the dataset) (there is also question miner, Future change, a place where users in 5 player lobbbies themselves can make questions and sens their pokemon out to classify/hunt similar images and bring in the results, these images and questions will then be used to add to the game\!) (Future change, there is also “Why” mode, where players are given images of a certin class, like “Dangerous”, “Why is this germany”, etc, and players have to figure out WHY? They have to click on th eobjects that inform them of WHY and then their pokemons will classify new test images if they are the same kinds of cases or not…Deduction kinda mode…)(Future change, there is also Detective agency mode where you can take care of, evolve and do stuff with your pokemon like dispatch and management…) (Future change, drawing a red circle or arrow over stuff in images, where should this chopping board go(red circle on the chopping board so players have a easier time and it feels more guided))(Future change, the game cycle should work like a rogue-lite, like Slay the Spire\! But not too brutal\!)(Future changes, in-round market with new cards that can be used, and cards can be exhausted…)  
(Proposed change, mobile landscape mode friendly UI for mobiles\!\!\!\!)(Proposed changes, Correct the AI mode, easy t understand right…)

\-------------------------------------------------------------------------------  
4\) Training Arena (Battle) — Current Mechanics  
\-------------------------------------------------------------------------------

The main gameplay logic resides in \`ThemeforFrontend/src/app/pages/Battle.tsx\`, which serves as the central monolith for battle interactions. The current card and rune system presents players with a shared tactical board containing slottable rune nodes. Players can place cards through drag and drop or click interactions, with focus-cost gating determining when cards can be played. The system performs compatibility checks by slot type and lane compatibility, and visually glows compatible slots when a relevant card is selected or dragged to help players make informed tactical decisions.

The board UI displays a specific slot topology comprising eight total active slots. Four PART slots named LOGIC\_GATE\_01, LOGIC\_GATE\_02, HEART\_PWR, and CENTRAL\_MIND form the core structure. One SABOTAGE slot called ARC\_EMITTER and one DEFENSE slot called VOID\_SHIELD provide tactical options, while two BOOST slots labeled ACT\_H\_L and ACT\_H\_R offer enhancement capabilities.

\-------------------------------------------------------------------------------  
5\) Card System — Current Truth  
\-------------------------------------------------------------------------------

The card system implementation resides in \`ThemeforFrontend/src/app/lib/cardSystem.ts\`, which defines the complete card data model. Each card carries properties including category (either part or boost), role (boost, sabotage, or defense), rarity (common, rare, or epic), and slotType compatibility that determines which slots accept the card. Compatibility types include part\_common\_1, part\_common\_2, part\_rare, part\_epic, boost, and tactical. Cards also define accuracyGain, focusCost, and model-effect fields such as ovrWeightMult, extraLr, and extraEpochs that influence training behavior.

For hand and deck behavior, the system provides a full tactical hand helper that produces a fixed mixed composition containing parts, boosts, one sabotage card, and one defense card. A legacy three-card draw helper still exists for slot-targeted minimal draws, though the primary flow uses the full tactical hand. Card colors and slot visuals are coded by role and architecture in the UI, and these visual distinctions are actively used to help players quickly identify compatible options during gameplay.

\-------------------------------------------------------------------------------  
6\) Model Layer — Current Truth  
\-------------------------------------------------------------------------------

Primary model execution occurs browser-side rather than on the backend server. The implementation in \`ThemeforFrontend/src/app/lib/pokemonModel.ts\` provides five real browser architectures: LogisticRegressionModel for regression, SVMModel for support vector machines, MLPModel for multilayer perceptrons, CNNModel for convolutional networks, and TransformerModel for transformer architectures. All models implement a shared IModel interface that standardizes their behavior across the system. These models produce heatmaps on the patch grid that feed into the annotation and reveal flows, providing visual feedback on model predictions. Model orchestration and lifecycle management are wired through frontend hooks and page logic, keeping the runtime close to player interactions.

An important architectural distinction is that the backend does not serve as the primary live trainer for player models during rounds. Instead, the browser handles in-round learning and inference behavior directly, with the backend focusing on orchestration, persistence, and quality control rather than model training execution.

\-------------------------------------------------------------------------------  
7\) Feature \+ Geometry Pipeline (Current)  
\-------------------------------------------------------------------------------

The backend configuration defines specific feature and geometry constants that standardize processing across the system. Images are processed at 420 by 420 pixels, divided into a 30 by 30 patch grid with each patch sized at 14 pixels. Feature dimensions include DINO at 384 dimensions, CLIP at 768 dimensions, and a combined feature representation at 1152 dimensions. These constants ensure consistent feature extraction and model input sizing throughout the application.

For feature caching, the frontend consumes DINO, CLIP, and combined feature blobs served by the backend. The frontend implements an IndexedDB plus memory caching path managed through \`featureCache.ts\`, which provides efficient feature retrieval and reduces redundant network requests during gameplay.

Dino is good for spatial questions, clip is good for logical questions obv.  
\-------------------------------------------------------------------------------  
8\) Quality \+ Integrity (Current and Near-Term)  
\-------------------------------------------------------------------------------

The current integrity system relies on hidden ground-truth checks implemented through the honeypot subsystem, which evaluates player performance against known correct answers without revealing them during gameplay. The backend maintains tracking of running integrity and accuracy state to continuously monitor data quality. Consensus endpoints and historical consensus heatmap surfaces provide additional quality signals by aggregating and comparing annotations across multiple players.

The system's quality posture explicitly rejects trusting raw clicks alone. Instead, the architecture is built around checks, storage, and comparison pipelines that validate annotations before treating them as reliable data. Answer keys and integrity checks remain backend-owned to prevent manipulation and ensure consistent evaluation standards.

Near-term quality expansion focuses on strengthening global consensus orchestration to better aggregate and weigh player contributions. The system also aims to move reviewer and validator workflows beyond their current shell page state into fully functional adjudication pipelines. Additionally, better centralized validity computation across different game modes will provide more consistent quality metrics throughout the platform.

\-------------------------------------------------------------------------------  
9\) Backend (\`neuralarena/backend\`) — Current Responsibilities  
\-------------------------------------------------------------------------------

The primary backend implementation remains monolithic within \`neuralarena/backend/main.py\`, which handles the majority of API endpoints. The round lifecycle domain provides endpoints for starting rounds, submitting annotations, ending rounds, retrieving images, and accessing object metadata. The dojo system offers configuration retrieval, image serving, and annotation submission for practice modes. Evaluation and export capabilities include evaluation submission, golden dataset export, and specialist weight export endpoints. Answer key and tool configuration endpoints serve answer keys by image ID, handle generation status, and manage theme and tool configuration updates. Consensus and annotation domains provide historical consensus data and annotation viewing capabilities. Ensemble metadata and control endpoints manage glue strategies and squad recommendations.

Beyond endpoint management, the backend handles infrastructure duties including CORS handling for local, development, and production surfaces. It serves images, features, and answer keys to the frontend, and maintains player, lobby, and match persistence through a SQLite layer that forms the persistence spine of the system.

\-------------------------------------------------------------------------------  
10\) Database / Persistence (Current)  
\-------------------------------------------------------------------------------

The persistence layer implemented in \`neuralarena/backend/db.py\` defines the storage schema for the entire system. The database includes entities for players that track individual user state, annotations that record all labeling actions, trust scores that measure player reliability over time, lobbies that organize multiplayer sessions, and matches along with related multiplayer artifacts. This persistence spine serves as the foundation for player state, annotation history, and match state throughout the application. It also provides the basis for integrity calculations and leaderboard computations by storing the historical data needed to evaluate player performance and rankings.

\-------------------------------------------------------------------------------  
11\) API Contract Reality (\`arenaApi.ts\`)  
\-------------------------------------------------------------------------------

The client-side API contract defined in \`ThemeforFrontend/src/app/api/arenaApi.ts\` establishes the communication pattern between frontend and backend. The contract uses a backend URL key called \`neuralarena\_backend\_url\` with a local fallback address of \`http://127.0.0.1:8002\` when the configured URL is unavailable. The round start payload structure includes optional ghost metadata and optional ghost training heatmaps to support ghost-based gameplay features. Answer key retrieval is fully integrated into frontend evaluation and reveal flows, allowing the frontend to fetch and display ground truth comparisons after round completion.

Recent stabilization improvements have added localhost preference logic to backend URL selection, ensuring the system prefers local development endpoints when available. The contract also includes robustness improvements around answer key and ghost data fetch patterns to handle edge cases and network inconsistencies more gracefully.

\-------------------------------------------------------------------------------  
12\) Ghost / PvP / Multiplayer Reality  
\-------------------------------------------------------------------------------

The current multiplayer state features \`/pvp2\` as an active surface that is treated as a future-facing multiplayer mode. Ghost training and reveal support exists within API contracts and frontend flows, providing the infrastructure for ghost-based competitive play. Solo and competitive loop variants currently coexist within the system while the underlying mechanisms continue to converge toward a unified multiplayer architecture. It is important to note that some multiplayer and trust or reward components remain partially wired and are still undergoing hardening and refinement as the system matures.

\-------------------------------------------------------------------------------  
13\) What Is No Longer Accurate (Removed From Old Narrative)  
\-------------------------------------------------------------------------------

This rewrite removes or corrects several outdated claims from earlier documentation. The old narrative described Random Forest tier progression as a core active model progression path, but the current live architecture set consists of Regression, SVM, MLP, CNN, and Transformer models running in the browser. Previous documentation made hard-coded coverage math claims as guaranteed current production behavior, whereas coverage and cycling are now configurable and mode-dependent. The old framing suggested that player subscription is required, which is not a current canonical requirement. Finally, earlier assumptions presented every future mechanism including reviewer staking, full global consensus, and logical links as already fully shipped, when in reality these are active strategic directions rather than complete production features.

\-------------------------------------------------------------------------------  
14\) Frontend Architecture Snapshot (\`ThemeforFrontend\`)  
\-------------------------------------------------------------------------------

The frontend architecture centers around several key files that define the application structure and behavior. Routing and flow management occurs in \`src/app/routes.ts\`, while round and game state is managed through \`src/app/context/GameContext.tsx\`. The API bridge that handles all backend communication resides in \`src/app/api/arenaApi.ts\`. The main battle state machine and UI logic are contained within the large monolith file \`src/app/pages/Battle.tsx\`, with PvP2 interactions handled in \`src/app/pages/PvP2.tsx\`. Browser model implementations live in \`src/app/lib/pokemonModel.ts\`, card definitions and compatibility logic in \`src/app/lib/cardSystem.ts\`, and feature caching in \`src/app/lib/featureCache.ts\`. The current architecture style relies on large, high-capability monolith files in core areas where strong domain behavior is already present. Although ongoing modularization documentation exists, the main gameplay logic still runs through these central files rather than being fully decomposed into smaller modules.

\-------------------------------------------------------------------------------  
15\) Backend Architecture Snapshot (\`neuralarena/backend\`)  
\-------------------------------------------------------------------------------

The backend architecture is organized around several key files that handle different responsibilities. The large route surface that defines most API endpoints resides in \`main.py\`, with configuration managed in \`config.py\`. The persistence layer and database schema are defined in \`db.py\`, while feature extraction for DINO models is handled in \`dino\_engine.py\`. Answer key generation and management occurs in \`answer\_key\_builder.py\`, honeypot integrity checks in \`honeypot\_engine.py\`, image cycling logic in \`cycling\_engine.py\`, and task dispatch in \`task\_dispatcher.py\`. The current architecture style positions the backend as an orchestration, integrity, and persistence service, while the frontend handles most player-model runtime logic. The endpoint breadth remains large and is still centralized primarily within \`main.py\` rather than being distributed across many smaller route files.

\-------------------------------------------------------------------------------  
16\) Company Product Vision (Updated)  
\-------------------------------------------------------------------------------

NeuralArena is positioned as a human-in-the-loop data and evaluation platform that uses a game-native collection interface to gather high-quality annotations. The product goals include making high-quality annotation behavior sustainable through game incentives that improve engagement compared to traditional labeling workflows. The system aims to capture logic-aware supervision that is difficult to collect through standard annotation tools, particularly spatial, semantic, and reasoning-layer annotations. Quality is kept measurable through hidden checks, consensus mechanisms, and auditable state that provide confidence in the collected data. The platform offers enterprise-friendly outputs including datasets, metrics, evaluation artifacts, and eventually specialist outputs that can serve broader machine learning needs. The core vision principle is that the game is not merely a cosmetic wrapper but rather the fundamental mechanism used to improve engagement, consistency, and data throughput in annotation workflows.

\-------------------------------------------------------------------------------  
17\) Current vs Future (Explicit Boundary)  
\-------------------------------------------------------------------------------

The system currently has several active components including browser-side multi-architecture models that run training and inference directly in the player's browser. The battle loop with its card and rune tactical system is fully operational, providing the core gameplay experience. The backend handles round lifecycle management, answer key serving, integrity systems, and data storage. Ghost-supporting APIs and PvP and PvP2 surfaces exist and are functional, though some multiplayer features continue to evolve.

In progress and future directions include developing a full reviewer-validator adjudication pipeline to handle disputed annotations more systematically. Stronger cross-lobby consensus fusion will improve how annotations are aggregated and weighted across different player groups. Logical links are planned as an additional annotation tool type to capture reasoning relationships between annotations. Deeper trust-routing and reward settlement unification will create more consistent incentive structures throughout the system. Wider enterprise automation layers including difficulty cascades and expanded output contracts will enable the platform to serve more sophisticated enterprise data needs.

18\) Final Summary  
\-------------------------------------------------------------------------------

NeuralArena currently operates as a tactical annotation game with real browser-side model behavior that allows players to train and interact with machine learning models during gameplay. The backend provides a quality, persistence, and orchestration system that maintains integrity through honeypots and consensus while managing the complete round lifecycle. The company-facing direction positions NeuralArena as a data engine focused on high-value, logic-aware supervision that is difficult to obtain through conventional annotation methods. This rewrite has cleaned up the old proposal language to clearly separate what is already implemented in the current system, what is partially implemented and undergoing active development, and what represents strategic future direction for the product roadmap.

\-------------------------------------------------------------------------------  
19\) Gameplay Loop \+ Player Feel (Design Intent, Current)  
\-------------------------------------------------------------------------------

The intended player experience should feel like training a living battle companion rather than filling out forms. Players should experience fast tactical pressure combined with readable feedback and clear skill expression opportunities. Short-term choices involving cards, focus, and tools should create visible shifts in model behavior, and results should feel earned through the chain from player intent to model response to final score impact.

The current operational loop begins when players enter the run flow through deck drafting, loadout preparation, and battle screens. They then receive a round image and task pack from the backend via the round start endpoint. During the timed annotation phase, players use probe and sweep tools alongside tactical card and rune actions. They spend focus to activate slot-compatible cards that provide temporary strategic edges. After submitting or finishing the round, the system reveals outcomes in the results screen, and the cycle repeats with fresh tactical context for the next round.

Skilled players should balance speed against annotation certainty rather than focusing only on raw marking volume. They should use focus as a tempo resource and avoid low-value card plays that waste this limited resource. Reading slot compatibility quickly allows players to chain part, boost, and tactical timing effectively. Honeypots should be treated as integrity checkpoints rather than side objectives, and players should learn architecture tendencies to play cards that amplify specific model strengths.

The primary game goal operates at three levels. From the player's perspective, the goal is to maximize per-round quality and progression outcomes. From the system's perspective, the goal is to extract auditable, high-signal supervision from gameplay. From the product perspective, the goal is to convert game mastery into reliable benchmark-grade data that can serve broader machine learning needs.

The Tamagotchi framing represents a current gap in the experience. While the current system has real training mechanics, the emotional pet-loop remains partial. To fully feel like a Tamagotchi experience, model state changes need stronger visible personality, richer feedback animations, and clearer moments where players can see that their Pokemon has learned something specific from their actions.

\-------------------------------------------------------------------------------  
20\) Technical Walkthrough (Connected to Code)  
\-------------------------------------------------------------------------------

The frontend control plane handles routing and flow management through \`ThemeforFrontend/src/app/routes.ts\`, which defines all application routes and navigation. Round and game state management occurs in \`ThemeforFrontend/src/app/context/GameContext.tsx\`, which maintains the shared state across the application. The API bridge that handles all backend communication resides in \`ThemeforFrontend/src/app/api/arenaApi.ts\`, which defines the contract between frontend and backend.

The core gameplay runtime centers on the main battle state machine and UI logic in \`ThemeforFrontend/src/app/pages/Battle.tsx\`, which orchestrates the entire battle experience. Card definitions, compatibility logic, and focus data are managed in \`ThemeforFrontend/src/app/lib/cardSystem.ts\`, which defines the complete card system. Browser model implementations live in \`ThemeforFrontend/src/app/lib/pokemonModel.ts\`, which contains all five model architectures. Feature caching is handled by \`ThemeforFrontend/src/app/lib/featureCache.ts\`, which manages IndexedDB and memory caching for DINO and CLIP features.

The backend authority plane provides lifecycle endpoints and orchestration through \`neuralarena/backend/main.py\`, which handles the majority of API endpoints. Persistence and database tables are defined in \`neuralarena/backend/db.py\`, which stores players, annotations, trust scores, lobbies, and matches. Integrity and answer-key helpers are provided by \`honeypot\_engine.py\` and \`answer\_key\_builder.py\`, which manage honeypot checks and answer key generation.

The current data and metric flow begins when a round starts and the backend serves images, features, and task metadata to the frontend. Player annotations and tactical actions then happen in the frontend runtime during gameplay. The backend stores these annotations and evaluates them against answer-key and honeypot surfaces, then returns outcome artifacts that drive the reveal and results phases.

\-------------------------------------------------------------------------------  
21\) Future Changes Backlog (EXPLICITLY PROPOSED ONLY, Not Implemented Yet)  
\-------------------------------------------------------------------------------

As we continue to evolve NeuralArena, several key areas of development are on the horizon. These proposed changes aim to further enhance the player experience, improve the quality and integrity of the data, and expand the platform's capabilities.  
\- Everything in this section is PROPOSED ONLY.  
\- These are design/roadmap ideas and are not presented as current behavior.

A) Ghost system hardening (PROPOSED ONLY)  
\- Ensure ghost readiness checks at round start: training payload exists, architecture  
  metadata valid, subset lineage known, latency thresholds met.  
\- Add ghost quality gates in backend before ghost can appear as boss opponent.  
\- Add frontend ghost status panel (ready/training/degraded) in battle prelude.  
\- Code touchpoints likely: \`arenaApi.ts\`, \`Battle.tsx\`, \`/round/start\` contract,  
  backend ghost validation in \`main.py\`.

B) Single-Pokemon per round integration (PROPOSED ONLY)  
\- Shift from multi-submodel feel to single active Pokemon identity each round.  
\- Keep anti-abuse by adding overfitting/stamina/decay mechanics so one model cannot  
  dominate all contexts without tradeoff.  
\- Preserve architecture identity and subset memory for evolved top performers.  
\- Code touchpoints likely:  
  \- model factory/orchestration in \`pokemonModel.ts\`  
  \- round state and selected active model in \`GameContext.tsx\`  
  \- battle UI \+ card gating in \`Battle.tsx\`  
  \- backend metadata fields in \`/round/start\` and persistence in \`db.py\`.

C) Evolved Pokemon as boss ghosts (PROPOSED ONLY)  
\- Use top-performing evolved Pokemon snapshots trained on specific subset buckets.  
\- Serve 14-20 image boss challenge packs from originating subset lineage.  
\- Retain architecture \+ training-subset metadata for replayability and fairness.  
\- Potential passive income/reward share for owners when their ghost is used.  
\- Needs clear ownership ledger \+ payout policy \+ anti-farming safeguards.

D) Metrics transition: IoU \-\> precision/recall/accuracy/ROC (PROPOSED ONLY)  
\- Move core player feedback toward class-aware metrics, not only overlap score.  
\- Add calibration-style readouts and ROC curves in results dashboard.  
\- Backend must emit confusion-style aggregates per round and per mode.  
\- Frontend results UI must explain tradeoffs by archetype (sniper/hunter/tank/etc).

E) Attention rendering upgrade (PROPOSED ONLY)  
\- Replace diffuse heatmap primary visual with concentrated crosshair targeting overlay.  
\- Keep faint background heatmap for context confidence.  
\- Requires renderer updates in battle/reveal views and confidence threshold tuning.

F) Benchmark mode economy \+ progression (PROPOSED ONLY)  
\- Dedicated benchmark mode with themed gauntlets (kitchen/indoor/etc) as end-boss tests.  
\- Earnings tied to benchmark placement to incentivize real model improvement.  
\- Positioning: "beat industry-grade baseline" challenge tier.

G) Build archetypes (PROPOSED ONLY)  
\- Sniper: high precision/calibration, lower recall.  
\- Hunter: high recall/sample-efficiency, noisier outputs.  
\- Tank: high robustness/stability, slower latency.  
\- Speedrunner: high speed/latency stat, weaker generalization.  
\- Meta-Ensemble: lower single power, stronger cross-model synergy.  
\- Needs stat model \+ balancing tables \+ archetype UI profile surfaces.

H) Expanded card taxonomy (PROPOSED ONLY)  
\- Add card families:  
  \- Tactic (one-round)  
  \- Protocol (multi-round temporary)  
  \- Relic (run-permanent)  
  \- Mutation (growth-curve modifier)  
  \- Counter (reactive defense)  
\- Optional per-theme card pools (Slay-the-Spire style variation by arena/theme).  
\- In-game market should allow deck exhaustion/rotation.  
\- Out-of-game market should allow missing card and booster acquisition.

I) Skill tree split and identity surfaces (PROPOSED ONLY)  
\- In-round rune board visual language: eyes/brain/hands/electrical-circuit metaphor.  
\- Out-of-round progression tree: RPG-style (Witcher-like) branching specialization.  
\- Add Sofifa-like Pokemon overview page for archetype, stats, strengths, weaknesses.

J) Tamagotchi feedback and animation loop (PROPOSED ONLY)  
\- Pokemon should visibly react to player actions (charging, fatigue, confidence, dazed).  
\- Honeypot success could grant special low-focus cards.  
\- Honeypot failure could apply temporary status effects (dazed/confused).  
\- Add stronger PvP feedback moments and "Dispatch" test animation sequence.

K) Additional mode ideas (PROPOSED ONLY)  
\- Co-op 3v3 partitioned-question mode (Q1/Q2/Q3 per player lane).  
\- Ghost spectating mode and pre-match opponent Pokemon reveal.  
\- Detective Agency framing with richer logic-link prompts and evidence tools.

L) Annotation/task design expansions (PROPOSED ONLY)  
\- More structured visual prompts (red circles/arrows, object-level constraint prompts).  
\- "Why"/deduction mode with logic-link chains.  
\- Negative honeypot/test images from opposite buckets for false-positive control.  
\- Cultural tagging and per-round trust tracking.  
\- "Question miner"/dispatch variant as explicit classification task mode.

M) Mobile and UX direction (PROPOSED ONLY)  
\- Mobile-friendly, landscape-first interaction model (GeoGuessr-like handling quality).  
\- Aesthetic shift toward detective motif (magnifying glass, pencils, case-board language).

Future \+ Proposed changes ive talked about some here already, but very dispersed, I’ll give you an unhinged list of stuff that is future and proposed changes, i ve talked bout some of them here already, this may not be comprehensive\!\!…::

{{{{  
Make sure the ghost works, make sure you understand what would need to be changed for single  pokemon integration...

We will use players' evoloved pokemons(from a certain subset that it was the top performer on) and give them 14-20(whatever is the round image limit) image annotations from the subset of the player who developed it... This will give us very good baseline of performance, and thy will act as the tough level boss ghosts... THe architecture and the traiing data on that subset will be retained... Players can earn passive income for this?

Since the  pokemon's  memory is only per rouond, only a single round's  annotations should be enough

Accuracy has to change from IoU to Precision,recall and accuracy concerns, roc curve

Attention heatmaps to change from current to more like crosshairs like in a game, so predicitons seem much more concentrated, with very light attention map in background of course

Benchmark mode, people earn money just by placing here there, this will push players to imprve their models, also there wil be benchmarks like end level of slay the spire, so several themes, kitchens, indoors, etc will be tested on... like an actual AI benchmark

Biggest change maybe single pokemon per round, not multiple, but have to make it so they don't just use one model, maybe add a "overfitting" kind of mchanic, like stamina... maybe have defence and attack pokemons?

What do we replace red string board with or make it more interactive like hints/configurable model weights, gradient descent, etc/ghost spectating/PVP feature, maybe spectating...

The pokemon skill tree in round shoud look like eyes, brain, hands, etc electrical circuit... The pokemon skill tree outside the round should look like actual skill tree like in Witcher 3\.

In-game market and out-of-game market, in-game market must have ability to exhaust current deck and out-game should allow purchase of missing and booster cards and stuff...

After a certain point Pokemon evolves into different architecture and "maxes out" like in DLS

Have comprehensive Pokemon overview like in Sofifa, not as complex but decent level to show archetypes and stuff

It still doent feel like you are trainign your pokemon...need to add like pokemon charging up from cards and most importantly need to add stimulus, like pokemon actually showing feedback on what theyr learning, cute animations\!  
It hass to feel like tamagotchi\!\!

PVP Feedback Very important\!\! 

Co-op mode? But in separate questions, Q1-\>Player 1, Q2-\>Player2, Q3-\>Player3...  
3v3 mode...

Ghost is actually fast and predicts fast, it can also show hints and predictions on images

Opponent pokemons also shown before start, your pokemon 

Build Archetypes (player chooses identity)

Sniper Build: high Precision \+ Calibration, low Recall.

Hunter Build: high Recall \+ Sample Efficiency, noisier outputs.

Tank Build: high Robustness \+ Stability, slower Latency.

Speedrunner Build: high Latency stat, weaker Generalization.

Meta-Ensemble Build: lower single-model power, high cross-model chemistry.

Card Types to Add, based on how we break the ML models, in a very ML Relevant way not just whatever we want\!

Tactic (one-round effect)

Protocol (multi-round temporary)

Relic (run-permanent passive)

Mutation (changes model stat growth curve)

Counter (reactive defense vs sabotage/failure mode)

\*\*I thinkk in this theme the cards ashould be different to another theme??\*\* Actually like Slay the Spire?

honeypot images can actually grant special cards that cost low focus or if bad performance on heonypots, add "dazed"/"confused" status on the pokemons 

Mrking with red circle/arrows inside the images as questions,   
Logic links, deductions("Why") mode

Maybe Pace stat should allow for faster focus buildup?

Consensus vocabulary, consesnsus accuracy

The pokemon after being trained in the round "scout" the image map for other imges that fal into the same categories as the oones you matched using simple keyword checkin or normal detection for objects... Obv thi should hapen within the round since pokemons forget their training after... we already know the image map's [categories..so](http://categories..so/) easy to check accuracy... IDK its very amorphous but i have to ask  your opinon cze i had this idea of a "Detective Agency" sending detective on cases...

Correct the AI, use AI as auto aim modes  
Logic links, traditional, belongingness, sequential  
Benchmark mode  
Train your pokemon better than an industry grade model like clip and benchmark mode, clip thinks this is where I should sit...  
Trajectories for dropping glass, for cutting bread, etc  
Grab here mode?

Make the pokemon predictions more cross hair like and he's heat map

Mobile friendly like geoguesser, but mostly landscape instead of potrait

Testing animation to have actual pokemon battle, maybe rename testing to "Dispatch"

Honeypot accuracy goes per round to backend\! Each player's individual rounds are calculated against the honeypots

For Honeypots and test images negative images (images without the answers and to check if players will mark), just have images from other subsets/buckets that are completely opposite\!\!\! Save on computation 

From feedback, use detective magnifying glass, pencils, etc for aesthetic\!\! 

Cultural tagging, nations...  
Per round trust score

We annotate the objects in the image and ask for stuff, like say in this chopping board(draw a red circle around it, and it is on the table), if I cut chicken what should I do next if I don't want to contaminate the butter(also annotated, using red circle)... Probe on faucet... 

Add question miner it's easy, question minig or dispatch has to be actually a classification task and not prediciton?

}}}}

\-------------------------------------------------------------------------------

NeuralArena · 2026 · Rewritten current-state context file

