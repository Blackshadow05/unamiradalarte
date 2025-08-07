'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  ArrowLeft,
  Filter,
  Search,
  Edit3,
  AlertCircle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Datos de ejemplo para las solicitudes
const requests = [
  {
    id: 1,
    type: 'Comisión',
    client: 'María González',
    email: 'maria@email.com',
    phone: '+34 123 456 789',
    subject: 'Retrato familiar personalizado',
    description: 'Me gustaría encargar un retrato familiar en óleo de 60x80cm para regalo de aniversario. Somos 4 personas y me gustaría que fuera en estilo realista.',
    budget: '€800-1200',
    status: 'Pendiente',
    date: '2024-01-22',
    priority: 'Alta'
  },
  {
    id: 2,
    type: 'Consulta',
    client: 'Carlos Ruiz',
    email: 'carlos@email.com',
    phone: '+34 987 654 321',
    subject: 'Disponibilidad para exposición',
    description: 'Consulta sobre disponibilidad de obras para exposición en galería local durante el mes de marzo. Interesado en paisajes y arte abstracto.',
    budget: 'A negociar',
    status: 'En proceso',
    date: '2024-01-20',
    priority: 'Media'
  },
  {
    id: 3,
    type: 'Venta',
    client: 'Ana Martín',
    email: 'ana@email.com',
    phone: '+34 555 123 456',
    subject: 'Interés en "Amanecer Dorado"',
    description: 'Estoy muy interesada en adquirir la obra "Amanecer Dorado" que vi en su galería online. ¿Está disponible para venta inmediata?',
    budget: '€650',
    status: 'Completada',
    date: '2024-01-18',
    priority: 'Baja'
  },
  {
    id: 4,
    type: 'Colaboración',
    client: 'Galería Arte Moderno',
    email: 'info@galeriaarte.com',
    phone: '+34 666 789 123',
    subject: 'Propuesta de colaboración',
    description: 'Nos gustaría proponer una colaboración para exhibir sus obras en nuestra próxima exposición colectiva "Nuevas Voces del Arte Contemporáneo".',
    budget: 'Sin costo',
    status: 'Pendiente',
    date: '2024-01-21',
    priority: 'Alta'
  },
  {
    id: 5,
    type: 'Comisión',
    client: 'Roberto Silva',
    email: 'roberto@email.com',
    phone: '+34 777 888 999',
    subject: 'Mural para oficina corporativa',
    description: 'Buscamos un artista para crear un mural de 3x2 metros para nuestra oficina principal. Temática: innovación y tecnología.',
    budget: '€2000-3000',
    status: 'En proceso',
    date: '2024-01-19',
    priority: 'Alta'
  },
  {
    id: 6,
    type: 'Consulta',
    client: 'Laura Fernández',
    email: 'laura@email.com',
    phone: '+34 444 555 666',
    subject: 'Clases particulares de pintura',
    description: 'Me interesa tomar clases particulares de pintura al óleo. ¿Ofrece este servicio? Soy principiante pero muy motivada.',
    budget: '€50-80/hora',
    status: 'Completada',
    date: '2024-01-16',
    priority: 'Media'
  }
];

export default function SolicitudesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [filterType, setFilterType] = useState('Todas');
  const [filterPriority, setFilterPriority] = useState('Todas');

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || request.status === filterStatus;
    const matchesType = filterType === 'Todas' || request.type === filterType;
    const matchesPriority = filterPriority === 'Todas' || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const types = ['Todas', ...Array.from(new Set(requests.map(r => r.type)))];
  const statuses = ['Todas', 'Pendiente', 'En proceso', 'Completada'];
  const priorities = ['Todas', 'Alta', 'Media', 'Baja'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'En proceso':
        return 'bg-blue-100 text-blue-700';
      case 'Completada':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-100 text-red-700';
      case 'Media':
        return 'bg-orange-100 text-orange-700';
      case 'Baja':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <MessageSquare className="h-8 w-8 mr-3" />
                  Solicitudes
                </h1>
                <p className="text-blue-100">
                  Gestiona {requests.length} solicitudes de clientes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-white">
                <p className="text-sm opacity-90">
                  {requests.filter(r => r.status === 'Pendiente').length} pendientes
                </p>
                <p className="text-sm opacity-90">
                  {requests.filter(r => r.status === 'En proceso').length} en proceso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por cliente o asunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredRequests.length} de {requests.length} solicitudes
              </span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Más filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {request.subject}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Cliente
                      </p>
                      <p className="font-medium text-gray-900">{request.client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Tipo</p>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {request.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Presupuesto</p>
                      <p className="font-medium text-gray-900">{request.budget}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Descripción</p>
                    <p className="text-gray-800 leading-relaxed">{request.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {request.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {request.phone}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(request.date).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  {request.status === 'Pendiente' && (
                    <>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </>
                  )}
                  {request.status === 'En proceso' && (
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar Completada
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {request.status === 'Completada' && (
                    <span className="text-green-600 flex items-center text-sm font-medium">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completada
                    </span>
                  )}
                  {request.priority === 'Alta' && request.status === 'Pendiente' && (
                    <span className="text-red-600 flex items-center text-sm font-medium">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Urgente
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron solicitudes
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'Todas' || filterType !== 'Todas' || filterPriority !== 'Todas'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Las nuevas solicitudes aparecerán aquí'
              }
            </p>
          </div>
        )}
      </div>

      <SimpleFooter />
    </main>
  );
}