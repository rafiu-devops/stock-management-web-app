// All values are CSS custom properties so they automatically respond to dark/light theme
// switching via the [data-theme="light"] selector on <html>.
export const T = {
  bg:              'var(--t-bg)',
  bgCard:          'var(--t-bg-card)',
  bgElevated:      'var(--t-bg-elevated)',
  bgInput:         'var(--t-bg)',
  border:          'var(--t-border)',
  borderLight:     'var(--t-border-light)',

  blue:            'var(--t-blue)',
  blueLight:       'var(--t-blue-light)',
  blueDim:         'var(--t-blue-dim)',
  blueDimHover:    'var(--t-blue-dim-hover)',
  blueBorder:      'var(--t-blue-border)',

  green:           'var(--t-green)',
  greenLight:      'var(--t-green-light)',
  greenDim:        'var(--t-green-dim)',
  greenBorder:     'var(--t-green-border)',

  amber:           'var(--t-amber)',
  amberLight:      'var(--t-amber-light)',
  amberDim:        'var(--t-amber-dim)',
  amberBorder:     'var(--t-amber-border)',

  red:             'var(--t-red)',
  redLight:        'var(--t-red-light)',
  redDim:          'var(--t-red-dim)',
  redBorder:       'var(--t-red-border)',

  textPrimary:     'var(--t-text-primary)',
  textSecondary:   'var(--t-text-secondary)',
  textMuted:       'var(--t-text-muted)',
};

export const formatPKR = (amount: number): string =>
  `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const todayStr = (): string => new Date().toISOString().split('T')[0];

export const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};
