'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { Grid } from '@mui/material';
import { BookOpen, User, Award, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AcademicsAPI, AssessmentAPI, AuthAPI } from '@ubs-lmis/api-client';

interface SubjectEntry {
  subjectName: string;
  subjectCode?: string;
  teacherName?: string;
  grade?: string;
  overallTotal?: number;
}

const subjectColors = [
  '#2563EB', '#7C3AED', '#059669', '#D97706',
  '#DC2626', '#0891B2', '#9333EA', '#16A34A',
];

export const StudentSubjectsView = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<SubjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, reportCard] = await Promise.allSettled([
          AuthAPI.me(),
          AssessmentAPI.getReportCard('', 'term-1'),
        ]);

        if (reportCard.status === 'fulfilled' && reportCard.value) {
          const rc = reportCard.value as any;
          setClassName(rc.className ?? '');
          const subs: SubjectEntry[] = (rc.subjects ?? []).map((s: any) => ({
            subjectName: s.subjectName,
            subjectCode: s.subjectCode,
            teacherName: s.teacherName,
            grade: s.grade,
            overallTotal: s.overallTotal,
          }));
          setSubjects(subs);
        }
      } catch (err) {
        console.error('Failed to load student subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ maxWidth: '1100px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
          My Subjects
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
          {className ? `Enrolled in ${className} · ` : ''}Current term subjects and performance
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

      {/* Summary bar */}
      {subjects.length > 0 && (
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 4, background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {[
                { label: 'Subjects This Term', value: subjects.length },
                { label: 'Subjects with Grades', value: subjects.filter(s => s.grade).length },
                {
                  label: 'Best Grade',
                  value: subjects.reduce((best, s) => {
                    const order = ['A', 'B', 'C', 'D', 'E', 'F'];
                    const bIdx = order.indexOf(best ?? 'F');
                    const sIdx = order.indexOf(s.grade ?? 'F');
                    return sIdx < bIdx ? s.grade : best;
                  }, null as string | null) ?? '—',
                },
                {
                  label: 'Overall Average',
                  value: subjects.some(s => s.overallTotal != null)
                    ? `${(subjects.filter(s => s.overallTotal != null).reduce((sum, s) => sum + (s.overallTotal ?? 0), 0) / subjects.filter(s => s.overallTotal != null).length).toFixed(1)}%`
                    : '—',
                },
              ].map(({ label, value }) => (
                <Grid key={label} size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                    {label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.25 }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Subject Cards */}
      {subjects.length === 0 && !loading ? (
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <BookOpen size={48} color="#CBD5E1" />
            <Typography variant="h6" sx={{ mt: 2, color: '#94A3B8', fontWeight: 600 }}>
              No subjects found
            </Typography>
            <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5 }}>
              Your enrolled subjects will appear here once the academic term is configured.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {subjects.map((subj, i) => {
            const color = subjectColors[i % subjectColors.length];
            const hasGrade = subj.grade != null;
            const score = subj.overallTotal ?? 0;
            return (
              <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: 'none',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: `0 8px 30px ${color}25`,
                      borderColor: `${color}40`,
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => router.push('/results/report-cards')}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Color strip */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <BookOpen size={20} color={color} />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2, mb: 0.5 }}>
                      {subj.subjectName}
                    </Typography>
                    {subj.subjectCode && (
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {subj.subjectCode}
                      </Typography>
                    )}

                    {subj.teacherName && (
                      <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center' }}>
                        <Avatar sx={{ width: 20, height: 20, fontSize: '0.65rem', backgroundColor: '#E2E8F0', color: '#475569' }}>
                          {subj.teacherName.charAt(0)}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {subj.teacherName}
                        </Typography>
                      </Stack>
                    )}

                    {hasGrade && (
                      <Box sx={{ mt: 2 }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                          <Typography variant="caption" sx={{ color: '#94A3B8' }}>Score</Typography>
                          <Chip
                            label={`Grade ${subj.grade}`}
                            size="small"
                            sx={{
                              backgroundColor: `${color}15`,
                              color: color,
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              height: 20,
                            }}
                          />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, score)}
                          sx={{
                            height: 5,
                            borderRadius: 3,
                            backgroundColor: '#F1F5F9',
                            '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 3 },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#94A3B8', mt: 0.5, display: 'block' }}>
                          {score.toFixed(1)}%
                        </Typography>
                      </Box>
                    )}

                    {!hasGrade && (
                      <Chip
                        label="Results Pending"
                        size="small"
                        sx={{ mt: 2, backgroundColor: '#F8FAFC', color: '#94A3B8', border: '1px solid #E2E8F0', fontSize: '0.72rem', height: 22 }}
                      />
                    )}

                    <Stack direction="row" sx={{ mt: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Typography variant="caption" sx={{ color: color, fontWeight: 600 }}>View Report</Typography>
                      <ArrowRight size={14} color={color} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
