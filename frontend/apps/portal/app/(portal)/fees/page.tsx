'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert } from '@mui/material';
import { FinanceAPI } from '@ubs-lmis/api-client';
import { FinanceTransaction } from '@ubs-lmis/types';

import { FinanceHeader } from './components/FinanceHeader';
import { FinanceStatCards } from './components/FinanceStatCards';
import { FinanceLedgerTable } from './components/FinanceLedgerTable';
import { StudentFeesView } from './components/StudentFeesView';
import { useAuth } from '../../providers/AuthProvider';

export default function FeesPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const personType = userProfile?.personType ?? null;
  const perms = userProfile?.permissions || [];
  // Full ledger: accountant and admin only (INVOICE_VIEW or FEE_SCHEDULE_MANAGE)
  const canViewLedger =
    personType === 'STAFF' &&
    (perms.includes('INVOICE_VIEW') ||
      perms.includes('FEE_SCHEDULE_MANAGE') ||
      perms.includes('BILLING_RUN_EXECUTE'));

  useEffect(() => {
    if (authLoading) return;
    const init = async () => {
      setLoading(true);
      try {
        if (canViewLedger) {
          const data = await FinanceAPI.getTransactions();
          setTransactions(data);
        }
      } catch (err) {
        console.error('Failed to load fees page:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [authLoading, canViewLedger]);

  const handleRunAutoAllocation = async () => {
    setIsAllocating(true);
    setSuccessMsg(null);
    try {
      await FinanceAPI.executeBillingRun({ academicYearId: 'year-1', termId: 'term-3' });
      setSuccessMsg('Auto-Allocation engine successfully matched GHS 16,700 of pending deposits to outstanding invoices!');
      const data = await FinanceAPI.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to run auto-allocation:', err);
    } finally {
      setIsAllocating(false);
    }
  };

  // Student or Guardian sees personal / ward fees view
  if (personType === 'STUDENT' || personType === 'GUARDIAN') {
    return <StudentFeesView />;
  }

  // Staff without finance access: access denied
  if (personType === 'STAFF' && !canViewLedger) {
    return (
      <Box style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '40px' }}>
        <Alert severity="warning" style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}>
          <strong>Access Restricted:</strong> Finance ledger access requires Accountant or Administrator privileges.
        </Alert>
      </Box>
    );
  }

  // Accountant / Admin: full ledger view
  return (
    <Box style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <FinanceHeader />

      {successMsg && (
        <Alert severity="success" style={{ marginBottom: '24px', borderRadius: '12px' }}>
          {successMsg}
        </Alert>
      )}

      {/* Simplified Stat Cards */}
      <FinanceStatCards
        onRunAutoAllocation={handleRunAutoAllocation}
        isAllocating={isAllocating}
      />

      {/* Ledger Transactions Table */}
      <FinanceLedgerTable
        transactions={transactions}
        onViewHistory={() => router.push('/fees/payments')}
      />
    </Box>
  );
}
