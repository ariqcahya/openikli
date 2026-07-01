import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'OpenSource-IKLI — Dashboard & Survei Kepuasan Infrastruktur',
  description: 'Platform open-source untuk survei, pemetaan, dan analisis Indeks Kepuasan Layanan Infrastruktur.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable}`}>
      <body className="bg-background text-text-primary font-sans antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
