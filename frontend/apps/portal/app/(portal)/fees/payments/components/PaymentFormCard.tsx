import React, { useMemo } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Grid } from '@mui/material';
import { Receipt } from 'lucide-react';
import { PaymentRequest, PaymentMethod, Student } from '@ubs-lmis/types';
import { Invoice } from '@ubs-lmis/types'; // Assuming this exists or I will mock the type

// Mock Invoice type if not imported properly
interface LocalInvoice {
  id: string;
  enrollmentId: string;
  studentId?: string; // If your backend returns it, else we need a way to map
  totalAmount: number;
  paidAmount: number;
  status: string;
}

interface PaymentFormCardProps {
  formData: PaymentRequest;
  setFormData: (data: PaymentRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  students: any[];
  invoices: any[]; // Using any to avoid strict type issues if Invoice is not fully exported
}

export const PaymentFormCard: React.FC<PaymentFormCardProps> = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  students,
  invoices,
}) => {
  
  // Calculate outstanding balance per student
  // In a real app, invoices would explicitly link to studentId or we resolve via enrollment.
  // We'll compute a rough outstanding map if possible.
  const studentBalances = useMemo(() => {
    const balances: Record<string, number> = {};
    students.forEach(s => {
      balances[s.id] = 0; // Default to 0
    });
    
    invoices.forEach(inv => {
      // Assuming invoice has studentId or we map it. 
      // If the backend doesn't return studentId on Invoice, this might be 0.
      const sid = inv.studentId || inv.enrollment?.student?.id; 
      if (sid && balances[sid] !== undefined) {
        balances[sid] += (inv.totalAmount - inv.paidAmount);
      }
    });
    return balances;
  }, [students, invoices]);

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        padding: '32px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        variant="h5"
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          color: '#070235',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Receipt size={24} color="#070235" />
        Record Fee Payment
      </Typography>

      <form onSubmit={onSubmit}>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TextField
            select
            label="Select Student"
            fullWidth
            required
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            slotProps={{
              input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
            }}
          >
            {students.length === 0 && <MenuItem disabled value="">Loading students...</MenuItem>}
            {students.map(student => {
              const outstanding = studentBalances[student.id] || 0;
              return (
                <MenuItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.currentClassName || 'No Class'} - Outstanding: GH₵ {outstanding.toFixed(2)})
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            label="Amount Paid (GH₵)"
            type="number"
            fullWidth
            required
            value={formData.amountPaid}
            onChange={(e) => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
            slotProps={{
              htmlInput: { min: 1, step: 0.5 },
              input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
            }}
          />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Payment Method"
                fullWidth
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                }
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="MOBILE_MONEY">Mobile Money (MTN / Telecel)</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer / Deposit</MenuItem>
                <MenuItem value="CHEQUE">Bank Cheque</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Reference / Transaction #"
                fullWidth
                value={formData.referenceNumber}
                onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.studentId}
            style={{
              backgroundColor: '#070235',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '14px 24px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(7, 2, 53, 0.15)',
              marginTop: '16px',
            }}
          >
            {loading ? 'Processing Payment...' : 'Record Payment & Auto-Allocate'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
