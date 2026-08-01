import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, RefreshCw } from 'lucide-react';

interface StaffFilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onRefresh: () => void;
}

export const StaffFilterToolbar: React.FC<StaffFilterToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  onRefresh,
}) => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <TextField
        placeholder="Search by staff name, staff number or GES Reg No..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ flexGrow: 1 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#94A3B8" />
              </InputAdornment>
            ),
            style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' },
          },
        }}
      />
      <IconButton
        onClick={onRefresh}
        style={{
          backgroundColor: '#F0F3FF',
          border: '1px solid rgba(30, 27, 75, 0.05)',
          padding: '12px',
          borderRadius: '12px',
        }}
      >
        <RefreshCw size={20} color="#070235" />
      </IconButton>
    </Box>
  );
};
