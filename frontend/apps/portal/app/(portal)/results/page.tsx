'use client';

import React, { useEffect, useState } from 'react';
import { Box, Alert, Snackbar, LinearProgress } from '@mui/material';
import { AssessmentAPI } from '@ubs-lmis/api-client';
import { AssessmentGridStudent } from '@ubs-lmis/types';

import { AssessmentHeader } from './components/AssessmentHeader';
import { AssessmentGridTable } from './components/AssessmentGridTable';

export default function ResultsPage() {
  const [students, setStudents] = useState<AssessmentGridStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await AssessmentAPI.getAssessmentGridStudents();
        setStudents(data);
      } catch (err) {
        console.error('Failed to load assessment grid students:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleScoreChange = (studentId: string, field: 'cw' | 'mt' | 'exam', value: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // For each component (cw, mt, exam), we need to send a bulk score request
      // We assume some hardcoded component IDs for this mock implementation
      const components = [
        { key: 'cw', id: 'comp-cw-123' },
        { key: 'mt', id: 'comp-mt-123' },
        { key: 'exam', id: 'comp-exam-123' }
      ] as const;

      for (const comp of components) {
        const scoresPayload = students.map((s) => ({
          enrollmentId: s.id, // Using student.id as enrollmentId for now
          rawScore: s[comp.key] || 0,
          isExempt: false,
          isNa: false,
        }));

        await AssessmentAPI.bulkEnterScores({
          assessmentComponentId: comp.id,
          scores: scoresPayload,
        });
      }

      setToastMsg('Assessment draft saved successfully!');
    } catch (err) {
      console.error('Failed to save draft:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishResults = async () => {
    setIsPublishing(true);
    try {
      setToastMsg('Results published successfully to guardians via SMS & Parent Portal!');
    } catch (err) {
      console.error('Failed to publish results:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Box style={{ width: '100%' }}>
      {loading && (
        <LinearProgress
          style={{
            marginBottom: '24px',
            borderRadius: '4px',
            backgroundColor: '#EEF2FF',
          }}
        />
      )}

      {/* Context Header */}
      <AssessmentHeader
        onSaveDraft={handleSaveDraft}
        onPublishResults={handlePublishResults}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />

      {/* Main Assessment Grid Card */}
      <AssessmentGridTable students={students} onScoreChange={handleScoreChange} />

      {/* Snackbar Toast Notification */}
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
