import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, Typography } from '@mui/material';
import { CreateStaffRequest, StaffType } from '@ubs-lmis/types';

interface AddStaffModalProps {
  open: boolean;
  onClose: () => void;
  formData: CreateStaffRequest;
  setFormData: (data: CreateStaffRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      slotProps={{
        paper: {
          style: {
            borderRadius: '24px',
            padding: '16px',
          }
        }
      }}
    >
      <DialogTitle style={{ borderBottom: '1px solid rgba(200, 197, 208, 0.2)', marginBottom: '16px' }}>
        <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
          Add New Staff Member
        </Typography>
      </DialogTitle>
      
      <form onSubmit={onSubmit}>
        <DialogContent style={{ padding: '24px 0' }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                label="Staff Number"
                fullWidth
                required
                value={formData.staffNumber}
                onChange={(e) => setFormData({ ...formData, staffNumber: e.target.value })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                fullWidth
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                fullWidth
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Staff Role / Type"
                fullWidth
                value={formData.staffType}
                onChange={(e) => setFormData({ ...formData, staffType: e.target.value as StaffType })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              >
                <MenuItem value="TEACHING">Teaching Staff</MenuItem>
                <MenuItem value="NON_TEACHING">Non-Teaching Staff</MenuItem>
                <MenuItem value="ADMINISTRATIVE">Administrative</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="GES Registration No."
                fullWidth
                value={formData.gesRegistrationNo}
                onChange={(e) => setFormData({ ...formData, gesRegistrationNo: e.target.value })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                slotProps={{
                  input: { style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' } },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions style={{ borderTop: '1px solid rgba(200, 197, 208, 0.2)', paddingTop: '16px' }}>
          <Button 
            onClick={onClose} 
            style={{ 
              color: '#47464F',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              padding: '8px 24px',
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            style={{ 
              backgroundColor: '#070235', 
              color: '#FFFFFF',
              borderRadius: '9999px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              padding: '8px 24px',
              boxShadow: '0 4px 14px rgba(7, 2, 53, 0.15)',
            }}
          >
            Save Staff Record
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
