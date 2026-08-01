import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Download, Plus } from 'lucide-react';

interface StudentDirectoryHeaderProps {
  onOpenNewStudentModal: () => void;
  canCreateStudent?: boolean;
}

export const StudentDirectoryHeader: React.FC<StudentDirectoryHeaderProps> = ({
  onOpenNewStudentModal,
  canCreateStudent = false,
}) => {
  return (
    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', paddingTop: '16px' }}>
      <Box>
        <Typography
          variant="h2"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '3rem',
            fontWeight: 600,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Student Directory
        </Typography>
        <Typography
          variant="h6"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: 'rgba(100, 116, 139, 0.8)',
            fontWeight: 400,
            fontSize: '1.125rem',
            maxWidth: '600px',
          }}
        >
          Manage academic records and enrollment status for the current term.
        </Typography>
      </Box>

      <Box style={{ display: 'flex', gap: '12px' }}>
        <Button
          variant="outlined"
          startIcon={<Download size={18} />}
          style={{
            borderColor: '#0F172A',
            color: '#0F172A',
            borderRadius: '9999px',
            padding: '10px 24px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
          }}
        >
          Export
        </Button>

        {canCreateStudent && (
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={18} />}
            onClick={onOpenNewStudentModal}
            style={{
              backgroundColor: '#4338CA',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '10px 24px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
            }}
          >
            Add Student
          </Button>
        )}
      </Box>
    </Box>
  );
};
