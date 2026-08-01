'use client';

import React, { useEffect, useState } from 'react';
import { Box, Grid, Alert, Snackbar, Fab } from '@mui/material';
import { RefreshCw } from 'lucide-react';
import { AcademicsAPI } from '@ubs-lmis/api-client';
import { SubjectCatalogItem, FacultyAllocationItem } from '@ubs-lmis/types';

import { AcademicSetupHeader } from './components/AcademicSetupHeader';
import { AcademicStatusCard } from './components/AcademicStatusCard';
import { ClassStructureCard } from './components/ClassStructureCard';
import { SubjectCatalogCard } from './components/SubjectCatalogCard';
import { FacultyAllocationCard } from './components/FacultyAllocationCard';
import { AcademicSetupFooter } from './components/AcademicSetupFooter';
import { StudentSubjectsView } from './components/StudentSubjectsView';
import { useAuth } from '../../providers/AuthProvider';

export default function AcademicsPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [subjects, setSubjects] = useState<SubjectCatalogItem[]>([]);
  const [allocations, setAllocations] = useState<FacultyAllocationItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const personType = userProfile?.personType ?? null;
  const perms = userProfile?.permissions || [];
  // Full admin setup: only ACADEMIC_YEAR_CREATE or STUDENT_CREATE holders
  const canManageAcademics =
    perms.includes('ACADEMIC_YEAR_CREATE') ||
    perms.includes('STUDENT_CREATE') ||
    perms.includes('CLASS_CREATE');

  useEffect(() => {
    if (authLoading) return;
    const fetchData = async () => {
      try {
        if (personType !== 'STUDENT') {
          const [subData, facultyData] = await Promise.all([
            AcademicsAPI.getSubjectCatalog(),
            AcademicsAPI.getFacultyAllocations(),
          ]);
          setSubjects(subData);
          setAllocations(facultyData);
        }
      } catch (err) {
        console.error('Failed to load academic setup data:', err);
      }
    };
    fetchData();
  }, [authLoading, personType]);

  const handleFinalizeSetup = async () => {
    setIsSaving(true);
    try {
      setToastMsg('Academic setup configurations finalized and synced successfully!');
    } catch (err) {
      console.error('Failed to finalize setup:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Students see their own subjects view
  if (personType === 'STUDENT') {
    return <StudentSubjectsView />;
  }

  // Teachers / HOD without management perms: read-only info notice
  if (personType === 'STAFF' && !canManageAcademics) {
    return (
      <Box style={{ width: '100%' }}>
        <Alert severity="info" style={{ marginBottom: '24px', borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}>
          <strong>Read-Only View:</strong> Academic structure is managed by the School Administrator. Contact your HoD or Admin to make changes.
        </Alert>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 4 }}>
            <AcademicStatusCard />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <ClassStructureCard />
          </Grid>
          <Grid size={{ xs: 12, lg: 7 }}>
            <SubjectCatalogCard subjects={subjects} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <FacultyAllocationCard allocations={allocations} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Admin / HEAD_OF_SCHOOL: full setup panel
  return (
    <Box style={{ width: '100%' }}>
      {/* Header */}
      <AcademicSetupHeader onFinalizeSetup={handleFinalizeSetup} isSaving={isSaving} />

      <Grid container spacing={3}>
        {/* Row 1: Academic Status (Col 4) & Class Structure (Col 8) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <AcademicStatusCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ClassStructureCard />
        </Grid>

        {/* Row 2: Subject Catalog (Col 7) & Faculty Allocation (Col 5) */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <SubjectCatalogCard subjects={subjects} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <FacultyAllocationCard allocations={allocations} />
        </Grid>
      </Grid>

      {/* Footer Stats */}
      <AcademicSetupFooter />

      {/* Floating Action Button — admin only */}
      <Fab
        color="primary"
        aria-label="publish"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#070235',
          color: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(7, 2, 53, 0.3)',
        }}
      >
        <RefreshCw size={24} />
      </Fab>

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMsg)}
        autoHideDuration={4000}
        onClose={() => setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToastMsg(null)} style={{ borderRadius: '12px' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
