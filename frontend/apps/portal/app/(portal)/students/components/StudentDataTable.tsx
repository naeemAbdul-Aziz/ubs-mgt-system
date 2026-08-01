import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';
import { MoreHorizontal } from 'lucide-react';
import { Student } from '@ubs-lmis/types';

interface StudentDataTableProps {
  students: Student[];
  onSelectStudent: (s: Student) => void;
}

export const StudentDataTable: React.FC<StudentDataTableProps> = ({ students, onSelectStudent }) => {
  return (
    <Box style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.6)', color: '#64748B', backgroundColor: 'rgba(249, 249, 255, 0.3)' }}>
            <th style={{ padding: '20px 32px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student
            </th>
            <th style={{ padding: '20px 32px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student ID
            </th>
            <th style={{ padding: '20px 32px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Grade
            </th>
            <th style={{ padding: '20px 32px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status
            </th>
            <th style={{ padding: '20px 32px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
          {students.map((student) => {
            const isSuspended = student.status === 'SUSPENDED';
            const initials = `${student.firstName[0]}${student.lastName[0]}`;

            return (
              <tr
                key={student.id}
                style={{
                  borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
                  transition: 'background-color 0.15s ease-in-out',
                }}
              >
                {/* Student Avatar + Name */}
                <td style={{ padding: '20px 32px' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Avatar
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: 'rgba(30, 27, 75, 0.05)',
                        color: '#0F172A',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        border: '1px solid rgba(30, 27, 75, 0.08)',
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body1"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          color: '#0F172A',
                          cursor: 'pointer',
                        }}
                        onClick={() => onSelectStudent(student)}
                      >
                        {student.firstName} {student.lastName}
                      </Typography>
                      <Typography variant="caption" style={{ color: 'rgba(100, 116, 139, 0.6)', fontSize: '13px' }}>
                        {student.guardianName ? `Guardian: ${student.guardianName}` : 'Day Student'}
                      </Typography>
                    </Box>
                  </Box>
                </td>

                {/* Student ID */}
                <td style={{ padding: '20px 32px', fontFamily: 'monospace', fontSize: '13px', color: 'rgba(100, 116, 139, 0.6)', fontWeight: 300 }}>
                  {student.studentNumber}
                </td>

                {/* Grade Level */}
                <td style={{ padding: '20px 32px', color: '#0F172A', fontWeight: 500 }}>
                  {student.currentClassName || 'JHS 2'}
                </td>

                {/* Status Pill Badge */}
                <td style={{ padding: '20px 32px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: isSuspended ? '#FEE2E2' : '#DCFCE7',
                      color: isSuspended ? '#991B1B' : '#166534',
                      border: `1px solid ${isSuspended ? 'rgba(254, 202, 202, 0.5)' : 'rgba(187, 247, 208, 0.5)'}`,
                    }}
                  >
                    {student.status}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                  <IconButton onClick={() => onSelectStudent(student)} style={{ borderRadius: '50%', padding: '8px' }}>
                    <MoreHorizontal size={20} color="#64748B" />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};
