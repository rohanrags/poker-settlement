
export interface ChipConfig {
  color: string;
  value: number;
  label: string;
  twColor: string;
}

export interface Player {
  id: string;
  name: string;
  buyInCount: number; // 1 = initial, 2 = +1 re-buy, etc.
  finalPoints: number;
}

export interface SessionConfig {
  buyInAmount: number; // e.g., $25
  pointsPerBuyIn: number; // e.g., 500
}

export interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export interface SettlementResult {
  netBalances: Record<string, number>;
  transactions: Transaction[];
}
