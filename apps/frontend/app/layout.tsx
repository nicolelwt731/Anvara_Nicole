import type { Metadata } from 'next';
import React from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { Nav } from './components/nav';
import { AnalyticsProvider } from './components/analytics-provider';
import { ToastContainer } from './components/toast';

export const metadata: Metadata = {
  title: 'Anvara Marketplace | Connect Sponsors with Premium Publishers',
  description:
    'The leading sponsorship marketplace connecting brands with premium publishers. Create campaigns, list ad slots, and grow your business.',
  keywords: ['sponsorship', 'marketplace', 'advertising', 'publishers', 'sponsors', 'campaigns'],
  openGraph: {
    title: 'Anvara Marketplace | Connect Sponsors with Premium Publishers',
    description:
      'The leading sponsorship marketplace connecting brands with premium publishers. Create campaigns, list ad slots, and grow your business.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anvara Marketplace',
    description: 'The leading sponsorship marketplace connecting brands with premium publishers.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const envGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gaId = envGaId || (process.env.NODE_ENV === 'development' ? 'G-DEMO000000' : undefined);

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Nav />
        <AnalyticsProvider />
        <main className="min-h-screen bg-[--color-background]">
          <div className="mx-auto max-w-6xl p-4">{children}</div>
        </main>
        <ToastContainer />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
