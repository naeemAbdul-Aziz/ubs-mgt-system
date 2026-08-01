'use client';

import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@ubs-lmis/ui';
import { AuthProvider } from './providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="en">
      <head>
        {/* ── Primary meta ─────────────────────────────────────────── */}
        <title>UBS-LMIS · School Management Portal</title>
        <meta name="description" content="University Basic School — School Management System. A unified digital platform for academic management, student welfare, and institutional excellence." />
        <meta name="keywords" content="UBS, school management, student portal, Ghana, academic, LMIS" />
        <meta name="author" content="Draka Labs" />
        <meta name="theme-color" content="#070235" />
        <meta name="color-scheme" content="light" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ── Favicon set ──────────────────────────────────────────── */}
        {/* Standard browser favicon */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        {/* Apple Touch Icon — used when saved to iPhone/iPad home screen */}
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Android Chrome manifest color */}
        <meta name="application-name" content="UBS-LMIS" />
        <meta name="msapplication-TileColor" content="#070235" />
        <meta name="msapplication-TileImage" content="/logo.png" />

        {/* ── Open Graph (WhatsApp, iMessage, Telegram, Facebook, Instagram, LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UBS-LMIS School Portal" />
        <meta property="og:title" content="UBS-LMIS · University Basic School Management System" />
        <meta property="og:description" content="A unified digital platform for academic management, student welfare, and institutional excellence. Serving students, teachers, guardians and administrators." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="University Basic School crest — UBS-LMIS Portal" />
        <meta property="og:locale" content="en_GH" />

        {/* ── Twitter / X Card (also used by TikTok link previews) ─── */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="UBS-LMIS · School Management Portal" />
        <meta name="twitter:description" content="Academic management, results, fees, attendance and more — all in one portal." />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:image:alt" content="University Basic School crest" />

        {/* ── Google Fonts ─────────────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#F8F9FA' }}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
