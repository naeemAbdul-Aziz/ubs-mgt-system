import React from 'react';
import { Box, Typography } from '@mui/material';

interface ProgressionStepTrackerProps {
  currentStep: number; // 1, 2, 3
}

export const ProgressionStepTracker: React.FC<ProgressionStepTrackerProps> = ({ currentStep }) => {
  const stepLabels: Record<number, string> = {
    1: 'Step 1 of 3: Parameters',
    2: 'Step 2 of 3: Analysis',
    3: 'Step 3 of 3: Confirmation',
  };

  const percentageMap: Record<number, number> = {
    1: 33,
    2: 66,
    3: 100,
  };

  const percent = percentageMap[currentStep] || 33;

  return (
    <Box
      style={{
        backgroundColor: '#F0F3FF',
        padding: '24px 32px',
        borderBottom: '1px solid rgba(200, 197, 208, 0.2)',
      }}
    >
      <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Typography
          variant="caption"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#4B41E1',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}
        >
          {stepLabels[currentStep]}
        </Typography>

        <Typography
          variant="caption"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#47464F',
            fontWeight: 500,
          }}
        >
          {percent}% Complete
        </Typography>
      </Box>

      {/* Progress Bar Container */}
      <Box
        style={{
          width: '100%',
          backgroundColor: '#DEE8FF',
          height: '8px',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            backgroundColor: '#4B41E1',
            height: '100%',
            width: `${percent}%`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </Box>
    </Box>
  );
};
