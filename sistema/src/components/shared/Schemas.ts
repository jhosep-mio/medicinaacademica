import * as Yup from 'yup'

export const SchemaBrief = Yup.object().shape({
  nombres: Yup.string().required('Este campo es requerido').min(1),
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(9, 'El numero debe tener 9 digitos')
    .max(9, 'El numero debe tener 9 digitos')
})
// CATEGORIAS
export const SchemaCategorias = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemaDistribuidores = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1),
  idCategoria: Yup.number().nullable(),
  celular: Yup.number().required('El campo es requerido'),
  correo: Yup.string().email('Digite un email valido').required('El campo es requerido'),
  horario: Yup.string().required('El campo es requerido'),
  direccion: Yup.string().required('El campo es requerido'),
  lat: Yup.string().required('El campo es requerido'),
  lng: Yup.string().required('El campo es requerido'),
  id_departamento: Yup.string().required('El campo es requerido'),
  id_provincia: Yup.string().required('El campo es requerido')

})

export const SchemaCoberturas = Yup.object().shape({
  id_departamento: Yup.string().required('El campo es requerido'),
  id_provincia: Yup.string().required('El campo es requerido'),
  id_distrito: Yup.string().required('El campo es requerido')
})

// SUBCATEGORIAS
export const SchemaSubcategorias = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1),
  idCategoria: Yup.number().required('El campo es requerido')
})

export const SchemaMostrar = Yup.object().shape({
  enlace: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemaMarcas = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1),
  id_profesor: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemaMarcas2 = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1)
})
// SHOWCATEGORIAS
export const SchemaShowcategory = Yup.object().shape({
  id_producto: Yup.number().required('El campo es requerido')
})

// DISTRITOS
export const SchemaDistrito = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido').min(1),
  id_provincia: Yup.string().required('Este campo es requerido').min(1)
})

// PRODUCTOS
export const ScheamaProductos = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido'),
  duracionFiltro: Yup.string().required('El campo es requerido'),
  idCategoria: Yup.number().required('El campo es requerido'),
  id_profesor: Yup.number().required('El campo es requerido'),
  nivel: Yup.string().required('El campo es requerido'),
  inscritos: Yup.string().required('El campo es requerido'),
  duracion: Yup.string().required('El campo es requerido'),
  certificado: Yup.string().required('El campo es requerido'),
  precio1: Yup.number().required('El campo es requerido'),
  precio2: Yup.number().required('El campo es requerido')
})

export const ScheamaProductos2 = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido'),
  duracionFiltro: Yup.string().required('El campo es requerido'),
  idCategoria: Yup.number().required('El campo es requerido'),
  nivel: Yup.string().required('El campo es requerido'),
  inscritos: Yup.string().required('El campo es requerido'),
  duracion: Yup.string().required('El campo es requerido'),
  certificado: Yup.string().required('El campo es requerido'),
  precio1: Yup.number().required('El campo es requerido'),
  precio2: Yup.number().required('El campo es requerido')
})

export const ScheamaBannersProducto = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido')

})

export const SchemaProfesores = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido'),
  especialidad: Yup.string().required('El campo es requerido'),
  email: Yup.string().email('Digite un email valido').required('El campo es requerido')
})

export const SchemaProfesores2 = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido'),
  especialidad: Yup.string().required('El campo es requerido'),
  email: Yup.string().email('Digite un email valido').required('El campo es requerido'),
  password: Yup.string().required('El campo es requerido')
})

export const SchemaServicios = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido'),
  titulo1: Yup.string().required('El campo es requerido')
})

export const SchemaTestimonios = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido')

})

// BLOG
export const SchemaBlog = Yup.object().shape({
  titulo: Yup.string().required('El campo es requerido'),
  resumen: Yup.string().required('El campo es requerido').max(150, 'Máximo de caracteres alcanzados')
})

// PRIMERASECCION
export const ScheamaPrimeraSeccion = Yup.object().shape({
  nombre: Yup.string().required('El campo es requerido'),
  descripcion: Yup.string().required('El campo es requerido')
})

// SEGUNDA SECCION
export const ScheamaSegundaSeccion = Yup.object().shape({
  titulo: Yup.string().required('El campo es requerido'),
  descripcion: Yup.string().required('El campo es requerido')
})

// VALORES
export const ScheamaValores = Yup.object().shape({
  titulo: Yup.string().required('El campo es requerido')
})

// VALORES
export const SchemaValores = Yup.object().shape({
  mapa: Yup.string().required('El campo es requerido'),
  mapa2: Yup.string().required('El campo es requerido')
})

// CONFIGURACION
export const SchemaConfiguracion = Yup.object().shape({
  celular1: Yup.number().required('El campo es requerido'),
  celular2: Yup.number().nullable(),
  correo1: Yup.string().email('Digite un email valido').required('El campo es requerido'),
  correo2: Yup.string().email('Digite un email valido').nullable(),
  direccion1: Yup.string().required('El campo es requerido'),
  direccion2: Yup.string().required('El campo es requerido'),
  direccion3: Yup.string().required('El campo es requerido'),
  horario: Yup.string().required('El campo es requerido'),
  facebook: Yup.string().nullable(),
  instagram: Yup.string().nullable(),
  twiter: Yup.string().nullable(),
  linkedin: Yup.string().nullable(),
  youtube: Yup.string().nullable(),
  whatsapp: Yup.string().nullable()
})

// VALORES
export const ScheamaBanner = Yup.object().shape({
  titulo: Yup.string().required('El campo es requerido'),
  subTitulo: Yup.string().required('El campo es requerido')
})

// TRANSACCIONES
export const SchemaTransacciones = Yup.object().shape({
  id_transaccion: Yup.string().required('El campo es requerido'),
  nombres: Yup.string().required('El campo es requerido'),
  apellidos: Yup.string().required('El campo es requerido'),
  status: Yup.string().required('El campo es requerido'),
  tipo: Yup.string().required('El campo es requerido'),
  order_id: Yup.string().required('El campo es requerido'),
  email: Yup.string().required('El campo es requerido'),
  celular: Yup.string().required('El campo es requerido'),
  comentario: Yup.string().nullable(),
  delivery: Yup.string().required('El campo es requerido'),
  total_pago: Yup.string().required('El campo es requerido'),
  array_productos: Yup.string().required('El campo es requerido'),
  estado: Yup.number().required('El campo es requerido')
})
