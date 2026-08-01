import React from 'react';
import { Box, Typography } from '@mui/material';
import { MapPin, Phone, Globe, Mail } from 'lucide-react';

interface ReportCardHeaderProps {
  institutionName?: string;
  motto?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  academicYear?: string;
  termName?: string;
}

export const ReportCardHeader: React.FC<ReportCardHeaderProps> = ({
  institutionName = 'UNIVERSITY BASIC SCHOOL',
  motto = 'Excellence in Scholastic Development',
  location = 'Accra, Ghana',
  phone = '+233 24 000 0000',
  email = 'info@ubs-lmis.edu.gh',
  website = 'www.ubs-lmis.edu.gh',
  academicYear = '2023/2024',
  termName = 'Term 3',
}) => {
  return (
    <header style={{ position: 'relative', zIndex: 10, marginBottom: '40px' }}>
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* Centered Original Logo */}
        <img
          src="/logo.png"
          alt="University Basic School Crest"
          style={{ width: '90px', height: '90px', objectFit: 'contain', marginBottom: '16px' }}
        />
        
        {/* Institution Name */}
        <Typography
          variant="h3"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 800,
            color: '#070235',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 1.1,
            marginBottom: '4px',
          }}
        >
          {institutionName}
        </Typography>

        {/* Motto */}
        <Typography
          variant="subtitle1"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}
        >
          {motto}
        </Typography>

        {/* Contact Details on a Straight Line */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            color: '#334155',
            fontSize: '0.85rem',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#645EFB" /> {location}
          </span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={14} color="#645EFB" /> {phone}
          </span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={14} color="#645EFB" /> {email}
          </span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={14} color="#645EFB" /> {website}
          </span>
        </Box>
      </Box>

      {/* Decorative Divider */}
      <Box style={{ marginTop: '24px', position: 'relative' }}>
        <Box style={{ height: '3px', backgroundColor: '#070235', width: '100%', borderRadius: '2px' }} />
        <Box style={{ height: '1px', backgroundColor: '#645EFB', width: '100%', marginTop: '3px' }} />
        
        {/* Document Badge Overlapping Divider */}
        <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFFFFF', padding: '0 24px' }}>
          <Typography
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              color: '#070235',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '0.85rem',
              border: '2px solid #070235',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: '#F8FAFC'
            }}
          >
            Official Terminal Report • {termName} {academicYear}
          </Typography>
        </Box>
      </Box>
    </header>
  );
};
