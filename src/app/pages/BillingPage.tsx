import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Receipt, Check, ChevronDown, User, Package, Banknote, CreditCard, Plus, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T, formatPKR, todayStr } from '../theme';

type Step = 'form' | 'success';

interface BillData {
  customerId: string;
  customerName: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  paymentType: 'cash' | 'credit';
}

export function BillingPage() {
  const navigate = useNavigate();
  const { products, customers, createSale, getTodaysSales } = useApp();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<Step>('form');
  const [lastBill, setLastBill] = useState<any>(null);

  const [form, setForm] = useState<BillData>({
    customerId: '',
    customerName: 'Walk-in Customer',
    productId: searchParams.get('product') || products[0]?.id || '',
    quantity: 1,
    unitPrice: 0,
    paymentType: 'cash',
  });

  const selectedProduct = products.find(p => p.id === form.productId);
  const totalAmount = form.quantity * form.unitPrice;
  const todaySales = getTodaysSales();
  const todayTotal = todaySales.reduce((a, s) => a + s.totalAmount, 0);
  const todayCash = todaySales.filter(s => s.paymentType === 'cash').reduce((a, s) => a + s.totalAmount, 0);
  const todayCredit = todaySales.filter(s => s.paymentType === 'credit').reduce((a, s) => a + s.totalAmount, 0);

  useEffect(() => {
    const pid = searchParams.get('product');
    if (pid) {
      const p = products.find(pr => pr.id === pid);
      if (p) setForm(f => ({ ...f, productId: pid, unitPrice: p.price }));
    }
  }, [searchParams, products]);

  useEffect(() => {
    if (selectedProduct) {
      setForm(f => ({ ...f, unitPrice: selectedProduct.price }));
    }
  }, [form.productId]);

  const inputStyle: React.CSSProperties = {
    background: T.bgElevated,
    border: `1px solid ${T.border}`,
    color: T.textPrimary,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || form.quantity <= 0) return;
    if (selectedProduct.stock < form.quantity) {
      alert(`Insufficient stock! Only ${selectedProduct.stock} ${selectedProduct.unit} available.`);
      return;
    }
    const bill = {
      customerId: form.customerId || undefined,
      customerName: form.customerName || 'Walk-in Customer',
      productId: form.productId,
      productName: selectedProduct.name,
      quantity: form.quantity,
      unitPrice: form.unitPrice,
      totalAmount,
      paymentType: form.paymentType,
      date: todayStr(),
    };
    createSale(bill);
    setLastBill({ ...bill, billNo: `B${Date.now().toString().slice(-6)}` });
    setStep('success');
  };

  const resetForm = () => {
    setForm({ customerId: '', customerName: 'Walk-in Customer', productId: products[0]?.id || '', quantity: 1, unitPrice: products[0]?.price || 0, paymentType: 'cash' });
    setStep('form');
  };

  if (step === 'success' && lastBill) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh' }}>
        <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
          <h1 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700 }}>Bill Created</h1>
        </div>
        <div className="px-4 py-6 flex flex-col items-center">
          {/* Success Icon */}
          <div className="flex items-center justify-center mb-6" style={{ width: 80, height: 80, borderRadius: '50%', background: T.greenDim, border: `2px solid ${T.green}` }}>
            <Check size={36} color={T.green} strokeWidth={2.5} />
          </div>
          <h2 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700, marginBottom: 4 }}>Bill Saved!</h2>
          <p style={{ color: T.textSecondary, fontSize: '14px', marginBottom: 8 }}>
            {lastBill.paymentType === 'credit' ? 'Added to Khata (Credit)' : 'Cash Payment Recorded'}
          </p>
          <div style={{ color: T.textMuted, fontSize: '12px', marginBottom: 24 }}>Bill #{lastBill.billNo}</div>

          {/* Bill Summary */}
          <div className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div className="px-5 py-4" style={{ background: T.bgElevated, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ color: T.textSecondary, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bill Summary</div>
            </div>
            {[
              { label: 'Customer', value: lastBill.customerName },
              { label: 'Product', value: lastBill.productName },
              { label: 'Quantity', value: `${lastBill.quantity} ${selectedProduct?.unit || ''}` },
              { label: 'Unit Price', value: formatPKR(lastBill.unitPrice) },
              { label: 'Payment', value: lastBill.paymentType === 'cash' ? '💵 Cash' : '📋 Credit (Khata)' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between px-5 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
                <span style={{ color: T.textSecondary, fontSize: '13px' }}>{label}</span>
                <span style={{ color: T.textPrimary, fontSize: '13px', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div className="flex justify-between px-5 py-4">
              <span style={{ color: T.textPrimary, fontSize: '15px', fontWeight: 700 }}>Total</span>
              <span style={{ color: T.green, fontSize: '18px', fontWeight: 700 }}>{formatPKR(lastBill.totalAmount)}</span>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="w-full max-w-sm rounded-xl p-4 mt-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div style={{ color: T.textMuted, fontSize: '11px', marginBottom: 10 }}>TODAY'S SALES</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total', value: formatPKR(todayTotal + lastBill.totalAmount), color: T.textPrimary },
                { label: 'Cash', value: formatPKR(todayCash + (lastBill.paymentType === 'cash' ? lastBill.totalAmount : 0)), color: T.green },
                { label: 'Credit', value: formatPKR(todayCredit + (lastBill.paymentType === 'credit' ? lastBill.totalAmount : 0)), color: T.amber },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <div style={{ color, fontSize: '13px', fontWeight: 700 }}>{value}</div>
                  <div style={{ color: T.textMuted, fontSize: '10px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6 w-full max-w-sm">
            <button onClick={resetForm} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl"
              style={{ background: T.blue, color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600 }}>
              <Plus size={18} /> New Bill
            </button>
            <button onClick={() => navigate('/khata')} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl"
              style={{ background: T.bgElevated, color: T.textPrimary, border: `1px solid ${T.border}`, fontSize: '15px' }}>
              View Khata
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
        <h1 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700 }}>Create Bill</h1>
        <p style={{ color: T.textMuted, fontSize: '12px' }}>
          Today: <span style={{ color: T.green }}>{formatPKR(todayTotal)}</span>
          {' '}· {todaySales.length} bills
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-4 flex flex-col gap-4">
        {/* Customer Selection */}
        <div className="rounded-xl p-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <User size={16} color={T.blueLight} />
            <span style={{ color: T.textPrimary, fontSize: '14px', fontWeight: 600 }}>Customer</span>
          </div>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, customerId: '', customerName: 'Walk-in Customer' }))}
              className="flex-1 py-2 rounded-lg text-center"
              style={{
                background: !form.customerId ? T.blueDim : T.bgElevated,
                color: !form.customerId ? T.blueLight : T.textSecondary,
                border: `1px solid ${!form.customerId ? T.blueBorder : T.border}`,
                fontSize: '13px', fontWeight: 500,
              }}
            >
              Walk-in
            </button>
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, customerId: customers[0]?.id || '', customerName: customers[0]?.name || '' }))}
              className="flex-1 py-2 rounded-lg text-center"
              style={{
                background: form.customerId ? T.blueDim : T.bgElevated,
                color: form.customerId ? T.blueLight : T.textSecondary,
                border: `1px solid ${form.customerId ? T.blueBorder : T.border}`,
                fontSize: '13px', fontWeight: 500,
              }}
            >
              Customer (Khata)
            </button>
          </div>
          {form.customerId ? (
            <select
              style={{
                background: T.bgElevated, border: `1px solid ${T.border}`, color: T.textPrimary,
                borderRadius: '10px', padding: '12px 14px', fontSize: '14px', width: '100%', outline: 'none',
              }}
              value={form.customerId}
              onChange={e => {
                const c = customers.find(c => c.id === e.target.value);
                setForm(f => ({ ...f, customerId: e.target.value, customerName: c?.name || '' }));
              }}
            >
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: T.bgElevated }}>
              <User size={14} color={T.textMuted} />
              <span style={{ color: T.textSecondary, fontSize: '13px' }}>Walk-in Customer</span>
            </div>
          )}
        </div>

        {/* Product Selection */}
        <div className="rounded-xl p-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} color={T.blueLight} />
            <span style={{ color: T.textPrimary, fontSize: '14px', fontWeight: 600 }}>Product</span>
          </div>
          <select
            style={{
              background: T.bgElevated, border: `1px solid ${T.border}`, color: T.textPrimary,
              borderRadius: '10px', padding: '12px 14px', fontSize: '14px', width: '100%', outline: 'none',
            }}
            value={form.productId}
            onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
            required
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} — Stock: {p.stock} {p.unit}</option>
            ))}
          </select>

          {selectedProduct && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { label: 'Stock', value: `${selectedProduct.stock} ${selectedProduct.unit}`, color: selectedProduct.stock <= selectedProduct.minStock ? T.amber : T.green },
                { label: 'Sell Price', value: formatPKR(selectedProduct.price), color: T.textPrimary },
                { label: 'Type', value: selectedProduct.unit, color: T.textSecondary },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg p-2 text-center" style={{ background: T.bgElevated }}>
                  <div style={{ color, fontSize: '11px', fontWeight: 600 }}>{value}</div>
                  <div style={{ color: T.textMuted, fontSize: '10px' }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity & Price */}
        <div className="rounded-xl p-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: T.textSecondary, fontSize: '12px', display: 'block', marginBottom: 6 }}>Quantity</label>
              <input
                type="number"
                min="0.1" step="0.1"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                style={{
                  background: T.bgElevated, border: `1px solid ${T.border}`, color: T.textPrimary,
                  borderRadius: '10px', padding: '12px 14px', fontSize: '15px', width: '100%', outline: 'none', fontWeight: 700,
                }}
                required
              />
            </div>
            <div>
              <label style={{ color: T.textSecondary, fontSize: '12px', display: 'block', marginBottom: 6 }}>
                Unit Price (Rs.)
              </label>
              <input
                type="number"
                value={form.unitPrice}
                onChange={e => setForm(f => ({ ...f, unitPrice: Number(e.target.value) }))}
                style={{
                  background: T.bgElevated, border: `1px solid ${T.border}`, color: T.textPrimary,
                  borderRadius: '10px', padding: '12px 14px', fontSize: '15px', width: '100%', outline: 'none', fontWeight: 700,
                }}
                required
              />
            </div>
          </div>

          {/* Total */}
          <div className="mt-3 rounded-xl p-3 flex justify-between items-center" style={{ background: T.bgElevated }}>
            <span style={{ color: T.textSecondary, fontSize: '14px' }}>Total Amount</span>
            <span style={{ color: T.green, fontSize: '22px', fontWeight: 700 }}>{formatPKR(totalAmount)}</span>
          </div>
        </div>

        {/* Payment Type */}
        <div className="rounded-xl p-4" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <span style={{ color: T.textPrimary, fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: 12 }}>Payment Type</span>
          <div className="grid grid-cols-2 gap-3">
            {(['cash', 'credit'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setForm(f => ({ ...f, paymentType: type }))}
                className="flex items-center justify-center gap-2 py-4 rounded-xl"
                style={{
                  background: form.paymentType === type
                    ? (type === 'cash' ? T.greenDim : T.amberDim)
                    : T.bgElevated,
                  color: form.paymentType === type
                    ? (type === 'cash' ? T.green : T.amber)
                    : T.textSecondary,
                  border: `2px solid ${form.paymentType === type ? (type === 'cash' ? T.green : T.amber) : 'transparent'}`,
                  fontSize: '14px', fontWeight: 600,
                }}
              >
                {type === 'cash' ? <Banknote size={18} /> : <CreditCard size={18} />}
                {type === 'cash' ? 'Cash' : 'Credit (Khata)'}
              </button>
            ))}
          </div>
          {form.paymentType === 'credit' && !form.customerId && (
            <p style={{ color: T.amber, fontSize: '12px', marginTop: 10 }}>
              ⚠ Select a customer from Khata list to record credit.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl"
          style={{ background: T.blue, color: '#fff', border: 'none', fontSize: '16px', fontWeight: 700 }}
        >
          <Receipt size={20} />
          Confirm Bill — {formatPKR(totalAmount)}
        </button>
      </form>
    </div>
  );
}