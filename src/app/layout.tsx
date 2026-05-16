import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HamSafar — Carpooling for Pakistan',
  description: 'Community carpooling connecting verified peers across Pakistan.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F766E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className="antialiased min-h-dvh flex items-start justify-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2d1f 100%)' }}
      >
        {/* Phone frame bezel */}
        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: 390,
            height: '100dvh',
            minHeight: '100vh',
            borderRadius: 40,
            boxShadow: `
              inset 0 0 0 1px rgba(255,255,255,0.08),
              0 0 0 2px #1e293b,
              0 0 0 7px #0f172a,
              0 40px 120px rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-[100] bg-slate-950"
            style={{ width: 126, height: 30, borderRadius: '0 0 18px 18px' }}
          />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: { maxWidth: 340, fontSize: 13 },
            }}
          />
        </div>
      </body>
    </html>
  );
}
