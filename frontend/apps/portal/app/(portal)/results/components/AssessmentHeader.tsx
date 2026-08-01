import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface AssessmentHeaderProps {
  onSaveDraft: () => void;
  onPublishResults: () => void;
  isSaving: boolean;
  isPublishing: boolean;
}

export const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  onSaveDraft,
  onPublishResults,
  isSaving,
  isPublishing,
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '32px',
      }}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography
          variant="h3"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '2.25rem',
            fontWeight: 600,
            color: '#070235',
            letterSpacing: '-0.02em',
          }}
        >
          Assessment Grid Engine
        </Typography>

        <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              padding: '4px 14px',
              backgroundColor: 'rgba(222, 232, 255, 0.6)',
              borderRadius: '9999px',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#070235',
            }}
          >
            Mathematics
          </span>
          <span style={{ color: 'rgba(200, 197, 208, 0.5)', fontSize: '12px' }}>•</span>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#47464F' }}>
            Class: JHS 2-A
          </Typography>
          <span style={{ color: 'rgba(200, 197, 208, 0.5)', fontSize: '12px' }}>•</span>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Term 3
          </Typography>
        </Box>
      </Box>

      <Box style={{ display: 'flex', gap: '12px' }}>
        <Button
          variant="outlined"
          onClick={onSaveDraft}
          disabled={isSaving}
          style={{
            borderColor: '#787680',
            color: '#111C2D',
            borderRadius: '9999px',
            padding: '8px 24px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
          }}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </Button>

        <Button
          variant="contained"
          onClick={onPublishResults}
          disabled={isPublishing}
          style={{
            backgroundColor: '#070235',
            color: '#FFFFFF',
            borderRadius: '9999px',
            padding: '8px 24px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(7, 2, 53, 0.15)',
          }}
        >
          {isPublishing ? 'Publishing...' : 'Publish Results to Guardians'}
        </Button>
      </Box>
    </Box>
  );
};
