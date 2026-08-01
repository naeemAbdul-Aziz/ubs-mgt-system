import React from 'react';
import { Box, Typography } from '@mui/material';
import { ShieldCheck } from 'lucide-react';

export const Step3ConfirmationView: React.FC = () => {
  return (
    <Box style={{ textAlign: 'center', padding: '32px 0', maxWidth: '560px', margin: '0 auto' }}>
      <Box
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(75, 65, 225, 0.08)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          color: '#4B41E1',
        }}
      >
        <ShieldCheck size={48} />
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
        Final Confirmation
      </Typography>

      <Typography
        variant="body1"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#47464F',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}
      >
        You are about to finalize the academic standings for the year. This action will update all student records and generate electronic transcripts.
      </Typography>

      {/* Confirmation Summary Card */}
      <Box
        style={{
          backgroundColor: '#F0F3FF',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(75, 65, 225, 0.15)',
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Box style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(200, 197, 208, 0.2)', paddingBottom: '12px' }}>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Total Student Records
          </Typography>
          <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#070235' }}>
            2,450
          </Typography>
        </Box>

        <Box style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(200, 197, 208, 0.2)', paddingBottom: '12px' }}>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Electronic SMS Notifications
          </Typography>
          <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#070235' }}>
            Queued (2,450)
          </Typography>
        </Box>

        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Execution Window
          </Typography>
          <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#070235' }}>
            Immediate
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
