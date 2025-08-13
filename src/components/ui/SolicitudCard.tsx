'use client';

import { useState } from 'react';
import { 
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Edit3,
  AlertCircle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Solicitud = {
  type: string; 
  client: string | null; 
  email: string | null; 
  phone: string | null; 
  subject: string | null; 
  description: string | null; 
  budget: string | null; 
  status: string | null; 
  date: string; 
  priority: string | null; 
  deliveryDate: string | null;
  notes: string | null;
  rowId: number;
};

interface SolicitudCardProps {
  request: Solicitud;
  isEditing: boolean;
  editValues: Solicitud | null;
  onStartEdit: (rowId: number) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditValueChange: (field: keyof Solicitud, value: string) => void;
}

export function SolicitudCard({
  request,
  isEditing,
  editValues,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange
}: SolicitudCardProps) {
  const values = isEditing && editValues ? editValues : request;

  // Helper: formatea fecha ISO (YYYY-MM-DD) a dd/MM/yyyy para mostrar
  const formatDMY = (iso: string | null) => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return '—';
    return `${d}/${m}/${y}`;
  };

  // Construye enlace de WhatsApp con prefijo 506 y número limpio
  const buildWhatsappUrl = (phone: string | null) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    // Evitar duplicar 506 si ya viene con el código
    const local = digits.startsWith('506') ? digits.slice(3) : digits;
    const full = `506${local}`;
    const href = `https://wa.me/${full}`;
    const label = `wa.me/${full}`;
    return { href, label };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'En proceso':
        return 'bg-blue-100 text-blue-700';
      case 'Completada':
        return 'bg-green-100 text-green-700';
      case 'Aceptado':
        return 'bg-emerald-100 text-emerald-700';
      case 'Rechazado':
        return 'bg-red-100 text-red-700';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditing ? (
                <input
                  className="border border-gray-300 rounded px-2 py-1 w-full max-w-md"
                  value={values.subject || ''}
                  onChange={(e) => onEditValueChange('subject', e.target.value)}
                  placeholder="Asunto"
                />
              ) : (values.subject)}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor((values.status || ''))}`}>
              {values.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor((values.priority || ''))}`}>
              {values.priority}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Cliente
              </p>
              {isEditing ? (
                <input
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={values.client || ''}
                  onChange={(e) => onEditValueChange('client', e.target.value)}
                  placeholder="Nombre"
                />
              ) : (
                <p className="font-medium text-gray-900">{values.client}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Tipo</p>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {values.type}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Presupuesto</p>
              {isEditing ? (
                <input
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={values.budget || ''}
                  onChange={(e) => onEditValueChange('budget', e.target.value)}
                  placeholder="Precio pactado"
                />
              ) : (
                <p className="font-medium text-gray-900">{values.budget}</p>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Descripción</p>
            {isEditing ? (
              <textarea
                className="border border-gray-300 rounded px-2 py-1 w-full"
                value={values.description || ''}
                onChange={(e) => onEditValueChange('description', e.target.value)}
                placeholder="Mensaje"
                rows={3}
              />
            ) : (
              <p className="text-gray-800 leading-relaxed">{values.description}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {isEditing ? (
                <input
                  className="border border-gray-300 rounded px-2 py-1"
                  value={values.email || ''}
                  onChange={(e) => onEditValueChange('email', e.target.value)}
                  placeholder="Email"
                />
              ) : (values.email)}
            </span>
            <span className="flex items-center w-full sm:w-auto">
              <Phone className="h-4 w-4 mr-2" />
              {isEditing ? (
                <input
                  className="border border-gray-300 rounded px-2 py-1"
                  value={values.phone || ''}
                  onChange={(e) => onEditValueChange('phone', e.target.value)}
                  placeholder="Celular"
                />
              ) : (
                (() => {
                  const wa = buildWhatsappUrl(values.phone);
                  return wa ? (
                    <a
                      href={wa.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {wa.label}
                    </a>
                  ) : (
                    <span>—</span>
                  );
                })()
              )}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {new Date(values.date).toLocaleDateString('es-ES')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Fecha de entrega</p>
              {isEditing ? (
                <input
                  type="date"
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  value={values.deliveryDate || ''}
                  onChange={(e) => onEditValueChange('deliveryDate', e.target.value)}
                />
              ) : (
                <p className="font-medium text-gray-900">{formatDMY(values.deliveryDate)}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-2">Notas</p>
              {isEditing ? (
                <textarea
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  rows={3}
                  value={values.notes || ''}
                  onChange={(e) => onEditValueChange('notes', e.target.value)}
                  placeholder="Notas adicionales del pedido"
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{values.notes || '—'}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-2">
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              {isEditing ? (
                <select
                  className="border border-gray-300 rounded px-2 py-1"
                  value={values.status || ''}
                  onChange={(e) => onEditValueChange('status', e.target.value)}
                >
                  <option value="">Sin estado</option>
                  <option>Pendiente</option>
                  <option>En proceso</option>
                  <option>Completada</option>
                  <option>Aceptado</option>
                  <option>Rechazado</option>
                </select>
              ) : null}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Prioridad</p>
              {isEditing ? (
                <select
                  className="border border-gray-300 rounded px-2 py-1"
                  value={values.priority || ''}
                  onChange={(e) => onEditValueChange('priority', e.target.value)}
                >
                  <option value="">Sin prioridad</option>
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </select>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          {!isEditing && (
            (() => {
              const wa = buildWhatsappUrl(values.phone);
              return wa ? (
                <a
                  href={wa.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                </a>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Responder
                </Button>
              );
            })()
          )}
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => onStartEdit(request.rowId)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={onSaveEdit}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Guardar
              </Button>
              <Button variant="outline" size="sm" onClick={onCancelEdit}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {values.status === 'Completada' && (
            <span className="text-green-600 flex items-center text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completada
            </span>
          )}
          {values.priority === 'Alta' && values.status === 'Pendiente' && (
            <span className="text-red-600 flex items-center text-sm font-medium">
              <AlertCircle className="h-4 w-4 mr-1" />
              Urgente
            </span>
          )}
        </div>
      </div>
    </div>
  );
}