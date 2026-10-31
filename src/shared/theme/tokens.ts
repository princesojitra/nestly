// Direction A — "Quiet Ivory" (see docs/DESIGN_REVIEW.md, docs/DESIGN_SYSTEM.md)

export const colors = {
  background: '#F6F5F0',
  surface: '#FFFFFF',
  surfaceSoft: '#E8E5DC',
  surfaceDark: '#242923',
  accent: '#A4B39A',
  accentText: '#5E7254',
  accentTint: '#EEF1EA',
  text: '#242923',
  textMuted: 'rgba(36,41,35,0.6)',
  textMutedStrong: 'rgba(36,41,35,0.55)',
  line: '#ECE9DF',
  lineStrong: '#E3E0D5',
  onDark: '#F6F5F0',
  danger: '#B3554B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
  pill: 999,
} as const;

// TODO: swap the system font for Fraunces (display) / Inter (body) once the
// font files are sourced and linked via react-native.config.js assets.
export const typography = {
  display: { fontSize: 26, fontWeight: '600' as const },
  title: { fontSize: 22, fontWeight: '600' as const },
  subtitle: { fontSize: 18, fontWeight: '500' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
} as const;

export type TypographyVariant = keyof typeof typography;
