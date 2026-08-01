'use client';

import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { StaffAPI } from '@ubs-lmis/api-client';
import { Staff, CreateStaffRequest } from '@ubs-lmis/types';

import { StaffHeader } from './components/StaffHeader';
import { StaffFilterToolbar } from './components/StaffFilterToolbar';
import { StaffDirectoryTable } from './components/StaffDirectoryTable';
import { AddStaffModal } from './components/AddStaffModal';

import { useAuth } from '../../providers/AuthProvider';

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const { userProfile } = useAuth();
  const canCreateStaff = userProfile?.permissions?.includes('STAFF_CREATE') || false;

  const [formData, setFormData] = useState<CreateStaffRequest>({
    staffNumber: `STF-00${Math.floor(Math.random() * 90 + 10)}`,
    firstName: '',
    lastName: '',
    otherNames: '',
    staffType: 'TEACHING',
    gesRegistrationNo: 'GES-102938',
    employmentStart: '2025-01-01',
    email: '',
    phone: '',
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await StaffAPI.getStaff(searchQuery);
      setStaffList(data.content);
    } catch (err) {
      console.error('Failed to fetch staff list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;

    try {
      await StaffAPI.createStaff(formData);
      setOpenModal(false);
      fetchStaff();
    } catch (err) {
      console.error('Failed to create staff record:', err);
    }
  };

  const filteredStaff = staffList.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box style={{ maxWidth: '1440px', margin: '0 auto' }}>
      <StaffHeader 
        onAddStaff={() => setOpenModal(true)} 
        canCreateStaff={canCreateStaff}
      />

      <StaffFilterToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={fetchStaff}
      />

      <StaffDirectoryTable staffList={filteredStaff} />

      <AddStaffModal 
        open={openModal}
        onClose={() => setOpenModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateStaff}
      />
    </Box>
  );
}
