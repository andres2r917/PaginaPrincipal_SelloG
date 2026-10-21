// Servicio de denuncias (por ahora con datos de prueba).
// TODO: reemplazar por llamada a la API de Laravel (GET /api/denuncias)

// Teléfono de emergencia de respaldo.
// TODO: tomar de platform_settings.Telefono_emergencia cuando exista la API
export const TELEFONO_EMERGENCIA = '+57 300 123 4567';

// Genera una fecha ISO restando minutos a la hora actual (para que "hace X" siempre sea coherente)
const hace = (minutos) => new Date(Date.now() - minutos * 60000).toISOString();

/*
  Estructura canónica de una denuncia:
  {
    id: string,
    titulo?: string,            // opcional; si no existe se muestra el tipo
    tipo: string,               // 'Maltrato físico' | 'Abandono' | ...
    urgencia: 'alta' | 'media' | 'baja',
    estado: 'abierta' | 'en_proceso' | 'resuelta',
    verificada: boolean,
    anonima: boolean,
    autor: string | null,
    descripcion: string,
    direccion: string,
    lat: number | null,
    lng: number | null,
    fecha: string (ISO),
    evidencia: string[]         // URLs o base64 de fotos
  }
*/
const DENUNCIAS_MOCK = [
  {
    id: 'd-001',
    tipo: 'Maltrato físico',
    urgencia: 'alta',
    estado: 'abierta',
    verificada: false,
    anonima: false,
    autor: 'Usuario registrado',
    descripcion: 'Vi un caso de maltrato animal en Bello Horizonte.',
    direccion: 'Bello Horizonte, Comuna 2, Popayán, Cauca',
    lat: 2.4575,
    lng: -76.6058,
    fecha: hace(4),
    evidencia: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop'
    ]
  },
  {
    id: 'd-002',
    tipo: 'Maltrato físico',
    urgencia: 'alta',
    estado: 'abierta',
    verificada: true,
    anonima: false,
    autor: 'Usuario registrado',
    descripcion: 'Perro atado sin agua ni comida frente a una casa abandonada. Se ve muy delgado.',
    direccion: 'Carrera 6 #4-20, Centro, Popayán, Cauca',
    lat: 2.4419,
    lng: -76.6063,
    fecha: hace(60 * 24 * 2),
    evidencia: [
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop'
    ]
  },
  {
    id: 'd-003',
    tipo: 'Abandono',
    urgencia: 'media',
    estado: 'abierta',
    verificada: true,
    anonima: true,
    autor: null,
    descripcion: 'Gata con crías abandonadas dentro de una caja junto al parque.',
    direccion: 'Parque Caldas, Popayán, Cauca',
    lat: 2.4421,
    lng: -76.6067,
    fecha: hace(60 * 24 * 2),
    evidencia: [
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=400&fit=crop'
    ]
  }
];

// Devuelve la lista de denuncias. Es asíncrona para que el cambio a la API no afecte a los componentes.
export async function getDenuncias() {
  return DENUNCIAS_MOCK;
}

// Crea una denuncia nueva (desde el formulario) con la estructura canónica.
// TODO: reemplazar por POST /api/denuncias
export function crearDenunciaLocal(datos) {
  return {
    id: `local-${Date.now()}`,
    titulo: datos.titulo || undefined,
    tipo: datos.tipo,
    urgencia: datos.urgencia || 'media',
    estado: 'abierta',
    verificada: false,
    anonima: Boolean(datos.anonima),
    autor: datos.anonima ? null : (datos.autor || 'Usuario registrado'),
    descripcion: datos.descripcion,
    direccion: datos.direccion,
    lat: datos.lat ?? null,
    lng: datos.lng ?? null,
    fecha: new Date().toISOString(),
    evidencia: datos.evidencia || []
  };
}
