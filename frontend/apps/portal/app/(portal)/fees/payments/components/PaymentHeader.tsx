import React from 'react';
import { Box, Typography } from '@mui/material';

export const PaymentHeader: React.FC = () => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '32px',
      }}
    >
      <Box style={{ maxWidth: '640px' }}>
        <Typography
          variant="h3"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '2.25rem',
            fontWeight: 600,
            color: '#070235',
            marginBottom: '8px',
          }}
        >
          Payment Entry & Auto-Allocation
        </Typography>
        <Typography
          variant="body1"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#47464F',
            lineHeight: 1.6,
          }}
        >
          Record fee payments and auto-allocate across outstanding student invoices.
        </Typography>
      </Box>
    </Box>
  );
};
