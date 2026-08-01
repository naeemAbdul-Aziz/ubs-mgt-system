'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  BookOpen,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Bell,
  ArrowRight,
  Award,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthAPI, AssessmentAPI, CommunicationAPI } from '@ubs-lmis/api-client';
import { Announcement } from '@ubs-lmis/types';

interface StudentProfile {
  personId: string;
  username: string;
  personType: string;
}

interface ReportCardSubject {
  subjectName: string;
  overallTotal?: number;
  grade?: string;
}

interface ReportCard {
  studentName?: string;
  className?: string;
  termName?: string;
  academicYear?: string;
  overallAverage?: number;
  positionInClass?: number;
  totalStudents?: number;
  subjects?: ReportCardSubject[];
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  subtext,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  subtext?: string;
}) => (
  <Card
    sx={{
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: 'none',
      height: '100%',
      transition: 'box-shadow 0.2s, transform 0.2s',
      '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5, lineHeight: 1 }}>
            {value}
          </Typography>
          {subtext && (
            <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5 }}>
              {subtext}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={22} color="#fff" />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const gradeColor = (grade?: string) => {
  if (!grade) return '#94A3B8';
  if (grade === 'A') return '#22C55E';
  if (grade === 'B') return '#3B82F6';
  if (grade === 'C') return '#F59E0B';
  if (grade === 'D') return '#F97316';
  return '#EF4444';
};

export const StudentDashboardPanel = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const user = await AuthAPI.me();
        setProfile(user);

        const [rc, ann] = await Promise.allSettled([
          AssessmentAPI.getReportCard('', 'term-1'),
          CommunicationAPI.getAnnouncements(),
        ]);

        if (rc.status === 'fulfilled') setReportCard(rc.value as unknown as ReportCard);
        if (ann.status === 'fulfilled') setAnnouncements((ann.value as Announcement[]).slice(0, 3));
      } catch (err) {
        console.error('Student dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const rc = reportCard as ReportCard | null;
  const avg = rc?.overallAverage ?? null;
  const subjects = rc?.subjects ?? [];
  const topSubject = subjects.length > 0
    ? [...subjects].sort((a, b) => (b.overallTotal ?? 0) - (a.overallTotal ?? 0))[0]
    : null;

  return (
    <Box sx={{ mt: 2 }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #2563EB 100%)',
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          mb: 4,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', fontSize: '0.7rem' }}>
              Welcome back
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mt: 0.5 }}>
              {rc?.studentName ?? profile?.username ?? '—'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
              {rc?.className && (
                <Chip
                  label={rc.className}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }}
                />
              )}
              {rc?.termName && (
                <Chip
                  label={rc.termName}
                  size="small"
                  sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)' }}
                />
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => router.push('/results/report-cards')}
              startIcon={<Award size={16} />}
              sx={{
                backgroundColor: '#fff',
                color: '#0F172A',
                fontWeight: 700,
                borderRadius: '9999px',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#F1F5F9' },
              }}
            >
              My Report Card
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/fees')}
              startIcon={<CreditCard size={16} />}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '9999px',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
              }}
            >
              Fee Balance
            </Button>
          </Stack>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2, backgroundColor: '#EEF2FF' }} />}

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={TrendingUp}
            label="Overall Average"
            value={avg !== null ? `${avg.toFixed(1)}%` : '—'}
            color="#2563EB"
            subtext={rc?.academicYear ?? 'Current Year'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={BookOpen}
            label="Subjects"
            value={subjects.length > 0 ? subjects.length : '—'}
            color="#7C3AED"
            subtext="Current term"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={GraduationCap}
            label="Class Position"
            value={rc?.positionInClass != null ? `#${rc.positionInClass}` : '—'}
            color="#059669"
            subtext={rc?.totalStudents ? `of ${rc.totalStudents} students` : undefined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            icon={Award}
            label="Top Subject"
            value={topSubject?.grade ?? '—'}
            color="#D97706"
            subtext={topSubject?.subjectName}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Subject Grades */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <BookOpen size={20} color="#2563EB" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    Subject Performance
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ArrowRight size={14} />}
                  onClick={() => router.push('/results/report-cards')}
                  sx={{ textTransform: 'none', color: '#2563EB', fontWeight: 600 }}
                >
                  Full Report
                </Button>
              </Stack>

              {subjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>
                  <BookOpen size={32} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    No results available yet for this term
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {subjects.map((s, i) => {
                    const score = s.overallTotal ?? 0;
                    const pct = Math.min(100, score);
                    const color = gradeColor(s.grade);
                    return (
                      <Box key={i}>
                        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                            {s.subjectName}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                              {score.toFixed(1)}%
                            </Typography>
                            <Chip
                              label={s.grade ?? '—'}
                              size="small"
                              sx={{
                                backgroundColor: `${color}20`,
                                color: color,
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                height: 22,
                              }}
                            />
                          </Stack>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={pct}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#F1F5F9',
                            '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 3 },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Announcements Sidebar */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Bell size={20} color="#7C3AED" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    Announcements
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  endIcon={<ArrowRight size={14} />}
                  onClick={() => router.push('/communication')}
                  sx={{ textTransform: 'none', color: '#7C3AED', fontWeight: 600 }}
                >
                  View All
                </Button>
              </Stack>

              {announcements.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>
                  <Bell size={32} />
                  <Typography variant="body2" sx={{ mt: 1 }}>No announcements</Typography>
                </Box>
              ) : (
                <Stack spacing={2.5}>
                  {announcements.map((ann, i) => (
                    <Box key={i}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                        <Avatar
                          sx={{ width: 32, height: 32, backgroundColor: '#EEF2FF', flexShrink: 0, mt: 0.25 }}
                        >
                          <Bell size={14} color="#7C3AED" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                            {(ann as any).title ?? 'Announcement'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.4 }}>
                            {(ann as any).body ?? ''}
                          </Typography>
                        </Box>
                      </Stack>
                      {i < announcements.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </Stack>
              )}

              {/* Quick action links */}
              <Divider sx={{ my: 3 }} />
              <Stack spacing={1.5}>
                {[
                  { icon: CalendarCheck, label: 'View Attendance', href: '/attendance', color: '#059669' },
                  { icon: CreditCard, label: 'Check Fee Balance', href: '/fees', color: '#D97706' },
                  { icon: BookOpen, label: 'My Subjects', href: '/academics', color: '#2563EB' },
                ].map(({ icon: Icon, label, href, color }) => (
                  <Box
                    key={href}
                    onClick={() => router.push(href)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: '1px solid #F1F5F9',
                      transition: 'all 0.15s',
                      '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
                    }}
                  >
                    <Box sx={{ width: 32, height: 32, borderRadius: 1.5, backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={color} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B', flex: 1 }}>
                      {label}
                    </Typography>
                    <ArrowRight size={14} color="#94A3B8" />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
