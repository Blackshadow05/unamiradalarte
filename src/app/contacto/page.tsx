'use client';

import { ContactForm } from '@/components/forms/ContactForm';

export default function ContactoPage() {
  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Contacto</h2>
        <ContactForm />
      </div>
    </section>
  );
}