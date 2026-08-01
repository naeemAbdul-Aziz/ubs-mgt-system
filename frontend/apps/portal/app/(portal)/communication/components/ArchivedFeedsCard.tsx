import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { History, Calendar, CreditCard, Info, ChevronRight } from 'lucide-react';
import { ArchivedFeedItem } from '@ubs-lmis/types';

interface ArchivedFeedsCardProps {
  feeds: ArchivedFeedItem[];
}

export const ArchivedFeedsCard: React.FC<ArchivedFeedsCardProps> = ({ feeds }) => {
  const getIcon = (type: string) => {
    if (type === 'calendar') return <Calendar size={18} color="#070235" />;
    if (type === 'payment') return <CreditCard size={18} color="#070235" />;
    return <Info size={18} color="#070235" />;
  };

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(7, 2, 53, 0.08)',
        padding: '24px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        marginBottom: '24px',
      }}
    >
      {/* Title */}
      <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <History size={20} color="#070235" />
        <Typography variant="h6" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
          Archived Feeds
        </Typography>
      </Box>

      {/* List */}
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {feeds.map((feed) => (
          <Box key={feed.id} style={{ display: 'flex', gap: '16px', cursor: 'pointer' }}>
            <Box
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#F0F3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getIcon(feed.iconType)}
            </Box>
            <Box style={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#070235' }}>
                {feed.title}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: '#47464F',
                  fontSize: '0.85rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginTop: '2px',
                }}
              >
                {feed.summary}
              </Typography>
              <Typography
                variant="caption"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#787680',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: '8px',
                  display: 'block',
                }}
              >
                {feed.timeAgo}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Button */}
      <Button
        fullWidth
        endIcon={<ChevronRight size={16} />}
        style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(200, 197, 208, 0.2)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#47464F',
          textTransform: 'none',
          justifyContent: 'center',
        }}
      >
        Load Full Archive
      </Button>
    </Box>
  );
};
