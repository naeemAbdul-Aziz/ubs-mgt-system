'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { ProgressionAPI } from '@ubs-lmis/api-client';
import { StudentProgressionDecision } from '@ubs-lmis/types';

import { ProgressionWizardHeader } from './components/ProgressionWizardHeader';
import { ProgressionStepTracker } from './components/ProgressionStepTracker';
import { Step1ParametersForm } from './components/Step1ParametersForm';
import { Step2AnalysisView } from './components/Step2AnalysisView';
import { Step3ConfirmationView } from './components/Step3ConfirmationView';
import { ProgressionContextHelp } from './components/ProgressionContextHelp';
import { ProgressionSuccessModal } from './components/ProgressionSuccessModal';

export default function ProgressionPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [decisions, setDecisions] = useState<StudentProgressionDecision[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Step 1 Form Parameters
  const [passMark, setPassMark] = useState<number>(50);
  const [attendanceReq, setAttendanceReq] = useState<number>(75);
  const [graduationCredits, setGraduationCredits] = useState<number>(120);
  const [retentionBuffer, setRetentionBuffer] = useState<number>(5);

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const data = await ProgressionAPI.getStudentDecisions();
        setDecisions(data);
      } catch (err) {
        console.error('Failed to load decisions:', err);
      }
    };
    fetchDecisions();
  }, []);

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setIsExecuting(true);
      try {
        await ProgressionAPI.executeRun({
          sourceAcademicYearId: 'year-0',
          targetAcademicYearId: 'year-1',
          promotionPassMark: passMark,
          minimumAttendancePercentage: attendanceReq,
        });
        setShowSuccessModal(true);
      } catch (err) {
        console.error('Failed to execute promotion run:', err);
      } finally {
        setIsExecuting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getNextButtonLabel = () => {
    if (currentStep === 1) return 'Continue to Analysis';
    if (currentStep === 2) return 'Review & Finalize';
    return isExecuting ? 'Executing...' : 'Execute Promotion';
  };

  return (
    <Box style={{ maxWidth: '1024px', margin: '0 auto' }}>
      {/* Editorial Header */}
      <ProgressionWizardHeader />

      {/* Main Wizard Container */}
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid rgba(30, 27, 75, 0.08)',
          boxShadow: '0 10px 40px -10px rgba(7, 2, 53, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Step Indicator Header */}
        <ProgressionStepTracker currentStep={currentStep} />

        {/* Step Content */}
        <Box style={{ padding: '48px' }}>
          {currentStep === 1 && (
            <Step1ParametersForm
              passMark={passMark}
              setPassMark={setPassMark}
              attendanceReq={attendanceReq}
              setAttendanceReq={setAttendanceReq}
              graduationCredits={graduationCredits}
              setGraduationCredits={setGraduationCredits}
              retentionBuffer={retentionBuffer}
              setRetentionBuffer={setRetentionBuffer}
            />
          )}

          {currentStep === 2 && <Step2AnalysisView decisions={decisions} />}

          {currentStep === 3 && <Step3ConfirmationView />}

          {/* Navigation Action Buttons */}
          <Box
            style={{
              marginTop: '48px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(200, 197, 208, 0.2)',
              paddingTop: '24px',
            }}
          >
            {currentStep > 1 ? (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                style={{
                  borderColor: '#070235',
                  color: '#070235',
                  borderRadius: '9999px',
                  padding: '8px 24px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNext}
              disabled={isExecuting}
              style={{
                backgroundColor: currentStep === 3 ? '#4B41E1' : '#070235',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '10px 32px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              {getNextButtonLabel()}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Contextual Help Cards */}
      <ProgressionContextHelp />

      {/* Success Modal */}
      <ProgressionSuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </Box>
  );
}
