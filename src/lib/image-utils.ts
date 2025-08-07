// Utilidades para redimensionamiento automático de imágenes usando Canvas

export interface ImageSize {
  name: string;
  width: number;
  height: number;
  quality: number;
  suffix: string;
}

// Configuración de tamaños para diferentes usos
export const IMAGE_SIZES: ImageSize[] = [
  {
    name: 'thumbnail',
    width: 200,
    height: 250,
    quality: 0.8,
    suffix: '_thumb'
  },
  {
    name: 'gallery',
    width: 400,
    height: 500,
    quality: 0.85,
    suffix: '_gallery'
  },
  {
    name: 'detail',
    width: 600,
    height: 750,
    quality: 0.9,
    suffix: '_detail'
  }
];

// Función para redimensionar una imagen usando Canvas
export function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('No se pudo crear el contexto del canvas'));
      return;
    }

    img.onload = () => {
      // Calcular dimensiones manteniendo el aspect ratio
      const { width: newWidth, height: newHeight } = calculateDimensions(
        img.width,
        img.height,
        targetWidth,
        targetHeight
      );

      // Configurar canvas
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Configurar calidad de renderizado
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al convertir canvas a blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    // Cargar imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    reader.readAsDataURL(file);
  });
}

// Calcular dimensiones manteniendo aspect ratio
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number
): { width: number; height: number } {
  const originalRatio = originalWidth / originalHeight;
  const targetRatio = targetWidth / targetHeight;

  let newWidth: number;
  let newHeight: number;

  if (originalRatio > targetRatio) {
    // La imagen es más ancha, ajustar por altura
    newHeight = targetHeight;
    newWidth = Math.round(targetHeight * originalRatio);
  } else {
    // La imagen es más alta, ajustar por ancho
    newWidth = targetWidth;
    newHeight = Math.round(targetWidth / originalRatio);
  }

  return { width: newWidth, height: newHeight };
}

// Función para generar múltiples tamaños de una imagen
export async function generateImageSizes(file: File): Promise<{
  [key: string]: { blob: Blob; size: ImageSize }
}> {
  const results: { [key: string]: { blob: Blob; size: ImageSize } } = {};

  console.log('🖼️ Generando múltiples tamaños para:', file.name);

  for (const size of IMAGE_SIZES) {
    try {
      console.log(`📐 Redimensionando a ${size.name}: ${size.width}x${size.height}`);
      
      const blob = await resizeImage(file, size.width, size.height, size.quality);
      
      results[size.name] = { blob, size };
      
      console.log(`✅ ${size.name}: ${(blob.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error(`❌ Error redimensionando ${size.name}:`, error);
      throw error;
    }
  }

  return results;
}

// Función para obtener el nombre de archivo con sufijo
export function getFileNameWithSuffix(originalName: string, suffix: string): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  const nameWithoutExt = originalName.substring(0, lastDotIndex);
  const extension = originalName.substring(lastDotIndex);
  
  return `${nameWithoutExt}${suffix}${extension}`;
}

// Función para validar tipo de archivo
export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP.');
  }

  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Máximo 10MB.');
  }

  return true;
}

// Función para obtener información de la imagen
export function getImageInfo(file: File): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type
      });
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen para obtener información'));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    reader.readAsDataURL(file);
  });
}