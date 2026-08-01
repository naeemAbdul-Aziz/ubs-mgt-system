import React from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';

interface AttendanceControlPanelProps {
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  attendanceDate: string;
  setAttendanceDate: (date: string) => void;
  onMarkAllPresent: () => void;
}

export const AttendanceControlPanel: React.FC<AttendanceControlPanelProps> = ({
  selectedClass,
  setSelectedClass,
  attendanceDate,
  setAttendanceDate,
  onMarkAllPresent,
}) => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
      }}
    >
      <TextField
        select
        label="Select Class Roster"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        style={{ flexGrow: 1, minWidth: '200px' }}
        slotProps={{
          input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
        }}
      >
        <MenuItem value="cls-1">Basic 1A</MenuItem>
        <MenuItem value="cls-2">Basic 5A (Current)</MenuItem>
        <MenuItem value="cls-3">JHS 1A</MenuItem>
        <MenuItem value="cls-4">JHS 3A</MenuItem>
      </TextField>

      <TextField
        label="Attendance Date"
        type="date"
        slotProps={{
          inputLabel: { shrink: true },
          input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
        }}
        value={attendanceDate}
        onChange={(e) => setAttendanceDate(e.target.value)}
        style={{ flexGrow: 1, minWidth: '200px' }}
      />

      <Box style={{ flexGrow: 1, minWidth: '200px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onMarkAllPresent}
          style={{
            borderColor: '#787680',
            color: '#070235',
            borderRadius: '9999px',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            padding: '10px 24px',
          }}
        >
          Mark All Present
        </Button>
      </Box>
    </Box>
  );
};
