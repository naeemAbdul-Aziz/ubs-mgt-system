'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { Grid } from '@mui/material';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, Receipt, TrendingDown } from 'lucide-react';
import { FinanceAPI } from '@ubs-lmis/api-client';
import { Invoice } from '@ubs-lmis/types';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PAID: { label: 'Paid', color: '#16A34A', bg: '#DCFCE7', icon: CheckCircle2 },
  PARTIAL: { label: 'Partially Paid', color: '#D97706', bg: '#FEF3C7', icon: Clock },
  UNPAID: { label: 'Outstanding', color: '#DC2626', bg: '#FEE2E2', icon: AlertTriangle },
  OVERDUE: { label: 'Overdue', color: '#9333EA', bg: '#F3E8FF', icon: AlertTriangle },
};

export const StudentFeesView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await FinanceAPI.getMyInvoices();
        setInvoices(data);
      } catch (err) {
        console.error('Failed to load student invoices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalAmount = invoices.reduce((s, i) => s + ((i as any).totalAmount ?? 0), 0);
  const totalPaid = invoices.reduce((s, i) => s + ((i as any).paidAmount ?? 0), 0);
  const totalOutstanding = totalAmount - totalPaid;
  const paidPct = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
          My School Fees
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mt: 0.5 }}>
          Your invoices and payment history for the current academic year
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

      {/* Balance Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Billed', value: totalAmount, color: '#2563EB', icon: CreditCard },
          { label: 'Amount Paid', value: totalPaid, color: '#16A34A', icon: CheckCircle2 },
          { label: 'Outstanding', value: totalOutstanding, color: totalOutstanding > 0 ? '#DC2626' : '#16A34A', icon: TrendingDown },
        ].map(({ label, value, color, icon: Icon }) => (
          <Grid key={label} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                      {label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
                      GHS {value.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Progress Bar */}
      {totalAmount > 0 && (
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                Payment Progress
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: paidPct === 100 ? '#16A34A' : '#D97706' }}>
                {paidPct}% settled
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={paidPct}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#F1F5F9',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: paidPct === 100 ? '#16A34A' : '#2563EB',
                  borderRadius: 5,
                },
              }}
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>GHS 0</Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>GHS {totalAmount.toLocaleString()}</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Invoice List */}
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
            <Receipt size={20} color="#2563EB" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
              Invoice History
            </Typography>
          </Stack>

          {invoices.length === 0 && !loading ? (
            <Box sx={{ textAlign: 'center', py: 6, color: '#94A3B8' }}>
              <Receipt size={40} />
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>No invoices found</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Your fee invoices will appear here once they are issued.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0} divider={<Divider />}>
              {invoices.map((inv, i) => {
                const invAny = inv as any;
                const status = invAny.status ?? 'UNPAID';
                const cfg = statusConfig[status] ?? statusConfig.UNPAID;
                const StatusIcon = cfg.icon;
                const paid = invAny.paidAmount ?? 0;
                const total = invAny.totalAmount ?? 0;
                return (
                  <Box key={invAny.id ?? i} sx={{ py: 2.5 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                        <Avatar sx={{ width: 40, height: 40, backgroundColor: cfg.bg, flexShrink: 0 }}>
                          <StatusIcon size={18} color={cfg.color} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                            {invAny.feeSchedule?.description ?? 'School Fee Invoice'}
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              Issued: {invAny.issueDate ? new Date(invAny.issueDate).toLocaleDateString('en-GH') : '—'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              Due: {invAny.dueDate ? new Date(invAny.dueDate).toLocaleDateString('en-GH') : '—'}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack spacing={0.5} sx={{ flexShrink: 0, alignItems: 'flex-end' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                          GHS {total.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                        </Typography>
                        {paid > 0 && paid < total && (
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            GHS {paid.toLocaleString()} paid
                          </Typography>
                        )}
                        <Chip
                          label={cfg.label}
                          size="small"
                          sx={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.72rem', height: 22 }}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
