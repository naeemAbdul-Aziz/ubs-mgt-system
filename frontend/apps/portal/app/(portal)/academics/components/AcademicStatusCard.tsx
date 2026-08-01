import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Calendar, ArrowRight } from 'lucide-react';

export const AcademicStatusCard: React.FC = () => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Status Header */}
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h6" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
          Status
        </Typography>
        <span
          style={{
            padding: '4px 12px',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Active
        </span>
      </Box>

      {/* Details */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
        <Box style={{ backgroundColor: '#F0F3FF', padding: '16px', borderRadius: '12px' }}>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Academic Year
          </Typography>
          <Typography variant="subtitle1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#070235' }}>
            2023/24 Academic Session
          </Typography>
        </Box>

        <Box style={{ backgroundColor: '#F0F3FF', padding: '16px', borderRadius: '12px' }}>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Current Term
          </Typography>
          <Typography variant="subtitle1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#070235' }}>
            Term 3 (Trinity Term)
          </Typography>
        </Box>

        <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '8px' }}>
          <Calendar size={18} color="#4B41E1" />
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Ends on July 28, 2024
          </Typography>
        </Box>
      </Box>

      {/* Timeline Button */}
      <Button
        endIcon={<ArrowRight size={16} />}
        style={{
          marginTop: '32px',
          alignSelf: 'flex-start',
          color: '#070235',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '0.875rem',
          padding: 0,
        }}
      >
        Configure Timeline
      </Button>
    </Box>
  );
};
