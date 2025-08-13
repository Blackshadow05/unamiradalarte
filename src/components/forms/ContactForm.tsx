'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ContactForm as ContactFormType } from '@/types';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// Webhook URL de Make
const WEBHOOK_API = '/api/make-webhook';

const subjects = [
  { value: 'consulta', label: 'Consulta General' },
  { value: 'encargo', label: 'Encargo Personalizado' },
  { value: 'otro', label: 'Otro' },
];

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormType>({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'consulta',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Build payload from form data
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    // Local device time without timezone info - formato YYYY-MM-DD HH:MM:SS para evitar ambigüedad
    const createdAtLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:00`;
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      subject: formData.subject,
      created_at: createdAtLocal,
    };
    
    // Enviar payload al webhook Make
    try {
      const res = await fetch(WEBHOOK_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await res.text();
    } catch (err) {
      // Silently ignore logs per request
    }
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '', subject: 'consulta' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (submitted) {
    return (
      <Card className="relative max-w-2xl mx-auto text-center p-12 overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-200/40 via-emerald-100/30 to-teal-200/40" />
        <div className="relative">
          <div className="w-16 h-16 bg-green-100/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2">¡Mensaje Enviado!</h3>
          <p className="text-gray-600">
            Gracias por contactarme. Te responderé lo antes posible.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
          <div className="space-y-4">
            <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-primary-400/40 via-fuchsia-400/40 to-amber-400/40 hover:from-primary-400 hover:to-amber-400 transition-colors">
              <div className="flex items-start gap-4 rounded-xl bg-white/80 backdrop-blur-md p-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="p-3 rounded-lg bg-primary-100/70 text-primary-600 shadow-inner">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <p className="text-gray-600">unamiradaalarte@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-primary-400/40 via-fuchsia-400/40 to-amber-400/40 hover:from-primary-400 hover:to-amber-400 transition-colors">
              <div className="flex items-start gap-4 rounded-xl bg-white/80 backdrop-blur-md p-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="p-3 rounded-lg bg-primary-100/70 text-primary-600 shadow-inner">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Teléfono</h4>
                  <p className="text-gray-600">+506 8383-8383</p>
                </div>
              </div>
            </div>

            <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-primary-400/40 via-fuchsia-400/40 to-amber-400/40 hover:from-primary-400 hover:to-amber-400 transition-colors">
              <div className="flex items-start gap-4 rounded-xl bg-white/80 backdrop-blur-md p-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="p-3 rounded-lg bg-primary-100/70 text-primary-600 shadow-inner">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Ubicación</h4>
                  <p className="text-gray-600">Cartago, Costa Rica</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4">Horarios de Atención</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Lunes - Viernes</span>
              <span>9:00 - 18:00</span>
            </div>
            <div className="flex justify-between">
              <span>Sábados</span>
              <span>10:00 - 14:00</span>
            </div>
            <div className="flex justify-between">
              <span>Domingos</span>
              <span>Cerrado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-primary-400/50 via-fuchsia-400/40 to-amber-400/50">
          <Card className="relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl shadow-xl">
            <div className="pointer-events-none absolute -top-20 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-primary-300/40 to-amber-300/40 blur-3xl" />
            <CardHeader>
              <h3 className="text-2xl font-bold">Envíame un Mensaje</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Número de celular"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Asunto *</label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-all focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Cuéntame sobre tu proyecto o consulta..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className={cn(
                    'w-full shadow-md transition-transform hover:shadow-lg hover:scale-[1.01]',
                    isSubmitting && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}