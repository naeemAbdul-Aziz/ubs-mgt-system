import React from 'react';
import { ReportCard } from '@ubs-lmis/types';

interface ReportCardScoreTableProps {
  reportCard: ReportCard;
}

export const ReportCardScoreTable: React.FC<ReportCardScoreTableProps> = ({ reportCard }) => {
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <section style={{ position: 'relative', zIndex: 10, marginBottom: '32px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#070235', color: '#FFFFFF' }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600, whiteSpace: 'nowrap' }}>
              SUBJECT
            </th>
            <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600, whiteSpace: 'nowrap', width: '110px' }}>
              CLASSWORK (30%)
            </th>
            <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600, whiteSpace: 'nowrap', width: '110px' }}>
              EXAM (70%)
            </th>
            <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600, whiteSpace: 'nowrap', width: '90px' }}>
              TOTAL
            </th>
            <th style={{ textAlign: 'center', padding: '12px 8px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600, whiteSpace: 'nowrap', width: '80px' }}>
              GRADE
            </th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600, whiteSpace: 'nowrap' }}>
              REMARKS
            </th>
          </tr>
        </thead>
        <tbody style={{ borderBottom: '1px solid #C8C5D0' }}>
          {reportCard.subjectResults.map((sub, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: '1px solid rgba(200, 197, 208, 0.2)',
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
              }}
            >
              <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#070235', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                {sub.subjectName}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
                {sub.classworkScore}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
                {sub.examScore}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#4B41E1', fontSize: '0.875rem', fontVariantNumeric: 'tabular-nums' }}>
                {sub.totalScore}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#070235', fontSize: '0.875rem' }}>
                {sub.grade}
              </td>
              <td style={{ padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#47464F' }}>
                {sub.remark}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: '#F1F5F9', fontWeight: 700 }}>
            <td style={{ padding: '14px 16px', fontFamily: 'Inter, sans-serif', color: '#070235', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
              OVERALL SUMMARY
            </td>
            <td style={{ padding: '14px 8px', textAlign: 'right', color: '#47464F', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', whiteSpace: 'nowrap' }} colSpan={2}>
              Position: <strong>{getOrdinal(reportCard.positionInClass)}</strong> / {reportCard.totalStudentsInClass}
            </td>
            <td style={{ padding: '14px 8px', textAlign: 'center', color: '#070235', fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums', fontSize: '1rem', fontWeight: 700 }}>
              {reportCard.overallAverage || 86.4}
            </td>
            <td style={{ padding: '14px 16px', color: '#070235', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', whiteSpace: 'nowrap' }} colSpan={2}>
              Overall Grade: <strong>{reportCard.gradeAverage || 'A1'}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
};
