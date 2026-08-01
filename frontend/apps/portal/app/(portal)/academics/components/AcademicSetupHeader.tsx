import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Save } from 'lucide-react';

interface AcademicSetupHeaderProps {
  onFinalizeSetup: () => void;
  isSaving: boolean;
}

export const AcademicSetupHeader: React.FC<AcademicSetupHeaderProps> = ({
  onFinalizeSetup,
  isSaving,
}) => {
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
          Academic Setup
        </Typography>
        <Typography
          variant="body1"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#47464F',
            lineHeight: 1.6,
          }}
        >
          Configure the structural foundations of the academic year, including class levels, course catalogs, and faculty assignments for the current term.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<Save size={18} />}
        onClick={onFinalizeSetup}
        disabled={isSaving}
        style={{
          backgroundColor: '#070235',
          color: '#FFFFFF',
          borderRadius: '9999px',
          padding: '12px 32px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '0.875rem',
          textTransform: 'none',
          boxShadow: '0 4px 14px rgba(7, 2, 53, 0.15)',
        }}
      >
        {isSaving ? 'Saving...' : 'Finalize Setup'}
      </Button>
    </Box>
  );
};
