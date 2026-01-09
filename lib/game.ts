// Types and Constants
export type Move = 'C' | 'D'; // Cooperate or Defect

export interface GameResult {
  playerA: number;
  playerB: number;
}

export interface MatchHistory {
  myMoves: Move[];
  opponentMoves: Move[];
}

export interface MatchResult {
  strategyA: string;
  strategyB: string;
  scoreA: number;
  scoreB: number;
  history: { roundNumber: number; moveA: Move; moveB: Move; scoreA: number; scoreB: number }[];
}

export interface TournamentResult {
  name: string;
  totalScore: number;
  avgScore: number;
  matches: number;
}

// Payoff Matrix
export const PAYOFF = {
  CC: { playerA: 3, playerB: 3 }, // Both cooperate
  CD: { playerA: 0, playerB: 5 }, // A cooperates, B defects
  DC: { playerA: 5, playerB: 0 }, // A defects, B cooperates
  DD: { playerA: 1, playerB: 1 }, // Both defect
};

export function getPayoff(moveA: Move, moveB: Move): GameResult {
  const key = `${moveA}${moveB}` as keyof typeof PAYOFF;
  return PAYOFF[key];
}

// Abstract Strategy Class
export abstract class Strategy {
  constructor(public name: string) {}

  abstract makeMove(history: MatchHistory): Move;

  // Reset any internal state for a new match
  reset(): void {}
}

// Strategy Implementations

export class AlwaysCooperate extends Strategy {
  constructor() {
    super('Always Cooperate');
  }

  makeMove(history: MatchHistory): Move {
    return 'C';
  }
}

export class AlwaysDefect extends Strategy {
  constructor() {
    super('Always Defect');
  }

  makeMove(history: MatchHistory): Move {
    return 'D';
  }
}

export class Random extends Strategy {
  constructor() {
    super('Random');
  }

  makeMove(history: MatchHistory): Move {
    return Math.random() < 0.5 ? 'C' : 'D';
  }
}

export class TitForTat extends Strategy {
  constructor() {
    super('Tit For Tat');
  }

  makeMove(history: MatchHistory): Move {
    // Round 1: Cooperate
    if (history.opponentMoves.length === 0) {
      return 'C';
    }
    // Copy opponent's last move
    return history.opponentMoves[history.opponentMoves.length - 1];
  }
}

export class Friedman extends Strategy {
  constructor() {
    super('Friedman (Grudger)');
  }

  makeMove(history: MatchHistory): Move {
    // If opponent has ever defected, defect forever
    if (history.opponentMoves.includes('D')) {
      return 'D';
    }
    return 'C';
  }
}

export class Joss extends Strategy {
  constructor() {
    super('Joss (Sneaky Tit For Tat)');
  }

  makeMove(history: MatchHistory): Move {
    // Base move is Tit For Tat
    let baseMove: Move;
    if (history.opponentMoves.length === 0) {
      baseMove = 'C';
    } else {
      baseMove = history.opponentMoves[history.opponentMoves.length - 1];
    }

    // 10% chance to override to defect
    if (Math.random() < 0.1) {
      return 'D';
    }

    return baseMove;
  }
}

export class TitForTwoTats extends Strategy {
  constructor() {
    super('Tit For Two Tats');
  }

  makeMove(history: MatchHistory): Move {
    const len = history.opponentMoves.length;

    // Start with cooperate
    if (len < 2) {
      return 'C';
    }

    // Only defect if opponent defected in BOTH of the last two rounds
    if (
      history.opponentMoves[len - 1] === 'D' &&
      history.opponentMoves[len - 2] === 'D'
    ) {
      return 'D';
    }

    return 'C';
  }
}

export class Detective extends Strategy {
  private mode: 'initial' | 'tit_for_tat' | 'always_defect' = 'initial';

  constructor() {
    super('Detective');
  }

  reset(): void {
    this.mode = 'initial';
  }

  makeMove(history: MatchHistory): Move {
    const roundNumber = history.myMoves.length + 1;

    // Phase 1: First 4 rounds - hardcoded sequence [C, D, C, C]
    if (roundNumber <= 4) {
      const sequence: Move[] = ['C', 'D', 'C', 'C'];
      return sequence[roundNumber - 1];
    }

    // Phase 2: After round 4, determine mode
    if (roundNumber === 5) {
      // Check if opponent defected during rounds 1-4
      const opponentDefected = history.opponentMoves.slice(0, 4).includes('D');

      if (opponentDefected) {
        this.mode = 'tit_for_tat';
      } else {
        this.mode = 'always_defect';
      }
    }

    // Execute chosen mode
    if (this.mode === 'always_defect') {
      return 'D';
    } else {
      // Tit for Tat: copy opponent's last move
      return history.opponentMoves[history.opponentMoves.length - 1];
    }
  }
}

// Game Engine

export class Game {
  static playRound(
    strategyA: Strategy,
    strategyB: Strategy,
    historyA: MatchHistory,
    historyB: MatchHistory
  ): { moveA: Move; moveB: Move; result: GameResult } {
    const moveA = strategyA.makeMove(historyA);
    const moveB = strategyB.makeMove(historyB);
    const result = getPayoff(moveA, moveB);

    // Update histories
    historyA.myMoves.push(moveA);
    historyA.opponentMoves.push(moveB);
    historyB.myMoves.push(moveB);
    historyB.opponentMoves.push(moveA);

    return { moveA, moveB, result };
  }

  static playMatch(
    strategyA: Strategy,
    strategyB: Strategy,
    rounds: number = 100
  ): MatchResult {
    // Reset strategies
    strategyA.reset();
    strategyB.reset();

    const historyA: MatchHistory = { myMoves: [], opponentMoves: [] };
    const historyB: MatchHistory = { myMoves: [], opponentMoves: [] };

    let scoreA = 0;
    let scoreB = 0;
    const history: MatchResult['history'] = [];

    for (let i = 0; i < rounds; i++) {
      const { moveA, moveB, result } = this.playRound(
        strategyA,
        strategyB,
        historyA,
        historyB
      );

      scoreA += result.playerA;
      scoreB += result.playerB;

      history.push({
        roundNumber: i + 1,
        moveA,
        moveB,
        scoreA: result.playerA,
        scoreB: result.playerB,
      });
    }

    return {
      strategyA: strategyA.name,
      strategyB: strategyB.name,
      scoreA,
      scoreB,
      history,
    };
  }

  static runTournament(strategies: Strategy[], roundsPerMatch: number = 200): TournamentResult[] {
    const scores = new Map<string, { total: number; matches: number }>();

    // Initialize scores
    strategies.forEach(s => {
      scores.set(s.name, { total: 0, matches: 0 });
    });

    // Play round robin
    for (let i = 0; i < strategies.length; i++) {
      for (let j = 0; j < strategies.length; j++) {
        const result = this.playMatch(strategies[i], strategies[j], roundsPerMatch);

        const statsA = scores.get(result.strategyA)!;
        statsA.total += result.scoreA;
        statsA.matches += 1;

        const statsB = scores.get(result.strategyB)!;
        statsB.total += result.scoreB;
        statsB.matches += 1;
      }
    }

    // Convert to results array
    const results: TournamentResult[] = Array.from(scores.entries()).map(
      ([name, stats]) => ({
        name,
        totalScore: stats.total,
        avgScore: stats.total / stats.matches,
        matches: stats.matches,
      })
    );

    // Sort by total score descending
    results.sort((a, b) => b.totalScore - a.totalScore);

    return results;
  }
}

// Strategy Registry
export const ALL_STRATEGIES = [
  AlwaysCooperate,
  AlwaysDefect,
  Random,
  TitForTat,
  Friedman,
  Joss,
  TitForTwoTats,
  Detective,
];

export function createStrategy(name: string): Strategy {
  const StrategyClass = ALL_STRATEGIES.find(S => new S().name === name);
  if (!StrategyClass) {
    throw new Error(`Unknown strategy: ${name}`);
  }
  return new StrategyClass();
}

export function getAllStrategyNames(): string[] {
  return ALL_STRATEGIES.map(S => new S().name);
}
