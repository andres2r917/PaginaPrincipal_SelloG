// Datos mock de denuncias. La forma de cada objeto replica la tabla denunciations de Laravel
// (más sus evidencias, la fundación asignada y quién reportó) para que al conectar la API el mapeo sea directo.

// TODO: reemplazar por platform_settings.Telefono_emergencia cuando exista el endpoint en Laravel
export const TELEFONO_EMERGENCIA_INICIAL = '+57 300 000 0000'

// Valores válidos de Estado_denuncia
export const ESTADOS_DENUNCIA = ['pendiente', 'verificada', 'en_rescate', 'resuelta', 'descartada']

// Estados "activos": los que se muestran en la pestaña Activas y en el panel de fundación
export const ESTADOS_ACTIVOS = ['pendiente', 'verificada', 'en_rescate']

// Etiquetas legibles para el campo Tipo_denuncia
export const ETIQUETA_TIPO = {
  maltrato: 'Maltrato físico',
  abandono: 'Abandono',
  trafico: 'Tráfico de animales',
  negligencia: 'Negligencia',
  otro: 'Otro',
}

export const seedDenuncias = [
  {
    id: 6,
    tipo: 'maltrato',
    descripcion: 'Perro atado sin agua ni comida frente a una casa abandonada. Se ve muy delgado.',
    ubicacion: 'Carrera 6 #4-20, Centro, Popayán, Cauca',
    latitud: 2.4448,
    longitud: -76.6147,
    anonima: false,
    estado: 'pendiente',
    urgencia: 'Alta',
    fecha: '2026-10-09T08:40:00',
    usuarioId: 2,
    reportadoPor: { tipo: 'civil', nombre: 'Usuario registrado' },
    fundacionAsignada: null,
    fechaAsignacion: null,
    evidencias: [
      { id: 1, url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop', tipoArchivo: 'image/jpeg', tamanoBytes: 0 },
    ],
  },
  {
    id: 5,
    tipo: 'abandono',
    descripcion: 'Gata con crías abandonadas dentro de una caja junto al parque.',
    ubicacion: 'Parque Caldas, Popayán, Cauca',
    latitud: 2.4382,
    longitud: -76.6061,
    anonima: true,
    estado: 'verificada',
    urgencia: 'Media',
    fecha: '2026-10-08T17:15:00',
    usuarioId: null,
    reportadoPor: { tipo: 'anonimo', nombre: 'Denuncia anónima' },
    fundacionAsignada: null,
    fechaAsignacion: null,
    evidencias: [
      { id: 1, url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=400&fit=crop', tipoArchivo: 'image/jpeg', tamanoBytes: 0 },
    ],
  },
  {
    id: 4,
    tipo: 'negligencia',
    descripcion: 'Perro con una herida abierta en la pata, el dueño no lo lleva al veterinario.',
    ubicacion: 'Barrio Bolívar, Popayán, Cauca',
    latitud: 2.4510,
    longitud: -76.6009,
    anonima: false,
    estado: 'en_rescate',
    urgencia: 'Alta',
    fecha: '2026-10-07T10:05:00',
    usuarioId: 55,
    reportadoPor: { tipo: 'civil', nombre: 'Usuario registrado' },
    fundacionAsignada: { id: 2, nombre: 'Patitas al Rescate', telefono: '+57 311 000 0002' },
    fechaAsignacion: '2026-10-07T12:30:00',
    evidencias: [
      { id: 1, url: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&h=400&fit=crop', tipoArchivo: 'image/jpeg', tamanoBytes: 0 },
    ],
  },
  {
    id: 3,
    tipo: 'abandono',
    descripcion: 'Dos perros dejados en un lote baldío, parecen llevar varios días sin comida.',
    ubicacion: 'Vía Panamericana, salida norte, Popayán, Cauca',
    latitud: 2.4290,
    longitud: -76.6120,
    anonima: false,
    estado: 'verificada',
    urgencia: 'Baja',
    fecha: '2026-10-06T15:20:00',
    usuarioId: 99,
    reportadoPor: { tipo: 'fundacion', nombre: 'Patitas al Rescate' },
    fundacionAsignada: null,
    fechaAsignacion: null,
    evidencias: [
      { id: 1, url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop', tipoArchivo: 'image/jpeg', tamanoBytes: 0 },
    ],
  },
  {
    id: 2,
    tipo: 'maltrato',
    descripcion: 'Caballo con signos de sobrecarga de trabajo. Ya fue atendido.',
    ubicacion: 'Plaza de mercado, Popayán, Cauca',
    latitud: 2.4425,
    longitud: -76.6032,
    anonima: false,
    estado: 'resuelta',
    urgencia: 'Media',
    fecha: '2026-10-01T09:00:00',
    usuarioId: 2,
    reportadoPor: { tipo: 'civil', nombre: 'Usuario registrado' },
    fundacionAsignada: { id: 1, nombre: 'Huellitas Felices', telefono: '+57 310 000 0001' },
    fechaAsignacion: '2026-10-01T11:00:00',
    evidencias: [
      { id: 1, url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=400&fit=crop', tipoArchivo: 'image/jpeg', tamanoBytes: 0 },
    ],
  },
  {
    id: 1,
    tipo: 'otro',
    descripcion: 'Publicación sin relación con maltrato animal.',
    ubicacion: 'Popayán, Cauca',
    latitud: 2.4419,
    longitud: -76.6069,
    anonima: true,
    estado: 'descartada',
    urgencia: 'Baja',
    fecha: '2026-09-28T13:00:00',
    usuarioId: null,
    reportadoPor: { tipo: 'anonimo', nombre: 'Denuncia anónima' },
    fundacionAsignada: null,
    fechaAsignacion: null,
    evidencias: [],
  },
]
