import React from 'react';
import { Box, Typography } from '@mui/material';

export const AcademicSetupFooter: React.FC = () => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid rgba(200, 197, 208, 0.2)',
        color: '#47464F',
        opacity: 0.7,
        marginTop: '48px',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
        Last updated: Oct 24, 2023 • 14:32 GMT
      </Typography>
      <Box style={{ display: 'flex', gap: '24px' }}>
        <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
          System: 1.2.4-stable
        </Typography>
        <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}>
          Database: Scholastic-Gold-v3
        </Typography>
      </Box>
    </Box>
  );
};
