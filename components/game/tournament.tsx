"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ALL_STRATEGIES, Game, type TournamentResult } from '@/lib/game';
import { Trophy, Play, RotateCcw } from 'lucide-react';

export function Tournament() {
  const [results, setResults] = useState<TournamentResult[] | null>(null);
  const [rounds, setRounds] = useState(200);
  const [isRunning, setIsRunning] = useState(false);

  const runTournament = () => {
    setIsRunning(true);
    // Create one instance of each strategy
    const strategies = ALL_STRATEGIES.map(StrategyClass => new StrategyClass());
    const tournamentResults = Game.runTournament(strategies, rounds);
    setResults(tournamentResults);
    setIsRunning(false);
  };

  const reset = () => {
    setResults(null);
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Round Robin Tournament</CardTitle>
          <CardDescription>
            Every strategy plays against every other strategy (and itself)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Rounds per Match: {rounds}
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={runTournament} disabled={isRunning} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Run Tournament'}
            </Button>
            {results && (
              <Button onClick={reset} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              Results from {ALL_STRATEGIES.length}² = {ALL_STRATEGIES.length * ALL_STRATEGIES.length} matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead className="text-right">Total Score</TableHead>
                  <TableHead className="text-right">Avg per Round</TableHead>
                  <TableHead className="text-right">Matches</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={result.name}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{getMedalEmoji(index + 1)}</span>
                        <span>#{index + 1}</span>
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell className="text-right font-mono">
                      {result.totalScore.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {result.avgScore.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {result.matches}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <h3 className="font-medium mb-2">Key Insights</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Each strategy plays {ALL_STRATEGIES.length} matches ({rounds} rounds each)</li>
                <li>• Higher total score indicates better overall performance</li>
                <li>• Avg per round shows efficiency (max possible: 5 points)</li>
                <li>• Best strategies balance cooperation and defection</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
