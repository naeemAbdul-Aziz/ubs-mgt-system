import React from 'react';
import { Box, Typography } from '@mui/material';
import { AssessmentGridStudent } from '@ubs-lmis/types';

interface AssessmentGridRowProps {
  student: AssessmentGridStudent;
  onScoreChange: (studentId: string, field: 'cw' | 'mt' | 'exam', value: number) => void;
}

export const AssessmentGridRow: React.FC<AssessmentGridRowProps> = ({ student, onScoreChange }) => {
  const total = (student.cw || 0) + (student.mt || 0) + (student.exam || 0);

  const calculateGradeInfo = (score: number) => {
    if (score >= 80) return { grade: 'A1', bg: '#ECFDF5', color: '#065F46', border: 'rgba(167, 243, 208, 0.5)' };
    if (score >= 70) return { grade: 'B2', bg: '#EFF6FF', color: '#1E40AF', border: 'rgba(191, 219, 254, 0.5)' };
    if (score >= 65) return { grade: 'B3', bg: '#F0F9FF', color: '#075985', border: 'rgba(186, 230, 253, 0.5)' };
    if (score >= 60) return { grade: 'C4', bg: '#FEFCE8', color: '#854D0E', border: 'rgba(254, 240, 138, 0.5)' };
    if (score >= 55) return { grade: 'C5', bg: '#FFF7ED', color: '#9A3412', border: 'rgba(255, 237, 213, 0.5)' };
    if (score >= 50) return { grade: 'C6', bg: '#FFF7ED', color: '#9A3412', border: 'rgba(255, 237, 213, 0.5)' };
    if (score >= 45) return { grade: 'D7', bg: '#FFF1F2', color: '#9F1239', border: 'rgba(255, 228, 230, 0.5)' };
    if (score >= 40) return { grade: 'E8', bg: '#FFF1F2', color: '#9F1239', border: 'rgba(255, 228, 230, 0.5)' };
    return { grade: 'F9', bg: '#FEF2F2', color: '#991B1B', border: 'rgba(254, 202, 202, 0.5)' };
  };

  const gradeInfo = calculateGradeInfo(total);

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        gap: '12px',
        padding: '16px 12px',
        alignItems: 'center',
        borderBottom: '1px solid rgba(200, 197, 208, 0.1)',
        transition: 'background-color 0.2s ease-in-out',
      }}
    >
      {/* Student Name */}
      <Box style={{ gridColumn: 'span 3', paddingLeft: '12px' }}>
        <Typography
          variant="body1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            color: '#111C2D',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {student.name}
        </Typography>
      </Box>

      {/* Student ID */}
      <Box style={{ gridColumn: 'span 2', textAlign: 'center' }}>
        <Typography
          variant="body2"
          style={{
            fontFamily: 'monospace',
            color: '#47464F',
            fontSize: '13px',
            opacity: 0.75,
          }}
        >
          {student.studentNumber}
        </Typography>
      </Box>

      {/* CW Score Input */}
      <Box style={{ gridColumn: 'span 1', textAlign: 'center' }}>
        <input
          type="number"
          min={0}
          max={30}
          value={student.cw}
          onChange={(e) => onScoreChange(student.id, 'cw', Math.min(30, Math.max(0, Number(e.target.value) || 0)))}
          style={{
            width: '48px',
            textAlign: 'center',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(200, 197, 208, 0.4)',
            padding: '4px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 500,
            outline: 'none',
          }}
        />
      </Box>

      {/* MT Score Input */}
      <Box style={{ gridColumn: 'span 1', textAlign: 'center' }}>
        <input
          type="number"
          min={0}
          max={20}
          value={student.mt}
          onChange={(e) => onScoreChange(student.id, 'mt', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
          style={{
            width: '48px',
            textAlign: 'center',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(200, 197, 208, 0.4)',
            padding: '4px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 500,
            outline: 'none',
          }}
        />
      </Box>

      {/* Exam Score Input */}
      <Box style={{ gridColumn: 'span 1', textAlign: 'center' }}>
        <input
          type="number"
          min={0}
          max={50}
          value={student.exam}
          onChange={(e) => onScoreChange(student.id, 'exam', Math.min(50, Math.max(0, Number(e.target.value) || 0)))}
          style={{
            width: '48px',
            textAlign: 'center',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid rgba(200, 197, 208, 0.4)',
            padding: '4px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 500,
            outline: 'none',
          }}
        />
      </Box>

      {/* Total Score */}
      <Box style={{ gridColumn: 'span 2', textAlign: 'center' }}>
        <Typography
          variant="subtitle1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: '#070235',
            fontSize: '1rem',
          }}
        >
          {total}
        </Typography>
      </Box>

      {/* GES Grade Badge */}
      <Box style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            padding: '2px 14px',
            borderRadius: '9999px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: gradeInfo.bg,
            color: gradeInfo.color,
            border: `1px solid ${gradeInfo.border}`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {gradeInfo.grade}
        </span>
      </Box>
    </Box>
  );
};
