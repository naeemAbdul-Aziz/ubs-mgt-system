import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse, Chip } from '@mui/material';
import { Plus, MoreVertical, ChevronRight, ChevronDown, UserCheck, BookOpen } from 'lucide-react';

interface ClassItem {
  code: string;
  name: string;
  streams: string;
  formTeacher: string;
  streamList: string[];
  subjects: string[];
}

export const ClassStructureCard: React.FC = () => {
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const earlyYearsClasses: ClassItem[] = [
    { code: 'N1', name: 'Nursery 1', streams: '2 Streams • 40 Students', formTeacher: 'Ama Serwaa', streamList: ['Nursery 1A (20)', 'Nursery 1B (20)'], subjects: ['Numeracy', 'Phonics', 'Rhymes & Creative Arts'] },
    { code: 'N2', name: 'Nursery 2', streams: '2 Streams • 45 Students', formTeacher: 'Abena Mensah', streamList: ['Nursery 2A (22)', 'Nursery 2B (23)'], subjects: ['Early Math', 'Literacy', 'Environmental Studies'] },
    { code: 'K1', name: 'KG 1', streams: '3 Streams • 75 Students', formTeacher: 'Kojo Appiah', streamList: ['KG 1A (25)', 'KG 1B (25)', 'KG 1C (25)'], subjects: ['Core Math', 'Language Arts', 'Basic Science'] },
    { code: 'K2', name: 'KG 2', streams: '3 Streams • 80 Students', formTeacher: 'Akosua Frimpong', streamList: ['KG 2A (27)', 'KG 2B (27)', 'KG 2C (26)'], subjects: ['Writing Skills', 'Quantitative Reasoning', 'Social Habits'] },
  ];

  const primaryClasses: ClassItem[] = [
    { code: 'P1', name: 'Primary 1', streams: '3 Streams • 105 Students', formTeacher: 'Yaw Frimpong', streamList: ['Primary 1A (35)', 'Primary 1B (35)', 'Primary 1C (35)'], subjects: ['English', 'Mathematics', 'Integrated Science', 'Ghanaian Language'] },
    { code: 'P2', name: 'Primary 2', streams: '3 Streams • 105 Students', formTeacher: 'Samuel Owusu', streamList: ['Primary 2A (35)', 'Primary 2B (35)', 'Primary 2C (35)'], subjects: ['English', 'Mathematics', 'Science', 'Religious & Moral Education'] },
    { code: 'P3', name: 'Primary 3', streams: '3 Streams • 110 Students', formTeacher: 'Evelyn Addo', streamList: ['Primary 3A (37)', 'Primary 3B (37)', 'Primary 3C (36)'], subjects: ['English', 'Mathematics', 'Science', 'Computing (ICT)'] },
    { code: 'P4', name: 'Primary 4', streams: '3 Streams • 100 Students', formTeacher: 'Grace Boateng', streamList: ['Primary 4A (34)', 'Primary 4B (33)', 'Primary 4C (33)'], subjects: ['Mathematics', 'Science', 'Social Studies', 'ICT', 'Creative Arts'] },
  ];

  const jhsClasses: ClassItem[] = [
    { code: 'J1', name: 'JHS 1', streams: '3 Streams • 105 Students', formTeacher: 'Kwame Osei', streamList: ['JHS 1A (35)', 'JHS 1B (35)', 'JHS 1C (35)'], subjects: ['Core Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'ICT', 'BDT'] },
    { code: 'J2', name: 'JHS 2', streams: '4 Streams • 120 Students', formTeacher: 'Dr. Kwame Osei', streamList: ['JHS 2A (30)', 'JHS 2B (30)', 'JHS 2C (30)', 'JHS 2D (30)'], subjects: ['Core Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'ICT', 'French'] },
    { code: 'J3', name: 'JHS 3', streams: '3 Streams • 98 Students', formTeacher: 'Samuel Frimpong', streamList: ['JHS 3A (33)', 'JHS 3B (33)', 'JHS 3C (32)'], subjects: ['BECE Prep Math', 'English Literature', 'Integrated Science', 'Social Studies', 'BECE ICT'] },
  ];

  const handleToggle = (code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  const renderClassGroup = (title: string, items: ClassItem[]) => (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Typography
        variant="caption"
        style={{
          fontFamily: 'Inter, sans-serif',
          color: '#47464F',
          opacity: 0.7,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
          fontSize: '11px',
          borderBottom: '1px solid rgba(200, 197, 208, 0.2)',
          paddingBottom: '8px',
        }}
      >
        {title}
      </Typography>

      <Box style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((cls) => {
          const isExpanded = expandedCode === cls.code;
          return (
            <Box
              key={cls.code}
              style={{
                border: isExpanded ? '1px solid #4B41E1' : '1px solid rgba(200, 197, 208, 0.3)',
                borderRadius: '14px',
                backgroundColor: isExpanded ? '#F8FAFC' : '#FFFFFF',
                transition: 'all 0.2s ease-in-out',
                overflow: 'hidden',
              }}
            >
              {/* Main Card Item */}
              <Box
                onClick={() => handleToggle(cls.code)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  cursor: 'pointer',
                }}
              >
                <Box style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Box
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: isExpanded ? '#4B41E1' : '#F0F3FF',
                      color: isExpanded ? '#FFFFFF' : '#070235',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {cls.code}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#070235' }}>
                      {cls.name}
                    </Typography>
                    <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', fontSize: '11px' }}>
                      {cls.streams}
                    </Typography>
                  </Box>
                </Box>
                {isExpanded ? <ChevronDown size={18} color="#4B41E1" /> : <ChevronRight size={18} color="#94A3B8" />}
              </Box>

              {/* Expandable Details Drawer */}
              <Collapse in={isExpanded}>
                <Box style={{ padding: '0 16px 16px 16px', borderTop: '1px dashed #E2E8F0', paddingTop: '12px', marginTop: '4px' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <UserCheck size={14} color="#4B41E1" />
                    <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#0F172A' }}>
                      Class Teacher: <span style={{ fontWeight: 400, color: '#475569' }}>{cls.formTeacher}</span>
                    </Typography>
                  </Box>

                  <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Active Streams ({cls.streamList.length}):
                  </Typography>
                  <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {cls.streamList.map((st) => (
                      <Chip
                        key={st}
                        label={st}
                        size="small"
                        style={{
                          backgroundColor: '#EEF2FF',
                          color: '#312E81',
                          fontWeight: 600,
                          fontSize: '11px',
                          borderRadius: '6px',
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Enrolled Subjects:
                  </Typography>
                  <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {cls.subjects.map((sb) => (
                      <Chip
                        key={sb}
                        label={sb}
                        size="small"
                        variant="outlined"
                        style={{
                          borderColor: '#CBD5E1',
                          color: '#475569',
                          fontSize: '10px',
                          borderRadius: '4px',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(30, 27, 75, 0.08)',
        padding: '32px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Card Header */}
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Box>
          <Typography variant="h5" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: '#070235' }}>
            Class Structure
          </Typography>
          <Typography variant="caption" style={{ fontFamily: 'Inter, sans-serif', color: '#64748B', display: 'block', marginTop: '2px' }}>
            Click any class to expand streams, assigned teachers, and subject offerings
          </Typography>
        </Box>
        <Box style={{ display: 'flex', gap: '8px' }}>
          <IconButton style={{ border: '1px solid #C8C5D0', borderRadius: '50%', padding: '8px' }}>
            <Plus size={18} color="#070235" />
          </IconButton>
          <IconButton style={{ border: '1px solid #C8C5D0', borderRadius: '50%', padding: '8px' }}>
            <MoreVertical size={18} color="#070235" />
          </IconButton>
        </Box>
      </Box>

      {/* Clusters Grid */}
      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {renderClassGroup('Nursery & Kindergarten', earlyYearsClasses)}
        {renderClassGroup('Primary School', primaryClasses)}
        {renderClassGroup('Junior High School', jhsClasses)}
      </Box>
    </Box>
  );
};
