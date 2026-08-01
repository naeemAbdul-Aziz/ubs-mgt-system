'use client';

import React, { useEffect, useState } from 'react';
import { Box, Alert, Snackbar, Fab, LinearProgress } from '@mui/material';
import { Edit3 } from 'lucide-react';
import { CommunicationAPI } from '@ubs-lmis/api-client';
import { OutboxLogItem, ArchivedFeedItem } from '@ubs-lmis/types';

import { BroadcastComposer } from './components/BroadcastComposer';
import { OutboxStatusLog } from './components/OutboxStatusLog';
import { EngagementPulseCard } from './components/EngagementPulseCard';
import { ArchivedFeedsCard } from './components/ArchivedFeedsCard';
import { AnnouncementInbox } from './components/AnnouncementInbox';
import { useAuth } from '../../providers/AuthProvider';

export default function CommunicationPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<OutboxLogItem[]>([]);
  const [feeds, setFeeds] = useState<ArchivedFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const personType = userProfile?.personType ?? null;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Only load composer data for staff (and only admin/HOD/Head — not accountant or teacher)
      const canCompose = personType === 'STAFF';
      if (canCompose) {
        const [outboxData, feedData] = await Promise.all([
          CommunicationAPI.getOutboxLogs(),
          CommunicationAPI.getArchivedFeeds(),
        ]);
        setLogs(outboxData);
        setFeeds(feedData);
      }
    } catch (err) {
      console.error('Failed to load communication data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const handleDispatchBroadcast = async (
    title: string,
    message: string,
    channels: string[],
    audience: string[]
  ) => {
    setIsDispatching(true);
    try {
      await CommunicationAPI.sendAnnouncement({
        title,
        message,
        channel: 'SMS',
        targetAudience: audience.join(', '),
      });
      setToastMsg(`Broadcast "${title}" dispatched successfully across ${channels.join(', ')}!`);
      fetchData();
    } catch (err) {
      console.error('Failed to dispatch broadcast:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  // Students and Guardians see read-only inbox
  if (personType === 'STUDENT' || personType === 'GUARDIAN') {
    return <AnnouncementInbox />;
  }

  return (
    <Box style={{ width: '100%', overflowX: 'hidden' }}>
      {loading && (
        <LinearProgress
          style={{
            marginBottom: '24px',
            borderRadius: '4px',
            backgroundColor: '#EEF2FF',
          }}
        />
      )}

      <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '32px' }}>
        {/* Left Column: Broadcast Composer & Outbox Status Log */}
        <Box style={{ flex: '1 1 600px', minWidth: 0 }}>
          <BroadcastComposer onDispatch={handleDispatchBroadcast} isDispatching={isDispatching} />
          <OutboxStatusLog logs={logs} />
        </Box>

        {/* Right Column: Analytics & Archived Feeds */}
        <Box style={{ flex: '0 0 360px', minWidth: 0, maxWidth: '100%' }}>
          <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <EngagementPulseCard />
            <ArchivedFeedsCard feeds={feeds} />
          </Box>
        </Box>
      </Box>

      {/* Quick Edit Floating Action Button */}
      <Fab
        color="primary"
        aria-label="edit"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#070235',
          color: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(7, 2, 53, 0.3)',
        }}
      >
        <Edit3 size={24} />
      </Fab>

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toastMsg)}
        autoHideDuration={4000}
        onClose={() => setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setToastMsg(null)} style={{ borderRadius: '12px' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
