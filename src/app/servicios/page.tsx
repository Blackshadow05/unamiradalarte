import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { Services } from '@/components/sections/Services';
import { PageHero } from '@/components/sections/PageHero';

export const metadata = {
  title: 'Mis Servicios | Una Mirada al Arte',
  description: 'Descubre todos mis servicios artísticos: retratos personalizados de mascotas, amigurumis, bodegones tropicales y más.',
};

export default function ServiciosPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <PageHero 
        title="Mis Servicios"
        subtitle="Ofrezco una variedad de servicios artísticos personalizados para inmortalizar a tus mascotas y crear obras únicas que capturen su esencia."
        badge="Arte a tu Medida"
      />
      <Services />
      <SimpleFooter />
    </main>
  );
}