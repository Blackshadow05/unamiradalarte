'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';

// Tipos para la tabla Galeria
interface GaleriaItem {
  id?: number;
  Nombre_obra: string;
  Descripcion: string;
  Categoria: string;
  image: string | null;
  created_at?: string;
}

// Categorías disponibles
const CATEGORIAS = [
  'Todas las Obras',
  'Obras en Venta',
  'Amigurumi',
  'Trabajos Personalizados',
  'Retratos de mascotas'
];

// Crear cliente de Supabase
const supabaseUrl = 'https://cturqalloieehxxrqzsw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXJxYWxsb2llZWh4eHJxenN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTU5OTMsImV4cCI6MjA2ODUzMTk5M30.7v-_m56nZyV7ZT3JhVAR6Hbtc4ZN9sTnrVyZVPYPeXA';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GaleriaUploadForm() {
  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);
  
  // Referencia para el input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar cambio de imagen
  const handleImagenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImagen(file);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje(null);

    try {
      if (!imagen) {
        throw new Error('Por favor selecciona una imagen');
      }

      // 1. Subir la imagen al bucket de storage
      const imagenNombre = `${Date.now()}-${imagen.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('galeria')
        .upload(imagenNombre, imagen);

      if (uploadError) {
        throw new Error(`Error al subir la imagen: ${uploadError.message}`);
      }

      // 2. Obtener la URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('galeria')
        .getPublicUrl(imagenNombre);

      const imageUrl = urlData?.publicUrl;

      // 3. Insertar los datos en la tabla Galeria
      const { data: insertData, error: insertError } = await supabase
        .from('Galeria')
        .insert([
          {
            Nombre_obra: nombre,
            Descripcion: descripcion,
            Categoria: categoria,
            image: imageUrl
          }
        ]);

      if (insertError) {
        throw new Error(`Error al guardar los datos: ${insertError.message}`);
      }

      // Éxito
      setMensaje({
        tipo: 'exito',
        texto: '¡Obra agregada exitosamente a la galería!'
      });

      // Limpiar formulario
      setNombre('');
      setDescripcion('');
      setCategoria(CATEGORIAS[0]);
      setImagen(null);
      setImagenPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error:', error);
      setMensaje({
        tipo: 'error',
        texto: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-purple-200/30 shadow-2xl shadow-purple-500/10 overflow-hidden animate-fade-in">
      <div className="px-8 py-6 border-b border-purple-200/30 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Agregar Nueva Obra
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Completa el formulario para agregar una nueva obra a la galería
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Mensaje de éxito o error */}
        {mensaje && (
          <div className={`p-4 rounded-2xl ${
            mensaje.tipo === 'exito' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <p className="font-medium">{mensaje.texto}</p>
          </div>
        )}

        {/* Nombre de la obra */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Obra
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-purple-200/50 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
            placeholder="Ingresa el nombre de la obra"
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 border-2 border-purple-200/50 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
            placeholder="Describe la obra, técnica, dimensiones, etc."
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-purple-200/50 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300"
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Imagen */}
        <div>
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="imagen"
              ref={fileInputRef}
              onChange={handleImagenChange}
              accept="image/*"
              required
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 text-sm font-medium text-purple-700 bg-white/80 border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-lg shadow-purple-500/10"
            >
              Seleccionar Imagen
            </button>
            {imagen && (
              <span className="text-sm text-green-600 font-medium">
                ✓ {imagen.name}
              </span>
            )}
          </div>

          {/* Preview de la imagen */}
          {imagenPreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <div className="w-64 h-64 rounded-xl overflow-hidden border-2 border-purple-200 shadow-lg">
                <img
                  src={imagenPreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full inline-flex justify-center items-center px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-300 shadow-xl shadow-purple-500/25 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-purple-500/40'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              <>
                ✨ Agregar Obra a la Galería
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}