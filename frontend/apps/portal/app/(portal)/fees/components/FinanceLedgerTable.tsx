import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Search, SlidersHorizontal, Smartphone, Landmark, Banknote } from 'lucide-react';
import { FinanceTransaction } from '@ubs-lmis/types';

interface FinanceLedgerTableProps {
  transactions: FinanceTransaction[];
  onViewHistory: () => void;
}

export const FinanceLedgerTable: React.FC<FinanceLedgerTableProps> = ({ transactions, onViewHistory }) => {
  const getMethodIcon = (method: string) => {
    if (method === 'MoMo') return <Smartphone size={18} color="#787680" />;
    if (method === 'Bank') return <Landmark size={18} color="#787680" />;
    return <Banknote size={18} color="#787680" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ALLOCATED') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', fontSize: '11px', fontWeight: 600 }}>
          Allocated
        </span>
      );
    }
    if (status === 'PARTIALLY') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', fontSize: '11px', fontWeight: 600 }}>
          Partially
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '9999px', backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 600 }}>
        Pending
      </span>
    );
  };

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(30, 27, 75, 0.05)',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(7, 2, 53, 0.03)',
      }}
    >
      {/* Table Header */}
      <Box style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <Typography variant="subtitle1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#070235' }}>
          RECENT TRANSACTIONS
        </Typography>

        <Box style={{ display: 'flex', gap: '8px' }}>
          <IconButton style={{ border: '1px solid rgba(200, 197, 208, 0.4)', borderRadius: '8px', padding: '8px' }}>
            <Search size={18} color="#47464F" />
          </IconButton>
          <IconButton style={{ border: '1px solid rgba(200, 197, 208, 0.4)', borderRadius: '8px', padding: '8px' }}>
            <SlidersHorizontal size={18} color="#47464F" />
          </IconButton>
        </Box>
      </Box>

      {/* Table Content */}
      <Box style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8F9FA', borderTop: '1px solid rgba(200, 197, 208, 0.2)', borderBottom: '1px solid rgba(200, 197, 208, 0.2)' }}>
              <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', padding: '12px 24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Student Entity
              </th>
              <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', padding: '12px 24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ref ID
              </th>
              <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', padding: '12px 24px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Method
              </th>
              <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', padding: '12px 24px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                Credit (GHS)
              </th>
              <th style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#47464F', padding: '12px 24px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                style={{
                  borderBottom: '1px solid rgba(200, 197, 208, 0.1)',
                  transition: 'background-color 0.15s ease-in-out',
                }}
              >
                {/* Student Entity */}
                <td style={{ padding: '16px 24px' }}>
                  <Typography variant="body2" style={{ fontWeight: 500, color: '#070235', fontFamily: 'Inter, sans-serif' }}>
                    {txn.studentName}
                  </Typography>
                  <Typography variant="caption" style={{ color: '#47464F', fontSize: '12px' }}>
                    {txn.className} • {txn.studentCode}
                  </Typography>
                </td>

                {/* Ref ID */}
                <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '12px', color: '#47464F' }}>
                  {txn.referenceId}
                </td>

                {/* Method */}
                <td style={{ padding: '16px 24px' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getMethodIcon(txn.paymentMethod)}
                    <span style={{ fontSize: '0.875rem', color: '#111C2D' }}>{txn.paymentMethod}</span>
                  </Box>
                </td>

                {/* Credit */}
                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 600, color: '#070235', fontVariantNumeric: 'tabular-nums' }}>
                  {txn.creditAmount.toFixed(2)}
                </td>

                {/* Status */}
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  {getStatusBadge(txn.allocationStatus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {/* Footer Link */}
      <Box style={{ padding: '16px', borderTop: '1px solid rgba(200, 197, 208, 0.1)', textAlign: 'center', backgroundColor: 'rgba(248, 249, 255, 0.3)' }}>
        <Button
          onClick={onViewHistory}
          style={{ fontFamily: 'Inter, sans-serif', color: '#070235', fontSize: '13px', textTransform: 'none', fontWeight: 600 }}
        >
          Full Transaction History →
        </Button>
      </Box>
    </Box>
  );
};
