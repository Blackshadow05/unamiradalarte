"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";
import { Ruler, Tag, PawPrint, Heart, Palette, Paintbrush, GraduationCap } from "lucide-react";

type Service = {
  title: string;
  price: string;
  description: string;
  size: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const services: Service[] = [
  {
    title: "Retrato de mascotas",
    price: "Desde ₡25,000",
    description:
      "Retrato de mascotas pintado a mano que captura la personalidad y expresión de tu compañero, con detalles realistas y colores vibrantes.",
    size: "20x20 cm: ₡25,000\n30x30 cm: ₡30,000\n50x50 cm: ₡50,000",
    icon: PawPrint,
  },
  {
    title: "Venta de amigurumis",
    price: "₡15,000",
    description:
      "Amigurumis hechos a mano, perfectos como regalos o decoración. Cada pieza es única y llena de cariño.",
    size: "20 cm",
    icon: Heart,
  },
  {
    title: "Bodegones",
    price: "₡30,000",
    description:
      "Obras de arte que representan la belleza de la naturaleza y la vida cotidiana. Diseños modernos para realzar cualquier espacio.",
    size: "40x50 cm",
    icon: Palette,
  },
  {
    title: "Murales",
    price: "₡100,000",
    description:
      "Transforma tu espacio con un mural personalizado que refleje tu estilo y personalidad. Gran formato y acabado duradero.",
    size: "Variable",
    icon: Paintbrush,
  },
  {
    title: "Clases privadas",
    price: "₡10,000 por sesión",
    description:
      "Aprende a crear arte en clases personalizadas, adaptadas a tu nivel y estilo. Sesiones prácticas y seguimiento individual.",
    size: "Variable",
    icon: GraduationCap,
  },
];

// Paletas de color por tarjeta (índice)
const tone: Array<{ text: string; bg: string; chip: string; ring: string }> = [
  { text: "text-pink-600", bg: "bg-pink-50", chip: "bg-pink-500", ring: "from-pink-400/40" },
  { text: "text-emerald-600", bg: "bg-emerald-50", chip: "bg-emerald-500", ring: "from-emerald-400/40" },
  { text: "text-indigo-600", bg: "bg-indigo-50", chip: "bg-indigo-500", ring: "from-indigo-400/40" },
  { text: "text-amber-700", bg: "bg-amber-50", chip: "bg-amber-500", ring: "from-amber-400/40" },
  { text: "text-sky-600", bg: "bg-sky-50", chip: "bg-sky-500", ring: "from-sky-400/40" },
];

const ServicesList: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const openModal = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setModalOpen(true);
  };

  return (
    <section aria-label="Mis Servicios" className="relative py-16 sm:py-20 bg-white">
      {/* Fondo decorativo sutil */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-pink-50/80 via-fuchsia-50/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Servicios
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">
            <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-amber-600 bg-clip-text text-transparent">
              Mis Servicios
            </span>
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-gray-600">
            Opciones pensadas para diferentes necesidades: desde piezas personalizadas hasta clases privadas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, idx) => {
            const T = tone[idx % tone.length];
            const Icon = service.icon;

            return (
              <div key={service.title} className="group relative">
                {/* Borde con gradiente sutil */}
                <div
                  className={[
                    "relative rounded-2xl p-[1px] transition-transform duration-300",
                    "bg-gradient-to-br",
                    T.ring,
                    "via-fuchsia-400/35 to-amber-400/35",
                    "group-hover:-translate-y-1 group-hover:shadow-xl",
                  ].join(" ")}>
                  <Card className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-sm ring-1 ring-gray-100">
                    {/* Header */}
                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={["h-11 w-11 rounded-xl flex items-center justify-center", T.bg].join(" ")}>
                            <Icon className={["h-6 w-6", T.text].join(" ")} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                            <div className="mt-1 inline-flex items-center gap-2">
                              <span className={[
                                  "inline-flex items-center gap-1 rounded-full text-white text-[11px] font-semibold px-2.5 py-1 shadow-sm",
                                  T.chip,
                                ].join(" ")}>
                                <Tag className="h-3.5 w-3.5 text-white/90" /> {service.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{service.description}</p>

                      {service.size.includes("\n") && service.size.includes(":") ? (
                        <div className="rounded-xl border border-gray-100 bg-gray-50/70 overflow-hidden">
                          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                            <Ruler className="h-4 w-4 text-gray-500" />
                            <h4 className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                              Precios por tamaño
                            </h4>
                          </div>
                          <ul className="divide-y divide-gray-100">
                            {service.size
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((line, i) => {
                                const parts = line.split(":");
                                const label = parts[0]?.trim();
                                const value = parts.slice(1).join(":").trim();
                                return (
                                  <li key={i} className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-gray-700">{label}</span>
                                    <span className="text-[13px] font-semibold text-gray-900 bg-white border border-gray-200 rounded-full px-2.5 py-1">
                                      {value}
                                    </span>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50/70 border border-gray-100 rounded-xl px-3 py-2">
                          <Ruler className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Tamaño:</span>
                          <span className="text-gray-800">{service.size}</span>
                        </div>
                      )}
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="pt-0">
                      <button
                        type="button"
                        onClick={() => openModal(service.title)}
                        aria-label={`Solicitar ${service.title}`}
                        className={[
                          "w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md text-white",
                          "shadow-md bg-gradient-to-r from-pink-500 to-pink-600",
                          "transition-all hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:scale-[1.01]",
                          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500",
                        ].join(" ")}
                      >
                        Solicitar
                      </button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de contacto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative w-full max-w-3xl">
            <div className="p-[1px] rounded-2xl bg-gradient-to-br from-pink-400/40 via-fuchsia-400/35 to-amber-400/40">
              <Card className="rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Contacto</p>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedService ? `Solicitar: ${selectedService}` : "Solicitar servicio"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label="Cerrar modal"
                    >
                      ✕
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesList;
