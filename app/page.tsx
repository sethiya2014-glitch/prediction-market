'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Trophy, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [points, setPoints] = useState(1250);
  const [bets, setBets] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Check Wallet
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) setWalletAddress(accounts[0]);
      }
    };
    checkWallet();
  }, []);

  // Load My Bets
  const loadMyBets = async () => {
    if (!walletAddress) return;
    const { data } = await supabase
      .from('bets')
      .select('*')
      .eq('user_wallet', walletAddress)
      .order('created_at', { ascending: false });
    setBets(data || []);
  };

  // Load Leaderboard
  const loadLeaderboard = async () => {
    const { data } = await supabase.from('bets').select('user_wallet, amount');
    const grouped = data?.reduce((acc: any, bet: any) => {
      acc[bet.user_wallet] = (acc[bet.user_wallet] || 0) + Number(bet.amount);
      return acc;
    }, {});

    const sorted = Object.entries(grouped || {})
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 8)
      .map(([wallet, pts], index) => ({
        rank: index + 1,
        wallet: wallet.slice(0, 8) + '...',
        points: pts
      }));

    setLeaderboard(sorted);
  };

  useEffect(() => {
    if (walletAddress) loadMyBets();
    loadLeaderboard();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask install karo!');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (error) {
      alert('Connection cancelled');
    }
  };

  const placeBet = async (market: string, choice: string, amount: number) => {
    if (!walletAddress) {
      alert('Pehle Wallet Connect karo!');
      return;
    }
    if (points < amount) {
      alert('Points kam hain!');
      return;
    }

    const { error } = await supabase.from('bets').insert({
      user_wallet: walletAddress,
      market,
      choice,
      amount,
      status: 'Pending'
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setPoints(prev => prev - amount);
      loadMyBets();
      loadLeaderboard();
      alert(`✅ Bet Placed & Saved!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            <h1 className="text-3xl font-bold text-black">PredictMarket</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {walletAddress ? (
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-mono text-gray-700">
                  {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}
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

      {/* Hero */}
      <section className="pt-20 pb-16 text-center bg-white border-b">
        <h1 className="text-5xl font-bold mb-6">Apne Predictions se <span className="text-blue-600">Kamao</span></h1>
        <p className="text-xl text-gray-600">Sports, Movies, Politics — har cheez pe predict karo aur points jeeto</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Live Market */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Live Markets</h2>
            <Card>
              <CardHeader>
                <CardTitle>FIFA World Cup 2026</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Who will win the tournament?</p>
                <input type="number" id="fifa" defaultValue={50} className="w-full p-3 border rounded-lg" />
                <div className="flex gap-3">
                  <Button onClick={() => placeBet("FIFA World Cup", "Argentina", Number((document.getElementById('fifa') as HTMLInputElement)?.value) || 50)} className="flex-1">Argentina</Button>
                  <Button onClick={() => placeBet("FIFA World Cup", "France", Number((document.getElementById('fifa') as HTMLInputElement)?.value) || 50)} variant="outline" className="flex-1">France</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Trophy className="text-yellow-500" /> Leaderboard
            </h2>
            <div className="space-y-4">
              {leaderboard.map((player, i) => (
                <Card key={i}>
                  <CardContent className="flex justify-between items-center p-5">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-yellow-500">#{player.rank}</div>
                      <div><p className="font-medium">{player.wallet}</p></div>
                    </div>
                    <div className="text-right font-bold text-emerald-600">{player.points} PTS</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* My Bets History */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="text-blue-600" /> My Bets History
            </h2>
            {bets.length === 0 ? (
              <p className="text-gray-500 p-8 text-center">Abhi koi bet nahi hai</p>
            ) : (
              bets.map((bet, i) => (
                <Card key={i} className="mb-4">
                  <CardContent className="p-4">
                    <p className="font-medium">{bet.market}</p>
                    <p>{bet.choice} • {bet.amount} pts</p>
                    <p className="text-xs text-gray-500">{bet.created_at}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}