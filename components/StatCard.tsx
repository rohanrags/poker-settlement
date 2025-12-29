
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = "text-emerald-400" }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className={`text-2xl font-bebas tracking-wide ${color}`}>{value}</div>
    </div>
  );
};
