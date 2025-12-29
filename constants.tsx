
import { ChipConfig } from './types';

export const DEFAULT_CHIPS: ChipConfig[] = [
  { color: 'White', value: 10, label: 'White', twColor: 'bg-slate-100 text-slate-900' },
  { color: 'Green', value: 20, label: 'Green', twColor: 'bg-emerald-500 text-white' },
  { color: 'Blue', value: 50, label: 'Blue', twColor: 'bg-blue-600 text-white' },
  { color: 'Black', value: 100, label: 'Black', twColor: 'bg-zinc-900 text-white border border-zinc-700' },
  { color: 'Red', value: 250, label: 'Red', twColor: 'bg-rose-600 text-white' },
];

export const INITIAL_SESSION_CONFIG = {
  buyInAmount: 25,
  pointsPerBuyIn: 500,
};
