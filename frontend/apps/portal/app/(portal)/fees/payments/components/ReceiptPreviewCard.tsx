import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle, Printer, Receipt } from 'lucide-react';
import { Payment } from '@ubs-lmis/types';

interface ReceiptPreviewCardProps {
  receipt: Payment | null;
  onPrint: () => void;
}

export const ReceiptPreviewCard: React.FC<ReceiptPreviewCardProps> = ({ receipt, onPrint }) => {
  if (!receipt) {
    return (
      <Box
        style={{
          backgroundColor: '#F8F1E7',
          borderRadius: '20px',
          border: '1px dashed rgba(30, 27, 75, 0.2)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <Receipt size={48} color="rgba(30, 27, 75, 0.3)" style={{ marginBottom: '16px' }} />
        <Typography
          variant="h6"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#070235',
            marginBottom: '8px',
          }}
        >
          Receipt Preview
        </Typography>
        <Typography
          variant="body2"
          style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}
        >
          Complete the payment form to generate an official digital payment receipt.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '2px solid #047857',
        padding: '32px',
        height: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle size={28} color="#047857" />
          <Typography
            variant="h5"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#047857',
            }}
          >
            Payment Receipt Issued
          </Typography>
        </Box>
        <Button
          onClick={onPrint}
          variant="outlined"
          startIcon={<Printer size={18} />}
          style={{
            borderColor: '#787680',
            color: '#070235',
            borderRadius: '9999px',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            padding: '6px 16px',
          }}
        >
          Print
        </Button>
      </Box>

      <Box style={{ borderBottom: '1px dashed rgba(30, 27, 75, 0.2)', marginBottom: '24px' }} />

      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
        <Box>
          <Typography variant="caption" style={{ color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Receipt Number
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 700, color: '#4B41E1', fontFamily: 'monospace', fontSize: '1rem' }}>
            {receipt.receiptNumber}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="caption" style={{ color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Payment Date
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 600, color: '#070235' }}>
            {receipt.paymentDate}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" style={{ color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Amount Paid
          </Typography>
          <Typography variant="h5" style={{ fontWeight: 800, color: '#047857' }}>
            GH₵ {receipt.amountPaid.toFixed(2)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" style={{ color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Payment Method
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 600, color: '#070235' }}>
            {receipt.paymentMethod}
          </Typography>
        </Box>

        <Box style={{ gridColumn: 'span 2' }}>
          <Typography variant="caption" style={{ color: '#47464F', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Reference Number
          </Typography>
          <Typography variant="body1" style={{ fontWeight: 600, color: '#070235', fontFamily: 'monospace' }}>
            {receipt.referenceNumber || 'N/A'}
          </Typography>
        </Box>
      </Box>

      {/* Decorative Stamp */}
      <Box
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        <CheckCircle size={120} />
      </Box>
    </Box>
  );
};
