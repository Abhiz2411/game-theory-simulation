"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { createStrategy, getAllStrategyNames, Game, type MatchResult, type Move } from '@/lib/game';
import { Play, RotateCcw } from 'lucide-react';

export function HeadToHead() {
  const [strategyA, setStrategyA] = useState('Tit For Tat');
  const [strategyB, setStrategyB] = useState('Always Defect');
  const [rounds, setRounds] = useState(50);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const strategyNames = getAllStrategyNames();

  const runMatch = () => {
    setIsRunning(true);
    const strat1 = createStrategy(strategyA);
    const strat2 = createStrategy(strategyB);
    const matchResult = Game.playMatch(strat1, strat2, rounds);
    setResult(matchResult);
    setIsRunning(false);
  };

  const reset = () => {
    setResult(null);
  };

  const getMoveEmoji = (move: Move) => {
    return move === 'C' ? '🟩' : '🟥';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Head-to-Head Duel</CardTitle>
          <CardDescription>
            Select two strategies to compete against each other
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Strategy A</label>
              <Select
                value={strategyA}
                onChange={(e) => setStrategyA(e.target.value)}
              >
                {strategyNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Strategy B</label>
              <Select
                value={strategyB}
                onChange={(e) => setStrategyB(e.target.value)}
              >
                {strategyNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Number of Rounds: {rounds}
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={runMatch} disabled={isRunning} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Run Match
            </Button>
            {result && (
              <Button onClick={reset} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {strategyA} vs {strategyB}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground">{strategyA}</div>
                <div className="text-3xl font-bold">{result.scoreA}</div>
                <div className="text-sm">
                  Avg: {(result.scoreA / rounds).toFixed(2)} per round
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground">{strategyB}</div>
                <div className="text-3xl font-bold">{result.scoreB}</div>
                <div className="text-sm">
                  Avg: {(result.scoreB / rounds).toFixed(2)} per round
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Match History</h3>
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                <div className="space-y-1 font-mono text-sm">
                  {result.history.map((round, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 hover:bg-secondary/50 p-2 rounded"
                    >
                      <span className="text-muted-foreground w-16">
                        R{round.roundNumber}:
                      </span>
                      <span className="flex items-center gap-2">
                        <span>{getMoveEmoji(round.moveA)}</span>
                        <span className="text-xs">({round.scoreA})</span>
                      </span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="flex items-center gap-2">
                        <span>{getMoveEmoji(round.moveB)}</span>
                        <span className="text-xs">({round.scoreB})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                🟩 = Cooperate | 🟥 = Defect
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
