import React from 'react';
import { Box, Typography } from '@mui/material';
import { AssessmentGridStudent } from '@ubs-lmis/types';
import { AssessmentGridRow } from './AssessmentGridRow';
import { EmptyState } from '../../../components/EmptyState';

interface AssessmentGridTableProps {
  students: AssessmentGridStudent[];
  onScoreChange: (studentId: string, field: 'cw' | 'mt' | 'exam', value: number) => void;
}

export const AssessmentGridTable: React.FC<AssessmentGridTableProps> = ({
  students,
  onScoreChange,
}) => {
  // Compute class average & highest total score dynamically
  const totals = students.map((s) => (s.cw || 0) + (s.mt || 0) + (s.exam || 0));
  const classAvg = totals.length > 0 ? (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1) : '72.4';
  const highestScore = totals.length > 0 ? Math.max(...totals) : 95;

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid rgba(200, 197, 208, 0.3)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(7, 2, 53, 0.05)',
      }}
    >
      {/* Sticky Grid Header */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(200, 197, 208, 0.3)',
          marginBottom: '12px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'rgba(71, 70, 79, 0.8)',
          backgroundColor: '#FFFFFF',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Box style={{ gridColumn: 'span 3', paddingLeft: '12px' }}>Student Name</Box>
        <Box style={{ gridColumn: 'span 2', textAlign: 'center' }}>ID</Box>
        <Box style={{ gridColumn: 'span 1', textAlign: 'center' }}>
          CW <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.6 }}>(30%)</span>
        </Box>
        <Box style={{ gridColumn: 'span 1', textAlign: 'center' }}>
          MT <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.6 }}>(20%)</span>
        </Box>
        <Box style={{ gridColumn: 'span 1', textAlign: 'center' }}>
          Exam <span style={{ fontSize: '11px', fontWeight: 400, opacity: 0.6 }}>(50%)</span>
        </Box>
        <Box style={{ gridColumn: 'span 2', textAlign: 'center', fontWeight: 700, color: '#070235' }}>
          Total Score
        </Box>
        <Box style={{ gridColumn: 'span 2', textAlign: 'center' }}>GES Grade</Box>
      </Box>

      {/* Grid Rows Body */}
      {students.length === 0 ? (
        <Box style={{ padding: '24px' }}>
          <EmptyState
            title="No Assessment Data Found"
            description="There are currently no students or assessment scores matching the selected class and subject filter."
          />
        </Box>
      ) : (
        <Box style={{ display: 'flex', flexDirection: 'column', maxHeight: '560px', overflowY: 'auto' }}>
          {students.map((student) => (
            <AssessmentGridRow key={student.id} student={student} onScoreChange={onScoreChange} />
          ))}
        </Box>
      )}

      {/* Grid Summary Footer */}
      <Box
        style={{
          marginTop: 'auto',
          paddingTop: '20px',
          borderTop: '1px solid rgba(200, 197, 208, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.875rem',
          color: 'rgba(71, 70, 79, 0.8)',
        }}
      >
        <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(71, 70, 79, 0.8)' }}>
          Showing 35 of 35 Students
        </Typography>

        <Box style={{ display: 'flex', gap: '24px' }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>Class Avg: {classAvg}</span>
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
            <span>Highest: {highestScore}</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
