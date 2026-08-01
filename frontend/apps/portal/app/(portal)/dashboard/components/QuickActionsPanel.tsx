import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowUpRight, FileText, Wallet, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../providers/AuthProvider';

export const QuickActionsPanel: React.FC = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  const perms = userProfile?.permissions || [];

  const canPromote = perms.includes('STUDENT_CREATE') || perms.includes('ACADEMIC_YEAR_CREATE');
  const canViewReports = perms.includes('RESULT_APPROVE') || perms.includes('ACCOUNT_CREATE') || perms.includes('ACADEMIC_YEAR_CREATE');
  const canManageFees = perms.includes('PAYMENT_RECORD') || perms.includes('FEE_SCHEDULE_MANAGE') || perms.includes('ACCOUNT_CREATE');

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Quick Actions Card */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '32px',
        }}
      >
        <Typography
          variant="h6"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#0F172A',
            marginBottom: '24px',
          }}
        >
          Quick Actions
        </Typography>

        <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {canPromote && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/progression')}
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '16px 24px',
                justifyContent: 'space-between',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            >
              <span>Promote Students</span>
              <ArrowUpRight size={18} />
            </Button>
          )}

          {canViewReports && (
            <Button
              variant={canPromote ? 'outlined' : 'contained'}
              fullWidth
              onClick={() => router.push('/results/report-cards')}
              style={{
                borderColor: canPromote ? '#0F172A' : 'transparent',
                backgroundColor: canPromote ? 'transparent' : '#0F172A',
                color: canPromote ? '#0F172A' : '#FFFFFF',
                borderRadius: '12px',
                padding: '16px 24px',
                justifyContent: 'space-between',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            >
              <span>Terminal Reports</span>
              <FileText size={18} />
            </Button>
          )}

          {canManageFees && (
            <Button
              variant={(!canPromote && !canViewReports) ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => router.push('/fees/payments')}
              style={{
                borderColor: (!canPromote && !canViewReports) ? 'transparent' : '#0F172A',
                backgroundColor: (!canPromote && !canViewReports) ? '#0F172A' : 'transparent',
                color: (!canPromote && !canViewReports) ? '#FFFFFF' : '#0F172A',
                borderRadius: '12px',
                padding: '16px 24px',
                justifyContent: 'space-between',
                textTransform: 'none',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            >
              <span>Fee Allocation</span>
              <Wallet size={18} />
            </Button>
          )}
        </Box>
      </Box>

      {/* Guidelines Card */}
      <Box
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '280px',
          textAlign: 'center',
          border: '1px dashed #94A3B8',
        }}
      >
        <BookOpen size={48} color="#94A3B8" style={{ opacity: 0.5, marginBottom: '16px' }} />
        <Typography
          variant="caption"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#64748B',
            fontSize: '0.875rem',
            maxWidth: '200px',
            display: 'block',
            lineHeight: 1.5,
          }}
        >
          New institutional guidelines have been published for Term 3.
        </Typography>

        <Button
          variant="text"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            color: '#0F172A',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
            textTransform: 'none',
            marginTop: '16px',
          }}
        >
          Read Guidelines
        </Button>
      </Box>
    </Box>
  );
};
