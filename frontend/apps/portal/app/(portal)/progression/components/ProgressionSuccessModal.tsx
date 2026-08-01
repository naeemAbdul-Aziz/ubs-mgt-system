import React from 'react';
import { Box, Typography, Button, Dialog } from '@mui/material';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProgressionSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProgressionSuccessModal: React.FC<ProgressionSuccessModalProps> = ({ open, onClose }) => {
  const router = useRouter();

  const handleReturnDashboard = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          style: {
            borderRadius: '32px',
            padding: '32px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
          },
        },
      }}
    >
      <Box
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#22C55E',
          color: '#FFFFFF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
        }}
      >
        <Check size={48} />
      </Box>

      <Typography
        variant="h4"
        style={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          color: '#070235',
          marginBottom: '12px',
        }}
      >
        Cycle Complete
      </Typography>

      <Typography
        variant="body2"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#47464F',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}
      >
        All student records have been successfully updated. Transcripts are now available in the student portal.
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={handleReturnDashboard}
        style={{
          backgroundColor: '#070235',
          color: '#FFFFFF',
          borderRadius: '9999px',
          padding: '12px 24px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.95rem',
        }}
      >
        Return to Dashboard
      </Button>
    </Dialog>
  );
};
