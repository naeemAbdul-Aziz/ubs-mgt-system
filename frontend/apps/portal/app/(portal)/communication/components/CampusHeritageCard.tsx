import React from 'react';
import { Box, Typography } from '@mui/material';

export const CampusHeritageCard: React.FC = () => {
  return (
    <Box
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(7, 2, 53, 0.08)',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7DQ3maUSunITLUCvWdsVsOU5LO86zwAGUCkZn5OeUCpmCq1iq1h_j1p6AciN_TdBf8SM4J9RNnPaGiCC3DocqMs3up-T7xhZ6cuhG9c9GPbceY8SPJUkxrwqGgMAyQLxfYIQV3b4uEZfwiNtYEjyG8hk-zGF2trLjY7ZfP4OjpxPsVB3EyVo2pBzfd0EqCbOgP-gU0XlGMv8GY6S-fbaas8U1BvtQHxhOHNh0_OIZSgJUgGJNVIQm"
        alt="Heritage Campus Architecture"
        style={{
          width: '100%',
          height: '192px',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <Box style={{ padding: '16px' }}>
        <Typography
          variant="body2"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'italic',
            color: '#47464F',
            lineHeight: 1.5,
          }}
        >
          &quot;Excellence is our heritage, precision is our future.&quot;
        </Typography>
      </Box>
    </Box>
  );
};
