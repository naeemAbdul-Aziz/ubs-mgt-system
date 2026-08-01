import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ButtonGroup, Button } from '@mui/material';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { AttendanceStatus } from '@ubs-lmis/types';

export interface StudentRosterItem {
  studentId: string;
  studentNumber: string;
  studentName: string;
  status: AttendanceStatus;
  remarks?: string;
}

interface AttendanceRosterTableProps {
  roster: StudentRosterItem[];
  handleStatusToggle: (studentId: string, newStatus: AttendanceStatus) => void;
}

export const AttendanceRosterTable: React.FC<AttendanceRosterTableProps> = ({ roster, handleStatusToggle }) => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        overflow: 'hidden',
      }}
    >
      <TableContainer style={{ maxHeight: '600px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Student ID
              </TableCell>
              <TableCell style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Student Name
              </TableCell>
              <TableCell align="center" style={{ backgroundColor: '#F0F3FF', padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Mark Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
            {roster.map((item) => (
              <TableRow key={item.studentId} hover style={{ borderBottom: '1px solid rgba(200, 197, 208, 0.1)' }}>
                <TableCell style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: '12px', color: '#47464F' }}>
                  {item.studentNumber}
                </TableCell>
                <TableCell style={{ padding: '20px 32px', fontWeight: 500, color: '#070235' }}>
                  {item.studentName}
                </TableCell>
                <TableCell align="center" style={{ padding: '20px 32px' }}>
                  <ButtonGroup size="small" disableElevation style={{ backgroundColor: '#F8FAFC', borderRadius: '9999px', padding: '4px', border: '1px solid #E2E8F0' }}>
                    <Button
                      onClick={() => handleStatusToggle(item.studentId, 'PRESENT')}
                      style={{
                        backgroundColor: item.status === 'PRESENT' ? '#DCFCE7' : 'transparent',
                        color: item.status === 'PRESENT' ? '#16A34A' : '#94A3B8',
                        border: 'none',
                        borderRadius: '9999px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: item.status === 'PRESENT' ? 600 : 500,
                        textTransform: 'none',
                        padding: '6px 16px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.status === 'PRESENT' && <CheckCircle2 size={16} style={{ marginRight: '6px' }} />}
                      Present
                    </Button>
                    <Button
                      onClick={() => handleStatusToggle(item.studentId, 'ABSENT')}
                      style={{
                        backgroundColor: item.status === 'ABSENT' ? '#FEE2E2' : 'transparent',
                        color: item.status === 'ABSENT' ? '#DC2626' : '#94A3B8',
                        border: 'none',
                        borderRadius: '9999px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: item.status === 'ABSENT' ? 600 : 500,
                        textTransform: 'none',
                        padding: '6px 16px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.status === 'ABSENT' && <XCircle size={16} style={{ marginRight: '6px' }} />}
                      Absent
                    </Button>
                    <Button
                      onClick={() => handleStatusToggle(item.studentId, 'LATE')}
                      style={{
                        backgroundColor: item.status === 'LATE' ? '#FEF3C7' : 'transparent',
                        color: item.status === 'LATE' ? '#D97706' : '#94A3B8',
                        border: 'none',
                        borderRadius: '9999px',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: item.status === 'LATE' ? 600 : 500,
                        textTransform: 'none',
                        padding: '6px 16px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {item.status === 'LATE' && <Clock size={16} style={{ marginRight: '6px' }} />}
                      Late
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
