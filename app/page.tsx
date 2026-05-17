'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [points, setPoints] = useState(1250);

  const connectWallet = () => {
    alert("MetaMask Connect Feature (Demo Mode)");
    setWalletAddress("0xDemoWallet1234567890abcdef12345678");
  };

  const placeBet = (market: string, choice: string, amount: number) => {
    if (!walletAddress) {
      alert('Pehle Wallet Connect karo!');
      return;
    }
    if (points < amount) {
      alert('Points kam hain!');
      return;
    }
    setPoints(prev => prev - amount);
    alert(`✅ Bet Placed!\nMarket: ${market}\nChoice: ${choice}\nAmount: ${amount}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            <h1 className="text-3xl font-bold">PredictMarket</h1>
          </div>

          <div className="flex items-center gap-6">
            {walletAddress ? (
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-semibold">
                  {points} Points
                </div>
              </div>
            ) : (
              <Button onClick={connectWallet} size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-20 pb-16 text-center bg-white border-b">
        <h1 className="text-5xl font-bold mb-6">
          Apne Predictions se <span className="text-blue-600">Kamao</span>
        </h1>
        <p className="text-xl text-gray-600">Sports, Movies, Politics — har cheez pe predict karo</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">🔥 Live Markets</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>FIFA World Cup 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Who will win the tournament?</p>
              <input
                type="number"
                id="fifa"
                defaultValue={50}
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => placeBet("FIFA World Cup", "Argentina", 50)}
                  className="flex-1"
                >
                  Argentina
                </Button>
                <Button
                  onClick={() => placeBet("FIFA World Cup", "France", 50)}
                  variant="outline"
                  className="flex-1"
                >
                  France
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}