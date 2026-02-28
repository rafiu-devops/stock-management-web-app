import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Package, Receipt, BookOpen, BarChart3, Settings, Droplets, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from './BottomNav';
import { T } from '../theme';

const sideNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Receipt, label: 'Billing', path: '/billing' },
  { icon: BookOpen, label: 'Khata', path: '/khata' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
];

export function Layout() {
  const { isAuthenticated, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }} className="flex">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60"
        style={{ background: T.bgCard, borderRight: `1px solid ${T.border}` }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ background: T.blueDim, width: 40, height: 40 }}
          >
            <Droplets size={22} color={T.blueLight} />
          </div>
          <div>
            <div style={{ color: T.textPrimary, fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>Oil & Grease</div>
            <div style={{ color: T.textMuted, fontSize: '11px' }}>Exchange</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 px-2">
          {sideNavItems.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-left"
                style={{
                  background: active ? T.blueDim : 'transparent',
                  color: active ? T.blueLight : T.textSecondary,
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-2 py-3" style={{ borderTop: `1px solid ${T.border}` }}>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
            style={{
              background: isActive('/settings') ? T.blueDim : 'transparent',
              color: isActive('/settings') ? T.blueLight : T.textSecondary,
              border: 'none',
              fontSize: '14px',
            }}
          >
            <Settings size={18} />
            Settings
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
            style={{ background: 'transparent', color: T.red, border: 'none', fontSize: '14px' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 min-h-screen" style={{ overflowX: 'hidden' }}>
        <div className="pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>
    </div>
  );
}
