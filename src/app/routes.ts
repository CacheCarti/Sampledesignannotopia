import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { MissionTypePage } from './pages/MissionTypePage';
import { GameSelectPage } from './pages/GameSelectPage';
import { Loadout } from './pages/Loadout';
import { Battle } from './pages/Battle';
import { Results } from './pages/Results';
import { Market } from './pages/Market';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ReviewerMode } from './pages/ReviewerMode';
import { PvP } from './pages/PvP';
import { BucketMap } from './pages/BucketMap';
import { DispatchMode } from './pages/DispatchMode';
import { Agency } from './pages/Agency';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'mission', Component: MissionTypePage },
      { path: 'games', Component: GameSelectPage },
      { path: 'loadout', Component: Loadout },
      { path: 'battle', Component: Battle },
      { path: 'results', Component: Results },
      { path: 'market', Component: Market },
      { path: 'leaderboard', Component: LeaderboardPage },
      { path: 'reviewer', Component: ReviewerMode },
      { path: 'pvp', Component: PvP },
      { path: 'map', Component: BucketMap },
      { path: 'dispatch', Component: DispatchMode },
      { path: 'agency', Component: Agency },
    ],
  },
]);
