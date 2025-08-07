import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RichFooter } from '../components/sections/RichFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Una Mirada al Arte | Galería Digital',
  description: 'Descubre obras de arte únicas y contemporáneas. Galería digital con pinturas, esculturas y arte digital de artistas emergentes.',
  keywords: 'arte, galería, pintura, escultura, arte digital, contemporáneo',
  authors: [{ name: 'Una Mirada al Arte' }],
  openGraph: {
    title: 'Una Mirada al Arte | Galería Digital',
    description: 'Descubre obras de arte únicas y contemporáneas',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <div className="flex-1">{children}</div>
        <RichFooter />
      </body>
    </html>
  );
}