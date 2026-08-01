'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { PayrollAPI, StaffAPI } from '@ubs-lmis/api-client';
import { PayrollRun, SalaryStructure, Staff } from '@ubs-lmis/types';
import { Plus, Play, Lock } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';

export default function PayrollPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'RUNS' | 'STRUCTURES'>('RUNS');

  // Data States
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [structureDialogOpen, setStructureDialogOpen] = useState(false);

  // Forms
  const [newRun, setNewRun] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [newStructure, setNewStructure] = useState({ staffId: '', baseSalary: 0, taxPercentage: 0, allowances: 0 });

  // Access guard — only ACCOUNTANT and HEAD_OF_SCHOOL can access payroll
  const perms = userProfile?.permissions || [];
  const canAccessPayroll = perms.includes('FINANCE_REPORT_VIEW') || perms.includes('PAYROLL_VIEW');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [runsRes, structsRes, staffRes] = await Promise.all([
        PayrollAPI.getPayrollRuns(),
        PayrollAPI.getSalaryStructures(),
        StaffAPI.getStaff(),
      ]);
      setPayrollRuns(runsRes);
      setSalaryStructures(structsRes);
      setStaffList(staffRes.content);
    } catch (err) {
      console.error('Failed to load payroll data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && canAccessPayroll) {
      fetchData();
    } else if (!authLoading && !canAccessPayroll) {
      setLoading(false);
    }
  }, [authLoading, canAccessPayroll]);

  const handleExecuteRun = async () => {
    try {
      await PayrollAPI.executePayrollRun(newRun);
      setRunDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to execute run', err);
      alert('Failed to execute run. It may already exist for this period.');
    }
  };

  const handleSaveStructure = async () => {
    try {
      await PayrollAPI.setSalaryStructure(newStructure);
      setStructureDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save structure', err);
    }
  };

  const formatPeriod = (run: PayrollRun) => {
    try {
      const start = new Date(run.periodStart);
      return start.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch {
      return run.periodStart || '—';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return '—';
    }
  };

  const getAllowancesTotal = (ss: SalaryStructure): number => {
    if (typeof ss.allowances === 'number') return ss.allowances;
    if (ss.allowances && typeof ss.allowances === 'object') {
      return Object.values(ss.allowances).reduce((sum, v) => sum + v, 0);
    }
    return 0;
  };

  const statusColor = (status: string): 'success' | 'warning' | 'default' => {
    if (status === 'PAID') return 'success';
    if (status === 'APPROVED') return 'warning';
    return 'default';
  };

  if (authLoading || loading) {
    return <Box style={{ padding: '40px', textAlign: 'center' }}><CircularProgress /></Box>;
  }

  // Access denied view for non-finance staff
  if (!canAccessPayroll) {
    return (
      <Box style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '40px' }}>
        <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Lock size={48} color="#64748B" />
        </Box>
        <Typography variant="h5" style={{ fontWeight: 700, color: '#0F172A', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
          Access Restricted
        </Typography>
        <Typography variant="body1" style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
          Payroll management is available to Finance staff only. Please contact your administrator if you believe this is an error.
        </Typography>
      </Box>
    );
  }

  return (
    <Box style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Box>
          <Typography variant="h4" style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'Inter' }}>
            Staff Payroll
          </Typography>
          <Typography variant="body2" style={{ color: '#64748B', marginTop: '4px' }}>
            Manage staff salaries, process monthly payroll, and view payslips.
          </Typography>
        </Box>

        <Box style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outlined"
            startIcon={<Plus size={18} />}
            onClick={() => setStructureDialogOpen(true)}
            style={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            New Salary Structure
          </Button>
          <Button
            variant="contained"
            startIcon={<Play size={18} />}
            onClick={() => setRunDialogOpen(true)}
            style={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, backgroundColor: '#0F172A' }}
          >
            Execute Payroll Run
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px' }}>
        <Typography
          onClick={() => setActiveTab('RUNS')}
          style={{
            paddingBottom: '12px',
            cursor: 'pointer',
            fontWeight: activeTab === 'RUNS' ? 600 : 500,
            color: activeTab === 'RUNS' ? '#0F172A' : '#64748B',
            borderBottom: activeTab === 'RUNS' ? '2px solid #0F172A' : '2px solid transparent',
          }}
        >
          Payroll Runs
        </Typography>
        <Typography
          onClick={() => setActiveTab('STRUCTURES')}
          style={{
            paddingBottom: '12px',
            cursor: 'pointer',
            fontWeight: activeTab === 'STRUCTURES' ? 600 : 500,
            color: activeTab === 'STRUCTURES' ? '#0F172A' : '#64748B',
            borderBottom: activeTab === 'STRUCTURES' ? '2px solid #0F172A' : '2px solid transparent',
          }}
        >
          Salary Structures
        </Typography>
      </Box>

      {/* Tab Content: RUNS */}
      {activeTab === 'RUNS' && (
        <TableContainer component={Paper} elevation={0} style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <Table>
            <TableHead style={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Period</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Total Net Pay</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Run Date</TableCell>
                <TableCell style={{ fontWeight: 600 }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payrollRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" style={{ padding: '32px', color: '#64748B' }}>
                    No payroll runs executed yet.
                  </TableCell>
                </TableRow>
              ) : (
                payrollRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>{formatPeriod(run)}</TableCell>
                    <TableCell>
                      <Chip
                        label={run.status}
                        size="small"
                        color={statusColor(run.status)}
                        style={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>GHS {run.totalNetPay?.toLocaleString() ?? '—'}</TableCell>
                    <TableCell>{formatDate(run.runDate)}</TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="text">View Payslips</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tab Content: STRUCTURES */}
      {activeTab === 'STRUCTURES' && (
        <TableContainer component={Paper} elevation={0} style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
          <Table>
            <TableHead style={{ backgroundColor: '#F8FAFC' }}>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Staff Name</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Base Salary</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Allowances</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Tax Rate</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Last Updated</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salaryStructures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" style={{ padding: '32px', color: '#64748B' }}>
                    No salary structures defined yet. Use "New Salary Structure" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                salaryStructures.map((ss) => {
                  // Resolve staff name: either backend join populates staffName, or we match from staffList
                  const staffMember = ss.staffId ? staffList.find(s => s.id === ss.staffId) : null;
                  const displayName = ss.staffName || (staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : '—');
                  return (
                    <TableRow key={ss.id}>
                      <TableCell style={{ fontWeight: 500 }}>{displayName}</TableCell>
                      <TableCell>GHS {ss.baseSalary?.toLocaleString()}</TableCell>
                      <TableCell>GHS {getAllowancesTotal(ss).toLocaleString()}</TableCell>
                      <TableCell>{ss.taxRate != null ? `${ss.taxRate}%` : '—'}</TableCell>
                      <TableCell>{formatDate(ss.updatedAt)}</TableCell>
                      <TableCell>
                        {ss.baseSalary === 0 ? (
                          <Chip label="Needs Setup" size="small" style={{ backgroundColor: '#FEF08A', color: '#854D0E', fontWeight: 600 }} />
                        ) : (
                          <Chip label="Configured" size="small" style={{ backgroundColor: '#ECFDF5', color: '#047857', fontWeight: 600 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Execute Run Dialog */}
      <Dialog open={runDialogOpen} onClose={() => setRunDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ fontWeight: 700 }}>Execute Payroll Run</DialogTitle>
        <DialogContent>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <Alert severity="info" style={{ borderRadius: '8px', fontSize: '0.875rem' }}>
              This will generate payslips for all active staff for the selected period.
            </Alert>
            <TextField
              label="Month (1–12)"
              type="number"
              fullWidth
              value={newRun.month}
              onChange={(e) => setNewRun({ ...newRun, month: parseInt(e.target.value) })}
              slotProps={{ htmlInput: { min: 1, max: 12 } }}
            />
            <TextField
              label="Year"
              type="number"
              fullWidth
              value={newRun.year}
              onChange={(e) => setNewRun({ ...newRun, year: parseInt(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button onClick={() => setRunDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExecuteRun} style={{ backgroundColor: '#0F172A' }}>
            Run Engine
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Structure Dialog */}
      <Dialog open={structureDialogOpen} onClose={() => setStructureDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ fontWeight: 700 }}>New Salary Structure</DialogTitle>
        <DialogContent>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <TextField
              select
              label="Staff Member"
              fullWidth
              value={newStructure.staffId}
              onChange={(e) => setNewStructure({ ...newStructure, staffId: e.target.value })}
            >
              {staffList.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.staffNumber})</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Base Salary (GHS)"
              type="number"
              fullWidth
              value={newStructure.baseSalary}
              onChange={(e) => setNewStructure({ ...newStructure, baseSalary: parseFloat(e.target.value) })}
            />
            <TextField
              label="Allowances (GHS)"
              type="number"
              fullWidth
              value={newStructure.allowances}
              onChange={(e) => setNewStructure({ ...newStructure, allowances: parseFloat(e.target.value) })}
            />
            <TextField
              label="Tax Percentage (%)"
              type="number"
              fullWidth
              value={newStructure.taxPercentage}
              onChange={(e) => setNewStructure({ ...newStructure, taxPercentage: parseFloat(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          <Button onClick={() => setStructureDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveStructure} style={{ backgroundColor: '#0F172A' }}>
            Save Structure
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
