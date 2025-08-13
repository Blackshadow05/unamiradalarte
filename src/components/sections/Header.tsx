'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X, Palette } from "lucide-react";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Galería", href: "/galeria" },
  { name: "Sobre Mí", href: "/sobre-mi" },
  { name: "Mis Servicios", href: "/servicios" },
  { name: "Contacto", href: "/#contacto" },
];

type HeaderProps = {
  initialSolid?: boolean;
};

export function Header({ initialSolid = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(initialSolid);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (initialSolid) return; // Forzar sólido: no escuchar scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialSolid]);

  const scrolled = initialSolid ? true : isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <span
              className={cn(
                "text-xl font-bold transition-colors",
                scrolled ? "text-gray-900" : "text-primary-500 drop-shadow"
              )}
            >
              Una Mirada al Arte
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
{navigation.map((item) => (
  <Link
    key={item.name}
    href={item.href}
    className="text-gray-700 hover:text-brand-magenta transition-colors duration-200 font-medium"
  >
    {item.name}
  </Link>
))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white shadow-lg border-b border-gray-100 animate-slide-up">
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-brand-magenta transition-colors duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
