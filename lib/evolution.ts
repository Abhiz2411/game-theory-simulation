import { Strategy, Game, ALL_STRATEGIES } from './game';

export interface Agent {
  id: number;
  strategyName: string;
  score: number;
}

export interface GenerationData {
  generation: number;
  populations: Record<string, number>;
  agents: Agent[];
}

export class EvolutionarySimulation {
  private agents: Agent[] = [];
  private generation: number = 0;
  private nextId: number = 0;
  private history: GenerationData[] = [];

  constructor(initialPopulationPerStrategy: number = 25) {
    this.initialize(initialPopulationPerStrategy);
  }

  private initialize(count: number): void {
    this.agents = [];
    this.generation = 0;
    this.nextId = 0;
    this.history = [];

    // Create initial population
    ALL_STRATEGIES.forEach(StrategyClass => {
      const strategyName = new StrategyClass().name;
      for (let i = 0; i < count; i++) {
        this.agents.push({
          id: this.nextId++,
          strategyName,
          score: 0,
        });
      }
    });

    this.recordGeneration();
  }

  private recordGeneration(): void {
    const populations: Record<string, number> = {};

    ALL_STRATEGIES.forEach(StrategyClass => {
      populations[new StrategyClass().name] = 0;
    });

    this.agents.forEach(agent => {
      populations[agent.strategyName]++;
    });

    this.history.push({
      generation: this.generation,
      populations,
      agents: [...this.agents],
    });
  }

  runGeneration(): GenerationData {
    // Reset all scores
    this.agents.forEach(agent => {
      agent.score = 0;
    });

    // Tournament: each agent plays against every other agent
    for (let i = 0; i < this.agents.length; i++) {
      for (let j = 0; j < this.agents.length; j++) {
        if (i === j) continue;

        const agentA = this.agents[i];
        const agentB = this.agents[j];

        const strategyA = this.createStrategyInstance(agentA.strategyName);
        const strategyB = this.createStrategyInstance(agentB.strategyName);

        const result = Game.playMatch(strategyA, strategyB, 200);

        agentA.score += result.scoreA;
        agentB.score += result.scoreB;
      }
    }

    // Sort by score
    this.agents.sort((a, b) => b.score - a.score);

    // Elimination: Remove bottom 5%
    const eliminationCount = Math.max(1, Math.floor(this.agents.length * 0.05));
    const survivingAgents = this.agents.slice(0, -eliminationCount);

    // Reproduction: Clone top 5%
    const reproductionCount = eliminationCount;
    const topAgents = survivingAgents.slice(0, reproductionCount);
    const newAgents = topAgents.map(agent => ({
      id: this.nextId++,
      strategyName: agent.strategyName,
      score: 0,
    }));

    // Update population
    this.agents = [...survivingAgents, ...newAgents];

    this.generation++;
    this.recordGeneration();

    return this.history[this.history.length - 1];
  }

  private createStrategyInstance(name: string): Strategy {
    const StrategyClass = ALL_STRATEGIES.find(S => new S().name === name);
    if (!StrategyClass) {
      throw new Error(`Unknown strategy: ${name}`);
    }
    return new StrategyClass();
  }

  getHistory(): GenerationData[] {
    return this.history;
  }

  getCurrentGeneration(): number {
    return this.generation;
  }

  getPopulationCounts(): Record<string, number> {
    const counts: Record<string, number> = {};

    ALL_STRATEGIES.forEach(StrategyClass => {
      counts[new StrategyClass().name] = 0;
    });

    this.agents.forEach(agent => {
      counts[agent.strategyName]++;
    });

    return counts;
  }

  reset(initialPopulationPerStrategy: number = 25): void {
    this.initialize(initialPopulationPerStrategy);
  }
}
