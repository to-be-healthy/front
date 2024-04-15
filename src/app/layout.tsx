import '@/app/_styles/global.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';

import { KakaoScript, MSWComponent, QueryProvider } from './_providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const gaId = process.env.GA_ID ?? '';

export const metadata: Metadata = {
  title: '건강해짐',
  description: 'Generated by create next app',
  manifest: '/manifest.json',
  icons: { apple: '/icon.png' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='ko'>
      <body>
        <QueryProvider>
          <MSWComponent />
          <Suspense>{children}</Suspense>
        </QueryProvider>
      </body>
      <GoogleAnalytics gaId={gaId} />
      <KakaoScript />
    </html>
  );
}
