'use client';

import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { StudentsAPI } from '@ubs-lmis/api-client';
import { Student, CreateStudentRequest } from '@ubs-lmis/types';

import { StudentDirectoryHeader } from './components/StudentDirectoryHeader';
import { StudentTableFilters } from './components/StudentTableFilters';
import { StudentDataTable } from './components/StudentDataTable';
import { StudentPaginationFooter } from './components/StudentPaginationFooter';
import { NewStudentModal } from './components/NewStudentModal';

import { useAuth } from '../../providers/AuthProvider';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const { userProfile } = useAuth();
  const canCreateStudent = userProfile?.permissions?.includes('STUDENT_CREATE') || false;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await StudentsAPI.getStudents('', selectedGrade, selectedStatus, page, 10);
      setStudents(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, selectedGrade, selectedStatus]);

  const handleCreateStudent = async (data: CreateStudentRequest) => {
    try {
      await StudentsAPI.createStudent(data);
      fetchStudents();
    } catch (err) {
      console.error('Failed to create student:', err);
    }
  };

  // Client-side filtering is no longer needed because the backend handles it via the API
  const filteredStudents = students;

  return (
    <Box>
      {/* Editorial Header */}
      <StudentDirectoryHeader 
        onOpenNewStudentModal={() => setOpenModal(true)} 
        canCreateStudent={canCreateStudent}
      />

      {/* Main Data Container Card */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid rgba(30, 27, 75, 0.05)',
          overflow: 'hidden',
          boxShadow: '0 8px 40px -12px rgba(30, 27, 75, 0.08)',
        }}
      >
        {/* Filters Toolbar */}
        <StudentTableFilters
          selectedGrade={selectedGrade}
          onGradeChange={(g) => { setSelectedGrade(g); setPage(0); }}
          selectedStatus={selectedStatus}
          onStatusChange={(s) => { setSelectedStatus(s); setPage(0); }}
          totalCount={totalElements}
        />

        {/* High Density Table */}
        <StudentDataTable students={filteredStudents} onSelectStudent={setSelectedStudent} />

        {/* Pagination Footer */}
        <StudentPaginationFooter page={page} totalPages={totalPages} onPageChange={setPage} />
      </Box>

      {/* New Student Form Modal */}
      <NewStudentModal open={openModal} onClose={() => setOpenModal(false)} onSubmit={handleCreateStudent} />

      {/* Student Details Dialog */}
      {selectedStudent && (
        <Dialog open={Boolean(selectedStudent)} onClose={() => setSelectedStudent(null)} maxWidth="xs" fullWidth slotProps={{ paper: { style: { borderRadius: '24px', padding: '16px' } } }}>
          <DialogTitle style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>Student Profile</DialogTitle>
          <DialogContent dividers>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
              <Typography variant="h6" style={{ fontWeight: 600, color: '#0F172A' }}>
                {selectedStudent.firstName} {selectedStudent.lastName}
              </Typography>
              <Typography variant="body2" style={{ color: '#64748B' }}>
                ID: {selectedStudent.studentNumber}
              </Typography>
              <Typography variant="body2">Grade: {selectedStudent.currentClassName || 'JHS 2'}</Typography>
              <Typography variant="body2">Gender: {selectedStudent.gender}</Typography>
              <Typography variant="body2">Guardian: {selectedStudent.guardianName || 'N/A'}</Typography>
              <Typography variant="body2">Status: {selectedStudent.status}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedStudent(null)} style={{ color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
