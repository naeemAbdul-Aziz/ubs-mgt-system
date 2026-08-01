'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Alert, Snackbar } from '@mui/material';
import { FinanceAPI, StudentsAPI } from '@ubs-lmis/api-client';
import { Payment, PaymentRequest, Student } from '@ubs-lmis/types';

import { PaymentHeader } from './components/PaymentHeader';
import { PaymentFormCard } from './components/PaymentFormCard';
import { ReceiptPreviewCard } from './components/ReceiptPreviewCard';

export default function PaymentEntryPage() {
  const [formData, setFormData] = useState<PaymentRequest>({
    studentId: '',
    amountPaid: 0.0,
    paymentMethod: 'MOBILE_MONEY',
    referenceNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [students, setStudents] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      try {
        const [studentsData, invoicesData] = await Promise.all([
          StudentsAPI.getStudentLookups(),
          FinanceAPI.getInvoices()
        ]);
        setStudents(studentsData);
        setInvoices(invoicesData);
      } catch (err) {
        console.error('Failed to load students and invoices:', err);
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amountPaid || formData.amountPaid <= 0) return;

    setLoading(true);
    setSuccessMsg(null);

    try {
      const result = await FinanceAPI.recordPayment(formData);
      setReceipt(result);
      setSuccessMsg(`Payment of GH₵ ${result.amountPaid.toFixed(2)} recorded and allocated successfully!`);
      
      // Refresh invoices to update outstanding balance
      const newInvoices = await FinanceAPI.getInvoices();
      setInvoices(newInvoices);
      
      // Reset form slightly
      setFormData(prev => ({...prev, amountPaid: 0, referenceNumber: ''}));
    } catch (err) {
      console.error('Payment capture failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <Box style={{ maxWidth: '1440px', margin: '0 auto' }}>
      <PaymentHeader />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PaymentFormCard 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmitPayment}
            loading={loading || dataLoading}
            students={students}
            invoices={invoices}
          />
        </Grid>
        
        <Grid size={{ xs: 12, lg: 6 }}>
          <ReceiptPreviewCard 
            receipt={receipt}
            onPrint={handlePrintReceipt}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={Boolean(successMsg)}
        autoHideDuration={5000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)} style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
