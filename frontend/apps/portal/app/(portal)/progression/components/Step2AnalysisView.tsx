import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart3 } from 'lucide-react';
import { StudentProgressionDecision } from '@ubs-lmis/types';

interface Step2AnalysisViewProps {
  decisions: StudentProgressionDecision[];
}

export const Step2AnalysisView: React.FC<Step2AnalysisViewProps> = ({ decisions }) => {
  return (
    <Box>
      {/* Title Header */}
      <Box style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Box
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(75, 65, 225, 0.1)',
            color: '#4B41E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BarChart3 size={24} />
        </Box>
        <Box>
          <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
            Performance Analysis
          </Typography>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Automated evaluation based on defined parameters.
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards Row */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: Promoted */}
        <Box style={{ padding: '16px 20px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
            Promoted
          </Typography>
          <Typography variant="h4" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#14532D', margin: '4px 0' }}>
            2,142
          </Typography>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#166534', fontSize: '0.75rem' }}>
            87.4% of total population
          </Typography>
        </Box>

        {/* Card 2: Graduating */}
        <Box style={{ padding: '16px 20px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #DBEAFE' }}>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase' }}>
            Graduating
          </Typography>
          <Typography variant="h4" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#1E3A8A', margin: '4px 0' }}>
            415
          </Typography>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#1E40AF', fontSize: '0.75rem' }}>
            Final year students
          </Typography>
        </Box>

        {/* Card 3: Retained */}
        <Box style={{ padding: '16px 20px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FEE2E2' }}>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase' }}>
            Retained
          </Typography>
          <Typography variant="h4" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#7F1D1D', margin: '4px 0' }}>
            308
          </Typography>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#991B1B', fontSize: '0.75rem' }}>
            Review recommended
          </Typography>
        </Box>
      </Box>

      {/* Analysis Table */}
      <Box style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(200, 197, 208, 0.3)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#E7EEFF', borderBottom: '1px solid rgba(200, 197, 208, 0.3)' }}>
              <th style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#47464F' }}>
                Student Name
              </th>
              <th style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#47464F' }}>
                Class
              </th>
              <th style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#47464F', textAlign: 'center' }}>
                Avg. Mark
              </th>
              <th style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#47464F', textAlign: 'right' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
            {decisions.map((student) => {
              const isPromoted = student.finalDecision === 'PROMOTE';
              const isGraduating = student.finalDecision === 'GRADUATE';

              return (
                <tr key={student.studentId} style={{ borderBottom: '1px solid rgba(200, 197, 208, 0.1)' }}>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#070235' }}>
                    {student.studentName}
                  </td>
                  <td style={{ padding: '16px', color: '#47464F', fontSize: '0.85rem' }}>
                    {student.currentClassName}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: 500 }}>
                    {student.averageScore.toFixed(1)}%
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: isPromoted ? '#DCFCE7' : isGraduating ? '#DBEAFE' : '#FEE2E2',
                        color: isPromoted ? '#166534' : isGraduating ? '#1E40AF' : '#991B1B',
                      }}
                    >
                      {isPromoted ? 'Promoted' : isGraduating ? 'Graduating' : 'Retained'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};
