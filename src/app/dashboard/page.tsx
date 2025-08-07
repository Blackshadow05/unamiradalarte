'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { addVisitRow, readTodayVisits, readTotalVisits } from '@/lib/supabase-queries';
import { supabase } from '@/lib/supabase';
import {
  BarChart3,
  Users,
  Eye,
  Heart,
  TrendingUp,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Download,
  AlertCircle
} from 'lucide-react';

const Header = dynamic(() => import('@/components/sections/Header').then(m => m.Header), { ssr: false });
import { Button } from '@/components/ui/Button';

// Datos base de tarjetas (los valores dinámicos se inyectan abajo)
const stats = [
  {
    title: 'Obras Totales',
    value: '127',
    change: '+12%',
    trend: 'up',
    icon: ImageIcon,
    color: 'text-primary-500'
  },
  {
    title: 'Visitas de hoy',
    value: null as unknown as string, // se mostrará desde estado todayVisits
    change: '+0%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    title: 'Visualizaciones',
    value: '8,432',
    change: '+18%',
    trend: 'up',
    icon: Eye,
    color: 'text-green-500'
  },
  {
    title: 'Me Gusta',
    value: '1,234',
    change: '+8%',
    trend: 'up',
    icon: Heart,
    color: 'text-red-500'
  }
] as const;

const recentActivity = [
  {
    id: 1,
    action: 'Nueva obra agregada',
    item: 'Paisaje Abstracto #23',
    time: 'Hace 2 horas',
    type: 'upload'
  },
  {
    id: 2,
    action: 'Comentario recibido',
    item: 'Retrato en Óleo',
    time: 'Hace 4 horas',
    type: 'comment'
  },
  {
    id: 3,
    action: 'Obra destacada',
    item: 'Serie Urbana #5',
    time: 'Hace 1 día',
    type: 'featured'
  },
  {
    id: 4,
    action: 'Nueva consulta',
    item: 'Comisión personalizada',
    time: 'Hace 2 días',
    type: 'inquiry'
  }
];

const topArtworks = [
  {
    id: 1,
    title: 'Amanecer Dorado',
    views: 1247,
    likes: 89,
    image: '/api/placeholder/150/150'
  },
  {
    id: 2,
    title: 'Reflexiones Urbanas',
    views: 987,
    likes: 76,
    image: '/api/placeholder/150/150'
  },
  {
    id: 3,
    title: 'Naturaleza Viva',
    views: 834,
    likes: 65,
    image: '/api/placeholder/150/150'
  }
];

// Datos para contadores - se actualizarán con datos reales
const myArtworksCount = {
  total: 0,
  published: 0,
  drafts: 0
};

const requestsCount = {
  total: 15,
  pending: 5,
  inProgress: 3,
  completed: 7
};

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [artworksCount, setArtworksCount] = useState(myArtworksCount);
  const [todayVisits, setTodayVisits] = useState<number>(0);
  const [totalVisits, setTotalVisits] = useState<number>(0);
  const [simulating, setSimulating] = useState<boolean>(false);

  // Iniciar el reloj solo en el cliente para evitar mismatch de hidratación
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Cargar conteo real de obras (directo con supabase para evitar import faltante)
  useEffect(() => {
    const loadArtworksCount = async () => {
      try {
        const { data, error } = await supabase
          .from('Galeria')
          .select('id');
        if (error) throw error;
        const total = data?.length ?? 0;
        setArtworksCount({
          total,
          published: total,
          drafts: 0
        });
      } catch (error) {
        console.error('Error al cargar conteo de obras:', error);
      }
    };

    loadArtworksCount();
  }, []);
 
 // Leer visitas del día y total acumulado al cargar; refrescar al insertar
 useEffect(() => {
   let active = true;
   const run = async () => {
     try {
       const [today, total] = await Promise.all([
         readTodayVisits(),
         readTotalVisits()
       ]);
       if (!active) return;
       setTodayVisits(Number.isFinite(today as any) ? Number(today) : 0);
       setTotalVisits(Number.isFinite(total as any) ? Number(total) : 0);
     } catch (e) {
       console.warn('No se pudo leer visitas en Supabase', e);
     }
   };
   // Ejecutar una vez después de hidratar
   const initial = setTimeout(run, 0);
   return () => {
     clearTimeout(initial);
     active = false;
   };
 }, []);

 return (
   <main className="min-h-screen bg-gray-50">
     <Header />
      
      {/* Dashboard Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Panel de Control
              </h1>
              <p className="text-primary-100">
                Bienvenido de vuelta. Aquí tienes un resumen de tu galería.
              </p>
            </div>
            <div className="text-right text-white">
              {/* Render condicional para evitar desajuste entre SSR y cliente */}
              {currentTime && (
                <>
                  <p className="text-sm opacity-90">
                    {currentTime.toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-lg font-semibold">
                    {currentTime.toLocaleTimeString('es-ES')}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...stats, {
            title: 'Total de visitas',
            value: null as unknown as string,
            change: '+0%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-purple-600'
          } as const].map((stat, index) => {
            // Inyectar dinámicamente los valores desde Supabase
            let displayValue: string = stat.value as unknown as string;
            if (stat.title === 'Visitas de hoy') {
              displayValue = Number.isFinite(todayVisits as any) ? String(todayVisits) : '0';
            } else if (stat.title === 'Total de visitas') {
              displayValue = Number.isFinite(totalVisits as any) ? String(totalVisits) : '0';
            }

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid={stat.title === 'Visitas de hoy' ? 'today-visits-value' : undefined}>
                  {displayValue}
                </h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Mis Obras Card */}
          <Link href="/dashboard/obras">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{artworksCount.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                Mis Obras
              </h3>
              <p className="text-gray-600 mb-4">
                Administra tu colección de obras de arte, edita información y controla la visibilidad.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{artworksCount.published} publicadas</span>
                  <span>{artworksCount.drafts} borradores</span>
                </div>
                <div className="text-primary-500 group-hover:text-primary-600 transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Solicitudes Card */}
          <Link href="/dashboard/solicitudes">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{requestsCount.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Solicitudes
              </h3>
              <p className="text-gray-600 mb-4">
                Gestiona consultas, comisiones y solicitudes de colaboración de tus clientes.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                    {requestsCount.pending} pendientes
                  </span>
                  <span>{requestsCount.inProgress} en proceso</span>
                </div>
                <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Actividad Reciente
                </h2>
                <Button variant="outline" size="sm">
                  Ver Todo
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        {activity.type === 'upload' && <ImageIcon className="h-5 w-5 text-primary-600" />}
                        {activity.type === 'comment' && <MessageSquare className="h-5 w-5 text-primary-600" />}
                        {activity.type === 'featured' && <TrendingUp className="h-5 w-5 text-primary-600" />}
                        {activity.type === 'inquiry' && <Users className="h-5 w-5 text-primary-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.item}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Artworks */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Obras Más Populares
              </h2>
              <div className="space-y-4">
                {topArtworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {artwork.title}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {artwork.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {artwork.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Acciones Rápidas
              </h2>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Subir Nueva Obra
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Estadísticas
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Gestionar Comentarios
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos
                </Button>

                {/* Botón para simular una visita: inserta una nueva fila con Visitas_hoy=1 */}
                <div className="pt-2 border-t border-gray-100">
                  <Button
                    className="w-full justify-center font-semibold"
                    variant="outline"
                    onClick={async () => {
                      try {
                        setSimulating(true);
                        await addVisitRow();
                      } catch (e) {
                        console.error('Error al simular visita:', e);
                      } finally {
                        setSimulating(false);
                        // Siempre re-leer después de intentar insertar, para asegurar consistencia
                        try {
                          const [today, total] = await Promise.all([
                            readTodayVisits(),
                            readTotalVisits()
                          ]);
                          setTodayVisits(Number.isFinite(today as any) ? Number(today) : 0);
                          setTotalVisits(Number.isFinite(total as any) ? Number(total) : 0);
                        } catch (e) {
                          console.warn('No se pudo refrescar visitas tras insertar', e);
                        }
                      }
                    }}
                    disabled={simulating}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {simulating ? 'Registrando visita...' : 'Simular visita (agregar fila)'}
                  </Button>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Crea una nueva fila en "Movimientos" y actualiza "Visitas de hoy" desde Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimpleFooter />
    </main>
  );
}