import React from 'react';
import { Box, Select, MenuItem, Typography } from '@mui/material';

interface StudentTableFiltersProps {
  selectedGrade: string;
  onGradeChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  totalCount: number;
}

export const StudentTableFilters: React.FC<StudentTableFiltersProps> = ({
  selectedGrade,
  onGradeChange,
  selectedStatus,
  onStatusChange,
  totalCount,
}) => {
  return (
    <Box
      style={{
        padding: '24px 32px',
        borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box style={{ display: 'flex', gap: '12px' }}>
        <Select
          size="small"
          value={selectedGrade}
          onChange={(e) => onGradeChange(e.target.value)}
          displayEmpty
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '9999px',
            border: '1px solid rgba(30, 27, 75, 0.08)',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          <MenuItem value="">All Grades</MenuItem>
          <MenuItem value="Nursery 1">Nursery 1</MenuItem>
          <MenuItem value="KG 1">KG 1</MenuItem>
          <MenuItem value="Primary 1">Primary 1</MenuItem>
          <MenuItem value="Primary 3">Primary 3</MenuItem>
          <MenuItem value="JHS 1">JHS 1</MenuItem>
          <MenuItem value="JHS 2">JHS 2</MenuItem>
          <MenuItem value="JHS 3">JHS 3</MenuItem>
        </Select>

        <Select
          size="small"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          displayEmpty
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '9999px',
            border: '1px solid rgba(30, 27, 75, 0.08)',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          <MenuItem value="">Status: All</MenuItem>
          <MenuItem value="ENROLLED">Status: Enrolled</MenuItem>
          <MenuItem value="SUSPENDED">Status: Suspended</MenuItem>
        </Select>
      </Box>

      <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(100, 116, 139, 0.7)', fontSize: '0.875rem' }}>
        Showing <strong style={{ color: '#0F172A' }}>1-{totalCount}</strong> of 452 students
      </Typography>
    </Box>
  );
};
