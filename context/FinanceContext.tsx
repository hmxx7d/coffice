import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 'ROOM_BOOKING' | 'SUBSCRIPTION' | 'CAFE_SALE' | 'ADDITIONAL_SERVICE' | 'INVENTORY_COST' | 'OPERATIONAL';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  date: string;
  description: string;
  referenceId?: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  getSummary: () => {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    revenueByCategory: Record<TransactionCategory, number>;
  };
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'INCOME', category: 'SUBSCRIPTION', amount: 120, date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'باقة 50 ساعة - سارة خالد' },
  { id: 't2', type: 'INCOME', category: 'ROOM_BOOKING', amount: 45, date: new Date(Date.now() - 86400000 * 1).toISOString(), description: 'حجز قاعة VIP 101' },
  { id: 't3', type: 'INCOME', category: 'CAFE_SALE', amount: 12.5, date: new Date().toISOString(), description: 'طلب كافيه #102' },
  { id: 't4', type: 'EXPENSE', category: 'INVENTORY_COST', amount: 4.2, date: new Date().toISOString(), description: 'تكلفة مواد طلب #102' },
  { id: 't5', type: 'EXPENSE', category: 'OPERATIONAL', amount: 15, date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'صيانة دورية' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const getSummary = () => {
    let totalRevenue = 0;
    let totalExpenses = 0;
    const revenueByCategory: Record<TransactionCategory, number> = {
      ROOM_BOOKING: 0,
      SUBSCRIPTION: 0,
      CAFE_SALE: 0,
      ADDITIONAL_SERVICE: 0,
      INVENTORY_COST: 0,
      OPERATIONAL: 0,
    };

    transactions.forEach(t => {
      if (t.type === 'INCOME') {
        totalRevenue += t.amount;
        if (revenueByCategory[t.category] !== undefined) {
          revenueByCategory[t.category] += t.amount;
        }
      } else {
        totalExpenses += t.amount;
      }
    });

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      revenueByCategory,
    };
  };

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, getSummary }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
