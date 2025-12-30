
import React, { useState, useEffect } from 'react';
import { X, Settings, RotateCcw, Save } from 'lucide-react';
import { SessionConfig } from '../types';

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: SessionConfig;
    onSave: (config: SessionConfig) => void;
    onReset: () => void;
    isFirstRun: boolean;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
    isOpen,
    onClose,
    config,
    onSave,
    onReset,
    isFirstRun
}) => {
    const [localConfig, setLocalConfig] = useState<SessionConfig>(config);

    useEffect(() => {
        if (isOpen) {
            setLocalConfig(config);
        }
    }, [isOpen, config]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(localConfig);
        onClose();
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the entire session? This will remove all players and transactions.")) {
            onReset();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
                        <Settings className="w-5 h-5 text-emerald-400" />
                        {isFirstRun ? "Start New Session" : "Session Settings"}
                    </h2>
                    {!isFirstRun && (
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Buy-in Amount ($)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                <input
                                    type="number"
                                    value={localConfig.buyInAmount}
                                    onChange={(e) => setLocalConfig({ ...localConfig, buyInAmount: Math.max(1, Number(e.target.value)) })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bebas text-lg tracking-wide"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Points per Buy-in</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={localConfig.pointsPerBuyIn}
                                    onChange={(e) => setLocalConfig({ ...localConfig, pointsPerBuyIn: Math.max(1, Number(e.target.value)) })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bebas text-lg tracking-wide"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-950/30 flex gap-3">
                    {!isFirstRun && (
                        <button
                            onClick={handleReset}
                            className="px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        <Save className="w-4 h-4" />
                        {isFirstRun ? "Start Game" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};
