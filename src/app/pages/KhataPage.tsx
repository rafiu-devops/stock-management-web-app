import { useState } from 'react';
import { Search, BookOpen, User, Plus, X, ChevronRight, ArrowUpCircle, ArrowDownCircle, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T, formatPKR, formatDate, todayStr } from '../theme';
import { Customer, KhataTransaction } from '../types';

type View = 'list' | 'detail';

export function KhataPage() {
  const { customers, khataTransactions, getCustomerBalance, addCustomer, addKhataPayment } = useApp();
  const [view, setView] = useState<View>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [newCust, setNewCust] = useState({ name: '', phone: '' });

  const withBalance = customers.map(c => ({
    ...c, balance: getCustomerBalance(c.id),
    lastTx: khataTransactions.filter(t => t.customerId === c.id).sort((a, b) => b.date.localeCompare(a.date))[0],
  })).sort((a, b) => b.balance - a.balance);

  const filtered = withBalance.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const totalPending = withBalance.reduce((a, c) => a + (c.balance > 0 ? c.balance : 0), 0);

  const customerTxs = selectedCustomer
    ? khataTransactions.filter(t => t.customerId === selectedCustomer.id).sort((a, b) => b.date.localeCompare(a.date))
    : [];

  const selectedBalance = selectedCustomer ? getCustomerBalance(selectedCustomer.id) : 0;

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !payAmount) return;
    addKhataPayment({
      customerId: selectedCustomer.id,
      type: 'payment',
      amount: Number(payAmount),
      description: payNote || 'Cash Payment',
      date: todayStr(),
    });
    setPayAmount('');
    setPayNote('');
    setShowPayment(false);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name) return;
    addCustomer(newCust);
    setNewCust({ name: '', phone: '' });
    setShowAddCustomer(false);
  };

  const inputStyle: React.CSSProperties = {
    background: T.bgElevated, border: `1px solid ${T.border}`, color: T.textPrimary,
    borderRadius: '10px', padding: '12px 14px', fontSize: '14px', width: '100%', outline: 'none',
  };

  if (view === 'detail' && selectedCustomer) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh' }}>
        {/* Header */}
        <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => setView('list')} style={{ background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: '8px', padding: '8px 12px', color: T.textSecondary, fontSize: '13px' }}>
              ← Back
            </button>
            <div>
              <h2 style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 700 }}>{selectedCustomer.name}</h2>
              <p style={{ color: T.textMuted, fontSize: '12px' }}>{selectedCustomer.phone}</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="rounded-xl p-4" style={{
            background: selectedBalance > 0 ? 'rgba(248,81,73,0.08)' : T.greenDim,
            border: `1px solid ${selectedBalance > 0 ? T.redBorder : T.greenBorder}`,
          }}>
            <div style={{ color: T.textMuted, fontSize: '12px' }}>Outstanding Balance</div>
            <div style={{ color: selectedBalance > 0 ? T.red : T.green, fontSize: '28px', fontWeight: 700, lineHeight: 1.2 }}>
              {formatPKR(Math.abs(selectedBalance))}
            </div>
            <div style={{ color: T.textMuted, fontSize: '12px' }}>
              {selectedBalance > 0 ? 'Amount Due' : selectedBalance < 0 ? 'Overpaid' : 'Cleared ✓'}
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Add Payment Button */}
          {selectedBalance > 0 && (
            <button
              onClick={() => setShowPayment(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl mb-4"
              style={{ background: T.green, color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600 }}
            >
              <Plus size={18} /> Record Payment
            </button>
          )}

          {/* Transactions */}
          <div style={{ color: T.textMuted, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
            Transaction History ({customerTxs.length})
          </div>

          {customerTxs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={32} color={T.textMuted} style={{ margin: '0 auto 12px' }} />
              <p style={{ color: T.textMuted, fontSize: '14px' }}>No transactions yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {customerTxs.map((tx, i) => {
                // Calculate running balance
                const runningBalance = customerTxs.slice(i).reduce((acc, t) =>
                  t.type === 'credit' ? acc + t.amount : acc - t.amount, 0);
                return (
                  <div key={tx.id} className="rounded-xl p-4 flex items-center gap-3"
                    style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                    <div className="flex-shrink-0">
                      {tx.type === 'credit'
                        ? <ArrowUpCircle size={20} color={T.red} />
                        : <ArrowDownCircle size={20} color={T.green} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: T.textPrimary, fontSize: '13px', fontWeight: 500 }} className="truncate">
                        {tx.description}
                      </div>
                      <div style={{ color: T.textMuted, fontSize: '11px' }}>{formatDate(tx.date)}</div>
                    </div>
                    <div className="text-right">
                      <div style={{ color: tx.type === 'credit' ? T.red : T.green, fontSize: '14px', fontWeight: 700 }}>
                        {tx.type === 'credit' ? '+' : '-'}{formatPKR(tx.amount)}
                      </div>
                      <div style={{ color: T.textMuted, fontSize: '10px' }}>
                        Bal: {formatPKR(Math.abs(runningBalance))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <>
            <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }} onClick={() => setShowPayment(false)} />
            <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-5 md:max-w-lg md:mx-auto" style={{ background: T.bgCard, border: `1px solid ${T.border}`, maxHeight: '92vh', overflowY: 'auto' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 700 }}>Record Payment</h3>
                <button onClick={() => setShowPayment(false)} style={{ background: T.bgElevated, border: 'none', borderRadius: '8px', padding: 7, color: T.textSecondary }}>
                  <X size={16} />
                </button>
              </div>
              <div className="rounded-xl p-3 mb-4 flex justify-between" style={{ background: T.redDim }}>
                <span style={{ color: T.textSecondary, fontSize: '13px' }}>Outstanding</span>
                <span style={{ color: T.red, fontSize: '16px', fontWeight: 700 }}>{formatPKR(selectedBalance)}</span>
              </div>
              <form onSubmit={handleAddPayment} className="flex flex-col gap-4">
                <div>
                  <label style={{ color: T.textSecondary, fontSize: '12px', display: 'block', marginBottom: 6 }}>Payment Amount (Rs.)</label>
                  <input type="number" style={inputStyle} value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="0" required min="1" />
                </div>
                <div>
                  <label style={{ color: T.textSecondary, fontSize: '12px', display: 'block', marginBottom: 6 }}>Note (optional)</label>
                  <input type="text" style={inputStyle} value={payNote} onChange={e => setPayNote(e.target.value)} placeholder="Cash Payment, Bank Transfer, etc." />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl"
                  style={{ background: T.green, color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600 }}>
                  Confirm Payment — {payAmount ? formatPKR(Number(payAmount)) : 'Rs. 0'}
                </button>
                {/* Safe area spacer for mobile bottom nav */}
                <div style={{ height: 'calc(72px + env(safe-area-inset-bottom))' }} />
              </form>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700 }}>Khata</h1>
            <p style={{ color: T.textMuted, fontSize: '12px' }}>
              {customers.length} customers · <span style={{ color: T.amber }}>{formatPKR(totalPending)} pending</span>
            </p>
          </div>
          <button onClick={() => setShowAddCustomer(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: T.blue, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600 }}>
            <Plus size={15} /> Customer
          </button>
        </div>
        <div className="relative">
          <Search size={16} color={T.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            style={{ background: T.bgElevated, border: `1px solid ${T.border}`, color: T.textPrimary, borderRadius: '10px', padding: '10px 12px 10px 36px', fontSize: '14px', width: '100%', outline: 'none' }} />
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {filtered.map(customer => (
          <button
            key={customer.id}
            onClick={() => { setSelectedCustomer(customer); setView('detail'); }}
            className="w-full rounded-xl p-4 text-left"
            style={{
              background: T.bgCard,
              border: `1px solid ${customer.balance > 0 ? T.redDim : T.border}`,
              borderLeft: `3px solid ${customer.balance > 0 ? T.red : customer.balance < 0 ? T.green : T.border}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: T.bgElevated, flexShrink: 0 }}>
                  <User size={18} color={customer.balance > 0 ? T.red : T.textSecondary} />
                </div>
                <div>
                  <div style={{ color: T.textPrimary, fontSize: '14px', fontWeight: 600 }}>{customer.name}</div>
                  <div className="flex items-center gap-1" style={{ color: T.textMuted, fontSize: '12px' }}>
                    <Phone size={11} />
                    {customer.phone}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div style={{ color: customer.balance > 0 ? T.red : T.green, fontSize: '16px', fontWeight: 700 }}>
                  {customer.balance > 0 ? formatPKR(customer.balance) : 'Clear'}
                </div>
                {customer.lastTx && (
                  <div style={{ color: T.textMuted, fontSize: '10px' }}>{formatDate(customer.lastTx.date)}</div>
                )}
              </div>
              <ChevronRight size={16} color={T.textMuted} style={{ marginLeft: 8 }} />
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} color={T.textMuted} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: T.textMuted }}>No customers found</p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }} onClick={() => setShowAddCustomer(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-5 md:max-w-lg md:mx-auto" style={{ background: T.bgCard, border: `1px solid ${T.border}`, maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 700 }}>Add Customer</h3>
              <button onClick={() => setShowAddCustomer(false)} style={{ background: T.bgElevated, border: 'none', borderRadius: '8px', padding: 7, color: T.textSecondary }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddCustomer} className="flex flex-col gap-4">
              <div>
                <label style={{ color: T.textSecondary, fontSize: '12px', display: 'block', marginBottom: 6 }}>Customer Name</label>
                <input type="text" style={inputStyle} value={newCust.name} onChange={e => setNewCust(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ahmed Khan" required />
              </div>
              <div>
                <label style={{ color: T.textSecondary, fontSize: '12px', display: 'block', marginBottom: 6 }}>Phone Number</label>
                <input type="tel" style={inputStyle} value={newCust.phone} onChange={e => setNewCust(f => ({ ...f, phone: e.target.value }))} placeholder="0300-1234567" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl"
                style={{ background: T.blue, color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600 }}>
                Add Customer
              </button>
              {/* Safe area spacer for mobile bottom nav */}
              <div style={{ height: 'calc(72px + env(safe-area-inset-bottom))' }} />
            </form>
          </div>
        </>
      )}
    </div>
  );
}