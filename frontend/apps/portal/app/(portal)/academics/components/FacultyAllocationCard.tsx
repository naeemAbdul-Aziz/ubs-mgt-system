import React from 'react';
import { Box, Typography, IconButton, Avatar, Chip, Button } from '@mui/material';
import { UserPlus, Edit2, Calendar, ArrowRight } from 'lucide-react';
import { FacultyAllocationItem } from '@ubs-lmis/types';

interface FacultyAllocationCardProps {
  allocations: FacultyAllocationItem[];
}

export const FacultyAllocationCard: React.FC<FacultyAllocationCardProps> = ({ allocations }) => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        color: '#070235',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        padding: '32px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Header */}
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Box>
          <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
            Faculty Allocation
          </Typography>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', display: 'block', marginTop: '2px' }}>
            Subject lead & teaching schedule distribution
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<UserPlus size={16} />}
          style={{
            borderColor: '#E2E8F0',
            color: '#070235',
            borderRadius: '10px',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '0.8125rem',
          }}
        >
          Assign
        </Button>
      </Box>

      {/* List */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
        {allocations.map((item) => (
          <Box
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 16px',
              borderRadius: '14px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              transition: 'all 0.15s ease-in-out',
            }}
          >
            <Avatar
              src={item.avatarUrl}
              alt={item.teacherName}
              style={{ width: 44, height: 44, border: '2px solid #E2E8F0', backgroundColor: '#EEF2FF', color: '#312E81', fontWeight: 700 }}
            >
              {item.teacherName ? item.teacherName.charAt(0) : 'T'}
            </Avatar>
            <Box style={{ flexGrow: 1, overflow: 'hidden' }}>
              <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#0F172A' }}>
                {item.teacherName}
              </Typography>
              <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', fontSize: '0.8125rem' }}>
                {item.scope}
              </Typography>
            </Box>
            <Chip
              label="3 Classes"
              size="small"
              style={{
                backgroundColor: '#EEF2FF',
                color: '#4338CA',
                fontWeight: 600,
                fontSize: '11px',
                borderRadius: '6px',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Master Schedule Action Bar */}
      <Box
        style={{
          marginTop: '24px',
          padding: '20px 24px',
          backgroundColor: '#070235',
          borderRadius: '16px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'transform 0.15s ease-in-out',
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Box style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} color="#FFFFFF" />
          </Box>
          <Box>
            <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '10px', display: 'block' }}>
              Global Timetable
            </Typography>
            <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>
              View Master Faculty Schedule
            </Typography>
          </Box>
        </Box>
        <ArrowRight size={20} color="#FFFFFF" />
      </Box>
    </Box>
  );
};
