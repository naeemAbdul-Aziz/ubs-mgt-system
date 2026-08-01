import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SubjectCatalogItem } from '@ubs-lmis/types';

interface SubjectCatalogCardProps {
  subjects: SubjectCatalogItem[];
}

export const SubjectCatalogCard: React.FC<SubjectCatalogCardProps> = ({ subjects }) => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Table Header */}
      <Box style={{ padding: '32px', borderBottom: '1px solid rgba(200, 197, 208, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
          Subject Catalog
        </Typography>
        <Button
          variant="outlined"
          style={{
            borderColor: '#787680',
            color: '#111C2D',
            borderRadius: '9999px',
            padding: '8px 20px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
          }}
        >
          Export Catalog
        </Button>
      </Box>

      {/* Table Content */}
      <Box style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F0F3FF', borderBottom: '1px solid rgba(200, 197, 208, 0.2)' }}>
              <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Subject Name
              </th>
              <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Code
              </th>
              <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Category
              </th>
              <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>
                Credits
              </th>
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
            {subjects.map((sub) => {
              const isCore = sub.category === 'Core';
              return (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(200, 197, 208, 0.1)' }}>
                  <td style={{ padding: '20px 32px', fontWeight: 500, color: '#070235' }}>
                    {sub.subjectName}
                  </td>
                  <td style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: '12px', color: '#47464F' }}>
                    {sub.code}
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: isCore ? '#EFF6FF' : '#F3E8FF',
                        color: isCore ? '#1D4ED8' : '#7E22CE',
                        border: `1px solid ${isCore ? '#DBEAFE' : '#E9D5FF'}`,
                      }}
                    >
                      {sub.category}
                    </span>
                  </td>
                  <td style={{ padding: '20px 32px', textAlign: 'right', fontWeight: 600, color: '#070235' }}>
                    {sub.credits.toFixed(1)}
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
