
import { Transaction } from '../types';

/**
 * Simplifies debts using a greedy approach.
 * Matches the largest debtors with the largest creditors.
 */
export const simplifyDebts = (balances: Record<string, number>, playerNames: Record<string, string>): Transaction[] => {
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  // Separate debtors and creditors
  Object.entries(balances).forEach(([id, balance]) => {
    if (balance < -0.01) {
      debtors.push({ id, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ id, amount: balance });
    }
  });

  // Sort to process largest amounts first
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions: Transaction[] = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0) {
      transactions.push({
        from: playerNames[debtor.id] || debtor.id,
        to: playerNames[creditor.id] || creditor.id,
        amount: Number(amount.toFixed(2))
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) d++;
    if (creditor.amount < 0.01) c++;
  }

  return transactions;
};
