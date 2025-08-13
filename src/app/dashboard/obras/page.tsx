'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/sections/Header';
import { SimpleFooter } from '@/components/sections/SimpleFooter';
import { 
  Image as ImageIcon,
  Edit3,
  Trash2,
  Plus,
  Filter,
  Search,
  ArrowLeft,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getGaleriaItems, deleteGaleriaItem, createGaleriaItem, updateGaleriaItem, deleteImage, checkTableStructure, checkBucketConfiguration, GaleriaItem, uploadSingleImage } from '@/lib/supabase-queries';

export default function ObrasPage() {
  const [artworks, setArtworks] = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<GaleriaItem | null>(null);
  const [formData, setFormData] = useState({
    Nombre_obra: '',
    Descripcion: '',
    Categoria: '',
    Imagen: '',
    Imagen_horizontal: '',
    Año: '',
    Dimensiones: '',
    Tecnica: '',
    Tiempo_creacion: '',
    Materiales: '',
    Inspiracion: '',
    Estado: 'Disponible',
    Precio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  // Cargar obras desde Supabase
  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      
      // Verificar configuración del bucket y tabla
      console.log('Verificando configuración...');
      await checkBucketConfiguration();
      await checkTableStructure();
      
      const data = await getGaleriaItems();
      setArtworks(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar obras:', err);
      setError('Error al cargar las obras. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtwork = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta obra?')) {
      return;
    }

    try {
      const artwork = artworks.find(a => a.id === id);
      
      // Eliminar imagen de Supabase Storage si existe (soporte para los distintos campos posibles)
      const imagePath = (artwork as any)?.image
        || (artwork as any)?.Imagen
        || (artwork as any)?.Imagen_horizontal
        || (artwork as any)?.Imagen_vertitical
        || (artwork as any)?.image_gallery
        || null;

      if (imagePath) {
        try {
          await deleteImage(imagePath);
        } catch (error) {
          console.warn('No se pudo eliminar la imagen:', error);
        }
      }
      
      await deleteGaleriaItem(id);
      setArtworks(artworks.filter(artwork => artwork.id !== id));
    } catch (err) {
      console.error('Error al eliminar obra:', err);
      alert('Error al eliminar la obra. Por favor, intenta de nuevo.');
    }
  };

  // Subir una sola imagen y redimensionar con canvas a max 2048x1536 (calidad 75%)
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    try {
      setUploading(true);

      // Crear elemento Image a partir del archivo
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Error cargando la imagen'));
        image.src = URL.createObjectURL(file);
      });

      const maxWidth = 1600;
      const maxHeight = 1200;
      let { width, height } = img;
      // No upscaling: scale <= 1
      const scale = Math.min(1, maxWidth / width, maxHeight / height);
      const targetWidth = Math.round(width * scale);
      const targetHeight = Math.round(height * scale);
    
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No se pudo obtener el contexto de canvas');

      // Mejor calidad de remuestreo
      ctx.imageSmoothingEnabled = true;
      // 'high' suele ofrecer mejor resultado visual al reducir imágenes grandes
      (ctx as any).imageSmoothingQuality = 'high';

      // Si createImageBitmap está disponible, úsalo para un remuestreo de mayor calidad
      // (algunos navegadores permiten pasar opciones de resize)
      if ((window as any).createImageBitmap) {
        try {
          // createImageBitmap puede aceptar un HTMLImageElement y opciones en navegadores modernos
          const bitmap = await (createImageBitmap as any)(img, { resizeWidth: targetWidth, resizeHeight: targetHeight, resizeQuality: 'high' });
          if (bitmap) {
            ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
            if (typeof bitmap.close === 'function') bitmap.close();
          } else {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          }
        } catch (err) {
          // Si createImageBitmap falla por alguna razón, caer al drawImage normal
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        }
      } else {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }
    
      // Intentar exportar como WebP (calidad 75%). Si el navegador no soporta WebP,
      // fallback a JPEG automáticamente no es trivial con toBlob, pero la mayoría
      // de navegadores modernos soportan 'image/webp'.
      const blob: Blob | null = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/webp', 0.75)
      );
      if (!blob) throw new Error('Error al procesar la imagen');
    
      const outFile = new File([blob], (file.name.replace(/\.\w+$/, '') || 'image') + '.webp', { type: 'image/webp' });
    
      const url = await uploadSingleImage(outFile);
      // Guardar URL tanto en Imagen (para preview/uso local) como en Imagen_horizontal (campo DB requerido)
      setFormData(prev => ({ ...prev, Imagen: url, Imagen_horizontal: url }));
      setPreview('');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Emitir evento para sincronizar estado con GalleryFull
    const event = new CustomEvent('updateGalleryState', { detail: formData.Estado });
    window.dispatchEvent(event);
    e.preventDefault();
    setSubmitting(true);

    try {
      // Preparar datos con tipos correctos, solo incluir campos con valores
      const dataToSubmit: any = {};
      
      if (formData.Nombre_obra) dataToSubmit.Nombre_obra = formData.Nombre_obra;
      if (formData.Descripcion) dataToSubmit.Descripcion = formData.Descripcion;
      if (formData.Categoria) dataToSubmit.Categoria = formData.Categoria;

      // Guardar la URL en el campo imagen_horizontal de la tabla (compatibilidad: preferir Imagen si existe)
      if (formData.Imagen) dataToSubmit['Imagen_horizontal'] = formData.Imagen;
      else if (formData.Imagen_horizontal) dataToSubmit['Imagen_horizontal'] = formData.Imagen_horizontal;

      if (formData.Año) dataToSubmit.Año = parseInt(formData.Año);
      if (formData.Dimensiones) dataToSubmit.Dimensiones = formData.Dimensiones;
      if (formData.Tecnica) dataToSubmit.Tecnica = formData.Tecnica;
      if (formData.Tiempo_creacion) dataToSubmit.Tiempo_creacion = formData.Tiempo_creacion;
      if (formData.Materiales) dataToSubmit.Materiales = formData.Materiales;
      if (formData.Inspiracion) dataToSubmit.Inspiracion = formData.Inspiracion;
      if (formData.Estado) dataToSubmit.Estado = formData.Estado;

      // Precio en DB es TEXT: enviar como string
      if (formData.Precio) dataToSubmit.Precio = String(formData.Precio);

      // Limpieza de NaN
      if (dataToSubmit.Año !== undefined && Number.isNaN(dataToSubmit.Año)) {
        delete dataToSubmit.Año;
      }

      // Validación mínima
      if (!dataToSubmit.Nombre_obra) {
        throw new Error('El nombre de la obra es obligatorio');
      }

      console.log('Guardando obra con datos (final):', dataToSubmit);

      if (editingArtwork) {
        try {
          const updatedArtwork = await updateGaleriaItem(editingArtwork.id, dataToSubmit);
          setArtworks(artworks.map(artwork =>
            artwork.id === editingArtwork.id ? updatedArtwork : artwork
          ));
        } catch (error: any) {
          console.error('updateGaleriaItem error:', {
            message: error?.message, details: error?.details, hint: error?.hint, payload: dataToSubmit
          });
          alert(`Error actualizando:\n${error?.message || ''}\n${error?.details || ''}\n${error?.hint || ''}`);
          return;
        }
      } else {
        try {
          const newArtwork = await createGaleriaItem(dataToSubmit);
          setArtworks([newArtwork, ...artworks]);
        } catch (error: any) {
          console.error('createGaleriaItem error:', {
            message: error?.message, details: error?.details, hint: error?.hint, payload: dataToSubmit
          });
          alert(`Error creando:\n${error?.message || ''}\n${error?.details || ''}\n${error?.hint || ''}`);
          return;
        }
      }
      
      // Resetear formulario
      setFormData({
        Nombre_obra: '',
        Descripcion: '',
        Categoria: '',
        Imagen: '',
        Imagen_horizontal: '',
        Año: '',
        Dimensiones: '',
        Tecnica: '',
        Tiempo_creacion: '',
        Materiales: '',
        Inspiracion: '',
        Estado: 'Disponible',
        Precio: ''
      });
      setShowAddModal(false);
      setEditingArtwork(null);
    } catch (err: any) {
      console.error('Error al guardar obra (catch externo):', {
        message: err?.message, details: err?.details, hint: err?.hint
      });
      alert(`Error al guardar:\n${err?.message || ''}\n${err?.details || ''}\n${err?.hint || ''}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (artwork: GaleriaItem) => {
    setEditingArtwork(artwork);
    setFormData({
      Nombre_obra: artwork.Nombre_obra || '',
      Descripcion: artwork.Descripcion || '',
      Categoria: artwork.Categoria || '',
      Imagen: (artwork as any).Imagen || (artwork as any).Imagen_horizontal || (artwork as any).Imagen_vertitical || artwork.image_gallery || artwork.image || '',
      Imagen_horizontal: (artwork as any).Imagen_horizontal || (artwork as any).Imagen || (artwork as any).Imagen_vertitical || artwork.image_gallery || artwork.image || '',
      Año: artwork.Año?.toString() || '',
      Dimensiones: artwork.Dimensiones || '',
      Tecnica: artwork.Tecnica || '',
      Tiempo_creacion: artwork.Tiempo_creacion || '',
      Materiales: artwork.Materiales || '',
      Inspiracion: artwork.Inspiracion || '',
      Estado: artwork.Estado || 'Disponible',
      Precio: artwork.Precio?.toString() || ''
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingArtwork(null);
    setPreview('');
    setFormData({
      Nombre_obra: '',
      Descripcion: '',
      Categoria: '',
      Imagen: '',
      Imagen_horizontal: '',
      Año: '',
      Dimensiones: '',
      Tecnica: '',
      Tiempo_creacion: '',
      Materiales: '',
      Inspiracion: '',
      Estado: 'Disponible',
      Precio: ''
    });
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.Nombre_obra?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = filterCategory === 'Todas' || artwork.Categoria === filterCategory;
    const matchesEstado = filterEstado === 'Todos' || artwork.Estado === filterEstado;
    return matchesSearch && matchesCategory && matchesEstado;
  });

  const categories = ['Todas', ...Array.from(new Set(artworks.map(a => a.Categoria).filter(Boolean)))];
  const estados = ['Todos', 'Disponible', 'Vendido', 'De cliente'];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-4" />
            <p className="text-gray-600">Cargando obras...</p>
          </div>
        </div>
        <SimpleFooter />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadArtworks}>
              Reintentar
            </Button>
          </div>
        </div>
        <SimpleFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary-500 to-accent-500">
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
                  <ImageIcon className="h-8 w-8 mr-3" />
                  Mis Obras
                </h1>
                <p className="text-primary-100">
                  Administra tu colección de {artworks.length} obras de arte
                </p>
              </div>
            </div>
            <Button 
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Obra
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar obras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => {
                  const v = String(category ?? '');
                  return (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
              
              {/* Estado Filter */}
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredArtworks.length} de {artworks.length} obras
              </span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Más filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover-lift"
            >
              {/* Image */}
              <div className="aspect-video bg-gradient-to-r from-primary-500 to-accent-500 relative">
                {((artwork as any).Imagen || (artwork as any).Imagen_horizontal || (artwork as any).Imagen_vertitical || artwork.image_gallery || artwork.image) && (
                  <img
                    src={(artwork as any).Imagen || (artwork as any).Imagen_horizontal || (artwork as any).Imagen_vertitical || artwork.image_gallery || artwork.image || ''}
                    alt={artwork.Nombre_obra || 'Obra de arte'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(artwork)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {artwork.Nombre_obra || 'Sin título'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {artwork.Categoria && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                          {artwork.Categoria}
                        </span>
                      )}
                      {artwork.Año && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {artwork.Año}
                        </span>
                      )}
                      {artwork.Tecnica && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {artwork.Tecnica}
                        </span>
                      )}
                      {artwork.Estado && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          artwork.Estado === 'Disponible' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {artwork.Estado}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {artwork.Descripcion && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {artwork.Descripcion}
                  </p>
                )}
                
                {/* Precio */}
                {artwork.Precio && (
                  <div className="mb-3">
                    <span className="text-lg font-bold text-primary-600">
                      ${artwork.Precio.toLocaleString('es-ES')}
                    </span>
                  </div>
                )}
                
                {/* Detalles técnicos */}
                <div className="space-y-1 mb-4 text-xs text-gray-500">
                  {artwork.Dimensiones && (
                    <div className="flex items-center justify-between">
                      <span>Dimensiones:</span>
                      <span className="font-medium">{artwork.Dimensiones}</span>
                    </div>
                  )}
                  {artwork.Tiempo_creacion && (
                    <div className="flex items-center justify-between">
                      <span>Tiempo:</span>
                      <span className="font-medium">{artwork.Tiempo_creacion}</span>
                    </div>
                  )}
                  {artwork.Materiales && (
                    <div className="flex items-center justify-between">
                      <span>Materiales:</span>
                      <span className="font-medium truncate ml-2">{artwork.Materiales}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pt-2 border-t">
                  <span>Creada: {new Date(artwork.created_at).toLocaleDateString('es-ES')}</span>
                  <span className="text-xs">ID: {artwork.id}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" className="flex-1" onClick={() => handleEdit(artwork)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteArtwork(artwork.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArtworks.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron obras
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'Todas'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primera obra de arte'
              }
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primera Obra
            </Button>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar obra */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingArtwork ? 'Editar Obra' : 'Nueva Obra'}
              </h2>
              <Button variant="outline" size="sm" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la obra *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.Nombre_obra}
                    onChange={(e) => setFormData({...formData, Nombre_obra: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Paisaje Abstracto #1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.Categoria}
                    onChange={(e) => setFormData({...formData, Categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Pintura, Escultura, Fotografía"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={formData.Estado}
                    onChange={(e) => setFormData({...formData, Estado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Vendido">Vendido</option>
                    <option value="De cliente">De cliente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.Precio}
                    onChange={(e) => setFormData({...formData, Precio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.Descripcion}
                  onChange={(e) => setFormData({...formData, Descripcion: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe tu obra de arte..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes de la obra
                </label>

                {(formData.Imagen || preview) && (
                  <div className="mb-4">
                    <img
                      src={preview || formData.Imagen}
                      alt="Imagen"
                      className={`w-full h-48 object-cover rounded-lg border ${preview ? 'opacity-50' : ''}`}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {preview ? 'Subiendo imagen...' : 'Imagen cargada'}
                    </p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    disabled={uploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                  {uploading && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Subiendo imagen...
                    </div>
                  )}
                </div>

                <div className="border-t pt-3">
                  <label className="block text-xs text-gray-500 mb-2">O URL Imagen</label>
                  <input
                    type="url"
                    value={formData.Imagen}
                    onChange={(e) => setFormData({...formData, Imagen: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    placeholder="https://.../imagen.jpg"
                  />
                </div>
              </div>

              {/* Detalles técnicos */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles Técnicos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max="2030"
                      value={formData.Año}
                      onChange={(e) => setFormData({...formData, Año: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="2024"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensiones
                    </label>
                    <input
                      type="text"
                      value={formData.Dimensiones}
                      onChange={(e) => setFormData({...formData, Dimensiones: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="25x35 cm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Técnica
                    </label>
                    <input
                      type="text"
                      value={formData.Tecnica}
                      onChange={(e) => setFormData({...formData, Tecnica: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Acrílico"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de creación
                    </label>
                    <input
                      type="text"
                      value={formData.Tiempo_creacion}
                      onChange={(e) => setFormData({...formData, Tiempo_creacion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1 semana"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materiales utilizados
                  </label>
                  <input
                    type="text"
                    value={formData.Materiales}
                    onChange={(e) => setFormData({...formData, Materiales: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Acrílico, Lienzo pequeño"
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspiración
                  </label>
                  <textarea
                    value={formData.Inspiracion}
                    onChange={(e) => setFormData({...formData, Inspiracion: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="La belleza está en la simplicidad y resistencia de estas plantas."
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 border-t">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    editingArtwork ? 'Actualizar Obra' : 'Crear Obra'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SimpleFooter />
    </main>
  );
}