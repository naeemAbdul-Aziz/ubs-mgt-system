import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack, Chip, Divider, Grid } from '@mui/material';
import { BookOpen, ClipboardCheck, CheckCircle, Bell } from 'lucide-react';

export const TeacherDashboardPanel = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Main Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            My Classes (Homeroom)
          </Typography>
          <Card sx={{ borderRadius: 4, mb: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>JHS 1A</Typography>
                  <Typography variant="body2" color="text.secondary">35 Students Enrolled</Typography>
                </Box>
                <Chip label="Current Term" color="primary" size="small" />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CheckCircle size={18} />}
                    fullWidth
                    href="/attendance"
                  >
                    Mark Attendance
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ClipboardCheck size={18} />}
                    fullWidth
                    href="/results"
                  >
                    Enter Assessments
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Today's Schedule
          </Typography>
          <Stack spacing={2}>
            {['Mathematics (JHS 1A) - 08:00 AM', 'Science (Primary 3A) - 10:00 AM', 'English (JHS 1A) - 01:00 PM'].map((cls, i) => (
              <Card key={i} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
                <BookOpen size={20} style={{ marginRight: 16, color: 'gray' }} />
                <Typography variant="subtitle1">{cls}</Typography>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Sidebar Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
            <CardContent>
              <Stack direction="row" sx={{ alignItems: 'center', mb: 3 }} spacing={1}>
                <Bell size={20} color="#4338CA" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Announcements</Typography>
              </Stack>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>End of Term Reports Due</Typography>
                  <Typography variant="body2" color="text.secondary">Please submit all continuous assessments by Friday.</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Staff Meeting</Typography>
                  <Typography variant="body2" color="text.secondary">General staff meeting tomorrow at 3:00 PM in the Assembly Hall.</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Payroll Processed</Typography>
                  <Typography variant="body2" color="text.secondary">Your payslip for this month is now available.</Typography>
                  <Button size="small" variant="text" sx={{ mt: 1, p: 0 }} href="/payroll">View Payslip</Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
