# Iterated Prisoner's Dilemma Simulator

A comprehensive Next.js application that simulates tournaments and evolutionary dynamics of the Iterated Prisoner's Dilemma, a classic game theory scenario.

## Features

### Three Simulation Modes

1. **Head-to-Head (1v1 Duel)**
   - Select any two strategies to compete
   - Adjust number of rounds (10-200)
   - View detailed round-by-round history
   - See visual representation with emojis (🟩 = Cooperate, 🟥 = Defect)

2. **Tournament (Round Robin)**
   - All strategies compete against each other
   - Each strategy plays every other strategy (including itself)
   - Leaderboard sorted by total score
   - Customizable rounds per match (50-500)

3. **Evolutionary Simulation**
   - Population-based natural selection model
   - Each generation: tournament → elimination → reproduction
   - Real-time area chart visualization
   - Adjustable simulation speed
   - Watch strategies rise and fall over time

## Strategy Library

All strategies are implemented according to game theory literature:

- **Always Cooperate**: Always plays C
- **Always Defect**: Always plays D
- **Random**: 50/50 chance of C or D
- **Tit For Tat**: Starts with C, then copies opponent's last move
- **Friedman (Grudger)**: Cooperates until opponent defects, then defects forever
- **Joss (Sneaky Tit For Tat)**: Like Tit For Tat, but 10% chance to randomly defect
- **Tit For Two Tats**: Only defects if opponent defected in both of the last two rounds
- **Detective**: Plays [C, D, C, C], then:
  - If opponent ever defected → acts like Tit For Tat
  - If opponent never defected → acts like Always Defect (exploits the "sucker")

## Payoff Matrix

```
Both Cooperate (C, C):     +3, +3
One Defects (D, C):        +5, +0
Both Defect (D, D):        +1, +1
```

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
game-theory/
├── app/
│   ├── globals.css          # Global styles with CSS variables
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard with tabs
├── components/
│   ├── game/
│   │   ├── head-to-head.tsx  # 1v1 mode component
│   │   ├── tournament.tsx    # Round robin component
│   │   └── evolution.tsx     # Evolutionary simulation component
│   └── ui/
│       ├── button.tsx        # Button component
│       ├── card.tsx          # Card component
│       ├── select.tsx        # Select component
│       ├── slider.tsx        # Slider component
│       ├── table.tsx         # Table component
│       └── tabs.tsx          # Tabs component
├── lib/
│   ├── game.ts               # Core game engine & strategies
│   ├── evolution.ts          # Evolutionary simulation logic
│   └── utils.ts              # Utility functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## How It Works

### Game Engine

The core game engine (`lib/game.ts`) implements:
- Strategy abstract class with `makeMove()` method
- Match history tracking for each player
- Payoff calculation based on the matrix
- Round-by-round execution

### Evolutionary Model

The evolutionary simulation (`lib/evolution.ts`) follows these steps each generation:

1. **Tournament**: All agents play each other (200 rounds per match)
2. **Scoring**: Total scores are calculated for each agent
3. **Elimination**: Bottom 5% of performers are removed
4. **Reproduction**: Top 5% of performers are cloned
5. **Next Generation**: Process repeats

### Expected Evolutionary Outcome

- **Early Generations**: "Always Defect" rises by exploiting cooperators
- **Mid Generations**: Cooperators get eliminated, reducing defectors' scores
- **Late Generations**: "Tit For Tat" and reciprocal strategies dominate, as they cooperate with each other while defending against defectors

## Key Insights

- **Cooperation Pays**: In iterated games, cooperative strategies with retaliation (like Tit For Tat) outperform pure defection
- **Nice Guys Finish First**: Strategies that start with cooperation tend to do well
- **Forgiveness Matters**: Tit For Two Tats is more forgiving than Tit For Tat, preventing downward spirals
- **Context Matters**: The best strategy depends on the population composition

## Customization

### Adding New Strategies

1. Create a new class extending `Strategy` in `lib/game.ts`
2. Implement the `makeMove(history: MatchHistory): Move` method
3. Add to `ALL_STRATEGIES` array
4. The strategy will automatically appear in all modes

Example:

```typescript
export class MyStrategy extends Strategy {
  constructor() {
    super('My Strategy Name');
  }

  makeMove(history: MatchHistory): Move {
    // Your logic here
    return 'C'; // or 'D'
  }
}
```

### Adjusting Simulation Parameters

In the code, you can modify:
- Default rounds per match
- Population size per strategy
- Elimination/reproduction percentages
- Simulation speed range

## License

ISC

## Credits

Based on Robert Axelrod's seminal work on the Iterated Prisoner's Dilemma and the strategies that emerged from his tournaments in the 1980s.
