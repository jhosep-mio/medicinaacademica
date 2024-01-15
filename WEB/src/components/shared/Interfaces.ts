export interface carrito {
  id: number | null
  nombre: string
  cantidad: number | null
  precio: number
  imagen1: string
}

export interface valuesRegistro {
  email: string
  password: string
  celular: string
  nombres: string
  apellidos: string
}

export interface perfilValues {
  nombres: string
  apellidos: string
  celular: string
  edad: string
  especialidad: string
  ubicacion: ''
  genero: string
  cumpleaños: string
  creacion: string
}

export interface serviciosValues {
  id: number
  nombre: string
  imagen1: string
  imagen2: string
  caracteristicas: string
  titulo1: string
  seccion1: string
  seccion2: string
  seccion3: string
  seccion4: string
}

export interface profesorValues {
  id: number
  nombre: string
  imagen1: string
  caracteristicas: string
  especialidad: string
}

export interface datosValues {
  nombres: string
  apellidos: string
  dni: string
  celular: string
  email: string
  nombre_empresa: string
  ruc: string
  direccion_fiscal: string
}

export interface testimoniosValues {
  id: number
  nombre: string
  tipoComentario: string
  imagen1: string
  comentario: string
  caracteristicas: string
}

export interface mostrarValues {
  enlace: string
  imagen1: string
}

export interface distribuidorValues {
  id: number
  nombre: string
  idCategoria: string
  categoria: string
  direccion: string
  correo: string
  celular: string
  horario: string
  lat: number
  lng: number
  imagen1: string
  departamento: string
  departamentos_id: string
  provincias_id: string
  id_distrito: string
  provincia: string
  distrito: string
}

export interface distribuidorValuesModificate {
  nombre: string
  idCategoria: string
  direccion: string
  correo: string
  celular: string
  horario: string
  lat: number
  lng: number
  departamento: string
  provincia: string
  distrito: string
}

export interface coberturasValuesModificate {
  id: string
  provincias_id: string
  provincia: string
  departamentos_id: string
  departamento: string
  distritos_id: string
  distrito: string
  imagen1: string
}

export interface departamentosValues {
  id: number
  nombre: string
}

export interface provinciasValues {
  id: number
  nombre: string
  id_provincia: string
  id_departamento: string
}

export interface distritosValues {
  id: number
  nombre: string
  id_provincia: string
}
export interface ConfiguracionValues {
  id: number | null
  celular1: string
  celular2: string
  correo1: string
  correo2: string
  direccion1: string
  direccion2: string
  direccion3: string
  facebook: string
  instagram: string
  youtube: string
  linkedin: string
  whatsapp: string
  horario: string
}

export interface Values {
  nombres: string
  celular: string
  email: string
  base_proyecto: string
  nombre_empresa: string
  historia_empresa: string
  principales_servicios: string
  colores: string
  referencias: string
  transmitir: string
}

export interface ImagenState {
  archivo: File | null
  archivoName: string
}

export interface ImagePreviewProps {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
}

export interface ImagePreviewPropsUdpdate {
  globalUrl: string
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  imagen: string
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
}

export interface interfaceListaDiseño {
  id: number
  nombres: string
  celular: number
  email: string
  nombre_empresa: string
  created_at: string
  uptated_at: string
}

// PAGINACION
export interface paginacionValues {
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
}

// DELETE
export interface deleteValues {
  ruta: string
  id: number
  token: string | null
  getData: () => Promise<void>
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
}

// BANNERS
export interface bannersValues {
  id: number
  imagen1: string
  created_at: string | null
  updated_at: string | null
}

// OFERTAS
export interface ofertasValues {
  id: number
  imagen1: string
  created_at: string | null
  updated_at: string | null
}

// MARCAS
export interface marcasValues {
  id: number
  imagen1: string
  created_at: string | null
  updated_at: string | null
}

// MARCAS
// export interface marcasValue {
//   id: number
//   imagen1: string
//   imagen2: string
//   created_at: string | null
//   updated_at: string | null
// }

// CATEGORIAS
// LISTA
export interface categoriasValues {
  id: number
  nombre: string
  imagen1: string
  descripcion: string
  created_at: string | null
  updated_at: string | null
}
// CREACION - UPDATE
export interface categoriasValuesMoficate {
  nombre: string
}

export interface showcategoryValues {
  id: number
  id_categoria: string
  categoria: string
}
export interface subcategoriasValues {
  id: number
  nombre: string
  id_categoria: string
  created_at: string | null
  updated_at: string | null
}

// PRODUCTOS
export interface productosValuesModificate {
  nombre: string
  descripcion: string
  idCategoria: string
}

// UPDATE-CREATE
export interface segundaSeccionValuesModificate {
  titulo: string
  descripcion: string
}

export interface valoresValues {
  titulo: string
}

export interface blogsValues {
  titulo: string
  resumen: string
  imagen1: string
  descripcion: string
  created_at: string | null
  updated_at: string | null
}

export interface mapaValues {
  mapa: string
  mapa2: string
}

export interface cursosCompradosValues {
  array_productos: string
}

export interface editorValues {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export interface arrayValues {
  id: number | null
  medida: string
  precio: string
  cantidad: string
  oferta: string
}

export interface mantenimientoValues {
  id: number
  valor: number
}

export interface apuntesValues {
  id: string
  tiempo: string
  texto: string
  claseId: string | undefined
  cursoId: string | undefined
}

export interface comentariosValues {
  id: number
  texto: string
  idUser: string
  fecha: string
  foto: string
  hora: string
  clase: string | undefined
  respuestas: any
  user: string
}

export interface valuesTransaccion {
  id: number
  id_transaccion: number
  nombres: string
  apellidos: string
  status: string
  tipo: string
  order_id: string
  email: string
  celular: string
  comentario: string | null
  delivery: string
  total_pago: string
  array_productos: string
  estado: number
  factura: string
}

export interface productosValues {
  id: number
  nombre: string
  id_categoria: string
  id_profesor: string
  resumen: string
  categoria: string
  profesor: string
  nivel: string
  duracionFiltro: string
  duracion: string
  inscritos: string
  certificado: string
  caracteristicas: string
  contenido: string
  precio1: number
  precio2: number
  imagen1: string
  enlaceVideo: string
  imagen2: string
  imagen3: string
  pdf: string
  created_at: string | null
  updated_at: string | null
}

// PRODUCTOS
export interface productosValuesToCupon {
  id: number
  nombre: string
  id_categoria: string
  id_profesor: string
  resumen: string
  categoria: string
  profesor: string
  nivel: string
  duracionFiltro: string
  duracion: string
  inscritos: string
  certificado: string
  caracteristicas: string
  contenido: string
  precio1: number
  precio2: number
  imagen1: string
  enlaceVideo: string
  tiempointroduccion: string
  videointroduccion: string
  nombreintroduccion: string
  imagen2: string
  imagen3: string
  pdf: string
  modalidad: string
  fechaInicio: string
  talleresVivo: string
  articulos: string
  recursos2: string
  garantia: string
  acceso: string
  created_at: string | null
  updated_at: string | null
}

export interface contenidosValues {
  contenido: any
  linkClases: string
  codClases: string
  tiemposClase: string
  titulo: string
  tipos: string
}

export interface valuesSecciones {
  id: string | undefined
  tituloSeccion: string
  idClase: string | undefined
  archivos: any[]
}

export interface archivoValuess {
  id: string | undefined
  tipo: string
  contenido: string
}
