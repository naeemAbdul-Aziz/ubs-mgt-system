import React from 'react';
import { Box, Typography } from '@mui/material';
import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStatsDto } from '@ubs-lmis/types';

interface BentoStatsGridProps {
  stats: DashboardStatsDto | null;
}

export const BentoStatsGrid: React.FC<BentoStatsGridProps> = ({ stats }) => {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '32px',
        marginBottom: '64px',
      }}
    >
      {/* Card 1: Total Students */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            Total Students
          </Typography>
          <Users size={20} color="#4F46E5" style={{ opacity: 0.8 }} />
        </Box>
        <Box style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <Typography
            variant="h3"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#0F172A',
              fontSize: '2.25rem',
            }}
          >
            {stats?.totalStudents ? stats.totalStudents.toLocaleString() : '1,240'}
          </Typography>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#4F46E5',
              backgroundColor: 'rgba(224, 231, 255, 0.4)',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            +12
          </span>
        </Box>
      </Box>

      {/* Card 2: Active Staff */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            Active Staff
          </Typography>
          <UserCheck size={20} color="#4F46E5" style={{ opacity: 0.8 }} />
        </Box>
        <Box style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <Typography
            variant="h3"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#0F172A',
              fontSize: '2.25rem',
            }}
          >
            {stats?.totalTeachers || 86}
          </Typography>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#0F172A',
              backgroundColor: '#F1F5F9',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            On-Site
          </span>
        </Box>
      </Box>

      {/* Card 3: Revenue */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            Revenue
          </Typography>
          <DollarSign size={20} color="#4F46E5" style={{ opacity: 0.8 }} />
        </Box>
        <Box style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <Typography
            variant="h3"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#0F172A',
              fontSize: '2.25rem',
            }}
          >
            GHS {stats?.totalRevenue ? `${(stats.totalRevenue / 1000).toFixed(0)}k` : '450k'}
          </Typography>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#15803D',
              backgroundColor: '#F0FDF4',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            85% Goal
          </span>
        </Box>
      </Box>

      {/* Card 4: Performance */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          >
            Performance
          </Typography>
          <TrendingUp size={20} color="#4F46E5" style={{ opacity: 0.8 }} />
        </Box>
        <Box style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <Typography
            variant="h3"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#0F172A',
              fontSize: '2.25rem',
            }}
          >
            B+
          </Typography>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              color: '#0F172A',
              backgroundColor: '#F1F5F9',
              padding: '2px 8px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            Avg Grade
          </span>
        </Box>
      </Box>
    </section>
  );
};
