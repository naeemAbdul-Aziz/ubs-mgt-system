import React from 'react';
import { Box, Typography, TextField, Grid } from '@mui/material';
import { Sliders, Info } from 'lucide-react';

interface Step1ParametersFormProps {
  passMark: number;
  setPassMark: (val: number) => void;
  attendanceReq: number;
  setAttendanceReq: (val: number) => void;
  graduationCredits: number;
  setGraduationCredits: (val: number) => void;
  retentionBuffer: number;
  setRetentionBuffer: (val: number) => void;
}

export const Step1ParametersForm: React.FC<Step1ParametersFormProps> = ({
  passMark,
  setPassMark,
  attendanceReq,
  setAttendanceReq,
  graduationCredits,
  setGraduationCredits,
  retentionBuffer,
  setRetentionBuffer,
}) => {
  return (
    <Box>
      {/* Title Header */}
      <Box style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Box
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(75, 65, 225, 0.1)',
            color: '#4B41E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sliders size={24} />
        </Box>
        <Box>
          <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
            Academic Parameters
          </Typography>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Define the thresholds for promotion and graduation for the 2023/24 Academic Year.
          </Typography>
        </Box>
      </Box>

      {/* Grid Inputs */}
      <Grid container spacing={3} style={{ marginBottom: '32px' }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Promotion Pass Mark (%)"
            type="number"
            fullWidth
            size="small"
            value={passMark}
            onChange={(e) => setPassMark(Number(e.target.value))}
            helperText="Minimum average score required for promotion"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Minimum Attendance Required (%)"
            type="number"
            fullWidth
            size="small"
            value={attendanceReq}
            onChange={(e) => setAttendanceReq(Number(e.target.value))}
            helperText="Minimum class attendance percentage"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Graduation Credits Minimum"
            type="number"
            fullWidth
            size="small"
            value={graduationCredits}
            onChange={(e) => setGraduationCredits(Number(e.target.value))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Retention (Probation) Buffer (%)"
            type="number"
            fullWidth
            size="small"
            value={retentionBuffer}
            onChange={(e) => setRetentionBuffer(Number(e.target.value))}
          />
        </Grid>
      </Grid>

      {/* Info Callout */}
      <Box
        style={{
          backgroundColor: '#F0F3FF',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(200, 197, 208, 0.3)',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        <Info size={20} color="#4B41E1" style={{ flexShrink: 0, marginTop: '2px' }} />
        <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F', lineHeight: 1.6 }}>
          These parameters will be used to calculate results across{' '}
          <strong style={{ color: '#070235' }}>2,450 active students</strong>. Students falling within the retention buffer will be flagged for manual review by the academic board.
        </Typography>
      </Box>
    </Box>
  );
};
