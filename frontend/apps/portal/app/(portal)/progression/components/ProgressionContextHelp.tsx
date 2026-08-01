import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Scroll, History } from 'lucide-react';

export const ProgressionContextHelp: React.FC = () => {
  return (
    <Grid container spacing={3} style={{ marginTop: '32px' }}>
      {/* Promotion Policy Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          style={{
            backgroundColor: '#E7EEFF',
            borderRadius: '16px',
            border: '1px solid rgba(200, 197, 208, 0.2)',
            padding: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <Scroll size={22} color="#444173" style={{ flexShrink: 0, marginTop: '2px' }} />
          <Box>
            <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#070235' }}>
              Promotion Policy
            </Typography>
            <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
              Promotion follows the National Ghana Education Service guidelines for secondary level advancement.
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Last Year Data Card */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          style={{
            backgroundColor: '#E7EEFF',
            borderRadius: '16px',
            border: '1px solid rgba(200, 197, 208, 0.2)',
            padding: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <History size={22} color="#444173" style={{ flexShrink: 0, marginTop: '2px' }} />
          <Box>
            <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#070235' }}>
              Last Year Data
            </Typography>
            <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
              Last session's average pass rate was 89.2% with a 1.2% dropout rate.
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
