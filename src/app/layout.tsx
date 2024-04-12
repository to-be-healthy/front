import '@/app/_styles/global.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';

import { KakaoScript, MSWComponent, QueryProvider } from './_providers';

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
          {children}
        </QueryProvider>
      </body>
      <GoogleAnalytics gaId={gaId} />
      <KakaoScript />
    </html>
  );
}
