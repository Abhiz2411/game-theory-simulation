# Project Summary: Iterated Prisoner's Dilemma Simulator

## Overview

A complete Next.js application implementing the Iterated Prisoner's Dilemma with three distinct simulation modes, featuring 8 different strategies and real-time visualizations.

## Deliverables

### ✅ Core Game Engine (`lib/game.ts`)

**Strategy Implementations:**
- ✅ Always Cooperate - Returns C every round
- ✅ Always Defect - Returns D every round
- ✅ Random - 50/50 probability each round
- ✅ Tit For Tat - Starts with C, copies opponent's last move
- ✅ Friedman (Grudger) - Cooperates until betrayed, then defects forever
- ✅ Joss (Sneaky Tit For Tat) - Tit For Tat with 10% random defection
- ✅ Tit For Two Tats - Only retaliates after two consecutive defections
- ✅ Detective - Tests opponent with [C,D,C,C], then adapts (Tit For Tat if opponent defected, Always Defect if not)

**Game Logic:**
- ✅ Payoff matrix implementation (CC: 3/3, CD: 0/5, DC: 5/0, DD: 1/1)
- ✅ Match history tracking for both players
- ✅ Round-by-round execution
- ✅ Tournament round-robin system

### ✅ Evolutionary Simulation (`lib/evolution.ts`)

- ✅ Population-based agent system
- ✅ Generational tournament execution
- ✅ Bottom 5% elimination
- ✅ Top 5% reproduction
- ✅ Historical data tracking
- ✅ Population statistics

### ✅ Three Simulation Modes

#### 1. Head-to-Head Mode (`components/game/head-to-head.tsx`)
- ✅ Strategy selection dropdowns for both players
- ✅ Adjustable round count (10-200) via slider
- ✅ Visual match history with emojis (🟩 Cooperate, 🟥 Defect)
- ✅ Score display with averages
- ✅ Run and Reset controls

#### 2. Tournament Mode (`components/game/tournament.tsx`)
- ✅ Round-robin tournament execution
- ✅ Leaderboard table with rankings
- ✅ Medal emojis for top 3 (🥇🥈🥉)
- ✅ Total score and average per round statistics
- ✅ Adjustable rounds per match (50-500)
- ✅ Key insights panel

#### 3. Evolutionary Mode (`components/game/evolution.tsx`)
- ✅ Real-time population visualization using Recharts
- ✅ Stacked area chart showing all 8 strategies
- ✅ Play/Pause controls
- ✅ Single-step execution
- ✅ Speed control slider (100-2000ms per generation)
- ✅ Current generation counter
- ✅ Live population breakdown with percentages
- ✅ Strategy-specific color coding
- ✅ Explanatory documentation

### ✅ UI Components (shadcn/ui style)

- ✅ `components/ui/card.tsx` - Card container with header, content, footer
- ✅ `components/ui/button.tsx` - Button with variants (default, outline, destructive, etc.)
- ✅ `components/ui/tabs.tsx` - Custom tabs implementation
- ✅ `components/ui/select.tsx` - Dropdown select with icon
- ✅ `components/ui/slider.tsx` - Range slider input
- ✅ `components/ui/table.tsx` - Table components for leaderboard

### ✅ Main Dashboard (`app/page.tsx`)

- ✅ Three-tab layout (Head-to-Head, Tournament, Evolution)
- ✅ Responsive design (mobile-friendly)
- ✅ Header with title and description
- ✅ Footer with game rules and strategy explanations
- ✅ Icon integration (Lucide React)

### ✅ Styling & Configuration

- ✅ Tailwind CSS setup with custom theme
- ✅ CSS variables for theming
- ✅ Dark mode support structure
- ✅ Responsive grid layouts
- ✅ Professional color scheme

### ✅ TypeScript & Type Safety

- ✅ Full TypeScript implementation
- ✅ Proper interfaces for all data structures
- ✅ Type-safe strategy system
- ✅ No `any` types used

## File Structure

```
game-theory/
├── app/
│   ├── globals.css          # Tailwind + CSS variables
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard
├── components/
│   ├── game/
│   │   ├── head-to-head.tsx  # Mode A: 1v1 Duel
│   │   ├── tournament.tsx    # Mode B: Round Robin
│   │   └── evolution.tsx     # Mode C: Evolutionary
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── slider.tsx
│       ├── table.tsx
│       └── tabs.tsx
├── lib/
│   ├── game.ts               # Core engine + strategies
│   ├── evolution.ts          # Evolutionary logic
│   └── utils.ts              # Utility functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework (App Router) |
| React | 19.2.3 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.1.18 | Styling |
| Recharts | 3.6.0 | Data visualization |
| Lucide React | 0.562.0 | Icons |
| class-variance-authority | 0.7.1 | Component variants |
| tailwind-merge | 3.4.0 | Class merging |
| clsx | 2.1.1 | Conditional classes |

## How to Run

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Key Features

### Game Mechanics
- Exact payoff matrix as specified
- Proper history tracking for stateful strategies
- Detective strategy's complex state machine correctly implemented
- Joss's 10% random defection probability

### UI/UX
- Responsive design (stacks on mobile)
- Real-time updates in evolutionary mode
- Visual feedback with emojis
- Color-coded strategy tracking
- Professional shadcn/ui aesthetic

### Performance
- Efficient tournament algorithms
- Optimized re-rendering in React
- Proper cleanup of intervals
- Memoized chart data

## Algorithms Verified

All 8 strategies have been implemented exactly as specified:

1. **Always Cooperate** - ✅ Simple, always returns 'C'
2. **Always Defect** - ✅ Simple, always returns 'D'
3. **Random** - ✅ Math.random() < 0.5
4. **Tit For Tat** - ✅ Round 1: C, Round N: copy opponent's move N-1
5. **Friedman** - ✅ Checks if 'D' exists in opponent history
6. **Joss** - ✅ Tit For Tat + 10% override to 'D'
7. **Tit For Two Tats** - ✅ Only defects if last TWO moves were both 'D'
8. **Detective** - ✅ Hardcoded [C,D,C,C], then conditional mode switch

## Expected Behavior

### Head-to-Head
- Tit For Tat vs Tit For Tat → Mutual cooperation (3 points each per round)
- Always Defect vs Always Cooperate → 5 vs 0 (defector wins)
- Detective vs Always Cooperate → Detective exploits (always defects after round 4)

### Tournament
- Tit For Tat should rank highly
- Always Defect does well against pure cooperators but poorly overall
- Random performs poorly

### Evolution
- Generation 0-10: Always Defect rises (exploiting cooperators)
- Generation 10-30: Cooperators eliminated, Always Defect crashes
- Generation 30+: Tit For Tat and Tit For Two Tats dominate
- Detective fluctuates based on population

## What's Next?

Potential enhancements:
- Save/load simulation state
- Export charts as PNG
- Custom strategy builder
- Head-to-head replay animation
- Network topology variations
- More strategies (Pavlov, Generous Tit For Tat, etc.)

## Status: ✅ COMPLETE

All requirements met. Application is production-ready.
