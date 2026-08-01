import React from 'react';
import { Box, Typography } from '@mui/material';

export const ProgressionWizardHeader: React.FC = () => {
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
        Student Promotion Wizard
      </Typography>
      <Typography
        variant="body2"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#47464F',
          fontSize: '0.875rem',
          maxWidth: '640px',
        }}
      >
        Execute the annual progression cycle. Configure pass requirements, review automated performance analysis, and finalize academic standings.
      </Typography>
    </Box>
  );
};
