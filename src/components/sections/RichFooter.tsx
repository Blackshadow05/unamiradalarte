"use client";

import { Palette, Heart, Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function RichFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-fuchsia-50 via-fuchsia-100 to-fuchsia-200 dark:from-fuchsia-900 dark:to-fuchsia-800 text-black dark:text-white" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.25)' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top: Brand + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 items-start">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 shadow-md">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight group-hover:text-primary-500 transition-colors">
                  Una Mirada al Arte
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Galería digital de obras contemporáneas
                </p>
              </div>
            </Link>

            <p className="mt-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Celebramos la creatividad con una selección curada de piezas únicas. Explora, conecta con el proceso creativo
              y descubre nuevas perspectivas a través del arte.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="https://instagram.com" label="Instagram">
                <Instagram className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <Facebook className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" label="Twitter/X">
                <Twitter className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href="https://youtube.com" label="YouTube">
                <Youtube className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
              Navegación
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/">Inicio</FooterLink>
              <FooterLink href="/galeria">Galería</FooterLink>
              <FooterLink href="/servicios">Servicios</FooterLink>
              <FooterLink href="/sobre-mi">Sobre mí</FooterLink>
              <FooterLink href="/ratings">Valoraciones</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
              Recursos
            </h3>
            <ul className="mt-4 space-y-3">
              <FooterLink href="/#testimonios">Testimonios</FooterLink>
              <FooterLink href="/#destacadas">Obras destacadas</FooterLink>
              <FooterLink href="/#contacto">Contacto</FooterLink>
              <FooterLink href="/dashboard">Panel</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
              Boletín
            </h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Suscríbete para recibir novedades de obras y exposiciones.
            </p>

            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                // Placeholder: here you could integrate a real service
                setEmail("");
              }}
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-md bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Enviar
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Tranquilo, no enviamos spam.
              </p>
            </form>

            {/* Contact quick info */}
            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 text-primary-500" />
                contacto@unamiradaalarte.com
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 text-primary-500" />
                +506 0000 0000
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-primary-500" />
                San José, Costa Rica
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-gray-200 dark:bg-gray-800" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Una Mirada al Arte. Hecho con{" "}
            <Heart className="inline h-3 w-3 text-red-500 fill-current align-text-top" /> para el arte.
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <Link className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors" href="/terminos">
              Términos
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors" href="/privacidad">
              Privacidad
            </Link>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <Link className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors" href="/cookies">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200 dark:border-gray-800 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}

export default RichFooter;