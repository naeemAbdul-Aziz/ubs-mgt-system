import React from 'react';
import { Box, Typography } from '@mui/material';

export const FinanceHeader: React.FC = () => {
  return (
    <Box style={{ marginBottom: '32px' }}>
      <Typography
        variant="h3"
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '2rem',
          fontWeight: 600,
          color: '#070235',
          marginBottom: '4px',
        }}
      >
        Finance Allocation Ledger
      </Typography>
      <Typography
        variant="body2"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#47464F',
          fontSize: '0.875rem',
        }}
      >
        Tracking institutional revenue and auto-matching unallocated student deposits.
      </Typography>
    </Box>
  );
};
