import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '8Blocks',
  description: 'Token economies that power the business — 8Blocks',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://8blocks.io'),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
