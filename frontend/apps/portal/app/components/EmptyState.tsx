import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There are currently no entries recorded in this list.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: '20px',
        border: '1px dashed #CBD5E1',
        margin: '16px 0',
      }}
    >
      <Box
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          backgroundColor: '#F1F5F9',
          color: '#475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Icon size={28} />
      </Box>

      <Typography
        variant="h6"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          color: '#0F172A',
          marginBottom: '6px',
          fontSize: '1rem',
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#64748B',
          maxWidth: '380px',
          marginBottom: onAction ? '20px' : 0,
          fontSize: '0.875rem',
        }}
      >
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="contained"
          style={{
            backgroundColor: '#070235',
            color: '#FFFFFF',
            borderRadius: '9999px',
            textTransform: 'none',
            padding: '8px 20px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
