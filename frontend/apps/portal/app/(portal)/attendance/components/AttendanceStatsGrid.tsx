import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Users, UserCheck, UserX, Activity } from 'lucide-react';

interface AttendanceStatsGridProps {
  total: number;
  presentCount: number;
  absentCount: number;
  rate: string;
}

export const AttendanceStatsGrid: React.FC<AttendanceStatsGridProps> = ({
  total,
  presentCount,
  absentCount,
  rate,
}) => {
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #F1F5F9',
    padding: '32px 24px',
    height: '100%',
    boxSizing: 'border-box' as const,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
  };

  const numberStyle = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    color: '#1E293B',
    marginTop: '16px',
    marginBottom: '8px',
    fontSize: '2rem',
  };

  const labelStyle = {
    fontFamily: 'Inter, sans-serif',
    color: '#94A3B8',
    fontSize: '0.875rem',
    fontWeight: 500,
  };

  return (
    <Grid container spacing={3} style={{ marginBottom: '32px' }}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Box style={cardStyle}>
          <Users size={28} color="#8B5CF6" strokeWidth={1.5} />
          <Typography style={numberStyle}>
            {total}
          </Typography>
          <Typography style={labelStyle}>
            Total Students
          </Typography>
        </Box>
      </Grid>
      
      <Grid size={{ xs: 6, sm: 3 }}>
        <Box style={cardStyle}>
          <UserCheck size={28} color="#10B981" strokeWidth={1.5} />
          <Typography style={numberStyle}>
            {presentCount}
          </Typography>
          <Typography style={labelStyle}>
            Present
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <Box style={cardStyle}>
          <UserX size={28} color="#F59E0B" strokeWidth={1.5} />
          <Typography style={numberStyle}>
            {absentCount}
          </Typography>
          <Typography style={labelStyle}>
            Absent
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 6, sm: 3 }}>
        <Box style={cardStyle}>
          <Activity size={28} color="#3B82F6" strokeWidth={1.5} />
          <Typography style={numberStyle}>
            {rate}%
          </Typography>
          <Typography style={labelStyle}>
            Attendance Rate
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
