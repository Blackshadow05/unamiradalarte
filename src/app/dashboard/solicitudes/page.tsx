'use client';

import { useEffect, useState } from 'react';
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
  User,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

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
  deliveryDate: string | null; // ISO YYYY-MM-DD en estado
  notes: string | null; // guardamos string en columna JSON
  rowId: number; // id interno para update (no se muestra)
};

export default function SolicitudesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [filterType, setFilterType] = useState('Todas');
  const [filterPriority, setFilterPriority] = useState('Todas');
  const [requests, setRequests] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Solicitud | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('formulario_contacto')
        .select('id, created_at, "Nombre", "Email", "Celular", "Asunto", "Mensaje", "Prioridad", "Estado", "Precio_pactado", "Fecha_entrega", "Notas"')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando solicitudes:', error);
        setError('No se pudieron cargar las solicitudes.');
        setRequests([]);
      } else {
        const mapped: Solicitud[] = (data || []).map((r: any) => ({
          type: 'Solicitud',
          client: r['Nombre'] ?? null,
          email: r['Email'] ?? null,
          phone: r['Celular'] ?? null,
          subject: r['Asunto'] ?? null,
          description: r['Mensaje'] ?? null,
          budget: r['Precio_pactado'] ?? null,
          status: r['Estado'] ?? null,
          // created_at es el estándar en Supabase; si existiera un nombre alterno, usamos fallback
          date: r['created_at'] ?? r['created-at'] ?? '',
          priority: r['Prioridad'] ?? null,
          // Normalizamos la fecha de entrega a ISO YYYY-MM-DD para el input date
          deliveryDate: r['Fecha_entrega'] ? new Date(r['Fecha_entrega']).toISOString().slice(0, 10) : null,
          // Guardamos notas como string legible (si viene JSON, lo convertimos)
          notes: typeof r['Notas'] === 'string' ? r['Notas'] : (r['Notas'] ? JSON.stringify(r['Notas']) : null),
          rowId: r['id'],
        }));
        console.log('Mapped requests:');
        mapped.forEach((req, index) => {
          console.log(`Index ${index}: Date = ${req.date}, RowId = ${req.rowId}, DateKey = ${dateKey(req.date)}`);
        });
        setRequests(mapped);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper: formatea fecha ISO (YYYY-MM-DD) a dd/MM/yyyy para mostrar
  const formatDMY = (iso: string | null) => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return '—';
    return `${d}/${m}/${y}`;
  };

  // Comparator robusto para 'YYYY-MM-DD HH:mm:ss' (sin depender de Date.parse)
  const dateKey = (s: string | null | undefined): number => {
    if (!s) return 0;
    const [dstr, tstr = '00:00:00'] = s.split(' ');
    if (!dstr) return 0;
    const [Y = '0000', M = '00', D = '00'] = dstr.split('-');
    const [h = '00', m = '00', sec = '00'] = tstr.split(':');
    const packed = `${Y}${M}${D}${h}${m}${sec}`;
    const n = Number(packed);
    return Number.isFinite(n) ? n : 0;
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

  const startEdit = (rowId: number) => {
    const current = requests.find(r => r.rowId === rowId) || null;
    setEditingId(rowId);
    setEditValues(current ? { ...current } : null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const saveEdit = async () => {
    if (editingId === null || !editValues) return;
    const r = editValues;
    const updatePayload: any = {
      "Nombre": r.client,
      "Email": r.email,
      "Celular": r.phone,
      "Asunto": r.subject,
      "Mensaje": r.description,
      "Prioridad": r.priority,
      "Estado": r.status,
      "Precio_pactado": r.budget,
      // Guardar fecha de entrega (ISO YYYY-MM-DD) y notas (string en JSON)
      "Fecha_entrega": r.deliveryDate ? r.deliveryDate : null,
      "Notas": r.notes ?? null,
    };
    const { error } = await supabase
      .from('formulario_contacto')
      .update(updatePayload)
      .eq('id', r.rowId);
    if (error) {
      console.error('Error al guardar cambios:', error);
      setError('No se pudieron guardar los cambios.');
      return;
    }
    // Actualizar estado local
    setRequests(prev => prev.map((item) => item.rowId === editingId ? { ...r } : item));
    cancelEdit();
  };

  // Actualiza el campo Estado (y otros si se desea) para una fila específica
  const updateStatus = async (rowId: number, newStatus: string) => {
    setError(null);
    const { error } = await supabase
      .from('formulario_contacto')
      .update({ "Estado": newStatus })
      .eq('id', rowId);
    if (error) {
      console.error('Error al actualizar estado:', error);
      setError('No se pudo actualizar el estado.');
      return;
    }
    // Actualizar estado local
    setRequests(prev => prev.map((item) => (
      item.rowId === rowId ? { ...item, status: newStatus } : item
    )));
    // Si se está editando justo esta solicitud, reflejar el cambio visible también
    setEditValues(prev => prev && prev.rowId === rowId ? { ...prev, status: newStatus } : prev);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      (request.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.client || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todas' || request.status === filterStatus;
    const matchesType = filterType === 'Todas' || request.type === filterType;
    const matchesPriority = filterPriority === 'Todas' || request.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const types = ['Todas', ...Array.from(new Set(requests.map(r => r.type)))];
  const statuses = ['Todas', 'Pendiente', 'En proceso', 'Completada', 'Aceptado', 'Rechazado'];
  const priorities = ['Todas', 'Alta', 'Media', 'Baja'];

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
    <main className="min-h-screen bg-gray-50">
      <Header initialSolid />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <Link href="/dashboard" className="hover:underline">
            Volver al panel
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Solicitudes</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Menú"
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Solicitudes</h1>
            </div>
            <p className="text-gray-600">Gestiona consultas, comisiones y mensajes recibidos ({requests.length})</p>
          </div>

          <div className="flex w-full sm:w-auto flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por asunto o cliente"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-400" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option>Todas</option>
                <option>Pendiente</option>
                <option>En proceso</option>
                <option>Completada</option>
                <option>Aceptado</option>
                <option>Rechazado</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option>Todas</option>
                <option>Solicitud</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                <option>Todas</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-600">Cargando solicitudes...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-gray-700" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'Pendiente').length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En proceso</p>
                <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'En proceso').length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'Completada').length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {[...filteredRequests]
            .sort((a, b) => {
              // Función para parsear fecha en formato YYYY/mm/dd o YYYY-mm-dd
              const parseDate = (dateStr: string) => {
                // Si la fecha está en formato ISO (YYYY-mm-ddTHH:MM:SS)
                if (dateStr.includes('T')) {
                  return new Date(dateStr);
                }
                
                // Si la fecha está en formato YYYY/mm/dd HH:MM:SS
                const parts = dateStr.split(' ');
                const datePart = parts[0];
                const timePart = parts[1] || '00:00:00';
                
                // Reemplazar / por - para que Date() lo interprete correctamente
                const normalizedDate = datePart.replace(/\//g, '-');
                return new Date(`${normalizedDate}T${timePart}`);
              };
              
              const dateA = parseDate(a.date);
              const dateB = parseDate(b.date);
              
              console.log(`Parseando fechas: a.date=${a.date} -> ${dateA.toISOString()}, b.date=${b.date} -> ${dateB.toISOString()}`);
              
              return dateB.getTime() - dateA.getTime();
            })
            .map((request) => {
            const isEditing = editingId === request.rowId;
            const values = isEditing && editValues ? editValues : request;
            return (
            <div
              key={request.rowId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {isEditing ? (
                        <input
                          className="border border-gray-300 rounded px-2 py-1 w-full max-w-md"
                          value={values.subject || ''}
                          onChange={(e) => setEditValues(v => v ? { ...v, subject: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, client: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, budget: e.target.value } : v)}
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
                        onChange={(e) => setEditValues(v => v ? { ...v, description: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, email: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, phone: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, deliveryDate: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, notes: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, status: e.target.value } : v)}
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
                          onChange={(e) => setEditValues(v => v ? { ...v, priority: e.target.value } : v)}
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
                    <Button variant="outline" size="sm" onClick={() => startEdit(request.rowId)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={saveEdit}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEdit}>
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
          })}
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