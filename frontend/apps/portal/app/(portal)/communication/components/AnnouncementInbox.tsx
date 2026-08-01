'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  LinearProgress,
  Divider,
} from '@mui/material';
import { Bell, Megaphone, Info, AlertTriangle } from 'lucide-react';
import { CommunicationAPI } from '@ubs-lmis/api-client';
import { Announcement } from '@ubs-lmis/types';

const audienceConfig: Record<string, { color: string; bg: string; label: string }> = {
  ALL: { color: '#2563EB', bg: '#EFF6FF', label: 'All Students' },
  STUDENTS: { color: '#7C3AED', bg: '#F3E8FF', label: 'Students' },
  GUARDIANS: { color: '#059669', bg: '#ECFDF5', label: 'Guardians' },
  STAFF: { color: '#D97706', bg: '#FFFBEB', label: 'Staff' },
};

const relativeTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
};

export const AnnouncementInbox = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await CommunicationAPI.getAnnouncements();
        // Sort newest first
        setAnnouncements(
          [...data].sort((a, b) => {
            const aDate = (a as any).publishedAt ?? (a as any).createdAt ?? '';
            const bDate = (b as any).publishedAt ?? (b as any).createdAt ?? '';
            return bDate.localeCompare(aDate);
          })
        );
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <Box sx={{ maxWidth: '760px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Megaphone size={20} color="#7C3AED" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Announcements
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ color: '#64748B', ml: 7 }}>
          School news, notices, and updates
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />}

      {/* Announcement list */}
      <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ p: 0 }}>
          {announcements.length === 0 && !loading ? (
            <Box sx={{ textAlign: 'center', py: 8, px: 4 }}>
              <Bell size={48} color="#CBD5E1" />
              <Typography variant="h6" sx={{ mt: 2, color: '#94A3B8', fontWeight: 600 }}>
                No announcements yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5 }}>
                School notices will appear here when they are published.
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />}>
              {announcements.map((ann, i) => {
                const annAny = ann as any;
                const audience = annAny.targetAudience ?? 'ALL';
                const audCfg = audienceConfig[audience] ?? audienceConfig.ALL;
                const dateStr = annAny.publishedAt ?? annAny.createdAt ?? '';
                const status = annAny.status ?? 'PUBLISHED';

                return (
                  <Box
                    key={annAny.id ?? i}
                    sx={{
                      p: 3,
                      transition: 'background-color 0.15s',
                      '&:hover': { backgroundColor: '#FAFAFA' },
                    }}
                  >
                    <Stack direction="row" spacing={2.5} sx={{ alignItems: 'flex-start' }}>
                      {/* Icon */}
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          backgroundColor: '#EEF2FF',
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        <Bell size={20} color="#7C3AED" />
                      </Avatar>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.75 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: '#0F172A',
                              lineHeight: 1.3,
                              flex: 1,
                            }}
                          >
                            {annAny.title ?? 'School Announcement'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#94A3B8', whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 500 }}
                          >
                            {dateStr ? relativeTime(dateStr) : '—'}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="body2"
                          sx={{ color: '#475569', lineHeight: 1.6, mb: 1.5 }}
                        >
                          {annAny.body ?? annAny.message ?? ''}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Chip
                            label={audCfg.label}
                            size="small"
                            sx={{
                              backgroundColor: audCfg.bg,
                              color: audCfg.color,
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                          {status === 'PUBLISHED' && (
                            <Chip
                              label="Published"
                              size="small"
                              sx={{
                                backgroundColor: '#DCFCE7',
                                color: '#16A34A',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                height: 20,
                              }}
                            />
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
