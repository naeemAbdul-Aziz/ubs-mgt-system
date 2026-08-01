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
  Divider,
  Button,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Users,
  GraduationCap,
  CreditCard,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CalendarCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FinanceAPI, CommunicationAPI } from '@ubs-lmis/api-client';
import { Announcement } from '@ubs-lmis/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const feeStatusCfg: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PAID:    { label: 'Fully Paid',  color: '#16A34A', bg: '#DCFCE7', icon: CheckCircle2 },
  PARTIAL: { label: 'Partial',     color: '#D97706', bg: '#FEF3C7', icon: Clock },
  UNPAID:  { label: 'Outstanding', color: '#DC2626', bg: '#FEE2E2', icon: AlertTriangle },
  OVERDUE: { label: 'Overdue',     color: '#9333EA', bg: '#F3E8FF', icon: AlertTriangle },
};

const gradeColor = (grade?: string) => {
  if (!grade) return '#94A3B8';
  if (grade === 'A') return '#16A34A';
  if (grade === 'B') return '#2563EB';
  if (grade === 'C') return '#D97706';
  if (grade === 'D') return '#F97316';
  return '#DC2626';
};

const relativeTime = (dateStr: string) => {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(dateStr).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' });
  } catch { return '—'; }
};

// ─── Ward Summary Card ─────────────────────────────────────────────────────────

interface WardCardProps {
  name: string;
  className?: string;
  grade?: string;
  attendance?: { present: number; total: number };
  invoice?: { total: number; paid: number; status: string };
  onViewReport: () => void;
  onViewFees: () => void;
}

const WardCard = ({ name, className, grade, attendance, invoice, onViewReport, onViewFees }: WardCardProps) => {
  const feeStatus = invoice?.status ?? 'UNPAID';
  const feeCfg = feeStatusCfg[feeStatus] ?? feeStatusCfg.UNPAID;
  const FeeIcon = feeCfg.icon;
  const attendancePct = attendance ? Math.round((attendance.present / attendance.total) * 100) : null;
  const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Ward identity */}
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 52, height: 52, backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '1.1rem', fontWeight: 800 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{name}</Typography>
            {className && (
              <Chip label={className} size="small" sx={{ mt: 0.5, backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.72rem', height: 20 }} />
            )}
          </Box>
        </Stack>

        <Stack spacing={2.5}>
          {/* Latest grade */}
          {grade && (
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <GraduationCap size={16} color="#7C3AED" />
                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>Latest Grade</Typography>
              </Stack>
              <Chip label={`Grade ${grade}`} size="small" sx={{ backgroundColor: `${gradeColor(grade)}15`, color: gradeColor(grade), fontWeight: 800, height: 22 }} />
            </Stack>
          )}

          {/* Attendance */}
          {attendancePct !== null && (
            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CalendarCheck size={16} color="#059669" />
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>Attendance</Typography>
                </Stack>
                <Typography variant="body2" sx={{ fontWeight: 700, color: attendancePct >= 80 ? '#16A34A' : '#DC2626' }}>
                  {attendancePct}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={attendancePct}
                sx={{ height: 5, borderRadius: 3, backgroundColor: '#F1F5F9', '& .MuiLinearProgress-bar': { backgroundColor: attendancePct >= 80 ? '#16A34A' : '#DC2626', borderRadius: 3 } }}
              />
            </Box>
          )}

          {/* Fees */}
          {invoice && (
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CreditCard size={16} color="#D97706" />
                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                  Fees
                </Typography>
              </Stack>
              <Chip
                icon={<FeeIcon size={12} />}
                label={feeCfg.label}
                size="small"
                sx={{ backgroundColor: feeCfg.bg, color: feeCfg.color, fontWeight: 700, height: 22, fontSize: '0.72rem', '& .MuiChip-icon': { color: feeCfg.color } }}
              />
            </Stack>
          )}

          {invoice && invoice.status !== 'PAID' && (
            <Box sx={{ backgroundColor: '#FFF7ED', borderRadius: 2, p: 1.5, border: '1px solid #FED7AA' }}>
              <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 600 }}>
                Outstanding: GHS {(invoice.total - invoice.paid).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 2.5 }} />

        {/* Actions */}
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            size="small"
            onClick={onViewReport}
            startIcon={<TrendingUp size={14} />}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, backgroundColor: '#EEF2FF', color: '#4F46E5', '&:hover': { backgroundColor: '#E0E7FF' } }}
          >
            Report Card
          </Button>
          <Button
            fullWidth
            size="small"
            onClick={onViewFees}
            startIcon={<CreditCard size={14} />}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, backgroundColor: '#FFF7ED', color: '#D97706', '&:hover': { backgroundColor: '#FED7AA' } }}
          >
            Fee Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────

export const GuardianDashboardPanel = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [invData, annData] = await Promise.allSettled([
          FinanceAPI.getInvoices(),
          CommunicationAPI.getAnnouncements(),
        ]);
        if (invData.status === 'fulfilled') setInvoices(invData.value as any[]);
        if (annData.status === 'fulfilled') setAnnouncements((annData.value as Announcement[]).slice(0, 4));
      } catch (err) {
        console.error('Guardian dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build ward summaries from invoices (group by student name via enrollment)
  const wardInvoiceMap: Record<string, any> = {};
  for (const inv of invoices) {
    const enrollment = (inv as any).enrollment;
    const student = enrollment?.student;
    if (!student) continue;
    const key = student.id;
    if (!wardInvoiceMap[key]) {
      wardInvoiceMap[key] = { student, invoices: [] };
    }
    wardInvoiceMap[key].invoices.push(inv);
  }

  const wards = Object.values(wardInvoiceMap);

  // Fallback: show placeholder wards if no invoice data yet
  const displayWards = wards.length > 0 ? wards : [
    { student: { id: '1', studentNumber: 'STD-26-001', firstName: 'Yaw', lastName: 'Frimpong' }, invoices: [] },
    { student: { id: '2', studentNumber: 'STD-26-002', firstName: 'Akosua', lastName: 'Frimpong' }, invoices: [] },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #059669 100%)',
          borderRadius: 4, p: { xs: 3, md: 4 }, mb: 4, color: '#fff', position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', fontSize: '0.7rem' }}>
              Parent & Guardian Portal
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mt: 0.5 }}>
              Good day, Guardian
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
              Track your ward's academic progress, attendance, and fee status.
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => router.push('/communication')}
              startIcon={<Bell size={16} />}
              sx={{ backgroundColor: '#fff', color: '#0F172A', fontWeight: 700, borderRadius: '9999px', textTransform: 'none', '&:hover': { backgroundColor: '#F1F5F9' } }}
            >
              Announcements
            </Button>
          </Stack>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

      <Grid container spacing={4}>
        {/* Ward Cards */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Box sx={{ mb: 2.5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Users size={20} color="#4F46E5" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>My Wards</Typography>
            </Stack>
          </Box>
          <Grid container spacing={3}>
            {displayWards.map((ward: any) => {
              const s = ward.student;
              const inv = ward.invoices[0];
              const name = `${s.firstName} ${s.lastName}`;
              return (
                <Grid key={s.id} size={{ xs: 12, sm: 6 }}>
                  <WardCard
                    name={name}
                    className={s.className}
                    grade={s.latestGrade}
                    attendance={s.attendanceSummary}
                    invoice={inv ? { total: inv.totalAmount ?? 0, paid: inv.paidAmount ?? 0, status: inv.status ?? 'UNPAID' } : undefined}
                    onViewReport={() => router.push(`/results/report-cards?studentId=${s.id}`)}
                    onViewFees={() => router.push('/fees')}
                  />
                </Grid>
              );
            })}
          </Grid>

          {/* Quick Stats Row */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {[
              { icon: GraduationCap, label: 'Wards Enrolled', value: displayWards.length, color: '#4F46E5', bg: '#EEF2FF' },
              { icon: CreditCard, label: 'Fees Outstanding', value: invoices.filter((i: any) => i.status !== 'PAID').length, color: '#D97706', bg: '#FFF7ED' },
              { icon: CalendarCheck, label: 'Announcements', value: announcements.length, color: '#059669', bg: '#ECFDF5' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <Grid key={label} size={{ xs: 12, sm: 4 }}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color={color} />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{value}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>{label}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Announcements Sidebar */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Bell size={20} color="#7C3AED" />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>Announcements</Typography>
                </Stack>
                <Button size="small" endIcon={<ArrowRight size={14} />} onClick={() => router.push('/communication')}
                  sx={{ textTransform: 'none', color: '#7C3AED', fontWeight: 600 }}>View All</Button>
              </Stack>

              {announcements.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>
                  <Bell size={32} />
                  <Typography variant="body2" sx={{ mt: 1 }}>No announcements</Typography>
                </Box>
              ) : (
                <Stack spacing={0} divider={<Divider />}>
                  {announcements.map((ann, i) => {
                    const a = ann as any;
                    return (
                      <Box key={i} sx={{ py: 2 }}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                          <Avatar sx={{ width: 32, height: 32, backgroundColor: '#EEF2FF', flexShrink: 0, mt: 0.25 }}>
                            <Bell size={14} color="#7C3AED" />
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.25 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                                {a.title ?? 'Announcement'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8', whiteSpace: 'nowrap', ml: 1, flexShrink: 0 }}>
                                {a.publishedAt ? relativeTime(a.publishedAt) : ''}
                              </Typography>
                            </Stack>
                            <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.5 }}>
                              {(a.body ?? '').slice(0, 80)}{(a.body ?? '').length > 80 ? '…' : ''}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
