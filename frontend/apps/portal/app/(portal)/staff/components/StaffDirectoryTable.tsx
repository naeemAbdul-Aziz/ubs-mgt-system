import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Staff } from '@ubs-lmis/types';

interface StaffDirectoryTableProps {
  staffList: Staff[];
}

export const StaffDirectoryTable: React.FC<StaffDirectoryTableProps> = ({ staffList }) => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        overflow: 'hidden',
      }}
    >
      <TableContainer style={{ maxHeight: '700px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Staff Number
              </TableCell>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Full Name
              </TableCell>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Staff Type
              </TableCell>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                GES Reg. No.
              </TableCell>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Contact Details
              </TableCell>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Subjects Taught
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
            {staffList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" style={{ padding: '64px 32px' }}>
                  <Typography variant="body1" style={{ color: '#47464F', fontFamily: 'Inter, sans-serif' }}>
                    No staff records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              staffList.map((staff) => (
                <TableRow key={staff.id} hover style={{ borderBottom: '1px solid rgba(200, 197, 208, 0.1)' }}>
                  <TableCell style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: '12px', color: '#47464F' }}>
                    {staff.staffNumber}
                  </TableCell>
                  <TableCell style={{ padding: '20px 32px', fontWeight: 500, color: '#070235' }}>
                    {staff.firstName} {staff.lastName}
                  </TableCell>
                  <TableCell style={{ padding: '20px 32px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: staff.staffType === 'TEACHING' ? '#ECFDF5' : '#EFF6FF',
                        color: staff.staffType === 'TEACHING' ? '#047857' : '#1D4ED8',
                        border: `1px solid ${staff.staffType === 'TEACHING' ? '#A7F3D0' : '#DBEAFE'}`,
                      }}
                    >
                      {staff.staffType}
                    </span>
                  </TableCell>
                  <TableCell style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: '12px', color: '#47464F' }}>
                    {staff.gesRegistrationNo || 'N/A'}
                  </TableCell>
                  <TableCell style={{ padding: '20px 32px' }}>
                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#070235' }}>
                        {staff.phone || 'N/A'}
                      </Typography>
                      <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
                        {staff.email || ''}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell style={{ padding: '20px 32px' }}>
                    {staff.subjectsTaught ? (
                      <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {staff.subjectsTaught.map((sub, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '2px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: '#F8F9FA',
                              border: '1px solid #E2E8F0',
                              color: '#47464F',
                            }}
                          >
                            {sub}
                          </span>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
