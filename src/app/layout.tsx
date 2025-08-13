import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RichFooter } from '../components/sections/RichFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Retratos de Mascotas a Mano en San José | Una Mirada al Arte',
  description:
    'Retratos de mascotas pintados a mano en óleo, acrílico o lápiz. Encargos desde San José, Costa Rica. Entrega ~15 días y envíos a todo el país. Pide tu retrato por WhatsApp.',
  keywords:
    'retrato de mascotas, retratos de perros, retratos de gatos, retrato al óleo, retrato acrílico, retrato a lápiz, arte personalizado, San José, Costa Rica',
  authors: [{ name: 'Una Mirada al Arte' }],
  openGraph: {
    title: 'Retratos de Mascotas pintados a mano | Una Mirada al Arte',
    description:
      'Pinturas personalizadas de tu mascota en óleo, acrílico o lápiz. Entrega ~15 días. Envíos a toda Costa Rica.',
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