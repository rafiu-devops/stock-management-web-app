import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart3, TrendingUp, Banknote, CreditCard, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T, formatPKR } from '../theme';
import { Sale } from '../types';

type Tab = 'daily' | 'weekly' | 'monthly';

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function getWeekStart(weeksAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - weeksAgo * 7 - d.getDay());
  return d.toISOString().split('T')[0];
}

function getMonthStr(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo, 1);
  return d.toISOString().slice(0, 7);
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px' }}>
        <p style={{ color: T.textSecondary, fontSize: '11px', marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.fill || T.textPrimary, fontSize: '12px', fontWeight: 600 }}>
            {p.name}: {formatPKR(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsPage() {
  const { sales } = useApp();
  const [tab, setTab] = useState<Tab>('daily');

  const dailyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = dateStr(6 - i);
      const daySales = sales.filter(s => s.date === date);
      const d = new Date(date + 'T00:00:00');
      return {
        label: d.toLocaleDateString('en-PK', { weekday: 'short' }),
        cash: daySales.filter(s => s.paymentType === 'cash').reduce((a, s) => a + s.totalAmount, 0),
        credit: daySales.filter(s => s.paymentType === 'credit').reduce((a, s) => a + s.totalAmount, 0),
        total: daySales.reduce((a, s) => a + s.totalAmount, 0),
        count: daySales.length,
      };
    });
  }, [sales]);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - (3 - i) * 7 - weekStartDate.getDay());
      const weekEnd = new Date(weekStartDate);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const ws = weekStartDate.toISOString().split('T')[0];
      const we = weekEnd.toISOString().split('T')[0];
      const weekSales = sales.filter(s => s.date >= ws && s.date <= we);
      return {
        label: `W${i + 1}`,
        cash: weekSales.filter(s => s.paymentType === 'cash').reduce((a, s) => a + s.totalAmount, 0),
        credit: weekSales.filter(s => s.paymentType === 'credit').reduce((a, s) => a + s.totalAmount, 0),
        total: weekSales.reduce((a, s) => a + s.totalAmount, 0),
        count: weekSales.length,
      };
    });
  }, [sales]);

  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const month = getMonthStr(5 - i);
      const monthSales = sales.filter(s => s.date.startsWith(month));
      const d = new Date(month + '-01');
      return {
        label: d.toLocaleDateString('en-PK', { month: 'short' }),
        cash: monthSales.filter(s => s.paymentType === 'cash').reduce((a, s) => a + s.totalAmount, 0),
        credit: monthSales.filter(s => s.paymentType === 'credit').reduce((a, s) => a + s.totalAmount, 0),
        total: monthSales.reduce((a, s) => a + s.totalAmount, 0),
        count: monthSales.length,
      };
    });
  }, [sales]);

  const data = tab === 'daily' ? dailyData : tab === 'weekly' ? weeklyData : monthlyData;
  const totalSales = data.reduce((a, d) => a + d.total, 0);
  const totalCash = data.reduce((a, d) => a + d.cash, 0);
  const totalCredit = data.reduce((a, d) => a + d.credit, 0);
  const totalBills = data.reduce((a, d) => a + d.count, 0);

  const pieData = [
    { name: 'Cash', value: totalCash, color: T.green },
    { name: 'Credit', value: totalCredit, color: T.amber },
  ].filter(d => d.value > 0);

  // Top products
  const periodSales = tab === 'daily'
    ? sales.filter(s => s.date >= dateStr(6))
    : tab === 'weekly'
    ? sales.filter(s => s.date >= dateStr(27))
    : sales.filter(s => s.date >= dateStr(179));

  const productSales: Record<string, { name: string; total: number; qty: number }> = {};
  periodSales.forEach(s => {
    if (!productSales[s.productId]) productSales[s.productId] = { name: s.productName, total: 0, qty: 0 };
    productSales[s.productId].total += s.totalAmount;
    productSales[s.productId].qty += s.quantity;
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.total - a.total).slice(0, 4);

  const tabLabel = { daily: 'Last 7 Days', weekly: 'Last 4 Weeks', monthly: 'Last 6 Months' }[tab];

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
        <h1 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700 }}>Reports</h1>
        <p style={{ color: T.textMuted, fontSize: '12px' }}>{tabLabel}</p>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex rounded-xl p-1" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          {(['daily', 'weekly', 'monthly'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg capitalize"
              style={{
                background: tab === t ? T.blue : 'transparent',
                color: tab === t ? '#fff' : T.textSecondary,
                border: 'none',
                fontSize: '13px',
                fontWeight: tab === t ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Sales', value: formatPKR(totalSales), icon: TrendingUp, color: T.blue, dim: T.blueDim },
            { label: 'Total Bills', value: String(totalBills), icon: BarChart3, color: T.textSecondary, dim: T.bgElevated },
            { label: 'Cash Sales', value: formatPKR(totalCash), icon: Banknote, color: T.green, dim: T.greenDim },
            { label: 'Credit Sales', value: formatPKR(totalCredit), icon: CreditCard, color: T.amber, dim: T.amberDim },
          ].map(({ label, value, icon: Icon, color, dim }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: T.textMuted, fontSize: '11px' }}>{label}</span>
                <div className="rounded-lg p-1.5" style={{ background: dim }}>
                  <Icon size={13} color={color} />
                </div>
              </div>
              <div style={{ color, fontSize: '16px', fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Sales Bar Chart */}
        <div className="rounded-xl p-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <div style={{ color: T.textSecondary, fontSize: '13px', fontWeight: 600, marginBottom: 16 }}>
            Sales Overview
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cash" name="Cash" fill={T.green} radius={[4, 4, 0, 0]} />
              <Bar dataKey="credit" name="Credit" fill={T.amber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2">
            {[{ color: T.green, label: 'Cash' }, { color: T.amber, label: 'Credit' }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                <span style={{ color: T.textMuted, fontSize: '11px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div style={{ color: T.textSecondary, fontSize: '13px', fontWeight: 600, marginBottom: 8 }}>
              Cash vs Credit Split
            </div>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 flex flex-col gap-3">
                {pieData.map(({ name, value, color }) => (
                  <div key={name}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                        <span style={{ color: T.textSecondary, fontSize: '12px' }}>{name}</span>
                      </div>
                      <span style={{ color, fontSize: '12px', fontWeight: 700 }}>
                        {totalSales > 0 ? Math.round((value / totalSales) * 100) : 0}%
                      </span>
                    </div>
                    <div style={{ color: T.textPrimary, fontSize: '13px', fontWeight: 600, marginLeft: 14 }}>
                      {formatPKR(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="rounded-xl p-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div style={{ color: T.textSecondary, fontSize: '13px', fontWeight: 600, marginBottom: 12 }}>
              Top Products
            </div>
            <div className="flex flex-col gap-3">
              {topProducts.map((p, i) => {
                const pct = topProducts[0].total > 0 ? (p.total / topProducts[0].total) * 100 : 0;
                const colors = [T.blue, T.green, T.amber, T.red];
                return (
                  <div key={p.name}>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: T.textPrimary, fontSize: '13px' }}>{p.name}</span>
                      <span style={{ color: T.textSecondary, fontSize: '12px' }}>
                        {formatPKR(p.total)} · {p.qty} units
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 5, background: T.bgElevated }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: colors[i], borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
