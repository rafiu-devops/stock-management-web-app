import { useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, Package, Receipt, BookOpen, BarChart3 } from 'lucide-react';
import { T } from '../theme';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Receipt, label: 'Billing', path: '/billing' },
  { icon: BookOpen, label: 'Khata', path: '/khata' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div
      style={{
        background: T.bgCard,
        borderTop: `1px solid ${T.border}`,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      className="flex items-stretch"
    >
      {navItems.map(({ icon: Icon, label, path }) => {
        const active = isActive(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all active:scale-95"
            style={{
              minHeight: '56px',
              color: active ? T.blueLight : T.textMuted,
              background: 'transparent',
              border: 'none',
            }}
          >
            <div
              style={{
                background: active ? T.blueDim : 'transparent',
                borderRadius: '8px',
                padding: '4px 10px',
                transition: 'background 0.2s',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400, lineHeight: 1 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
