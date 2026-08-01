import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { Send, MessageSquare, Mail, Globe } from 'lucide-react';

interface BroadcastComposerProps {
  onDispatch: (title: string, message: string, channels: string[], audience: string[]) => void;
  isDispatching: boolean;
}

export const BroadcastComposer: React.FC<BroadcastComposerProps> = ({ onDispatch, isDispatching }) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['SMS', 'EMAIL']);
  const [targetAudience, setTargetAudience] = useState<string[]>(['Guardians']);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const toggleChannel = (ch: string) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const toggleAudience = (aud: string) => {
    setTargetAudience((prev) =>
      prev.includes(aud) ? prev.filter((a) => a !== aud) : [...prev, aud]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !body) return;
    onDispatch(subject, body, selectedChannels, targetAudience);
  };

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(7, 2, 53, 0.08)',
        padding: '32px',
        marginBottom: '32px',
      }}
    >
      {/* Header */}
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Box>
          <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
            Broadcast Composer
          </Typography>
          <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#47464F' }}>
            Design and distribute messages across multiple channels.
          </Typography>
        </Box>
        <Send size={24} color="#4B41E1" />
      </Box>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Channel Selection */}
        <Box>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#070235',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Communication Channels
          </Typography>
          <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Box
              onClick={() => toggleChannel('SMS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '9999px',
                border: '1px solid rgba(200, 197, 208, 0.5)',
                cursor: 'pointer',
                backgroundColor: selectedChannels.includes('SMS') ? '#070235' : 'transparent',
                color: selectedChannels.includes('SMS') ? '#FFFFFF' : '#070235',
                transition: 'all 0.15s ease-in-out',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <MessageSquare size={18} />
              <span>SMS</span>
            </Box>

            <Box
              onClick={() => toggleChannel('EMAIL')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '9999px',
                border: '1px solid rgba(200, 197, 208, 0.5)',
                cursor: 'pointer',
                backgroundColor: selectedChannels.includes('EMAIL') ? '#070235' : 'transparent',
                color: selectedChannels.includes('EMAIL') ? '#FFFFFF' : '#070235',
                transition: 'all 0.15s ease-in-out',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <Mail size={18} />
              <span>Email</span>
            </Box>

            <Box
              onClick={() => toggleChannel('PORTAL')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '9999px',
                border: '1px solid rgba(200, 197, 208, 0.5)',
                cursor: 'pointer',
                backgroundColor: selectedChannels.includes('PORTAL') ? '#070235' : 'transparent',
                color: selectedChannels.includes('PORTAL') ? '#FFFFFF' : '#070235',
                transition: 'all 0.15s ease-in-out',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <Globe size={18} />
              <span>Portal Notice</span>
            </Box>
          </Box>
        </Box>

        {/* Target Audience */}
        <Box>
          <Typography
            variant="caption"
            style={{
              fontFamily: 'Inter, sans-serif',
              color: '#070235',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Target Audience
          </Typography>
          <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {['Guardians', 'Staff', 'Students'].map((aud) => (
              <Box
                key={aud}
                style={{
                  border: '1px solid rgba(200, 197, 208, 0.4)',
                  borderRadius: '8px',
                  padding: '4px 12px',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={targetAudience.includes(aud)}
                      onChange={() => toggleAudience(aud)}
                      style={{ color: '#070235' }}
                    />
                  }
                  label={<Typography style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500 }}>{aud}</Typography>}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Subject & Body */}
        <TextField
          label="Subject Line"
          placeholder="e.g., Upcoming Heritage Week Celebrations"
          fullWidth
          required
          size="small"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <TextField
          label="Message Body"
          placeholder="Compose your message here..."
          fullWidth
          required
          multiline
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {/* Buttons */}
        <Box style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isDispatching}
            style={{
              flex: 1,
              backgroundColor: '#070235',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '14px 32px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
            }}
          >
            {isDispatching ? 'Dispatching...' : 'Dispatch Broadcast'}
          </Button>

          <Button
            variant="outlined"
            style={{
              borderColor: '#070235',
              color: '#070235',
              borderRadius: '9999px',
              padding: '14px 32px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
            }}
          >
            Save as Draft
          </Button>
        </Box>
      </form>
    </Box>
  );
};
