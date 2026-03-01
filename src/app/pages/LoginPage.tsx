import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Droplets, Eye, EyeOff, AlertCircle, KeyRound, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../theme';

type FPStep = 'verify' | 'reset' | 'done';

function ForgotPasswordSheet({ onClose, changePassword }: { onClose: () => void; changePassword: (p: string) => void }) {
  const [step, setStep] = useState<FPStep>('verify');
  const [username, setUsername] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');

  const inputStyle: React.CSSProperties = {
    background: T.bgElevated,
    border: `1px solid ${T.border}`,
    color: T.textPrimary,
    borderRadius: '10px',
    padding: '13px 16px',
    fontSize: '15px',
    width: '100%',
    outline: 'none',
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (username.trim().toLowerCase() !== 'admin') {
      setError('Username not found. Only the admin account can reset the password.');
      return;
    }
    setStep('reset');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPw.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setError('Passwords do not match.');
      return;
    }
    changePassword(newPw);
    setStep('done');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl md:max-w-sm md:mx-auto"
        style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: T.border }} />
        </div>

        <div className="px-6 pb-8 pt-2">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            {step !== 'done' && (
              <button
                onClick={step === 'verify' ? onClose : () => setStep('verify')}
                style={{ background: T.bgElevated, border: 'none', borderRadius: '8px', padding: 7, color: T.textSecondary }}
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="flex-1">
              <h3 style={{ color: T.textPrimary, fontSize: '17px', fontWeight: 700, margin: 0 }}>
                {step === 'verify' && 'Forgot Password'}
                {step === 'reset' && 'Set New Password'}
                {step === 'done' && 'Password Updated'}
              </h3>
              <p style={{ color: T.textSecondary, fontSize: '12px', margin: '3px 0 0' }}>
                {step === 'verify' && 'Verify your admin username'}
                {step === 'reset' && 'Choose a strong new password'}
                {step === 'done' && 'Your password has been changed'}
              </p>
            </div>
          </div>

          {/* Step indicator */}
          {step !== 'done' && (
            <div className="flex gap-2 mb-6">
              {(['verify', 'reset'] as FPStep[]).map((s, i) => (
                <div
                  key={s}
                  className="flex-1 rounded-full"
                  style={{
                    height: 3,
                    background: step === 'verify' && i === 0 ? T.blue :
                      step === 'reset' ? T.blue :
                      T.bgElevated,
                  }}
                />
              ))}
            </div>
          )}

          {/* STEP 1: Verify username */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex items-center justify-center mb-2">
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{ width: 64, height: 64, background: T.blueDim, border: `1px solid ${T.blueBorder}` }}
                >
                  <KeyRound size={28} color={T.blueLight} strokeWidth={1.5} />
                </div>
              </div>
              <p style={{ color: T.textSecondary, fontSize: '13px', textAlign: 'center', marginBottom: 4 }}>
                Enter your admin username to verify your identity and reset the password.
              </p>
              <div>
                <label style={{ color: T.textSecondary, fontSize: '13px', display: 'block', marginBottom: 8 }}>
                  Admin Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  style={inputStyle}
                  autoComplete="username"
                  required
                />
              </div>
              {error && (
                <div className="flex items-start gap-2 rounded-lg px-3 py-3" style={{ background: T.redDim, border: `1px solid ${T.redBorder}` }}>
                  <AlertCircle size={15} color={T.red} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ color: T.red, fontSize: '13px' }}>{error}</span>
                </div>
              )}
              <button
                type="submit"
                style={{
                  background: T.blue, color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 600,
                  cursor: 'pointer', marginTop: 4,
                }}
              >
                Verify Username
              </button>
            </form>
          )}

          {/* STEP 2: Set new password */}
          {step === 'reset' && (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div className="flex items-center justify-center mb-2">
                <div
                  className="flex items-center justify-center rounded-2xl"
                  style={{ width: 64, height: 64, background: T.amberDim, border: `1px solid ${T.amberBorder}` }}
                >
                  <Lock size={28} color={T.amber} strokeWidth={1.5} />
                </div>
              </div>

              <div>
                <label style={{ color: T.textSecondary, fontSize: '13px', display: 'block', marginBottom: 8 }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPw(v => !v)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', padding: 4 }}>
                    {showNewPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ color: T.textSecondary, fontSize: '13px', display: 'block', marginBottom: 8 }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Repeat password"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPw(v => !v)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', padding: 4 }}>
                    {showConfirmPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Strength hint */}
              {newPw.length > 0 && (
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map(n => (
                    <div
                      key={n}
                      className="flex-1 rounded-full"
                      style={{
                        height: 3,
                        background: newPw.length >= n * 3
                          ? newPw.length >= 10 ? T.green : newPw.length >= 6 ? T.amber : T.red
                          : T.bgElevated,
                        transition: 'background 0.2s',
                      }}
                    />
                  ))}
                  <span style={{ color: T.textMuted, fontSize: '11px', marginLeft: 4 }}>
                    {newPw.length < 6 ? 'Weak' : newPw.length < 10 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 rounded-lg px-3 py-3" style={{ background: T.redDim, border: `1px solid ${T.redBorder}` }}>
                  <AlertCircle size={15} color={T.red} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ color: T.red, fontSize: '13px' }}>{error}</span>
                </div>
              )}

              <button
                type="submit"
                style={{
                  background: T.green, color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 600,
                  cursor: 'pointer', marginTop: 4,
                }}
              >
                Update Password
              </button>
            </form>
          )}

          {/* STEP 3: Done */}
          {step === 'done' && (
            <div className="flex flex-col items-center text-center gap-4">
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 72, height: 72, background: T.greenDim, border: `1px solid ${T.greenBorder}` }}
              >
                <CheckCircle2 size={36} color={T.green} />
              </div>
              <div>
                <p style={{ color: T.textPrimary, fontSize: '16px', fontWeight: 600, marginBottom: 6 }}>
                  Password Changed!
                </p>
                <p style={{ color: T.textSecondary, fontSize: '13px' }}>
                  Your new password has been saved. You can now log in with it.
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: T.blue, color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 600,
                  cursor: 'pointer', width: '100%', marginTop: 8,
                }}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function LoginPage() {
  const { login, isAuthenticated, changePassword } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPw, setShowForgotPw] = useState(false);

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(username.trim(), password);
    if (ok) {
      navigate('/', { replace: true });
    } else {
      setError('Invalid username or password. Check credentials or use Forgot Password.');
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: T.bgElevated,
    border: `1px solid ${T.border}`,
    color: T.textPrimary,
    borderRadius: '10px',
    padding: '14px 16px',
    fontSize: '15px',
    width: '100%',
    outline: 'none',
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ background: T.bg }}
    >
      {/* Background accent */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% -10%, rgba(59,143,255,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="flex items-center justify-center mb-4"
            style={{
              width: 80, height: 80, borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(59,143,255,0.2), rgba(59,143,255,0.08))',
              border: `1px solid ${T.blueBorder}`,
            }}
          >
            <Droplets size={40} color={T.blueLight} strokeWidth={1.5} />
          </div>
          <h1 style={{ color: T.textPrimary, fontSize: '22px', fontWeight: 700, marginBottom: 4 }}>
            Oil & Grease Exchange
          </h1>
          <p style={{ color: T.textSecondary, fontSize: '13px' }}>Shop Management System</p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
        >
          <h2 style={{ color: T.textPrimary, fontSize: '18px', fontWeight: 600, marginBottom: 20 }}>
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label style={{ color: T.textSecondary, fontSize: '13px', display: 'block', marginBottom: 8 }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                style={inputStyle}
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label style={{ color: T.textSecondary, fontSize: '13px' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPw(true)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: T.blueLight, fontSize: '12px', cursor: 'pointer', padding: 0,
                    fontWeight: 500,
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: '48px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', color: T.textMuted, cursor: 'pointer', padding: 4,
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 rounded-lg px-4 py-3"
                style={{ background: T.redDim, border: `1px solid ${T.redBorder}` }}
              >
                <AlertCircle size={15} color={T.red} style={{ marginTop: 1, flexShrink: 0 }} />
                <span style={{ color: T.red, fontSize: '13px' }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? T.blueDim : T.blue,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ color: T.textMuted, fontSize: '12px', textAlign: 'center', marginTop: 24 }}>
          © 2026 Oil & Grease Exchange. All rights reserved.
        </p>
      </div>

      {/* Forgot Password Sheet */}
      {showForgotPw && (
        <ForgotPasswordSheet
          onClose={() => setShowForgotPw(false)}
          changePassword={changePassword}
        />
      )}
    </div>
  );
}
