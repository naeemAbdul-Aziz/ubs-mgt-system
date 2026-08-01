import React from 'react';
import { createTheme, ThemeOptions } from '@mui/material/styles';

// ─── SOFT MATERIAL DESIGN SYSTEM THEME ─────────────────────────────────────
export const softMaterialThemeConfig: ThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default: '#F8F9FA', // Light Gray background per spec
      paper: '#FFFFFF',   // Pure White cards
    },
    primary: {
      main: '#1E1B4B',    // Deep Navy
      light: '#312E81',
      dark: '#0F172A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4F46E5',    // Indigo Accent
      light: '#6366F1',
      dark: '#3730A3',
    },
    success: {
      main: '#10B981',    // Emerald Green
      light: '#D1FAE5',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',    // Amber
      light: '#FEF3C7',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',    // Rose Crimson
      light: '#FEE2E2',
      dark: '#DC2626',
    },
    text: {
      primary: '#1E293B',   // Slate Dark
      secondary: '#64748B', // Slate Muted
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#1E293B',
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      color: '#1E293B',
      fontSize: '1.35rem',
    },
    h6: {
      fontWeight: 600,
      color: '#1E293B',
      fontSize: '1.1rem',
    },
    subtitle1: {
      color: '#64748B',
      fontSize: '0.95rem',
    },
    body1: {
      fontSize: '0.925rem',
      color: '#334155',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(15, 23, 42, 0.05)',
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 18px',
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(30, 27, 75, 0.2)',
          '&:hover': {
            boxShadow: '0px 4px 10px rgba(30, 27, 75, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
  },
};

export const theme = createTheme(softMaterialThemeConfig);

// ─── REUSABLE UI COMPONENTS ─────────────────────────────────────────────────

export interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const getStatusType = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
  const upper = status.toUpperCase();
  if (['ENROLLED', 'PRESENT', 'PAID', 'DELIVERED', 'ACTIVE', 'PROMOTE'].includes(upper)) return 'success';
  if (['PARTIAL', 'LATE', 'PENDING', 'REPEAT'].includes(upper)) return 'warning';
  if (['ABSENT', 'OVERDUE', 'FAILED', 'WITHDRAWN', 'SUSPENDED'].includes(upper)) return 'error';
  if (['GRADUATED', 'SYSTEM'].includes(upper)) return 'info';
  return 'neutral';
};

export const statusColors = {
  success: { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
  warning: { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  error: { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' },
  info: { bg: '#E0F2FE', color: '#075985', border: '#BAE6FD' },
  neutral: { bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  const badgeType = type || getStatusType(status);
  const colors = statusColors[badgeType];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '16px',
        fontSize: '0.75rem',
        fontWeight: 600,
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};
