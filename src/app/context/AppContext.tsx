import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Customer, Sale, StockEntry, KhataTransaction } from '../types';
import { todayStr } from '../theme';
import { db } from '../data/db';

export type AppTheme = 'dark' | 'light';

interface AppContextType {
  isAuthenticated: boolean;
  theme: AppTheme;
  toggleTheme: () => void;
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  stockEntries: StockEntry[];
  khataTransactions: KhataTransaction[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  addStock: (entry: Omit<StockEntry, 'id'>) => Promise<void>;
  createSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<void>;
  addKhataPayment: (tx: Omit<KhataTransaction, 'id'>) => Promise<void>;
  getCustomerBalance: (customerId: string) => number;
  getTodaysSales: () => Sale[];
  getTotalStockValue: () => number;
  getTotalPendingKhata: () => number;
  getLowStockProducts: () => Product[];
}

const AppContext = createContext<AppContextType | null>(null);

function applyTheme(theme: AppTheme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('oge_auth') === 'true'
  );

  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('oge_theme') as AppTheme | null;
    const t = saved === 'light' ? 'light' : 'dark';
    applyTheme(t);
    return t;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [khataTransactions, setKhataTransactions] = useState<KhataTransaction[]>([]);

  // 🔥 Central Reload
  const reloadAllData = useCallback(async () => {
    const p = (await db.products.toArray()).map(i => ({ ...i, id: String(i.id) }));
    const c = (await db.customers.toArray()).map(i => ({ ...i, id: String(i.id) }));
    const s = (await db.sales.toArray()).map(i => ({ ...i, id: String(i.id) }));
    const se = (await db.stockEntries.toArray()).map(i => ({ ...i, id: String(i.id) }));
    const k = (await db.khataTransactions.toArray()).map(i => ({ ...i, id: String(i.id) }));

    setProducts(p);
    setCustomers(c);
    setSales(s);
    setStockEntries(se);
    setKhataTransactions(k);
  }, []);

  useEffect(() => {
    reloadAllData();
  }, [reloadAllData]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next: AppTheme = prev === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('oge_theme', next);
      return next;
    });
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const adminPassword = localStorage.getItem('oge_admin_password') || 'admin123';
    if (username === 'admin' && password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('oge_auth', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.setItem('oge_auth', 'false');
  }, []);

  const changePassword = useCallback((newPassword: string) => {
    localStorage.setItem('oge_admin_password', newPassword);
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt'>) => {
    await db.products.add({
      ...product,
      createdAt: todayStr(),
    } as any);
    await reloadAllData();
  }, [reloadAllData]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const numericId = Number(id);
    const { id: _, ...safeUpdates } = updates;
    await db.products.update(numericId, safeUpdates);
    await reloadAllData();
  }, [reloadAllData]);

  const addStock = useCallback(async (entry: Omit<StockEntry, 'id'>) => {
    await db.stockEntries.add(entry as any);

    const product = await db.products.get(Number(entry.productId));
    if (product) {
      await db.products.update(Number(product.id), {
        stock: product.stock + entry.quantity,
        purchasePrice: entry.purchasePrice,
      });
    }

    await reloadAllData();
  }, [reloadAllData]);

  const createSale = useCallback(async (sale: Omit<Sale, 'id'>) => {
    await db.sales.add(sale as any);

    const product = await db.products.get(Number(sale.productId));
    if (product) {
      await db.products.update(Number(product.id), {
        stock: Math.max(0, product.stock - sale.quantity),
      });
    }

    if (sale.paymentType === 'credit' && sale.customerId) {
      await db.khataTransactions.add({
        customerId: sale.customerId,
        type: 'credit',
        amount: sale.totalAmount,
        description: `${sale.productName} × ${sale.quantity}`,
        date: sale.date,
      } as any);
    }

    await reloadAllData();
  }, [reloadAllData]);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    await db.customers.add({
      ...customer,
      createdAt: todayStr(),
    } as any);
    await reloadAllData();
  }, [reloadAllData]);

  const addKhataPayment = useCallback(async (tx: Omit<KhataTransaction, 'id'>) => {
    await db.khataTransactions.add(tx as any);
    await reloadAllData();
  }, [reloadAllData]);

  const getCustomerBalance = useCallback((customerId: string) => {
    return khataTransactions
      .filter(t => t.customerId === customerId)
      .reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 0);
  }, [khataTransactions]);

  const getTodaysSales = useCallback(() => {
    const today = todayStr();
    return sales.filter(s => s.date === today);
  }, [sales]);

  const getTotalStockValue = useCallback(() =>
    products.reduce((acc, p) => acc + p.stock * p.purchasePrice, 0),
  [products]);

  const getTotalPendingKhata = useCallback(() => {
    const credit = khataTransactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
    const payment = khataTransactions.filter(t => t.type === 'payment').reduce((a, t) => a + t.amount, 0);
    return Math.max(0, credit - payment);
  }, [khataTransactions]);

  const getLowStockProducts = useCallback(() =>
    products.filter(p => p.stock <= p.minStock),
  [products]);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      theme,
      toggleTheme,
      products,
      customers,
      sales,
      stockEntries,
      khataTransactions,
      login,
      logout,
      changePassword,
      addProduct,
      updateProduct,
      addStock,
      createSale,
      addCustomer,
      addKhataPayment,
      getCustomerBalance,
      getTodaysSales,
      getTotalStockValue,
      getTotalPendingKhata,
      getLowStockProducts,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}