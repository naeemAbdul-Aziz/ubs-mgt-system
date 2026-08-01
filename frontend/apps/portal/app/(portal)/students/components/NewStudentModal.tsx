import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { CreateStudentRequest, Gender } from '@ubs-lmis/types';

interface NewStudentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStudentRequest) => void;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateStudentRequest>({
    studentNumber: `SMS-2023-${Math.floor(Math.random() * 900 + 100)}`,
    firstName: '',
    lastName: '',
    otherNames: '',
    dateOfBirth: '2014-05-12',
    gender: 'MALE',
    admissionDate: '2023-09-01',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { style: { borderRadius: '24px', padding: '12px' } } }}>
      <DialogTitle style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, fontSize: '1.5rem', color: '#0F172A' }}>
        Enroll New Student
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent style={{ padding: '24px' }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Student ID Number"
                fullWidth
                required
                size="small"
                value={formData.studentNumber}
                onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="First Name"
                fullWidth
                required
                size="small"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Last Name"
                fullWidth
                required
                size="small"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                select
                label="Gender"
                fullWidth
                size="small"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button onClick={onClose} style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
            }}
          >
            Save Record
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
