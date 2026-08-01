'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function ApiDocsPage() {
  // Extract the base backend URL by stripping off '/api/v1' from the NEXT_PUBLIC_API_BASE_URL
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
  const backendUrl = apiBase.replace('/api/v1', '');
  const swaggerUrl = `${backendUrl}/swagger-ui.html`;

  return (
    <Box sx={{ p: 0, height: 'calc(100vh - 120px)' }}>
      <Paper 
        elevation={0}
        sx={{ 
          height: '100%', 
          width: '100%',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          borderRadius: '12px'
        }}
      >
        <iframe 
          src={swaggerUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 'none' }}
          title="Swagger API Documentation"
        />
      </Paper>
    </Box>
  );
}
