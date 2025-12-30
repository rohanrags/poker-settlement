
import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  PlusCircle,
  MinusCircle,
  Trash2,
  CircleDollarSign,
  Receipt,
  BarChart3,
  Trophy,
  RefreshCcw,
  Sparkles,
  Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Player, SessionConfig, Transaction } from './types';
import { INITIAL_SESSION_CONFIG, DEFAULT_CHIPS } from './constants';
import { simplifyDebts } from './utils/debtSimplifier';
import { StatCard } from './components/StatCard';
import { ConfigModal } from './components/ConfigModal';

const App: React.FC = () => {
  const [config, setConfig] = useState<SessionConfig>(INITIAL_SESSION_CONFIG);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showSettlement, setShowSettlement] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  // If we have saved data or players, we might not want to show it immediately, but for now
  // let's assume "In the beginning" means on first load if default. 
  // We can refine persistence later.
  useEffect(() => {
    // Basic check: if players exist, don't auto-open.
    if (players.length > 0) {
      setIsConfigOpen(false);
    }
  }, []);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: newPlayerName.trim(),
      buyInCount: 1,
      finalPoints: 0
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const updateBuyIn = (id: string, delta: number) => {
    setPlayers(players.map(p =>
      p.id === id ? { ...p, buyInCount: Math.max(1, p.buyInCount + delta) } : p
    ));
  };

  const updatePoints = (id: string, points: number) => {
    setPlayers(players.map(p =>
      p.id === id ? { ...p, finalPoints: Math.max(0, points) } : p
    ));
  };

  const totals = useMemo(() => {
    const totalBuyIns = players.reduce((sum, p) => sum + p.buyInCount, 0);
    const totalCash = totalBuyIns * config.buyInAmount;
    const totalPointsPlayed = totalBuyIns * config.pointsPerBuyIn;
    const totalPointsEntered = players.reduce((sum, p) => sum + p.finalPoints, 0);
    const pointValue = config.buyInAmount / config.pointsPerBuyIn;

    const playerStats = players.map(p => {
      const cost = p.buyInCount * config.buyInAmount;
      const cashOut = p.finalPoints * pointValue;
      const net = cashOut - cost;
      return { ...p, cost, cashOut, net };
    });

    const netBalances: Record<string, number> = {};
    const playerNames: Record<string, string> = {};
    playerStats.forEach(p => {
      netBalances[p.id] = p.net;
      playerNames[p.id] = p.name;
    });

    const transactions = simplifyDebts(netBalances, playerNames);

    return {
      totalBuyIns,
      totalCash,
      totalPointsPlayed,
      totalPointsEntered,
      playerStats,
      transactions,
      pointValue
    };
  }, [players, config]);

  const isBalanced = Math.abs(totals.totalPointsPlayed - totals.totalPointsEntered) < 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
              <CircleDollarSign className="w-6 h-6 text-slate-950" />
            </div>
            <h1 className="text-2xl font-bebas tracking-widest">PokerSettle <span className="text-emerald-400">Pro</span></h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">Buy-in: ${config.buyInAmount}</div>
            <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">Points: {config.pointsPerBuyIn}</div>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="p-1.5 hover:bg-slate-700 rounded transition-colors"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSave={setConfig}
        onReset={() => {
          setPlayers([]);
          setConfig(INITIAL_SESSION_CONFIG);
        }}
        isFirstRun={players.length === 0}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Pot" value={`$${totals.totalCash}`} icon={<CircleDollarSign className="w-4 h-4 text-emerald-500" />} />
          <StatCard label="Total Players" value={players.length} icon={<Users className="w-4 h-4 text-blue-500" />} color="text-blue-400" />
          <StatCard label="Buy-ins" value={totals.totalBuyIns} icon={<Receipt className="w-4 h-4 text-purple-500" />} color="text-purple-400" />
          <StatCard
            label="Points Balance"
            value={`${totals.totalPointsEntered} / ${totals.totalPointsPlayed}`}
            icon={<Trophy className="w-4 h-4 text-amber-500" />}
            color={isBalanced ? "text-emerald-400" : "text-rose-400"}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Player Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 md:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Active Players
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                    placeholder="Player Name..."
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm flex-1 sm:flex-initial"
                  />
                  <button
                    onClick={addPlayer}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 p-2 rounded-lg transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-800/30 text-slate-400 text-xs font-bold uppercase">
                    <tr>
                      <th className="px-3 md:px-6 py-4">Player</th>
                      <th className="px-3 md:px-6 py-4"># Buy-ins</th>
                      <th className="px-3 md:px-6 py-4">Buy-ins ($)</th>
                      <th className="px-3 md:px-6 py-4">Final Chips (Pts)</th>
                      <th className="px-3 md:px-6 py-4">Net</th>
                      <th className="px-3 md:px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {players.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-3 md:px-6 py-12 text-center text-slate-500 italic">
                          No players added yet. Enter names above to start.
                        </td>
                      </tr>
                    )}
                    {totals.playerStats.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-3 md:px-6 py-4 font-semibold text-slate-200">{p.name}</td>
                        <td className="px-3 md:px-6 py-4 font-bebas text-lg text-slate-300">{p.buyInCount}</td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <button onClick={() => updateBuyIn(p.id, -1)} className="text-slate-500 hover:text-rose-400"><MinusCircle className="w-5 h-5" /></button>
                            <span className="w-8 md:w-12 text-center font-bebas text-lg">${p.cost}</span>
                            <button onClick={() => updateBuyIn(p.id, 1)} className="text-slate-500 hover:text-emerald-400"><PlusCircle className="w-5 h-5" /></button>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <input
                            type="number"
                            value={p.finalPoints || ''}
                            onChange={(e) => updatePoints(p.id, Number(e.target.value))}
                            placeholder="Points"
                            className="bg-slate-800 border border-slate-700 px-2 md:px-3 py-1 rounded w-16 md:w-24 text-center text-sm focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className={`px-3 md:px-6 py-4 font-bebas text-xl ${p.net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {p.net >= 0 ? `+$${p.net.toFixed(2)}` : `-$${Math.abs(p.net).toFixed(2)}`}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-right">
                          <button onClick={() => removePlayer(p.id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Settlement & Insights */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-28">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Settlement
                </h2>
                {!isBalanced && players.length > 0 && (
                  <div className="bg-rose-500/10 text-rose-400 text-[10px] px-2 py-1 rounded border border-rose-500/20 animate-pulse uppercase font-bold">
                    Points mismatch
                  </div>
                )}
              </div>

              {totals.transactions.length > 0 ? (
                <div className="space-y-4">
                  {totals.transactions.map((t, idx) => (
                    <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between group hover:border-emerald-500/30 transition-all gap-4">
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs text-slate-500 font-bold uppercase mb-1">Payer</span>
                        <span className="font-bold text-slate-200 truncate">{t.from}</span>
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        <div className="text-emerald-400 font-bebas text-2xl group-hover:scale-110 transition-transform">${t.amount}</div>
                        <div className="w-12 h-px bg-slate-700 my-1" />
                      </div>
                      <div className="flex flex-col items-end flex-1 min-w-0 text-right">
                        <span className="text-xs text-slate-500 font-bold uppercase mb-1">Receiver</span>
                        <span className="font-bold text-slate-200 truncate">{t.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Transactions will appear here once points are entered.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Persistence Floating Bar (Mobile Accessibility) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-slate-700 px-6 py-3 rounded-full shadow-2xl flex items-center gap-8 md:hidden">
        <div className="text-center">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Pot</div>
          <div className="font-bebas text-lg text-emerald-400">${totals.totalCash}</div>
        </div>
        <div className="w-px h-6 bg-slate-700" />
        <div className="text-center">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Diff</div>
          <div className={`font-bebas text-lg ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totals.totalPointsEntered - totals.totalPointsPlayed}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
