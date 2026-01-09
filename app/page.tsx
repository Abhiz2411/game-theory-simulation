"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeadToHead } from '@/components/game/head-to-head';
import { Tournament } from '@/components/game/tournament';
import { Evolution } from '@/components/game/evolution';
import { ThemeToggle } from '@/components/theme-toggle';
import { Swords, Trophy, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Iterated Prisoner&apos;s Dilemma
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore game theory through interactive simulations and tournaments
            </p>
          </div>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="head-to-head" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="head-to-head" className="flex items-center gap-2">
              <Swords className="h-4 w-4" />
              <span className="hidden sm:inline">Head-to-Head</span>
              <span className="sm:hidden">1v1</span>
            </TabsTrigger>
            <TabsTrigger value="tournament" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Tournament</span>
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Evolution</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="head-to-head">
            <HeadToHead />
          </TabsContent>

          <TabsContent value="tournament">
            <Tournament />
          </TabsContent>

          <TabsContent value="evolution">
            <Evolution />
          </TabsContent>
        </Tabs>

        <footer className="mt-16 pt-8 border-t">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">About the Prisoner&apos;s Dilemma</h3>
              <p>
                The Prisoner&apos;s Dilemma is a classic game theory scenario where two players must choose
                between cooperation and defection. In the iterated version, players meet repeatedly,
                allowing for strategies based on past behavior.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-1">Payoff Matrix</h4>
                <ul className="space-y-1">
                  <li>• Both Cooperate: +3 points each</li>
                  <li>• Both Defect: +1 point each</li>
                  <li>• Cooperate vs Defect: 0 vs +5 points</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Key Strategies</h4>
                <ul className="space-y-1">
                  <li>• <strong>Tit For Tat:</strong> Copy opponent&apos;s last move</li>
                  <li>• <strong>Grudger:</strong> Defect forever after betrayal</li>
                  <li>• <strong>Detective:</strong> Test then adapt behavior</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
