import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface StudentPaginationFooterProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const StudentPaginationFooter: React.FC<StudentPaginationFooterProps> = ({ page, totalPages, onPageChange }) => {
  return (
    <Box
      style={{
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(249, 249, 255, 0.3)',
        borderTop: '1px solid rgba(226, 232, 240, 0.6)',
      }}
    >
      <Button
        disabled={page === 0}
        onClick={() => onPageChange(Math.max(0, page - 1))}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          color: page === 0 ? 'rgba(100, 116, 139, 0.5)' : '#0F172A',
          textTransform: 'none',
        }}
      >
        Previous
      </Button>

      <Box style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}>
          Page {page + 1} of {Math.max(1, totalPages)}
        </Typography>
      </Box>

      <Button
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: page >= totalPages - 1 ? 'rgba(100, 116, 139, 0.5)' : '#0F172A',
          textTransform: 'none',
        }}
      >
        Next
      </Button>
    </Box>
  );
};
