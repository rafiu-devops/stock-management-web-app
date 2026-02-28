import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  LogOut, Download, Upload, Info, Shield, Droplets, ChevronRight,
  Bell, User, Database, Check, Sun, Moon, Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../theme';
import { db } from '../data/db';

export function SettingsPage() {
  const navigate = useNavigate();
  const {
    logout,
    products,
    sales,
    customers,
    khataTransactions,
    stockEntries,
    theme,
    toggleTheme
  } = useApp();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [backupDone, setBackupDone] = useState(false);
  const [restoreDone, setRestoreDone] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // ✅ BACKUP FROM DATABASE
  const handleBackup = async () => {
    const data = {
      exportDate: new Date().toISOString(),
      products: await db.products.toArray(),
      sales: await db.sales.toArray(),
      customers: await db.customers.toArray(),
      stockEntries: await db.stockEntries.toArray(),
      khataTransactions: await db.khataTransactions.toArray(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `oge-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);

    setBackupDone(true);
    setTimeout(() => setBackupDone(false), 3000);
  };

  // ✅ RESTORE DATABASE
  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Clear existing DB
      await db.products.clear();
      await db.sales.clear();
      await db.customers.clear();
      await db.stockEntries.clear();
      await db.khataTransactions.clear();

      // Restore
      if (data.products) await db.products.bulkAdd(data.products);
      if (data.sales) await db.sales.bulkAdd(data.sales);
      if (data.customers) await db.customers.bulkAdd(data.customers);
      if (data.stockEntries) await db.stockEntries.bulkAdd(data.stockEntries);
      if (data.khataTransactions) await db.khataTransactions.bulkAdd(data.khataTransactions);

      setRestoreDone(true);

      // Reload app state
      window.location.reload();

    } catch {
      alert("Invalid backup file");
    }
  };

  const stats = [
    { label: 'Products', value: products.length },
    { label: 'Sales Records', value: sales.length },
    { label: 'Customers', value: customers.length },
    { label: 'Khata Entries', value: khataTransactions.length },
  ];

  const SettingItem = ({
    icon: Icon, label, sub, onClick, danger = false, right
  }: {
    icon: any; label: string; sub?: string; onClick?: () => void; danger?: boolean; right?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 text-left"
      style={{ background: 'transparent', border: 'none' }}
    >
      <div
        className="rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ width: 40, height: 40, background: danger ? T.redDim : T.bgElevated }}
      >
        <Icon size={18} color={danger ? T.red : T.textSecondary} />
      </div>

      <div className="flex-1">
        <div style={{ color: danger ? T.red : T.textPrimary, fontSize: '15px' }}>{label}</div>
        {sub && <div style={{ color: T.textMuted, fontSize: '12px' }}>{sub}</div>}
      </div>

      {right || <ChevronRight size={16} color={T.textMuted} />}
    </button>
  );

  const ThemeToggle = () => {
    const isDark = theme === 'dark';
    return (
      <button
        onClick={toggleTheme}
        className="w-full flex items-center gap-4 px-4 py-4 text-left"
        style={{ background: 'transparent', border: 'none' }}
      >
        <div
          className="rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            width: 40,
            height: 40,
            background: isDark ? T.amberDim : T.blueDim
          }}
        >
          {isDark ? <Moon size={18} color={T.amber} /> : <Sun size={18} color={T.blue} />}
        </div>

        <div className="flex-1">
          <div style={{ color: T.textPrimary, fontSize: '15px' }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </div>
          <div style={{ color: T.textMuted, fontSize: '12px' }}>
            {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>

      <input
        type="file"
        accept="application/json"
        id="restoreInput"
        style={{ display: 'none' }}
        onChange={handleRestore}
      />

      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3"
        style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
        <h1 style={{ color: T.textPrimary, fontSize: '20px', fontWeight: 700 }}>
          Settings
        </h1>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">

        {/* Data Overview */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <div className="px-4 py-3"
            style={{ borderBottom: `1px solid ${T.border}` }}>
            <span style={{ color: T.textMuted, fontSize: '11px', textTransform: 'uppercase' }}>
              Data Overview
            </span>
          </div>

          <div className="grid grid-cols-2">
            {stats.map(({ label, value }) => (
              <div key={label} className="p-4"
                style={{ borderBottom: `1px solid ${T.border}` }}>
                <div style={{ color: T.textPrimary, fontSize: '22px', fontWeight: 700 }}>
                  {value}
                </div>
                <div style={{ color: T.textMuted, fontSize: '12px' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
          <ThemeToggle />
        </div>

        {/* Data Management */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>

          <div style={{ borderBottom: `1px solid ${T.border}` }}>
            <SettingItem
              icon={Download}
              label="Backup Data"
              sub="Export all data as JSON"
              onClick={handleBackup}
              right={
                backupDone
                  ? <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                      style={{ background: T.greenDim }}>
                      <Check size={12} color={T.green} />
                      <span style={{ color: T.green, fontSize: '11px' }}>Done</span>
                    </div>
                  : undefined
              }
            />
          </div>

          <div style={{ borderBottom: `1px solid ${T.border}` }}>
            <SettingItem
              icon={Upload}
              label="Restore Data"
              sub="Import backup JSON file"
              onClick={() => document.getElementById('restoreInput')?.click()}
              right={
                restoreDone
                  ? <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                      style={{ background: T.greenDim }}>
                      <Check size={12} color={T.green} />
                      <span style={{ color: T.green, fontSize: '11px' }}>Done</span>
                    </div>
                  : undefined
              }
            />
          </div>

          <SettingItem
            icon={Database}
            label="Storage"
            sub="Data saved locally on device"
          />
        </div>

        {/* Logout */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: T.bgCard, border: `1px solid ${T.redBorder}` }}>
          <SettingItem
            icon={LogOut}
            label="Logout"
            sub="Sign out of admin account"
            danger
            onClick={() => setShowLogoutConfirm(true)}
          />
        </div>

      </div>

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div style={{ background: T.bgCard, padding: 20, borderRadius: 12 }}>
            <p style={{ marginBottom: 12 }}>Confirm logout?</p>
            <button onClick={handleLogout}>Yes</button>
          </div>
        </div>
      )}
    </div>
  );
}