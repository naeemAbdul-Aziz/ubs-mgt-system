import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportCard } from '@ubs-lmis/types';

interface ReportCardStudentBioProps {
  reportCard: ReportCard;
}

export const ReportCardStudentBio: React.FC<ReportCardStudentBioProps> = ({ reportCard }) => {
  return (
    <section style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '40px' }}>
      {/* Left Column */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box style={{ display: 'flex', borderBottom: '1px solid #C8C5D0', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#47464F', width: '128px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            STUDENT NAME
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.125rem', fontWeight: 600, color: '#070235' }}>
            {reportCard.studentName}
          </span>
        </Box>

        <Box style={{ display: 'flex', borderBottom: '1px solid #C8C5D0', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#47464F', width: '128px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            STUDENT ID
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500, color: '#070235', fontVariantNumeric: 'tabular-nums' }}>
            {reportCard.studentNumber}
          </span>
        </Box>

        <Box style={{ display: 'flex', borderBottom: '1px solid #C8C5D0', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#47464F', width: '128px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DATE OF BIRTH
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#111C2D' }}>
            {reportCard.dateOfBirth || '14th September, 2008'}
          </span>
        </Box>
      </Box>

      {/* Right Column */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box style={{ display: 'flex', borderBottom: '1px solid #C8C5D0', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#47464F', width: '128px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CLASS / LEVEL
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500, color: '#070235' }}>
            {reportCard.className}
          </span>
        </Box>

        <Box style={{ display: 'flex', borderBottom: '1px solid #C8C5D0', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#47464F', width: '128px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HOUSE
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#111C2D' }}>
            {reportCard.house || 'Aggrey House'}
          </span>
        </Box>

        <Box style={{ display: 'flex', borderBottom: '1px solid #C8C5D0', paddingBottom: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#47464F', width: '128px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ATTENDANCE
          </span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#111C2D', fontVariantNumeric: 'tabular-nums' }}>
            {reportCard.attendanceDays || '68 / 70 Days'}
          </span>
        </Box>
      </Box>
    </section>
  );
};
