'use client';

import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar, Typography, CircularProgress, LinearProgress, Paper, Chip } from '@mui/material';
import { AttendanceAPI } from '@ubs-lmis/api-client';
import { AttendanceStatus, AttendanceSummaryDto } from '@ubs-lmis/types';
import { CheckCircle, XCircle, Clock, BookOpen } from 'lucide-react';

import { AttendanceHeader } from './components/AttendanceHeader';
import { AttendanceControlPanel } from './components/AttendanceControlPanel';
import { AttendanceStatsGrid } from './components/AttendanceStatsGrid';
import { AttendanceRosterTable, StudentRosterItem } from './components/AttendanceRosterTable';
import { useAuth } from '../../providers/AuthProvider';

// ─── Student: own attendance summary view ──────────────────────────────────────
function StudentAttendanceView() {
  const [summary, setSummary] = useState<AttendanceSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    AttendanceAPI.getMyAttendanceSummary()
      .then(setSummary)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box style={{ padding: '48px', textAlign: 'center' }}>
        <CircularProgress style={{ color: '#070235' }} />
      </Box>
    );
  }

  if (error || !summary) {
    return (
      <Alert severity="info" style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}>
        Your attendance records are not yet available. Please check back later or contact your class teacher.
      </Alert>
    );
  }

  const pct = summary.attendancePercentage ?? 0;
  const statusColor = pct >= 75 ? '#047857' : pct >= 50 ? '#B45309' : '#B91C1C';
  const statusLabel = pct >= 75 ? 'Good Standing' : pct >= 50 ? 'Needs Improvement' : 'At Risk';

  return (
    <Box style={{ maxWidth: '720px', margin: '0 auto' }}>
      <Box style={{ marginBottom: '32px' }}>
        <Typography variant="h4" style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
          My Attendance
        </Typography>
        <Typography variant="body1" style={{ color: '#64748B', marginTop: '4px', fontFamily: 'Inter, sans-serif' }}>
          Your personal attendance record for the current term.
        </Typography>
      </Box>

      {/* Overall Card */}
      <Paper elevation={0} style={{
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        padding: '32px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #070235 0%, #1E1B4B 100%)',
        color: '#FFFFFF',
      }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h2" style={{ fontWeight: 800, color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
              {pct.toFixed(1)}%
            </Typography>
            <Typography variant="h6" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>
              Attendance Rate
            </Typography>
          </Box>
          <Chip
            label={statusLabel}
            style={{
              backgroundColor: statusColor,
              color: '#FFFFFF',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              padding: '4px 8px',
            }}
          />
        </Box>
        {/* Progress bar */}
        <Box style={{ marginTop: '24px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '9999px', height: '8px' }}>
          <Box style={{
            width: `${Math.min(pct, 100)}%`,
            backgroundColor: '#FFFFFF',
            borderRadius: '9999px',
            height: '8px',
            transition: 'width 0.6s ease',
          }} />
        </Box>
      </Paper>

      {/* Stats Grid */}
      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Days', value: summary.totalDays, icon: BookOpen, color: '#6366F1', bg: '#EEF2FF' },
          { label: 'Present', value: summary.presentDays, icon: CheckCircle, color: '#059669', bg: '#ECFDF5' },
          { label: 'Absent', value: summary.absentDays, icon: XCircle, color: '#DC2626', bg: '#FEF2F2' },
          { label: 'Late', value: summary.lateDays, icon: Clock, color: '#D97706', bg: '#FFFBEB' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Paper key={label} elevation={0} style={{ borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Box style={{ backgroundColor: bg, borderRadius: '10px', padding: '8px', display: 'flex' }}>
                <Icon size={18} color={color} />
              </Box>
            </Box>
            <Typography variant="h4" style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
              {value ?? 0}
            </Typography>
            <Typography variant="caption" style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {pct < 75 && (
        <Alert severity="warning" style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}>
          <strong>Attendance Notice:</strong> Your attendance rate is below 75%. Please attend all classes to maintain good academic standing.
        </Alert>
      )}
    </Box>
  );
}

// ─── Mock roster for teacher register view ─────────────────────────────────────
const mockRoster: StudentRosterItem[] = [
  { studentId: '1', studentNumber: 'STU-2025-001', studentName: 'Kofi Mensah', status: 'PRESENT' },
  { studentId: '2', studentNumber: 'STU-2025-002', studentName: 'Ama Osei', status: 'PRESENT' },
  { studentId: '3', studentNumber: 'STU-2025-003', studentName: 'Kwaku Appiah', status: 'ABSENT' },
  { studentId: '4', studentNumber: 'STU-2025-004', studentName: 'Akosua Boateng', status: 'LATE' },
  { studentId: '5', studentNumber: 'STU-2025-005', studentName: 'Ekow Quaye', status: 'PRESENT' },
  { studentId: '6', studentNumber: 'STU-2025-006', studentName: 'Yaa Asantewaa', status: 'PRESENT' },
];

// ─── Staff / Teacher: class register view ──────────────────────────────────────
export default function AttendancePage() {
  const { userProfile, loading: authLoading } = useAuth();

  const [selectedClass, setSelectedClass] = useState('cls-2');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [roster, setRoster] = useState<StudentRosterItem[]>(mockRoster);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Show student's own view if personType is STUDENT
  if (authLoading) {
    return (
      <Box style={{ padding: '48px', textAlign: 'center' }}>
        <LinearProgress style={{ borderRadius: '4px' }} />
      </Box>
    );
  }

  if (userProfile?.personType === 'STUDENT') {
    return <StudentAttendanceView />;
  }

  const handleStatusToggle = (studentId: string, newStatus: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status: newStatus } : item))
    );
  };

  const handleMarkAllPresent = () => {
    setRoster((prev) => prev.map((item) => ({ ...item, status: 'PRESENT' })));
  };

  const handleSaveRegister = async () => {
    setSubmitting(true);
    setSuccessMsg(null);
    try {
      await AttendanceAPI.submitRegister({
        classId: selectedClass,
        attendanceDate,
        records: roster.map((r) => ({ studentId: r.studentId, status: r.status, remarks: r.remarks })),
      });
      setSuccessMsg(`Attendance register for ${attendanceDate} submitted successfully!`);
    } catch (err) {
      console.error('Failed to submit attendance:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const total = roster.length;
  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const rate = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0.0';

  return (
    <Box style={{ maxWidth: '1440px', margin: '0 auto' }}>
      <AttendanceHeader onSave={handleSaveRegister} submitting={submitting} />

      <AttendanceControlPanel
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        attendanceDate={attendanceDate}
        setAttendanceDate={setAttendanceDate}
        onMarkAllPresent={handleMarkAllPresent}
      />

      <AttendanceStatsGrid
        total={total}
        presentCount={presentCount}
        absentCount={absentCount}
        rate={rate}
      />

      <AttendanceRosterTable
        roster={roster}
        handleStatusToggle={handleStatusToggle}
      />

      <Snackbar
        open={Boolean(successMsg)}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)} style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
