import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, Plus, X, Package, Droplets, AlertTriangle, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T, formatPKR, formatDate, todayStr } from '../theme';
import { Product } from '../types';

type Modal = 'none' | 'addProduct' | 'addStock';

function StockLevel({ product }: { product: Product }) {
  const pct = Math.min(100, (product.stock / (product.minStock * 3)) * 100);
  const color = product.stock === 0 ? T.red : product.stock <= product.minStock ? T.amber : T.green;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span style={{ color: T.textMuted, fontSize: '11px' }}>Stock Level</span>
        <span style={{ color, fontSize: '11px', fontWeight: 600 }}>
          {product.stock} / {product.minStock * 3} {product.unit}
        </span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: 4, background: T.bgElevated }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function ProductsPage() {
  const { products, addProduct, addStock } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<Modal>('none');
  const [preselectedProduct, setPreselectedProduct] = useState('');

  useEffect(() => {
    const stockId = searchParams.get('stock');
    if (stockId) {
      setPreselectedProduct(stockId);
      setModal('addStock');
    }
  }, [searchParams]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.oilType.toLowerCase().includes(search.toLowerCase())
  );

  const lowCount = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700 }}>Products</h1>
            <p style={{ color: T.textMuted, fontSize: '12px' }}>
              {products.length} items
              {lowCount > 0 && <span style={{ color: T.amber }}> · {lowCount} low stock</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setModal('addStock')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: T.bgElevated, color: T.textPrimary, border: `1px solid ${T.border}`, fontSize: '13px' }}
            >
              <Plus size={15} /> Add Stock
            </button>
            <button
              onClick={() => setModal('addProduct')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: T.blue, color: '#fff', border: 'none', fontSize: '13px', fontWeight: 600 }}
            >
              <Plus size={15} /> Product
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <Search size={16} color={T.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              background: T.bgElevated,
              border: `1px solid ${T.border}`,
              color: T.textPrimary,
              borderRadius: '10px',
              padding: '10px 12px 10px 36px',
              fontSize: '14px',
              width: '100%',
              outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: T.textMuted }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="px-4 py-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} color={T.textMuted} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: T.textMuted, fontSize: '14px' }}>No products found</p>
          </div>
        ) : (
          filtered.map(product => {
            const isLow = product.stock <= product.minStock;
            const isCritical = product.stock === 0;
            const leftColor = isCritical ? T.red : isLow ? T.amber : T.blue;
            return (
              <div
                key={product.id}
                className="rounded-xl p-4"
                style={{
                  background: T.bgCard,
                  border: `1px solid ${isLow ? (isCritical ? T.redDim : T.amberDim) : T.border}`,
                  borderLeft: `3px solid ${leftColor}`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg flex items-center justify-center" style={{ width: 38, height: 38, background: T.bgElevated, flexShrink: 0 }}>
                      <Droplets size={18} color={leftColor} />
                    </div>
                    <div>
                      <div style={{ color: T.textPrimary, fontSize: '14px', fontWeight: 600 }}>{product.name}</div>
                      <div style={{ color: T.textSecondary, fontSize: '12px' }}>{product.brand} · {product.oilType}</div>
                    </div>
                  </div>
                  {isLow && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: isCritical ? T.redDim : T.amberDim }}>
                      <AlertTriangle size={11} color={isCritical ? T.red : T.amber} />
                      <span style={{ color: isCritical ? T.red : T.amber, fontSize: '10px', fontWeight: 600 }}>
                        {isCritical ? 'Out' : 'Low'}
                      </span>
                    </div>
                  )}
                </div>

                <StockLevel product={product} />

                <div className="grid grid-cols-3 gap-2 mt-3">
                  {[
                    { label: 'Sell Price', value: formatPKR(product.price) },
                    { label: 'Buy Price', value: formatPKR(product.purchasePrice) },
                    { label: 'Unit', value: product.unit },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg p-2.5 text-center" style={{ background: T.bgElevated }}>
                      <div style={{ color: T.textPrimary, fontSize: '12px', fontWeight: 600 }}>{value}</div>
                      <div style={{ color: T.textMuted, fontSize: '10px', marginTop: 1 }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { setPreselectedProduct(product.id); setModal('addStock'); }}
                    className="flex-1 py-2 rounded-lg text-center"
                    style={{ background: T.blueDim, color: T.blueLight, border: `1px solid ${T.blueBorder}`, fontSize: '13px', fontWeight: 500 }}
                  >
                    + Add Stock
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Product Modal */}
      {modal === 'addProduct' && (
        <AddProductModal onClose={() => setModal('none')} onAdd={addProduct} />
      )}

      {/* Add Stock Modal */}
      {modal === 'addStock' && (
        <AddStockModal
          products={products}
          preselected={preselectedProduct}
          onClose={() => { setModal('none'); setPreselectedProduct(''); }}
          onAdd={addStock}
        />
      )}
    </div>
  );
}

function AddProductModal({
  onClose, onAdd
}: {
  onClose: () => void;
  onAdd: (p: any) => void;
}) {
  const [form, setForm] = useState({
    name: '', brand: '', oilType: '', unit: 'liter' as 'liter' | 'kg' | 'drum',
    price: '', purchasePrice: '', stock: '', minStock: '',
  });

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
    if (!form.name || !form.brand || !form.price) return;
    onAdd({
      name: form.name, brand: form.brand, oilType: form.oilType, unit: form.unit,
      price: Number(form.price), purchasePrice: Number(form.purchasePrice),
      stock: Number(form.stock), minStock: Number(form.minStock) || 5,
    });
    onClose();
  };

  return (
    <ModalSheet onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Product Name">
          <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mobil 1 0W-40" required />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Brand">
            <input style={inputStyle} value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. Mobil" required />
          </FormField>
          <FormField label="Unit">
            <select style={inputStyle} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value as any }))}>
              <option value="liter">Liter</option>
              <option value="kg">Kilogram</option>
              <option value="drum">Drum</option>
            </select>
          </FormField>
        </div>
        <FormField label="Oil Type">
          <input style={inputStyle} value={form.oilType} onChange={e => setForm(f => ({ ...f, oilType: e.target.value }))} placeholder="e.g. Synthetic Engine Oil" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Selling Price (Rs.)">
            <input style={inputStyle} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" required />
          </FormField>
          <FormField label="Purchase Price (Rs.)">
            <input style={inputStyle} type="number" value={form.purchasePrice} onChange={e => setForm(f => ({ ...f, purchasePrice: e.target.value }))} placeholder="0" />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Current Stock">
            <input style={inputStyle} type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
          </FormField>
          <FormField label="Min Stock Alert">
            <input style={inputStyle} type="number" value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: e.target.value }))} placeholder="5" />
          </FormField>
        </div>
        <button type="submit" className="w-full py-3.5 rounded-xl mt-2"
          style={{ background: T.blue, color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600 }}>
          Add Product
        </button>
      </form>
    </ModalSheet>
  );
}

function AddStockModal({
  products, preselected, onClose, onAdd
}: {
  products: Product[];
  preselected: string;
  onClose: () => void;
  onAdd: (e: any) => void;
}) {
  const [productId, setProductId] = useState(preselected || products[0]?.id || '');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(todayStr());

  const selectedProduct = products.find(p => p.id === productId);
  const newStock = selectedProduct ? selectedProduct.stock + (Number(qty) || 0) : 0;

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
    if (!productId || !qty) return;
    onAdd({
      productId,
      productName: selectedProduct?.name || '',
      quantity: Number(qty),
      purchasePrice: Number(price) || selectedProduct?.purchasePrice || 0,
      date,
    });
    onClose();
  };

  return (
    <ModalSheet onClose={onClose} title="Add Stock">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Select Product">
          <select style={inputStyle} value={productId} onChange={e => setProductId(e.target.value)} required>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.stock} {p.unit})</option>
            ))}
          </select>
        </FormField>

        {selectedProduct && (
          <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: T.blueDim, border: `1px solid ${T.blueBorder}` }}>
            <div>
              <div style={{ color: T.textMuted, fontSize: '11px' }}>Current Stock</div>
              <div style={{ color: T.textPrimary, fontSize: '18px', fontWeight: 700 }}>
                {selectedProduct.stock} {selectedProduct.unit}
              </div>
            </div>
            {Number(qty) > 0 && (
              <>
                <div style={{ color: T.textMuted, fontSize: '20px' }}>→</div>
                <div>
                  <div style={{ color: T.textMuted, fontSize: '11px' }}>After Adding</div>
                  <div style={{ color: T.green, fontSize: '18px', fontWeight: 700 }}>
                    {newStock} {selectedProduct.unit}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Quantity">
            <input style={inputStyle} type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" required min="0.1" step="0.1" />
          </FormField>
          <FormField label="Purchase Price">
            <input style={inputStyle} type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder={String(selectedProduct?.purchasePrice || 0)} />
          </FormField>
        </div>
        <FormField label="Date">
          <input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} />
        </FormField>
        <button type="submit" className="w-full py-3.5 rounded-xl mt-2"
          style={{ background: T.green, color: '#fff', border: 'none', fontSize: '15px', fontWeight: 600 }}>
          Update Stock
        </button>
      </form>
    </ModalSheet>
  );
}

function ModalSheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl md:max-w-lg md:mx-auto"
        style={{ background: T.bgCard, border: `1px solid ${T.border}`, maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div className="px-5 pt-4 pb-2 flex items-center justify-between sticky top-0" style={{ background: T.bgCard, borderBottom: `1px solid ${T.border}` }}>
          <h3 style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: T.bgElevated, border: 'none', borderRadius: '8px', padding: 7, color: T.textSecondary }}>
            <X size={16} />
          </button>
        </div>
        <div className="p-5 modal-sheet-content">{children}</div>
      </div>
    </>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ color: T.textSecondary, fontSize: '12px', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}