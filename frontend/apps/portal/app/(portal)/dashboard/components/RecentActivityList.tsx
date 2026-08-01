import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CreditCard, Activity } from 'lucide-react';
import { AnalyticsAPI } from '@ubs-lmis/api-client';

export const RecentActivityList: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    AnalyticsAPI.getRecentActivity()
      .then((data) => setActivities(data))
      .catch((err) => console.error('Failed to fetch recent activity', err));
  }, []);

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        style={{
          padding: '24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
        }}
      >
        <Typography
          variant="h6"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#0F172A',
          }}
        >
          Recent Activity
        </Typography>
        <Button style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#4F46E5', textTransform: 'none' }}>
          View All
        </Button>
      </Box>

      {/* Activities Stream */}
      <Box style={{ display: 'flex', flexDirection: 'column' }}>
        {activities.length > 0 ? (
          activities.map((item, index) => (
            <Box
              key={item.id || index}
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: index < activities.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              <Box style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Box
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: item.type === 'PAYMENT' ? '#F0FDF4' : '#F0F3FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.type === 'PAYMENT' ? '#16A34A' : '#4F46E5',
                  }}
                >
                  {item.type === 'PAYMENT' ? <CreditCard size={20} /> : <Activity size={20} />}
                </Box>
                <Box>
                  <Typography variant="body1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, color: '#0F172A' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', fontSize: '0.85rem' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  color: '#64748B',
                  fontWeight: 500,
                }}
              >
                {item.eventTime}
              </span>
            </Box>
          ))
        ) : (
          <Box style={{ padding: '32px', textAlign: 'center' }}>
            <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#64748B' }}>
              No recent activity found.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
