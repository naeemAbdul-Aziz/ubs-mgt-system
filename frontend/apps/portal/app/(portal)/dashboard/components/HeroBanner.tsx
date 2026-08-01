import React from 'react';
import { Box, Typography } from '@mui/material';

export const HeroBanner: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section style={{ marginBottom: '32px', borderBottom: '1px solid #E2E8F0', paddingBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <Box style={{ maxWidth: '768px' }}>
        <Typography
          variant="h2"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '3rem',
            fontWeight: 600,
            color: '#0F172A',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '4px',
          }}
        >
          Welcome back.
        </Typography>

        <Typography
          variant="h6"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.125rem',
            color: '#64748B',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          We're glad to see you again. Here is an overview of your portal today.
        </Typography>
      </Box>

      <Box style={{ textAlign: 'right' }}>
        <Typography
          variant="caption"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          Active Date
        </Typography>
        <Typography
          variant="h5"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#0F172A',
            fontSize: '1.75rem',
          }}
        >
          {currentDate}
        </Typography>
      </Box>
    </section>
  );
};
