"use client"

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EvolutionarySimulation, type GenerationData } from '@/lib/evolution';
import { ALL_STRATEGIES } from '@/lib/game';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STRATEGY_COLORS: Record<string, string> = {
  'Always Cooperate': '#10b981',
  'Always Defect': '#ef4444',
  'Random': '#8b5cf6',
  'Tit For Tat': '#3b82f6',
  'Friedman (Grudger)': '#f59e0b',
  'Joss (Sneaky Tit For Tat)': '#ec4899',
  'Tit For Two Tats': '#14b8a6',
  'Detective': '#6366f1',
};

export function Evolution() {
  const [simulation, setSimulation] = useState<EvolutionarySimulation | null>(null);
  const [history, setHistory] = useState<GenerationData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per generation
  const [maxGenerations, setMaxGenerations] = useState(100); // Recommended limit
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initialize = () => {
    const sim = new EvolutionarySimulation(25);
    setSimulation(sim);
    setHistory(sim.getHistory());
    setIsRunning(false);
  };

  const runSingleGeneration = () => {
    if (!simulation) return;
    const currentGen = simulation.getCurrentGeneration();

    // Auto-stop at generation limit
    if (currentGen >= maxGenerations) {
      setIsRunning(false);
      return;
    }

    simulation.runGeneration();
    setHistory([...simulation.getHistory()]);
  };

  const toggleRunning = () => {
    const currentGen = simulation?.getCurrentGeneration() || 0;
    if (currentGen >= maxGenerations && !isRunning) {
      // Don't start if already at limit
      return;
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    initialize();
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isRunning && simulation) {
      intervalRef.current = setInterval(() => {
        runSingleGeneration();
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed]);

  const chartData = history.map((gen) => ({
    generation: gen.generation,
    ...gen.populations,
  }));

  const currentGeneration = simulation?.getCurrentGeneration() || 0;
  const currentPopulations = simulation?.getPopulationCounts() || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evolutionary Simulation</CardTitle>
          <CardDescription>
            Watch strategies evolve over generations through natural selection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                onClick={toggleRunning}
                variant={isRunning ? 'destructive' : 'default'}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>

              <Button
                onClick={runSingleGeneration}
                disabled={isRunning}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FastForward className="h-4 w-4" />
                Step
              </Button>

              <Button
                onClick={reset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="flex-1" />

            <div className="text-sm">
              <span className="text-muted-foreground">Generation:</span>{' '}
              <span className="font-mono font-bold text-lg">{currentGeneration}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Speed: {speed}ms per generation
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                disabled={isRunning}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Max Generations: {maxGenerations}
                <span className="text-muted-foreground text-xs ml-2">
                  (Recommended: 50-100)
                </span>
              </label>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={maxGenerations}
                onChange={(e) => setMaxGenerations(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                disabled={isRunning}
              />
            </div>
          </div>

          {currentGeneration >= maxGenerations && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                Generation limit reached ({maxGenerations}). Reset to continue or adjust the limit.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Population Over Time</CardTitle>
          <CardDescription>
            Each generation eliminates the bottom 5% and reproduces the top 5%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="generation"
                label={{ value: 'Generation', position: 'insideBottom', offset: -5 }}
                className="text-muted-foreground"
                stroke="currentColor"
              />
              <YAxis
                label={{ value: 'Population', angle: -90, position: 'insideLeft' }}
                className="text-muted-foreground"
                stroke="currentColor"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend />
              {ALL_STRATEGIES.map((StrategyClass) => {
                const strategyName = new StrategyClass().name;
                return (
                  <Area
                    key={strategyName}
                    type="monotone"
                    dataKey={strategyName}
                    stackId="1"
                    stroke={STRATEGY_COLORS[strategyName]}
                    fill={STRATEGY_COLORS[strategyName]}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Population</CardTitle>
          <CardDescription>
            Population distribution at generation {currentGeneration}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_STRATEGIES.map((StrategyClass) => {
              const strategyName = new StrategyClass().name;
              const count = currentPopulations[strategyName] || 0;
              const total = Object.values(currentPopulations).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';

              return (
                <div
                  key={strategyName}
                  className="p-4 rounded-lg border"
                  style={{
                    borderColor: STRATEGY_COLORS[strategyName],
                    borderWidth: '2px',
                  }}
                >
                  <div className="text-sm text-muted-foreground mb-1">{strategyName}</div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{percentage}%</div>
                  <div
                    className="h-2 mt-2 rounded-full"
                    style={{
                      backgroundColor: STRATEGY_COLORS[strategyName],
                      opacity: 0.6,
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>1. Tournament:</strong> All agents compete in a round-robin tournament (200 rounds per match)
          </p>
          <p>
            <strong>2. Elimination:</strong> The bottom 5% performers are removed from the population
          </p>
          <p>
            <strong>3. Reproduction:</strong> The top 5% performers are cloned to replace the eliminated agents
          </p>
          <p>
            <strong>4. Iteration:</strong> This process repeats, simulating natural selection
          </p>
          <div className="pt-4 border-t">
            <p className="font-medium text-foreground">Expected Outcome:</p>
            <p>
              &quot;Always Defect&quot; rises early by exploiting cooperators, but crashes when cooperators
              are eliminated. &quot;Tit For Tat&quot; and similar reciprocal strategies eventually dominate
              as they cooperate with each other while protecting against defectors.
            </p>
          </div>
          <div className="pt-4 border-t">
            <p className="font-medium text-foreground">Recommended Generations:</p>
            <ul className="space-y-1 mt-2">
              <li>• <strong>50 generations:</strong> Quick overview of initial dynamics</li>
              <li>• <strong>100 generations:</strong> Ideal for observing full evolutionary patterns</li>
              <li>• <strong>150+ generations:</strong> Extended analysis for stable equilibrium</li>
            </ul>
            <p className="mt-2 text-xs">
              Most meaningful insights occur within the first 100 generations as strategies reach equilibrium.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
