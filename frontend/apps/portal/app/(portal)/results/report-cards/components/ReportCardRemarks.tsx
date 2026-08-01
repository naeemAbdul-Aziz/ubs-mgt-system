import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportCard } from '@ubs-lmis/types';

interface ReportCardRemarksProps {
  reportCard: ReportCard;
}

export const ReportCardRemarks: React.FC<ReportCardRemarksProps> = ({ reportCard }) => {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        marginTop: '64px',
        paddingTop: '32px',
        borderTop: '2px solid rgba(7, 2, 53, 0.2)',
      }}
    >
      {/* Teacher's Remarks */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <Box>
          <Typography
            variant="subtitle2"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#070235',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Class Teacher's Remarks
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#111C2D',
              lineHeight: 1.6,
              minHeight: '60px',
            }}
          >
            {reportCard.classTeacherRemark}
          </Typography>

          <Box style={{ marginTop: '32px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
            <Box style={{ width: '192px', borderBottom: '2px solid rgba(7, 2, 53, 0.4)', position: 'relative', minHeight: '40px' }}>
              {reportCard.teacherSignatureUrl && (
                <img
                  src={reportCard.teacherSignatureUrl}
                  alt="Teacher Signature"
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: 0,
                    width: '128px',
                    opacity: 0.8,
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              )}
            </Box>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#47464F', fontWeight: 500 }}>
              SIGNATURE & DATE
            </span>
          </Box>
        </Box>
      </Box>

      {/* Headmaster's Verdict */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <Box>
          <Typography
            variant="subtitle2"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#070235',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Headmaster's Final Verdict
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#111C2D',
              lineHeight: 1.6,
              minHeight: '60px',
            }}
          >
            {reportCard.headteacherRemark}
          </Typography>

          <Box style={{ marginTop: '32px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
            <Box style={{ width: '192px', borderBottom: '2px solid rgba(7, 2, 53, 0.4)', position: 'relative', minHeight: '40px' }}>
              {reportCard.headmasterSignatureUrl && (
                <img
                  src={reportCard.headmasterSignatureUrl}
                  alt="Headmaster Signature"
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: 0,
                    width: '128px',
                    opacity: 0.8,
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              )}
            </Box>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#47464F', fontWeight: 500 }}>
              OFFICIAL STAMP & SIGNATURE
            </span>
          </Box>
        </Box>
      </Box>
    </section>
  );
};
