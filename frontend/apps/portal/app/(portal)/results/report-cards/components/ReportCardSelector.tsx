import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Avatar } from '@mui/material';
import { Search, User, FileText, ArrowRight, UserCheck } from 'lucide-react';
import { StudentsAPI } from '@ubs-lmis/api-client';
import { Student } from '@ubs-lmis/types';
import { useRouter } from 'next/navigation';

export const ReportCardSelector: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState('term-3');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await StudentsAPI.getStudents(searchQuery, selectedGrade, '', 0, 20);
        setStudents(data.content);
      } catch (err) {
        console.error('Failed to search students:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce
    const timer = setTimeout(() => {
      fetchStudents();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGrade]);

  const handleGenerate = (studentId: string) => {
    if (studentId && selectedTermId) {
      router.push(`/results/report-cards?studentId=${studentId}&termId=${selectedTermId}`);
    }
  };

  return (
    <Box style={{ maxWidth: '1000px', margin: '48px auto', padding: '0 24px' }}>
      <Box style={{ marginBottom: '40px' }}>
        <Typography variant="h3" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
          Report Cards
        </Typography>
        <Typography variant="body1" style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
          Filter by class or search for a student to view and print their terminal report.
        </Typography>
      </Box>

      <Card style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #E2E8F0', marginBottom: '32px' }}>
        <CardContent style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box style={{ flexGrow: 1, minWidth: '240px' }}>
            <Typography variant="caption" style={{ fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Search Student
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Name or Student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={18} color="#94A3B8" style={{ marginRight: '8px' }} />,
                },
              }}
              style={{ marginTop: '8px' }}
            />
          </Box>

          <Box style={{ minWidth: '180px' }}>
            <Typography variant="caption" style={{ fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Class / Grade
            </Typography>
            <FormControl fullWidth size="small" style={{ marginTop: '8px' }}>
              <Select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Classes</MenuItem>
                <MenuItem value="Nursery 1">Nursery 1</MenuItem>
                <MenuItem value="KG 1">KG 1</MenuItem>
                <MenuItem value="Primary 1">Primary 1</MenuItem>
                <MenuItem value="Primary 2">Primary 2</MenuItem>
                <MenuItem value="Primary 3">Primary 3</MenuItem>
                <MenuItem value="JHS 1">JHS 1</MenuItem>
                <MenuItem value="JHS 2">JHS 2</MenuItem>
                <MenuItem value="JHS 3">JHS 3</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box style={{ minWidth: '180px' }}>
            <Typography variant="caption" style={{ fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Term
            </Typography>
            <FormControl fullWidth size="small" style={{ marginTop: '8px' }}>
              <Select
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
              >
                <MenuItem value="term-1">Term 1 (2025/2026)</MenuItem>
                <MenuItem value="term-2">Term 2 (2025/2026)</MenuItem>
                <MenuItem value="term-3">Term 3 (2025/2026)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Box style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Student</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>ID / Class</th>
              <th style={{ padding: '16px 24px', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ padding: '48px', textAlign: 'center' }}>
                  <CircularProgress size={32} style={{ color: '#0F172A' }} />
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.2s', cursor: 'pointer' }} onClick={() => handleGenerate(student.id)} onMouseOver={e => e.currentTarget.style.backgroundColor = '#F8FAFC'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '16px 24px' }}>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar style={{ width: 40, height: 40, backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 600, fontSize: '0.875rem' }}>
                        {student.firstName[0]}{student.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography style={{ fontWeight: 600, color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
                          {student.firstName} {student.lastName}
                        </Typography>
                        {student.status !== 'ACTIVE' && (
                          <Typography variant="caption" style={{ color: '#EF4444', fontWeight: 500 }}>
                            {student.status}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Typography style={{ color: '#0F172A', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                      {student.studentNumber}
                    </Typography>
                    <Typography variant="caption" style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                      {student.currentClassName || 'Unassigned'}
                    </Typography>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <Button
                      variant="text"
                      endIcon={<ArrowRight size={16} />}
                      style={{ color: '#0F172A', fontWeight: 600, textTransform: 'none' }}
                    >
                      View Report
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

