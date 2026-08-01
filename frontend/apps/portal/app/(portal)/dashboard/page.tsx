'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { AnalyticsAPI } from '@ubs-lmis/api-client';
import { DashboardStatsDto } from '@ubs-lmis/types';

import { useAuth } from '../../providers/AuthProvider';
import { HeroBanner } from './components/HeroBanner';
import { BentoStatsGrid } from './components/BentoStatsGrid';
import { RecentActivityList } from './components/RecentActivityList';
import { TeacherDashboardPanel } from './components/TeacherDashboardPanel';
import { QuickActionsPanel } from './components/QuickActionsPanel';
import { StudentDashboardPanel } from './components/StudentDashboardPanel';
import { GuardianDashboardPanel } from './components/GuardianDashboardPanel';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    import('@ubs-lmis/api-client').then(({ AnalyticsAPI }) => {
      AnalyticsAPI.getDashboardStats().then(setStats).catch(console.error);
    });
  }, []);

  const isStaff = userProfile?.personType === 'STAFF';
  const isStudent = userProfile?.personType === 'STUDENT';
  const isGuardian = userProfile?.personType === 'GUARDIAN';
  const perms = userProfile?.permissions || [];
  
  // Strict admin check: Only those with school-wide or finance dash permissions
  const isAdmin = isStaff && (perms.includes('DASHBOARD_VIEW_SCHOOL') || perms.includes('DASHBOARD_VIEW_FINANCE'));
  const isTeacher = isStaff && !isAdmin;

  return (
    <Box>
      {/* Magazine-Style Hero Banner — shown for staff only */}
      {isStaff && <HeroBanner />}

      {/* Admin Dashboard */}
      {isAdmin && (
        <>
          <BentoStatsGrid stats={stats} />
          <Grid container spacing={4} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <RecentActivityList />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <QuickActionsPanel />
            </Grid>
          </Grid>
        </>
      )}

      {/* Teacher Dashboard */}
      {isTeacher && (
        <Grid container spacing={4} sx={{ mt: 0 }}>
          <Grid size={{ xs: 12 }}>
            <TeacherDashboardPanel />
          </Grid>
        </Grid>
      )}

      {/* Student Dashboard — fully wired personal panel */}
      {isStudent && <StudentDashboardPanel />}

      {/* Guardian Dashboard — ward overview */}
      {isGuardian && <GuardianDashboardPanel />}
    </Box>
  );
}
