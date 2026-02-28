import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Settings, Package, TrendingUp, Clock, AlertTriangle, ChevronRight,
  Droplets, X, Receipt, BarChart3, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T, formatPKR, formatDate } from '../theme';
import { Product } from '../types';

function StockBadge({ product }: { product: Product }) {
  const pct = product.stock / product.minStock;
  const isCritical = product.stock === 0;
  const isLow = product.stock <= product.minStock;
  const color = isCritical ? T.red : isLow ? T.amber : T.green;
  const dimColor = isCritical ? T.redDim : isLow ? T.amberDim : T.greenDim;
  return (
    <span
      className="flex items-center gap-1 px-2 py-0.5 rounded-full"
      style={{ background: dimColor, fontSize: '11px', color, fontWeight: 600 }}
    >
      {isCritical ? '⚠ Out' : isLow ? '⚠ Low' : '✓ OK'}
    </span>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const isLow = product.stock <= product.minStock;
  const isCritical = product.stock === 0;
  const leftColor = isCritical ? T.red : isLow ? T.amber : T.blue;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl p-4 text-left active:scale-98 transition-all"
      style={{
        background: T.bgCard,
        border: `1px solid ${isLow ? (isCritical ? T.redDim : T.amberDim) : T.border}`,
        borderLeft: `3px solid ${leftColor}`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ width: 40, height: 40, background: T.bgElevated }}
      >
        <Droplets size={18} color={leftColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span style={{ color: T.textPrimary, fontSize: '14px', fontWeight: 600 }} className="truncate">
            {product.name}
          </span>
          <StockBadge product={product} />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span style={{ color: T.textSecondary, fontSize: '12px' }}>{product.brand}</span>
          <span style={{ color: T.textMuted, fontSize: '12px' }}>·</span>
          <span style={{ color: T.textSecondary, fontSize: '12px' }}>{product.oilType}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 700 }}>
          {product.stock}
        </div>
        <div style={{ color: T.textMuted, fontSize: '11px' }}>{product.unit}</div>
      </div>
      <ChevronRight size={16} color={T.textMuted} />
    </button>
  );
}

function SummaryCard({
  icon: Icon, label, value, sub, color, dimColor
}: {
  icon: any; label: string; value: string; sub?: string; color: string; dimColor: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
    >
      <div className="flex items-center justify-between">
        <span style={{ color: T.textSecondary, fontSize: '12px' }}>{label}</span>
        <div className="rounded-lg p-1.5" style={{ background: dimColor }}>
          <Icon size={14} color={color} />
        </div>
      </div>
      <div style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ color: T.textMuted, fontSize: '11px' }}>{sub}</div>}
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { products, getTodaysSales, getTotalStockValue, getTotalPendingKhata, getLowStockProducts } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const todaySales = getTodaysSales();
  const todayTotal = todaySales.reduce((a, s) => a + s.totalAmount, 0);
  const stockValue = getTotalStockValue();
  const pendingKhata = getTotalPendingKhata();
  const lowStock = getLowStockProducts();

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-4 pt-4 pb-3"
        style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-1.5" style={{ background: T.blueDim }}>
              <Droplets size={18} color={T.blueLight} />
            </div>
            <div>
              <h1 style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>
                Oil & Grease Exchange
              </h1>
              <p style={{ color: T.textMuted, fontSize: '11px' }}>{dateLabel}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-lg p-2"
            style={{ background: T.bgElevated, border: `1px solid ${T.border}` }}
          >
            <Settings size={18} color={T.textSecondary} />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            icon={Package} label="Total Products"
            value={String(products.length)} sub={`${lowStock.length} low stock`}
            color={T.blue} dimColor={T.blueDim}
          />
          <SummaryCard
            icon={Layers} label="Stock Value"
            value={stockValue >= 100000 ? `${(stockValue / 100000).toFixed(1)}L` : formatPKR(stockValue)}
            sub="purchase value"
            color={T.green} dimColor={T.greenDim}
          />
          <SummaryCard
            icon={TrendingUp} label="Today's Sales"
            value={todayTotal > 0 ? formatPKR(todayTotal) : 'Rs. 0'}
            sub={`${todaySales.length} bills`}
            color={T.green} dimColor={T.greenDim}
          />
          <SummaryCard
            icon={Clock} label="Pending Khata"
            value={pendingKhata > 0 ? formatPKR(pendingKhata) : 'Clear'}
            sub="total due amount"
            color={pendingKhata > 0 ? T.amber : T.green}
            dimColor={pendingKhata > 0 ? T.amberDim : T.greenDim}
          />
        </div>

        {/* Low Stock Alerts */}
        {lowStock.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} color={T.amber} />
              <span style={{ color: T.amber, fontSize: '13px', fontWeight: 600 }}>
                Low Stock Alerts ({lowStock.length})
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {lowStock.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: T.textSecondary, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              All Products
            </span>
            <button
              onClick={() => navigate('/products')}
              style={{ color: T.blueLight, fontSize: '13px', background: 'transparent', border: 'none' }}
            >
              Manage →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Bottom Sheet */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
            onClick={() => setSelectedProduct(null)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-5 md:max-w-lg md:left-auto md:right-4 md:bottom-4 md:rounded-2xl"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
          >
            {/* Handle */}
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-1 rounded-full mx-auto" style={{ background: T.border }}/>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{ background: T.bgElevated, border: 'none', borderRadius: '8px', padding: '6px', color: T.textSecondary }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded-xl flex items-center justify-center" style={{ width: 52, height: 52, background: T.bgElevated }}>
                <Droplets size={26} color={T.blueLight} />
              </div>
              <div>
                <h3 style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 700 }}>{selectedProduct.name}</h3>
                <p style={{ color: T.textSecondary, fontSize: '13px' }}>{selectedProduct.brand} · {selectedProduct.oilType}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Stock', value: `${selectedProduct.stock} ${selectedProduct.unit}`, color: selectedProduct.stock <= selectedProduct.minStock ? T.amber : T.green },
                { label: 'Sell Price', value: formatPKR(selectedProduct.price), color: T.textPrimary },
                { label: 'Min Stock', value: `${selectedProduct.minStock} ${selectedProduct.unit}`, color: T.textSecondary },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: T.bgElevated }}>
                  <div style={{ color, fontSize: '13px', fontWeight: 700 }}>{value}</div>
                  <div style={{ color: T.textMuted, fontSize: '11px', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { navigate(`/billing?product=${selectedProduct.id}`); setSelectedProduct(null); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5"
                style={{ background: T.blue, color: '#fff', border: 'none', fontWeight: 600, fontSize: '15px' }}
              >
                <Receipt size={18} />
                Create Bill
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { navigate(`/products?stock=${selectedProduct.id}`); setSelectedProduct(null); }}
                  className="flex items-center justify-center gap-2 rounded-xl py-3"
                  style={{ background: T.bgElevated, color: T.textPrimary, border: `1px solid ${T.border}`, fontWeight: 500, fontSize: '14px' }}
                >
                  <Package size={16} />
                  Add Stock
                </button>
                <button
                  onClick={() => { navigate('/reports'); setSelectedProduct(null); }}
                  className="flex items-center justify-center gap-2 rounded-xl py-3"
                  style={{ background: T.bgElevated, color: T.textPrimary, border: `1px solid ${T.border}`, fontWeight: 500, fontSize: '14px' }}
                >
                  <BarChart3 size={16} />
                  Reports
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
