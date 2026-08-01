'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Lock,
  User,
  Shield,
  BookOpen,
  Calculator,
  Users,
  ChevronRight,
} from 'lucide-react';
import { AuthAPI } from '@ubs-lmis/api-client';

// ─── Color constants (dashboard palette only) ─────────────────────────────────
const C = {
  navy:      '#070235',
  navyMid:   '#1E1B4B',
  navyLight: '#2D2A6E',
  indigo:    '#4F46E5',
  indigoSoft:'#645EFB',
  gold:      '#D4AF37',
  white:     '#FFFFFF',
  bg:        '#F8FAFC',
  border:    '#E2E8F0',
  textMain:  '#0F172A',
  textSub:   '#64748B',
  textMuted: '#94A3B8',
};

// ─── Actor Definitions ────────────────────────────────────────────────────────
interface Actor {
  label: string;
  username: string;
  role: string;
  icon: React.ElementType;
  description: string;
}

const ACTORS: Actor[] = [
  {
    label: 'Head of School',
    username: 'kwame.osei',
    role: 'HEAD_OF_SCHOOL',
    icon: Shield,
    description: 'Full admin access — approvals, reports, all modules',
  },
  {
    label: 'Accountant',
    username: 'kojo.appiah',
    role: 'ACCOUNTANT',
    icon: Calculator,
    description: 'Fee schedules, invoices, payments, financial reports',
  },
  {
    label: 'Teacher',
    username: 'ama.mensah',
    role: 'TEACHER',
    icon: GraduationCap,
    description: 'Attendance, scores, class roster, own dashboard',
  },
  {
    label: 'Guardian',
    username: 'samuel.frimpong',
    role: 'GUARDIAN',
    icon: Users,
    description: 'View wards: results, fees, attendance, announcements',
  },
  {
    label: 'Student',
    username: 'STD-26-001',
    role: 'STUDENT',
    icon: BookOpen,
    description: 'Yaw Frimpong — personal dashboard, results, fees',
  },
];

// ─── Page Component ────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('kwame.osei');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActors, setShowActors] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both username and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await AuthAPI.login(username, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Invalid username or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fillActor = (actor: Actor) => {
    setUsername(actor.username);
    setPassword('Password123');
    setError(null);
    setShowActors(false);
  };

  return (
    <Box style={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── Left Panel: Branding (true 50%) ──────────────────────────────── */}
      <Box
        sx={{ display: { xs: 'none', md: 'flex' }, width: '50%', flexShrink: 0 }}
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 56px',
          position: 'relative',
          overflow: 'hidden',
          // login.png as full-cover background
          backgroundImage: 'url(/login.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* ── Cinematic overlay stack ────────────────────────────────────── */}
        {/* Layer 1: overall dark veil — neutral black instead of navy to avoid blue tint */}
        <Box style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundColor: 'rgba(0,0,0,0.40)',
        }} />
        {/* Layer 2: strong bottom-up gradient — legible text zone, using neutral darks */}
        <Box style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.70) 35%, rgba(0,0,0,0.20) 70%, transparent 100%)',
        }} />
        {/* Layer 3: left-edge darkening — frames the content column */}
        <Box style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 60%)',
        }} />
        {/* Layer 4: subtle gold bloom to add warmth without blue cast */}
        <Box style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* ── Top: Logo + Headline ─────────────────────────── */}
        <Box style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo pill */}
          <Box style={{
            display: 'inline-flex', alignItems: 'center', gap: '14px',
            marginBottom: '56px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '16px',
            padding: '12px 20px 12px 14px',
            backdropFilter: 'blur(12px)',
          }}>
            <Box style={{
              width: '40px', height: '40px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <img src="/logo.png" alt="UBS Crest" style={{ height: '26px', width: '26px', objectFit: 'contain' }} />
            </Box>
            <Box>
              <Typography style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 700,
                color: C.white, fontSize: '0.85rem', letterSpacing: '0.06em',
                textTransform: 'uppercase', lineHeight: 1.2,
              }}>
                University Basic School
              </Typography>
              <Typography style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                color: C.gold, fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', marginTop: '3px',
              }}>
                School Management System
              </Typography>
            </Box>
          </Box>

          {/* Headline */}
          <Typography style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            fontSize: '2.8rem',
            lineHeight: 1.15,
            color: C.white,
            maxWidth: '400px',
            marginBottom: '20px',
          }}>
            Empowering the next generation of African excellence.
          </Typography>

          <Typography style={{
            fontFamily: 'Inter, sans-serif',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.75,
            maxWidth: '360px',
            fontSize: '0.95rem',
          }}>
            A unified digital platform for academic management, student welfare, and institutional excellence.
          </Typography>


        </Box>

        {/* ── Bottom: Role pills ───────────────────────────── */}
        <Box style={{ position: 'relative', zIndex: 1 }}>
          <Typography style={{
            fontFamily: 'Inter, sans-serif',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            Serving all school stakeholders
          </Typography>
          <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Head of School', 'Teacher', 'HOD', 'Accountant', 'Librarian', 'Nurse', 'Guardian', 'Student'].map((role) => (
              <Box key={role} style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '9999px', padding: '4px 14px',
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)',
                fontFamily: 'Inter, sans-serif', fontWeight: 500,
              }}>
                {role}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Right Panel: Login Form (true 50%) ───────────────────────────── */}
      <Box style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 40px',
        backgroundColor: C.bg,
        minHeight: '100vh',
      }}>
        <Box style={{ width: '100%', maxWidth: '440px' }}>

          {/* Mobile-only logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <img src="/logo.png" alt="UBS" style={{ height: '32px' }} />
            <Typography style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: C.navyMid, fontSize: '1rem' }}>
              UBS · School Portal
            </Typography>
          </Box>

          {/* Form header */}
          <Box style={{ marginBottom: '40px' }}>
            <Typography style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700, fontSize: '2.1rem',
              color: C.textMain, marginBottom: '8px', lineHeight: 1.2,
            }}>
              Welcome back
            </Typography>
            <Typography style={{
              fontFamily: 'Inter, sans-serif',
              color: C.textSub, fontSize: '0.95rem', lineHeight: 1.6,
            }}>
              Sign in to your UBS-LMIS portal account.
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" style={{ marginBottom: '24px', borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <TextField
                label="Username / Student ID"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color={C.textMuted} />
                      </InputAdornment>
                    ),
                    style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px', fontSize: '0.95rem', backgroundColor: C.white },
                  },
                  inputLabel: { style: { fontFamily: 'Inter, sans-serif' } },
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color={C.textMuted} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={18} color={C.textMuted} /> : <Eye size={18} color={C.textMuted} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px', fontSize: '0.95rem', backgroundColor: C.white },
                  },
                  inputLabel: { style: { fontFamily: 'Inter, sans-serif' } },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                style={{
                  backgroundColor: C.navy,
                  color: C.white,
                  padding: '15px',
                  borderRadius: '9999px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: `0 8px 32px rgba(7,2,53,0.28)`,
                  marginTop: '6px',
                  letterSpacing: '0.01em',
                }}
              >
                {loading ? <CircularProgress size={22} style={{ color: C.white }} /> : 'Sign In to Portal'}
              </Button>
            </Box>
          </form>

          {/* ─── Actor Switcher ─────────────────────────────────────────── */}
          <Box style={{
            marginTop: '28px',
            backgroundColor: C.white,
            borderRadius: '16px',
            border: `1px solid ${C.border}`,
            boxShadow: '0 4px 20px rgba(7,2,53,0.06)',
            overflow: 'hidden',
          }}>
            {/* Header row */}
            <Box
              onClick={() => setShowActors(!showActors)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                cursor: 'pointer', userSelect: 'none',
                borderBottom: showActors ? `1px solid ${C.border}` : 'none',
                transition: 'background 0.15s',
              }}
              sx={{ '&:hover': { backgroundColor: C.bg } }}
            >
              <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Box style={{
                  width: 7, height: 7, borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  boxShadow: '0 0 6px rgba(34,197,94,0.7)',
                  flexShrink: 0,
                }} />
                <Typography style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: C.textMain, fontSize: '0.85rem' }}>
                  Quick Login — Test Accounts
                </Typography>
                <Chip
                  label="Password123"
                  size="small"
                  style={{ backgroundColor: '#F0FDF4', color: '#15803D', fontWeight: 700, fontSize: '0.65rem', height: 18 }}
                />
              </Box>
              <ChevronRight
                size={17} color={C.textMuted}
                style={{ transform: showActors ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
              />
            </Box>

            {/* Actor list */}
            {showActors && (
              <Box style={{ maxHeight: '440px', overflowY: 'auto' }}>
                {ACTORS.map((actor) => {
                  const Icon = actor.icon;
                  const isSelected = username === actor.username;
                  return (
                    <Box
                      key={actor.username}
                      onClick={() => fillActor(actor)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 20px',
                        cursor: 'pointer',
                        borderBottom: `1px solid ${C.border}`,
                        backgroundColor: isSelected ? 'rgba(79,70,229,0.05)' : 'transparent',
                        transition: 'background-color 0.12s',
                        '&:hover': { backgroundColor: 'rgba(79,70,229,0.04)' },
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      {/* Icon box */}
                      <Box style={{
                        width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                        backgroundColor: isSelected ? 'rgba(79,70,229,0.10)' : C.bg,
                        border: isSelected ? `1.5px solid ${C.indigo}` : `1.5px solid ${C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        <Icon size={17} color={isSelected ? C.indigo : C.textSub} />
                      </Box>

                      {/* Info */}
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <Typography style={{
                            fontFamily: 'Inter, sans-serif', fontWeight: 700,
                            color: C.textMain, fontSize: '0.83rem', lineHeight: 1,
                          }}>
                            {actor.label}
                          </Typography>
                          <Chip
                            label={actor.role}
                            size="small"
                            style={{
                              backgroundColor: isSelected ? 'rgba(79,70,229,0.10)' : C.bg,
                              color: isSelected ? C.indigo : C.textSub,
                              fontWeight: 700, fontSize: '0.6rem', height: 17,
                              border: `1px solid ${isSelected ? C.indigo : C.border}`,
                            }}
                          />
                        </Box>
                        <Typography style={{
                          fontFamily: 'Inter, sans-serif',
                          color: C.textSub, fontSize: '0.73rem', lineHeight: 1.35,
                        }}>
                          <code style={{
                            backgroundColor: C.bg, padding: '1px 6px',
                            borderRadius: '5px', fontSize: '0.7rem', color: C.navyMid,
                            border: `1px solid ${C.border}`,
                          }}>
                            {actor.username}
                          </code>
                          {' — '}{actor.description}
                        </Typography>
                      </Box>

                      {/* Selected dot */}
                      {isSelected && (
                        <Box style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.indigo, flexShrink: 0 }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* ─── Dev Tools (Seeding) ──────────────────────────────────────── */}
          <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <Button
              variant="text"
              onClick={async () => {
                const { DevAPI } = await import('@ubs-lmis/api-client');
                const prev = document.body.style.cursor;
                document.body.style.cursor = 'wait';
                try {
                  await DevAPI.seedDatabase();
                  alert('Database seeded successfully! You can now log in.');
                } catch (e: any) {
                  alert('Failed to seed database: ' + (e.response?.data?.error || e.message));
                } finally {
                  document.body.style.cursor = prev;
                }
              }}
              style={{
                color: C.textSub,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                textTransform: 'none',
              }}
              startIcon={<Shield size={14} />}
            >
              Initialize Database (Dev)
            </Button>
          </Box>

          {/* Footer */}
          <Typography style={{
            textAlign: 'center', marginTop: '28px',
            fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
            color: C.textMuted,
          }}>
            © {new Date().getFullYear()} Draka Labs · UBS-LMIS Platform · All rights reserved
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
