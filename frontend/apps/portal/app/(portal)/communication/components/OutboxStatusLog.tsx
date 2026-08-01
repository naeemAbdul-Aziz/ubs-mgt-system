import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { OutboxLogItem } from '@ubs-lmis/types';
import { EmptyState } from '../../../components/EmptyState';

interface OutboxStatusLogProps {
  logs: OutboxLogItem[];
}

export const OutboxStatusLog: React.FC<OutboxStatusLogProps> = ({ logs }) => {
  const getStatusBadge = (status: string) => {
    if (status === 'SENT') {
      return (
        <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
          Sent
        </span>
      );
    }
    if (status === 'PENDING') {
      return (
        <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
          Pending
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFF1F2', color: '#9F1239', border: '1px solid #FFE4E6', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
        Failed
      </span>
    );
  };

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(7, 2, 53, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Table Header */}
      <Box
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(200, 197, 208, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
          Outbox Status Log
        </Typography>
        <Button style={{ fontFamily: 'Inter, sans-serif', color: '#4B41E1', fontWeight: 600, textTransform: 'none' }}>
          View All
        </Button>
      </Box>

      {/* Table Content */}
      {logs.length === 0 ? (
        <Box style={{ padding: '24px' }}>
          <EmptyState
            title="No Outbox Messages"
            description="You haven't dispatched any announcements yet. Use the composer above to broadcast a message to parents or staff."
          />
        </Box>
      ) : (
        <Box style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Broadcast Subject
                </th>
                <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Audience
                </th>
                <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Timestamp
                </th>
                <th style={{ padding: '16px 32px', fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(200, 197, 208, 0.1)' }}>
                  <td style={{ padding: '20px 32px' }}>
                    <Typography variant="body1" style={{ fontWeight: 600, color: '#070235', fontFamily: 'Inter, sans-serif' }}>
                      {log.subject}
                    </Typography>
                    <Typography variant="caption" style={{ color: '#47464F', fontSize: '13px' }}>
                      {log.channels}
                    </Typography>
                  </td>
                  <td style={{ padding: '20px 32px', color: '#111C2D' }}>{log.audience}</td>
                  <td style={{ padding: '20px 32px', color: '#47464F' }}>{log.timestamp}</td>
                  <td style={{ padding: '20px 32px' }}>{getStatusBadge(log.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
};
