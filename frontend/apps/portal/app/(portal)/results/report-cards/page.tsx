'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { ArrowLeft, Mail, Printer } from 'lucide-react';
import { AssessmentAPI, AuthAPI } from '@ubs-lmis/api-client';
import { ReportCard } from '@ubs-lmis/types';

import { ReportCardHeader } from './components/ReportCardHeader';
import { ReportCardStudentBio } from './components/ReportCardStudentBio';
import { ReportCardScoreTable } from './components/ReportCardScoreTable';
import { ReportCardRemarks } from './components/ReportCardRemarks';
import { ReportCardFooter } from './components/ReportCardFooter';
import { useSearchParams } from 'next/navigation';
import { ReportCardSelector } from './components/ReportCardSelector';

function ReportCardsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStudentId = searchParams.get('studentId');
  const queryTermId = searchParams.get('termId') || 'term-3';

  const [isStudent, setIsStudent] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(queryStudentId || '');
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailNotificationSent, setEmailNotificationSent] = useState(false);

  // On mount: check personType — if STUDENT, auto-resolve their personId
  useEffect(() => {
    AuthAPI.me()
      .then((user) => {
        if (user.personType === 'STUDENT') {
          setIsStudent(true);
          // For student: use their personId directly — backend resolves via JWT if blank
          setSelectedStudentId(user.personId);
        } else if (queryStudentId) {
          setSelectedStudentId(queryStudentId);
        }
      })
      .catch(console.error);
  }, [queryStudentId]);

  useEffect(() => {
    const fetchReportCard = async () => {
      if (!selectedStudentId) return;
      setLoading(true);
      try {
        const data = await AssessmentAPI.getReportCard(selectedStudentId, queryTermId);
        setReportCard(data);
      } catch (err) {
        console.error('Failed to load report card:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportCard();
  }, [selectedStudentId, queryTermId]);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailParent = () => {
    setEmailNotificationSent(true);
    setTimeout(() => setEmailNotificationSent(false), 4000);
  };

  if (!queryStudentId && !isStudent) {
    return <ReportCardSelector />;
  }

  return (
    <Box style={{ backgroundColor: '#F0F3FF', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Print CSS Injection */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background-color: white !important;
          }
          .report-page {
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Top Navigation Bar (Hidden on Print) */}
      <Box
        className="no-print"
        style={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(200, 197, 208, 0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '16px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.back()}
            style={{ color: '#070235', fontWeight: 600 }}
          >
            Back to Portal
          </Button>
          <Box style={{ height: '24px', width: '1px', backgroundColor: 'rgba(200, 197, 208, 0.4)' }} />
          <Typography
            variant="h6"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}
          >
            UBS-LMIS Portal
          </Typography>

          {/* Hide student selector for students — they only see their own card */}
          {!isStudent && (
            <Select
              size="small"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              style={{ marginLeft: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}
            >
              <MenuItem value="1">Kofi Mensah Boateng (JHS 2A)</MenuItem>
              <MenuItem value="2">Ama Osei (JHS 2A)</MenuItem>
              <MenuItem value="3">Kwaku Appiah (JHS 3A)</MenuItem>
            </Select>
          )}
        </Box>

        <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="contained"
            startIcon={<Mail size={18} />}
            onClick={handleEmailParent}
            style={{
              backgroundColor: '#645EFB',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Email Parent
          </Button>

          <Button
            variant="contained"
            startIcon={<Printer size={18} />}
            onClick={handlePrint}
            style={{
              backgroundColor: '#070235',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Print Report
          </Button>
        </Box>
      </Box>

      {emailNotificationSent && (
        <Box className="no-print" style={{ maxWidth: '850px', margin: '20px auto 0' }}>
          <Alert severity="success" style={{ borderRadius: '12px' }}>
            Official transcript PDF has been queued to Guardian email address!
          </Alert>
        </Box>
      )}

      {loading && (
        <LinearProgress style={{ backgroundColor: '#EEF2FF' }} />
      )}

      {/* Report Canvas Container */}
      {loading ? (
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '120px 0' }}>
          <CircularProgress style={{ color: '#070235' }} />
        </Box>
      ) : reportCard ? (
        <Box
          className="report-page"
          style={{
            maxWidth: '850px',
            margin: '40px auto',
            position: 'relative',
            backgroundColor: '#FFFFFF',
            padding: '48px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(30, 27, 75, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Background Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)',
              opacity: 0.03,
              fontSize: '8rem',
              fontWeight: 800,
              color: '#070235',
              pointerEvents: 'none',
              zIndex: 0,
              whiteSpace: 'nowrap',
              fontFamily: '"Playfair Display", serif',
            }}
          >
            OFFICIAL TRANSCRIPT
          </div>

          {/* Decorative Corner Elements */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '96px',
              height: '96px',
              borderTop: '2px solid rgba(7, 2, 53, 0.2)',
              borderRight: '2px solid rgba(7, 2, 53, 0.2)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '96px',
              height: '96px',
              borderBottom: '2px solid rgba(7, 2, 53, 0.2)',
              borderLeft: '2px solid rgba(7, 2, 53, 0.2)',
              pointerEvents: 'none',
            }}
          />

          {/* Modular Components */}
          <ReportCardHeader
            academicYear={reportCard.academicYear}
            termName={reportCard.termName}
          />

          <ReportCardStudentBio reportCard={reportCard} />

          <ReportCardScoreTable reportCard={reportCard} />

          <ReportCardRemarks reportCard={reportCard} />

          <ReportCardFooter />
        </Box>
      ) : null}
    </Box>
  );
}

export default function ReportCardsPage() {
  return (
    <Suspense fallback={<Box style={{ padding: '40px', textAlign: 'center' }}><CircularProgress /></Box>}>
      <ReportCardsPageContent />
    </Suspense>
  );
}
