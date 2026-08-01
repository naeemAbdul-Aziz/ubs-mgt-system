'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Paper,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck,
  Megaphone,
  FileSpreadsheet,
  Award,
  CreditCard,
  Receipt,
  TrendingUp,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

const EXPANDED_DRAWER_WIDTH = 272;
const COLLAPSED_DRAWER_WIDTH = 80;

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/students', icon: Users },
  { label: 'Staff', href: '/staff', icon: UserCheck },
  { label: 'Academic Setup', href: '/academics', icon: BookOpen },
  { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { label: 'Announcements', href: '/communication', icon: Megaphone },
  { label: 'Assessment', href: '/results', icon: FileSpreadsheet },
  { label: 'Reports', href: '/results/report-cards', icon: Award },
  { label: 'School Fees', href: '/fees', icon: CreditCard },
  { label: 'Payment Entry', href: '/fees/payments', icon: Receipt },
  { label: 'Staff Payroll', href: '/payroll', icon: Wallet },
  { label: 'Progression', href: '/progression', icon: TrendingUp },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { userProfile, loading, logout } = useAuth();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  const mustChangePassword = (userProfile?.mustChangePassword || false) && !bannerDismissed;

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleProfileClose();
    await logout();
  };

  const allowedNavItems = navItems.filter((item) => {
    if (loading || !userProfile) return false;

    // Everyone sees Dashboard
    if (item.href === '/dashboard') return true;

    const perms = userProfile.permissions || [];
    const personType = userProfile.personType;

    // ── STUDENTS ────────────────────────────────────────────────────────────────
    // Per screen catalog: Dashboard, My Subjects (/academics), My Report Card
    // (/results/report-cards), My Fees (/fees), Announcements (/communication),
    // My Attendance (/attendance)
    if (personType === 'STUDENT') {
      return ['/academics', '/results/report-cards', '/fees', '/communication', '/attendance'].includes(item.href);
    }

    // ── GUARDIANS ────────────────────────────────────────────────────────────────
    // Per screen catalog: Dashboard, Report Cards (ward), Announcements
    // Fees and Attendance are accessed via dashboard ward cards, not top-level nav
    if (personType === 'GUARDIAN') {
      return ['/results/report-cards', '/communication'].includes(item.href);
    }

    // ── STAFF ────────────────────────────────────────────────────────────────────
    if (personType !== 'STAFF') return false;

    // Determine role tier from permission set (permission-based RBAC — not role name)

    // Tier 1: Full admins — SYSTEM_ADMIN, HEAD_OF_SCHOOL, SCHOOL_ADMIN
    // Marker perms: ACCOUNT_CREATE (SYSTEM_ADMIN), ACADEMIC_YEAR_CREATE (HEAD/SCH_ADMIN)
    const isFullAdmin =
      perms.includes('ACCOUNT_CREATE') ||
      perms.includes('ACADEMIC_YEAR_CREATE') ||
      perms.includes('STUDENT_CREATE');

    if (isFullAdmin) {
      // All nav items visible — admins see everything
      return true;
    }

    // Tier 2: ACCOUNTANT — finance only
    // Marker: FEE_SCHEDULE_MANAGE or BILLING_RUN_EXECUTE or PAYMENT_RECORD
    const isAccountant =
      perms.includes('FEE_SCHEDULE_MANAGE') ||
      perms.includes('BILLING_RUN_EXECUTE') ||
      perms.includes('INVOICE_VIEW') ||
      perms.includes('PAYMENT_RECORD');

    if (isAccountant) {
      return ['/fees', '/fees/payments', '/payroll'].includes(item.href);
    }

    // Tier 3: TEACHER / HOD
    // Marker: ATTENDANCE_MARK or SCORE_ENTER
    const isTeacherOrHod =
      perms.includes('ATTENDANCE_MARK') ||
      perms.includes('SCORE_ENTER') ||
      perms.includes('RESULT_APPROVE') ||  // HOD extra
      perms.includes('ATTENDANCE_VIEW');

    if (isTeacherOrHod) {
      // Per screen catalog: Attendance, Assessment (/results), Report Cards,
      // Announcements (/communication). Students & Staff are read-only but still shown.
      return [
        '/attendance',
        '/results',
        '/results/report-cards',
        '/communication',
        '/students',  // read-only access to class roster
        '/staff',     // read-only self-view
      ].includes(item.href);
    }

    // Tier 4: LIBRARIAN / NURSE (Phase 2 stubs — dashboard only, already covered above)
    return false;
  });

  const drawerWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : EXPANDED_DRAWER_WIDTH;

  const drawerContent = (
    <Box
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FDFDFC',
        borderRight: '1px solid #E2E8F0',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header Row */}
      <Box
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          overflow: 'hidden',
        }}
      >
        {!isCollapsed ? (
          <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
            <img
              src="/logo.png"
              alt="School Logo"
              style={{ height: '36px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
            />
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              UBS Portal
            </Typography>
          </Box>
        ) : (
          <img
            src="/logo.png"
            alt="School Logo"
            style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
          />
        )}
      </Box>

      {/* Navigation Links */}
      <Box style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {allowedNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' &&
                item.href !== '/results' &&
                item.href !== '/fees' &&
                pathname.startsWith(item.href));
            const Icon = item.icon;

            // Contextual labels per role
            const isStudentUser = userProfile?.personType === 'STUDENT';
            const isGuardianUser = userProfile?.personType === 'GUARDIAN';

            const displayLabel = isStudentUser
              ? item.href === '/academics'
                ? 'My Subjects'
                : item.href === '/communication'
                ? 'Announcements'
                : item.href === '/results/report-cards'
                ? 'My Report Card'
                : item.href === '/fees'
                ? 'My Fees'
                : item.href === '/attendance'
                ? 'My Attendance'
                : item.label
              : isGuardianUser
              ? item.href === '/communication'
                ? 'Announcements'
                : item.href === '/results/report-cards'
                ? 'Ward Report Cards'
                : item.label
              : item.label;

            const navItemElement = (
              <Box
                key={item.href}
                onClick={() => router.push(item.href)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: isCollapsed ? '12px 0' : '12px 16px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#F1F5F9' : 'transparent',
                  color: isActive ? '#0F172A' : '#64748B',
                  transition: 'background-color 0.15s ease-in-out',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Active Indicator Strip */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '20px',
                      width: '3.5px',
                      backgroundColor: '#0F172A',
                      borderRadius: '0 4px 4px 0',
                    }}
                  />
                )}

                <Box style={{ width: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: isCollapsed ? 0 : '14px' }}>
                  <Icon size={20} color={isActive ? '#0F172A' : '#64748B'} />
                </Box>

                <Typography
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    whiteSpace: 'nowrap',
                    opacity: isCollapsed ? 0 : 1,
                    transition: 'opacity 0.15s ease-in-out',
                    overflow: 'hidden',
                  }}
                >
                  {displayLabel}
                </Typography>
              </Box>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} title={item.label} placement="right" arrow>
                  {navItemElement}
                </Tooltip>
              );
            }

            return navItemElement;
          })}
        </Box>
      </Box>

      {/* Bottom Profile / Settings */}
      <Box style={{ paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
        <Box
          onClick={handleProfileClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            cursor: 'pointer',
            padding: isCollapsed ? '8px 0' : '8px 16px',
            borderRadius: '12px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          <Avatar
            style={{ width: 38, height: 38, flexShrink: 0, marginRight: isCollapsed ? 0 : '12px', backgroundColor: '#E0E7FF', color: '#1E1B4B', fontWeight: 600, fontSize: '0.85rem' }}
          >
            {userProfile?.username?.substring(0, 2).toUpperCase() || 'HA'}
          </Avatar>

          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              opacity: isCollapsed ? 0 : 1,
              transition: 'opacity 0.15s ease-in-out',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>
              {userProfile?.username || 'Administrator'}
            </Typography>
            <Typography variant="caption" style={{ color: '#64748B', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
              {userProfile?.personType || 'Role Loading...'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF', width: '100%' }}>
      {/* TopAppBar Navigation */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: `${drawerWidth}px`,
          height: '80px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          zIndex: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 48px',
          width: `calc(100% - ${drawerWidth}px)`,
          transition: 'left 0.22s cubic-bezier(0.4, 0, 0.2, 1), width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', gap: '24px', width: '360px' }}>
          {/* Search Input */}
          <Paper
            elevation={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '9999px',
              padding: '4px 16px',
              width: '100%',
              border: '1px solid #E2E8F0',
            }}
          >
            <Search size={18} color="#64748B" />
            <InputBase
              placeholder="Search student or ID..."
              style={{
                marginLeft: '10px',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                width: '100%',
              }}
            />
          </Paper>
        </Box>

        <Box style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box
            style={{
              backgroundColor: '#F1F5F9',
              borderRadius: '9999px',
              padding: '6px 16px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#0F172A',
            }}
          >
            Term 3, 2023/24
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #E2E8F0', paddingLeft: '24px' }}>
            <Tooltip title="Notifications">
              <IconButton style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Bell size={18} color="#64748B" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Help Center">
              <IconButton style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <HelpCircle size={18} color="#64748B" />
              </IconButton>
            </Tooltip>

            <Avatar
              onClick={handleProfileClick}
              style={{
                width: 40,
                height: 40,
                cursor: 'pointer',
                border: '1px solid #E2E8F0',
                backgroundColor: '#E0E7FF',
                color: '#1E1B4B',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {userProfile?.username?.substring(0, 2).toUpperCase() || 'KW'}
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              slotProps={{
                paper: {
                  elevation: 3,
                  style: { marginTop: '8px', borderRadius: '12px', minWidth: '180px' },
                }
              }}
            >
              <MenuItem onClick={handleLogout} style={{ color: '#EF4444', gap: '10px', fontWeight: 500 }}>
                <LogOut size={16} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </header>

      {/* Left Drawer Navigation */}
      <Box
        component="nav"
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        style={{ width: drawerWidth, flexShrink: 0, transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        style={{
          flexGrow: 1,
          paddingTop: '112px',
          paddingLeft: '48px',
          paddingRight: '48px',
          paddingBottom: '64px',
          backgroundColor: '#FFFFFF',
          minHeight: '100vh',
          boxSizing: 'border-box',
          width: '0', // Flex will grow this
          maxWidth: '1600px',
          margin: '0 auto',
        }}
      >
        {/* First-Login Password Change Banner */}
        {mustChangePassword && (
          <Alert
            severity="warning"
            onClose={() => setBannerDismissed(true)}
            style={{
              marginBottom: '24px',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            }}
          >
            <strong>Action Required:</strong> You are using a temporary password. Please change your password as soon as possible to secure your account.
          </Alert>
        )}
        {children}
      </Box>
    </Box>
  );
}
