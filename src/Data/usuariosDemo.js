// Usuarios por defecto para desarrollo (simulan la tabla users)
export const usuariosDemo = [
  {
    id: 1,
    nombre: 'Administrador Sello Guardián',
    email: 'admin@selloguardian.com',
    password: 'Admin123*',
    rol: 'admin',
    foto: null,
  },
  {
    id: 2,
    nombre: 'Carlos Ruiz',
    email: 'civil@selloguardian.com',
    password: 'Civil123*',
    rol: 'civil',
    foto: null,
    // Perfil vacío: obliga a pasar por /perfil en el primer ingreso
    documento: '',
    fechaNacimiento: '',
    tipoVivienda: '',
    ocupacion: '',
    salario: '',
    telefono: '',
    hijos: '',
    perfilCompleto: false,
  },
  {
    id: 3,
    nombre: 'Huellitas Felices',
    email: 'fundacion@selloguardian.com',
    password: 'Fundacion123*',
    rol: 'fundacion',
    foto: null,
    fundacionId: 1,
    // pendiente | verificada | rechazada
    estadoVerificacion: 'verificada',
  },
]
