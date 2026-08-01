import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { TrendingUp } from 'lucide-react';

export const EngagementPulseCard: React.FC = () => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(7, 2, 53, 0.08)',
        padding: '24px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        marginBottom: '24px',
      }}
    >
      <Typography
        variant="caption"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#070235',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 600,
          fontSize: '11px',
          display: 'block',
          marginBottom: '16px',
        }}
      >
        Engagement Pulse
      </Typography>

      <Box style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography
              variant="h3"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                color: '#070235',
                fontSize: '2.5rem',
                lineHeight: 1,
              }}
            >
              94%
            </Typography>
            <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F', marginTop: '4px' }}>
              Delivery Success Rate
            </Typography>
          </Box>
          <TrendingUp size={24} color="#059669" />
        </Box>

        <LinearProgress
          variant="determinate"
          value={94}
          style={{
            height: '8px',
            borderRadius: '9999px',
            backgroundColor: '#F0F3FF',
          }}
        />
      </Box>
    </Box>
  );
};
