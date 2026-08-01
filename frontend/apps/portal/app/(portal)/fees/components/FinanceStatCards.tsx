import React from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { ArrowUp, CheckCircle, PlayCircle, Sparkles } from 'lucide-react';

interface FinanceStatCardsProps {
  onRunAutoAllocation: () => void;
  isAllocating: boolean;
}

export const FinanceStatCards: React.FC<FinanceStatCardsProps> = ({
  onRunAutoAllocation,
  isAllocating,
}) => {
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}
    >
      {/* Stat Card 1: Total Outstanding */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(30, 27, 75, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(7, 2, 53, 0.03)',
        }}
      >
        <Box>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#47464F',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '10px',
              fontWeight: 600,
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Total Outstanding
          </Typography>
          <Typography
            variant="h4"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '2.25rem',
              color: '#070235',
            }}
          >
            GHS 125,400
          </Typography>
        </Box>

        <Box style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', color: 'rgba(186, 26, 26, 0.8)', fontWeight: 500 }}>
          <ArrowUp size={16} />
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            4% since last month
          </Typography>
        </Box>
      </Box>

      {/* Stat Card 2: Monthly Collections */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(30, 27, 75, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(7, 2, 53, 0.03)',
        }}
      >
        <Box>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#47464F',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '10px',
              fontWeight: 600,
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Monthly Collections
          </Typography>
          <Typography
            variant="h4"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: '2.25rem',
              color: '#070235',
            }}
          >
            GHS 89,000
          </Typography>
        </Box>

        <Box style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', color: '#166534', fontWeight: 500 }}>
          <CheckCircle size={16} />
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Target reached
          </Typography>
        </Box>
      </Box>

      {/* Action Card: Unallocated Deposits */}
      <Box
        style={{
          backgroundColor: '#F0F3FF',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Sparkles
          size={100}
          color="#070235"
          style={{ position: 'absolute', right: '-16px', top: '-16px', opacity: 0.05, transform: 'rotate(12deg)' }}
        />

        <Box>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#070235',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '10px',
              fontWeight: 600,
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Unallocated Deposits
          </Typography>

          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '8px' }}>
            <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
              Pending Match
            </Typography>
            <Typography variant="subtitle1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#070235' }}>
              GHS 16,700
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={65}
            style={{ height: '4px', borderRadius: '9999px', backgroundColor: 'rgba(200, 197, 208, 0.3)', marginTop: '8px' }}
          />
        </Box>

        <Button
          variant="contained"
          startIcon={<PlayCircle size={18} />}
          onClick={onRunAutoAllocation}
          disabled={isAllocating}
          style={{
            backgroundColor: '#070235',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '10px 16px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
            marginTop: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {isAllocating ? 'Allocating...' : 'Run Auto-Allocation'}
        </Button>
      </Box>
    </section>
  );
};
