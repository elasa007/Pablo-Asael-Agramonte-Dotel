import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export type StorageProvider = 'firebase' | 'cloudinary' | 'imgbb';

export interface StorageSettings {
  provider: StorageProvider;
  firebaseBucket: string;
  cloudinary: {
    cloudName: string;
    uploadPreset: string;
  };
  imgbb: {
    apiKey: string;
  };
  autoCompress: boolean;
  maxDimension: number;
  quality: number;
}

const SETTINGS_KEY = 'creativo_storage_settings';

const DEFAULT_SETTINGS: StorageSettings = {
  provider: 'firebase',
  firebaseBucket: firebaseConfig.storageBucket || 'gen-lang-client-0126152032.firebasestorage.app',
  cloudinary: {
    cloudName: '',
    uploadPreset: ''
  },
  imgbb: {
    apiKey: ''
  },
  autoCompress: true,
  maxDimension: 2048,
  quality: 0.85
};

export class StorageService {
  /**
   * Obtiene la configuración actual de almacenamiento
   */
  public static getSettings(): StorageSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          firebaseBucket: firebaseConfig.storageBucket || DEFAULT_SETTINGS.firebaseBucket
        };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Guarda nueva configuración de almacenamiento
   */
  public static saveSettings(settings: Partial<StorageSettings>): StorageSettings {
    const current = this.getSettings();
    const updated: StorageSettings = {
      ...current,
      ...settings
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving storage settings to localStorage:', e);
    }
    return updated;
  }

  /**
   * Comprime y optimiza imágenes del lado del cliente antes de enviarlas al servidor
   * Reduce drásticamente el peso (hasta 90%) manteniendo nitidez retina
   */
  public static async compressImage(
    file: File,
    maxDimension = 2048,
    quality = 0.85
  ): Promise<File> {
    // Si no es imagen estándar o es SVG/GIF animado, no recomprimir
    if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
      return file;
    }

    // Si ya pesa menos de 300KB, usar directamente
    if (file.size < 300 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(file);
          return;
        }

        // Suavizado bicúbico
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Intentar exportar a WebP, fallback a JPEG
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
              const compressedFile = new File([blob], newFileName, {
                type: 'image/webp',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Sube una imagen al hosting seleccionado (Firebase Storage, Cloudinary o ImgBB)
   */
  public static async uploadImage(
    originalFile: File,
    folder = 'projects',
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; provider: StorageProvider; filename: string; size: number }> {
    const settings = this.getSettings();

    // 1. Optimizar imagen si está habilitado
    let fileToUpload = originalFile;
    if (settings.autoCompress) {
      onProgress?.(5);
      fileToUpload = await this.compressImage(originalFile, settings.maxDimension, settings.quality);
    }

    onProgress?.(15);

    // 2. Ejecutar según el proveedor activo
    if (settings.provider === 'cloudinary' && settings.cloudinary.cloudName && settings.cloudinary.uploadPreset) {
      return this.uploadToCloudinary(fileToUpload, settings.cloudinary, folder, onProgress);
    }

    if (settings.provider === 'imgbb' && settings.imgbb.apiKey) {
      return this.uploadToImgbb(fileToUpload, settings.imgbb.apiKey, onProgress);
    }

    // Default: Firebase Storage
    try {
      return await this.uploadToFirebaseStorage(fileToUpload, folder, onProgress);
    } catch (firebaseErr: unknown) {
      console.warn('Firebase Storage upload failed, verifying fallback options:', firebaseErr);
      
      // Si el usuario configuró Cloudinary de respaldo, intentar Cloudinary
      if (settings.cloudinary.cloudName && settings.cloudinary.uploadPreset) {
        return this.uploadToCloudinary(fileToUpload, settings.cloudinary, folder, onProgress);
      }
      
      // Si no, relanzar el error con mensaje descriptivo y diagnóstico
      const errMessage = firebaseErr instanceof Error ? firebaseErr.message : String(firebaseErr);
      let userFriendlyMessage = 'Error al subir la imagen al hosting de Firebase Storage.';
      
      if (errMessage.includes('unauthorized') || errMessage.includes('permission')) {
        userFriendlyMessage = 'Permiso denegado en Firebase Storage. Asegúrate de que las reglas de seguridad en Firebase Console permitan lectura/escritura (o inicia sesión con Google en el panel).';
      } else if (errMessage.includes('bucket') || errMessage.includes('not-found')) {
        userFriendlyMessage = `No se encontró el bucket de almacenamiento "${settings.firebaseBucket}". Verifica el nombre del bucket en la consola de Firebase.`;
      } else if (errMessage.includes('network') || errMessage.includes('retry-limit')) {
        userFriendlyMessage = 'Error de conexión con el servidor de Firebase Storage. Comprueba tu conexión a internet o intenta nuevamente.';
      }

      const enhancedError = new Error(userFriendlyMessage);
      (enhancedError as unknown as { original: unknown }).original = firebaseErr;
      throw enhancedError;
    }
  }

  /**
   * Sube directamente a Firebase Cloud Storage con tracking de progreso
   */
  private static async uploadToFirebaseStorage(
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; provider: StorageProvider; filename: string; size: number }> {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `portfolio/${folder}/${timestamp}_${cleanName}`;

    const storageRef = ref(storage, storagePath);
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        folder
      }
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress?.(Math.min(99, Math.max(15, percent)));
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.(100);
            resolve({
              url: downloadUrl,
              provider: 'firebase',
              filename: cleanName,
              size: file.size
            });
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  /**
   * Sube a Cloudinary mediante Unsigned Upload Preset
   */
  private static async uploadToCloudinary(
    file: File,
    config: { cloudName: string; uploadPreset: string },
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; provider: StorageProvider; filename: string; size: number }> {
    onProgress?.(30);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    formData.append('folder', `portfolio/${folder}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    onProgress?.(80);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Error en Cloudinary (${res.status}): ${res.statusText}`);
    }

    const data = await res.json();
    onProgress?.(100);

    return {
      url: data.secure_url || data.url,
      provider: 'cloudinary',
      filename: file.name,
      size: data.bytes || file.size
    };
  }

  /**
   * Sube a ImgBB mediante su API pública
   */
  private static async uploadToImgbb(
    file: File,
    apiKey: string,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; provider: StorageProvider; filename: string; size: number }> {
    onProgress?.(30);
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    onProgress?.(80);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Error en ImgBB (${res.status}): ${res.statusText}`);
    }

    const data = await res.json();
    onProgress?.(100);

    if (data.data?.url) {
      return {
        url: data.data.url,
        provider: 'imgbb',
        filename: file.name,
        size: data.data.size || file.size
      };
    }

    throw new Error('Respuesta inválida recibida de ImgBB');
  }

  /**
   * Prueba de subida de imagen sintética para validar la conexión con el hosting
   */
  public static async testStorage(
    targetProvider?: StorageProvider
  ): Promise<{ success: boolean; message: string; url?: string }> {
    const settings = this.getSettings();
    const provider = targetProvider || settings.provider;

    // Crear un blob de prueba mínimo de 1x1 píxel PNG
    const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#0284c7"/>
      <circle cx="50" cy="50" r="30" fill="#38bdf8"/>
      <text x="50" y="55" font-size="12" fill="white" font-family="sans-serif" text-anchor="middle">TEST OK</text>
    </svg>`;
    const blob = new Blob([testSvg], { type: 'image/svg+xml' });
    const testFile = new File([blob], `test_connection_${Date.now()}.svg`, { type: 'image/svg+xml' });

    try {
      if (provider === 'firebase') {
        const result = await this.uploadToFirebaseStorage(testFile, 'diagnostics');
        return {
          success: true,
          message: `¡Conexión exitosa con Firebase Cloud Storage! Bucket: "${settings.firebaseBucket}"`,
          url: result.url
        };
      }

      if (provider === 'cloudinary') {
        if (!settings.cloudinary.cloudName || !settings.cloudinary.uploadPreset) {
          return {
            success: false,
            message: 'Debes ingresar el Cloud Name y el Upload Preset de Cloudinary para probar la conexión.'
          };
        }
        const result = await this.uploadToCloudinary(testFile, settings.cloudinary, 'diagnostics');
        return {
          success: true,
          message: `¡Conexión exitosa con Cloudinary! Cloud: "${settings.cloudinary.cloudName}"`,
          url: result.url
        };
      }

      if (provider === 'imgbb') {
        if (!settings.imgbb.apiKey) {
          return {
            success: false,
            message: 'Debes ingresar tu API Key de ImgBB para probar la conexión.'
          };
        }
        const result = await this.uploadToImgbb(testFile, settings.imgbb.apiKey);
        return {
          success: true,
          message: '¡Conexión exitosa con el servicio de alojamiento de ImgBB!',
          url: result.url
        };
      }

      return {
        success: false,
        message: 'Proveedor de almacenamiento no reconocido.'
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Fallo en la prueba de almacenamiento: ${msg}`
      };
    }
  }
}
