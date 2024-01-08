import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import {
  type productosValuesModificate,
  type ImagenState,
  type categoriasValues,
  type Clase,
  type valuesEdicionItem
} from '../../../shared/Interfaces'
import { ScheamaProductos } from '../../../shared/Schemas'
import Editor from '../../../shared/Editar'
import { ImageUpdate } from '../../../shared/ImageUpdate'
import { BsFillTrash2Fill, BsPencilSquare, BsXLg } from 'react-icons/bs'
import { v4 as uuidv4 } from 'uuid'
import { EditarBloque } from './modals/EditarBloque'
import { EditarItem } from './modals/EditarItem'
import { FaChevronUp } from 'react-icons/fa'
import { IoAddCircle } from 'react-icons/io5'
import { AgregarNewItems } from './modals/AgregarNewItems'
import Editor2 from '../../../shared/Editar2'
import { MostrarContenido } from './modals/MostrarContenido'
import { PdfUpdateTemario } from '../../../shared/PdfUpdateTemario'
export const EditarProducto = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [materiales, setMateriales] = useState<string[]>([])
  const [materialValue, setMaterialValue] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [openAddItem, setOpenAddItem] = useState<boolean>(false)
  const [tipo, setTipo] = useState<string>('')
  const [tipos, setTipos] = useState<string[]>([])
  const [openContenido, setOpenContenido] = useState(false)
  const [contenidoseleccionado, setContenidoseleccionado] = useState('')
  const [newItemToBloque, setNewItemToBloque] = useState<number | null>(null)
  const [examenes, setExamenes] = useState([])
  const [nombretemario, setNombreTemario] = useState('')
  const [temario, setTemario] = useState<File | null>(null)
  const handlePdfChange = (temario: File | null): void => {
    setTemario(temario)
  }
  const [openItem, setOpenItem] = useState<boolean>(false)
  const [pased, setPased] = useState<Clase>({
    id: '',
    titulo: '',
    contenido: [],
    tiemposClase: [],
    linkClases: [],
    codClases: [],
    tipos: []
  })

  const getExamenes = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getExamenes`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setExamenes(request.data)
  }

  const handleMaterialChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setMaterialValue(event.target.value)
  }

  const agregarElemento = (): void => {
    if (materialValue.trim() !== '') {
      setMateriales([...materiales, materialValue])
      setMaterialValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarElemento = (index: number): void => {
    const nuevosMaterial = [...materiales]
    nuevosMaterial.splice(index, 1)
    setMateriales(nuevosMaterial)
  }

  const eliminarTodo = (): void => {
    setMateriales([])
  }

  const [requisitos, setRequisitos] = useState<string[]>([])
  const [requisitoValue, setRequisitoValue] = useState<string>('')

  const handleRequisitoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRequisitoValue(event.target.value)
  }

  const agregarRequisito = (): void => {
    if (requisitoValue.trim() !== '') {
      setRequisitos([...requisitos, requisitoValue])
      setRequisitoValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarRequisito = (index: number): void => {
    const nuevosMaterial = [...requisitos]
    nuevosMaterial.splice(index, 1)
    setRequisitos(nuevosMaterial)
  }

  const eliminarRequisitos = (): void => {
    setRequisitos([])
  }

  const [publico, setPublico] = useState<string[]>([])
  const [publicoValue, setPublicoValue] = useState<string>('')

  const handlePublicoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPublicoValue(event.target.value)
  }

  const agregarPublico = (): void => {
    if (publicoValue.trim() !== '') {
      setPublico([...publico, publicoValue])
      setPublicoValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarPublico = (index: number): void => {
    const nuevosMaterial = [...publico]
    nuevosMaterial.splice(index, 1)
    setPublico(nuevosMaterial)
  }

  const eliminarPublicos = (): void => {
    setPublico([])
  }

  const [aprenderas, setAprenderas] = useState<string[]>([])
  const [aprenderasValue, setAprenderasValue] = useState<string>('')

  const handleAprenderasChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAprenderasValue(event.target.value)
  }

  const agregarAprenderas = (): void => {
    if (aprenderasValue.trim() !== '') {
      setAprenderas([...aprenderas, aprenderasValue])
      setAprenderasValue('') // Limpiamos el input después de agregar un elemento
    }
  }

  const eliminarAprendera = (index: number): void => {
    const nuevosMaterial = [...aprenderas]
    nuevosMaterial.splice(index, 1)
    setAprenderas(nuevosMaterial)
  }

  const eliminarAprenderas = (): void => {
    setAprenderas([])
  }

  const [tituloClase, setTituloClase] = useState<string>('')
  const [clases, setClases] = useState<Clase[]>([])

  const handleTituloChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTituloClase(event.target.value)
  }

  const [tiempoClase, setTiempoClase] = useState('')
  const [linkClase, setLinkClase] = useState('')

  const handleTiempoChange = (e: any): void => {
    setTiempoClase(e.target.value)
  }

  const [tiemposClase, setTiemposClase] = useState<string[]>([])
  const [linkClases, setLinkClases] = useState<string[]>([])
  const [codClases, setCodClases] = useState<string[]>([])
  const [contenido, setContenido] = useState<string[]>([])
  const [contenidoValue, setContenidoValue] = useState<string>('')

  const handleContenidoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setContenidoValue(event.target.value)
  }

  const agregarContenido = (): void => {
    if (
      contenidoValue.trim() !== '' &&
      tiempoClase.trim() !== '' &&
      linkClase.trim() !== ''
    ) {
      setContenido([...contenido, contenidoValue])
      setTiemposClase([...tiemposClase, tiempoClase])
      setTiemposClase([...tiemposClase, tiempoClase])
      const uniqueId = uuidv4()
      setCodClases([...codClases, uniqueId])
      setLinkClases([...linkClases, linkClase])
      setTipos([...tipos, tipo])
      setContenidoValue('')
      setTiempoClase('')
      setLinkClase('')
      setTipo('')
    } else {
      Swal.fire('Complete todos los campos por favor', '', 'warning')
    }
  }

  const agregarExamen = (): void => {
    if (linkClase.trim() !== '') {
      const datos = JSON.parse(linkClase)
      setContenido([...contenido, datos.titulo])
      setTiemposClase([...tiemposClase, '0'])
      const uniqueId = uuidv4()
      setCodClases([...codClases, uniqueId])
      setLinkClases([...linkClases, datos.id])
      setTipos([...tipos, tipo])
      setContenidoValue('')
      setTiempoClase('')
      setLinkClase('')
      setTipo('')
    } else {
      Swal.fire('Complete todos los campos por favor', '', 'warning')
    }
  }

  const eliminarContenido = (index: number): void => {
    const nuevoContenido = contenido.filter((_, i) => i !== index)
    const nuevasTiemposClase = tiemposClase.filter((_, i) => i !== index)
    const nuevosLinkClases = linkClases.filter((_, i) => i !== index)
    const nuevosCodClases = codClases.filter((_, i) => i !== index)
    const nuevosTipos = tipos.filter((_, i) => i !== index)
    setContenido(nuevoContenido)
    setTiemposClase(nuevasTiemposClase)
    setLinkClases(nuevosLinkClases)
    setCodClases(nuevosCodClases)
    setTipos(nuevosTipos)
    // Actualizar el array final de clases
    // const nuevasClases = clases.map((clase, i) => {
    //   if (i === index) {
    //     return {
    //       ...clase,
    //       contenido: nuevoContenido,
    //       tiemposClase: nuevasTiemposClase,
    //       linkClases: nuevosLinkClases,
    //       codClases: nuevosCodClases,
    //       tipos: nuevosTipos
    //     }
    //   }
    //   return clase
    // })

    // setClases(nuevasClases)
  }
  const eliminarContenidos = (): void => {
    setContenido([])
  }

  const agregarClase = (): void => {
    if (tituloClase.trim() !== '' && contenido.length > 0) {
      setClases([
        ...clases,
        {
          id: uuidv4(),
          titulo: tituloClase,
          contenido,
          tiemposClase,
          linkClases,
          codClases,
          tipos
        }
      ])
      setTituloClase('')
      setContenido([])
      setTiemposClase([])
      setLinkClases([])
      setCodClases([])
      setTipos([])
    } else {
      Swal.fire('Complete todos los campos', '', 'warning')
    }
  }

  const eliminarItemDeClase = (claseIndex: number, itemIndex: number): void => {
    const nuevasClases = clases.map((clase, i) => {
      if (i === claseIndex) {
        const nuevoContenido = [...clase.contenido]
        nuevoContenido.splice(itemIndex, 1)
        return {
          ...clase,
          contenido: nuevoContenido,
          tiemposClase: clase.tiemposClase?.filter((_, j) => j !== itemIndex),
          linkClases: clase.linkClases?.filter((_, j) => j !== itemIndex),
          codClases: clase.codClases?.filter((_, j) => j !== itemIndex),
          tipos: clase.tipos?.filter((_, j) => j !== itemIndex)
        }
      }
      return clase
    })

    setClases(nuevasClases)
  }

  const eliminarBloque = (bloqueIndex: number): void => {
    const nuevasClases = clases.filter((_, i) => i !== bloqueIndex)
    setClases(nuevasClases)
  }

  const eliminarTodoElTemario = (): void => {
    setClases([])
  }

  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [profesores, setProfesores] = useState([])

  const [content, setContent] = useState('')
  const [envivo, setEnvivo] = useState('0')
  const [semuestra, setsemuestra] = useState('0')
  const [resumen, setResumen] = useState('')

  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()

  const [imagen1, setImagen1] = useState('')
  const [imagenNueva1, setImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')

  useEffect(() => {
    setTiempoClase('')
    setLinkClase('')
    setContenidoValue('')
  }, [tipo])

  useEffect(() => {
    setLoadingComponents(true)
    setTitle('Editar Producto')
    Promise.all([
      getExamenes(),
      getCategorias(),
      getProducto(),
      getProfesores()
    ]).then(() => {
      setLoadingComponents(false)
    })
  }, [])

  const updateProducto = async (
    values: productosValuesModificate
  ): Promise<void> => {
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('id_categoria', values.idCategoria)
    data.append('id_profesor', values.id_profesor)
    data.append('nombre', values.nombre)
    data.append('enlaceVideo', values.enlaceVideo)
    data.append('nivel', values.nivel)
    data.append('inscritos', values.inscritos)
    data.append('duracion', values.duracion)
    data.append('duracionFiltro', values.duracionFiltro)
    data.append('certificado', values.certificado)
    data.append('nombreintroduccion', values.nombreintroduccion)
    data.append('videointroduccion', values.videointroduccion)
    data.append('tiempointroduccion', values.tiempointroduccion)
    data.append('envivo', envivo)
    data.append('semuestra', semuestra)
    data.append('aprenderas', JSON.stringify(aprenderas))
    data.append('materiales', JSON.stringify(materiales))
    data.append('requisitos', JSON.stringify(requisitos))
    data.append('publico', JSON.stringify(publico))
    data.append('contenido', JSON.stringify(clases))
    if (temario !== null) {
      data.append('temario', temario)
    }
    if (imagenNueva1.archivo != null) {
      data.append('imagen1', imagenNueva1.archivo)
    }

    data.append('caracteristicas', content)
    data.append('resumen', resumen)
    data.append('precio1', values.precio1)
    data.append('precio2', values.precio2)
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateProducto/${id ?? ''}}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )

      if (respuesta.data.status == 'success') {
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/productos')
      } else {
        Swal.fire('Error ', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  const getCategorias = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/allCategorias`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setCategorias(request.data)
    setLoadingComponents(false)
  }

  const getProfesores = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/allProfesores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProfesores(request.data)
    setLoadingComponents(false)
  }

  const getProducto = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/showAdmin/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      idCategoria: request.data[0].id_categoria,
      id_profesor: request.data[0].id_profesor,
      nombre: request.data[0].nombre,
      precio1: request.data[0].precio1,
      precio2: request.data[0].precio2,
      nivel: request.data[0].nivel,
      duracion: request.data[0].duracion,
      duracionFiltro: request.data[0].duracionFiltro,
      certificado: request.data[0].certificado,
      inscritos: request.data[0].inscritos,
      enlaceVideo: request.data[0].enlaceVideo,
      nombreintroduccion: request.data[0].nombreintroduccion,
      videointroduccion: request.data[0].videointroduccion,
      tiempointroduccion: request.data[0].tiempointroduccion
    })

    setRequisitos(JSON.parse(request.data[0].requisitos))
    setAprenderas(JSON.parse(request.data[0].aprenderas))
    setMateriales(JSON.parse(request.data[0].materiales))
    setPublico(JSON.parse(request.data[0].publico))
    if (request.data[0].contenido) {
      setClases(JSON.parse(request.data[0].contenido))
    }
    if (request.data[0].envivo) {
      setEnvivo(request.data[0].envivo)
    }
    if (request.data[0].semuestra) {
      setsemuestra(request.data[0].semuestra)
    }
    setImagen1(request.data[0].imagen1)
    setNombreTemario(request.data[0].temario)
    console.log(request.data[0].temario)
    setContent(request.data[0].caracteristicas)
    setResumen(request.data[0].resumen)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setValues,
    isSubmitting
  } = useFormik({
    initialValues: {
      nombre: '',
      idCategoria: '',
      id_profesor: '',
      videointroduccion: '',
      nombreintroduccion: '',
      tiempointroduccion: '',
      contenido: '',
      precio1: '',
      precio2: '',
      nivel: '',
      inscritos: '',
      duracion: '',
      certificado: '',
      enlaceVideo: '',
      duracionFiltro: ''
    },
    validationSchema: ScheamaProductos,
    onSubmit: updateProducto
  })

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  const [itemSeleccionado, setItemSeleccionado] =
    useState<valuesEdicionItem | null>(null)

  const abrirModalEdicionItem = (
    clase: Clase,
    claseIndex: number,
    itemIndex: number
  ): void => {
    setItemSeleccionado({
      claseIndex,
      itemIndex,
      contenido: clase.contenido[itemIndex],
      tiempo: clase.tiemposClase[itemIndex],
      enlace: clase.linkClases[itemIndex],
      tipo: clase.tipos[itemIndex]
    })
    setOpenItem(true)
  }

  const moverBloqueArriba = (indice: number): void => {
    if (indice == 0) return // No mover si ya está al principio

    const nuevoOrden = [...clases];
    [nuevoOrden[indice], nuevoOrden[indice - 1]] = [
      nuevoOrden[indice - 1],
      nuevoOrden[indice]
    ]
    setClases(nuevoOrden)
  }

  // Función para mover un bloque hacia abajo
  const moverBloqueAbajo = (indice: number): void => {
    if (indice == clases.length - 1) return // No mover si ya está al final
    const nuevoOrden = [...clases];
    [nuevoOrden[indice], nuevoOrden[indice + 1]] = [
      nuevoOrden[indice + 1],
      nuevoOrden[indice]
    ]
    setClases(nuevoOrden)
  }

  // Función para mover un ítem hacia arriba dentro de un bloque
  const moverItemArriba = (claseIndex: number, itemIndex: number): void => {
    if (itemIndex == 0) return // No mover si ya está al principio del bloque
    const nuevoOrden = [...clases]
    // NOMBRE
    const bloque = nuevoOrden[claseIndex];
    [bloque.contenido[itemIndex], bloque.contenido[itemIndex - 1]] = [
      bloque.contenido[itemIndex - 1],
      bloque.contenido[itemIndex]
    ]
    // TIEMPO
    const temp = bloque.tiemposClase[itemIndex]
    bloque.tiemposClase[itemIndex] = bloque.tiemposClase[itemIndex - 1]
    bloque.tiemposClase[itemIndex - 1] = temp
    // LINK
    const link = bloque.linkClases[itemIndex]
    bloque.linkClases[itemIndex] = bloque.linkClases[itemIndex - 1]
    bloque.linkClases[itemIndex - 1] = link
    // CODIGO
    const cod = bloque.codClases[itemIndex]
    bloque.codClases[itemIndex] = bloque.codClases[itemIndex - 1]
    bloque.codClases[itemIndex - 1] = cod

    const tip = bloque.tipos[itemIndex]
    bloque.tipos[itemIndex] = bloque.tipos[itemIndex - 1]
    bloque.tipos[itemIndex - 1] = tip
    setClases(nuevoOrden)
  }

  // Función para mover un ítem hacia abajo dentro de un bloque
  const moverItemAbajo = (claseIndex: number, itemIndex: number): void => {
    const bloque = clases[claseIndex]
    if (itemIndex == bloque.contenido.length - 1) return // No mover si ya está al final del bloque

    const nuevoOrden = [...clases];
    [bloque.contenido[itemIndex], bloque.contenido[itemIndex + 1]] = [
      bloque.contenido[itemIndex + 1],
      bloque.contenido[itemIndex]
    ]

    // TIEMPO
    const temp = bloque.tiemposClase[itemIndex]
    bloque.tiemposClase[itemIndex] = bloque.tiemposClase[itemIndex + 1]
    bloque.tiemposClase[itemIndex + 1] = temp
    // LINK
    const link = bloque.linkClases[itemIndex]
    bloque.linkClases[itemIndex] = bloque.linkClases[itemIndex + 1]
    bloque.linkClases[itemIndex + 1] = link
    // CODIGO
    const cod = bloque.codClases[itemIndex]
    bloque.codClases[itemIndex] = bloque.codClases[itemIndex + 1]
    bloque.codClases[itemIndex + 1] = cod

    const tip = bloque.tipos[itemIndex]
    bloque.tipos[itemIndex] = bloque.tipos[itemIndex + 1]
    bloque.tipos[itemIndex + 1] = tip
    setClases(nuevoOrden)
  }

  return (
    <>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <form
          className="bg-secondary-100 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
            <div className="w-full lg:w-2/3">
              <TitleBriefs titulo="Título del curso" />
              <InputsBriefs
                name="nombre"
                type="text"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombre} touched={touched.nombre} />
            </div>
            <div className="w-full md:w-1/3">
              <TitleBriefs titulo="Asignar profesor" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="id_profesor"
                value={values.id_profesor}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleccionar</option>
                {profesores.map((profesor: categoriasValues) => (
                  <option value={profesor.id} key={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>
              <Errors
                errors={errors.id_profesor}
                touched={touched.id_profesor}
              />
            </div>
          </div>
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2">
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Precio" />
              <InputsBriefs
                name="precio1"
                type="number"
                value={values.precio1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.precio1} touched={touched.precio1} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Precio con oferta" />
              <InputsBriefs
                name="precio2"
                type="number"
                value={values.precio2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.precio2} touched={touched.precio2} />
            </div>
            <div className="w-full md:w-1/4">
              <TitleBriefs titulo="Asignar categoria" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="idCategoria"
                value={values.idCategoria}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleccionar</option>
                {categorias.map((categoria: categoriasValues) => (
                  <option value={categoria.id} key={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <Errors
                errors={errors.idCategoria}
                touched={touched.idCategoria}
              />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Duración Filtro(horas)" />
              <InputsBriefs
                name="duracionFiltro"
                type="number"
                value={values.duracionFiltro}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.duracionFiltro}
                touched={touched.duracionFiltro}
              />
            </div>
          </div>
          <div className="w-full lg:relative mb-16 flex flex-col lg:flex-row justify-between gap-2">
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Nivel" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                          focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                          rounded-md transition-all"
                name="nivel"
                value={values.nivel}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleccionar</option>
                <option value="Introductorio">Introductorio</option>
                <option value="Moderado">Moderado</option>
                <option value="Avanzado">Avanzado</option>
              </select>
              <Errors errors={errors.nivel} touched={touched.nivel} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Total inscritos" />
              <InputsBriefs
                name="inscritos"
                type="text"
                value={values.inscritos}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.inscritos} touched={touched.inscritos} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Duración" />
              <InputsBriefs
                name="duracion"
                type="text"
                value={values.duracion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.duracion} touched={touched.duracion} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="Certificado" />
              <InputsBriefs
                name="certificado"
                type="text"
                value={values.certificado}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.certificado}
                touched={touched.certificado}
              />
            </div>
          </div>

          <div className="w-full lg:relative mb-16 flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="CURSO EN VIVO" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                          focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                          rounded-md transition-all"
                value={envivo}
                autoComplete="off"
                onChange={(e) => { setEnvivo(e.target.value) }}
              >
                <option value="0">NO</option>
                <option value="1">SI</option>
              </select>
              <Errors errors={errors.nivel} touched={touched.nivel} />
            </div>
            <div className="w-full lg:w-1/4">
              <TitleBriefs titulo="CURSO PUBLICO" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                          focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                          rounded-md transition-all"
                value={semuestra}
                autoComplete="off"
                onChange={(e) => { setsemuestra(e.target.value) }}
              >
                <option value="0">SI</option>
                <option value="1">NO</option>
              </select>
              <Errors errors={errors.nivel} touched={touched.nivel} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-24 relative">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Resumen del curso
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={resumen} setContent={setResumen} />
            </div>
          </div>

          {!loadingComponents &&
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-5 relative">
                <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
                TEMARIO
                </p>
                <PdfUpdateTemario
                onPdfChange={handlePdfChange}
                initialPdfName={nombretemario}
                />
            </div>
          }

        <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
            <p className="bg-secondary-100 pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-10px]">
              Imagenes del producto<span className="text-red-500">*</span>
            </p>
            <div className="flex-1 flex flex-col lg:flex-row items-center gap-4">
              <ImageUpdate
                globalUrl="productos"
                url={url1}
                setUrl={setUrl1}
                boton={boton1}
                setBoton={setBoton1}
                imagen={imagen1}
                setImagen={setImagenNueva1}
                clase="1"
              />
            </div>
          </div>
          <div className="w-full lg:w-full mb-10">
            <TitleBriefs titulo="Enlace de Youtube" />
            <InputsBriefs
              name="enlaceVideo"
              type="text"
              value={values.enlaceVideo}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.enlaceVideo} touched={touched.enlaceVideo} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-24    relative pt-14">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[20px]">
              Descripción del curso
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={content} setContent={setContent} />
            </div>
          </div>

          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">
                Lo que aprenderás
              </h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textInput"
                value={aprenderasValue}
                onChange={handleAprenderasChange}
              />
              <button
                type="button"
                onClick={agregarAprenderas}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {aprenderas.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarAprenderas}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {aprenderas.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => {
                          eliminarAprendera(index)
                        }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">
                Materiales incluidos
              </h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textInput"
                value={materialValue}
                onChange={handleMaterialChange}
              />
              <button
                type="button"
                onClick={agregarElemento}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {materiales.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarTodo}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {materiales.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => {
                          eliminarElemento(index)
                        }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">Requisitos</h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textI"
                value={requisitoValue}
                onChange={handleRequisitoChange}
              />
              <button
                type="button"
                onClick={agregarRequisito}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {requisitos.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarRequisitos}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {requisitos.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => {
                          eliminarRequisito(index)
                        }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full flex gap-6 items-center">
              <h2 className="font-medium text-white w-1/5">Público Objetivo</h2>
              <input
                className="border border-black w-3/5  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="textI"
                value={publicoValue}
                onChange={handlePublicoChange}
              />
              <button
                type="button"
                onClick={agregarPublico}
                className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Agregar
              </button>
              {publico.length > 0 && (
                <button
                  type="button"
                  className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                  onClick={eliminarPublicos}
                >
                  Eliminar
                </button>
              )}
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {publico.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {elemento}
                      <button
                        type="button"
                        onClick={() => {
                          eliminarPublico(index)
                        }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full lg:relative mt-10 mb-5 flex flex-col justify-between gap-2">
            <div className="w-full gap-6 items-center">
              <h2 className="font-medium text-white w-1/5 mb-8">
                Contenido del curso
              </h2>

              <TitleBriefs titulo="Título de clase" />

              <input
                autoComplete="off"
                className="border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                type="text"
                id="tituloI"
                value={tituloClase}
                onChange={handleTituloChange}
                placeholder="Título de la clase"
              />
              <div className="w-full flex justify-center">
                <select
                  name=""
                  value={tipo}
                  onChange={(e) => {
                    setTipo(e.target.value)
                  }}
                  id=""
                  className="border border-black w-1/3 mx-auto  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Clase">Clase</option>
                  <option value="Tarea">Tarea</option>
                  <option value="Examen">Examen</option>
                </select>
              </div>
              <section className="border border-gray-600 p-2 my-2 flex flex-col gap-6 ">
                {tipo == 'Clase'
                  ? (
                  <div className="flex w-full items-center gap-6">
                    <input
                      className="border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                      type="text"
                      placeholder="Item clase"
                      id="textI"
                      value={contenidoValue}
                      onChange={handleContenidoChange}
                    />
                    <input
                      className="border border-black w-1/2 placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                      type="text"
                      placeholder="Tiempo de clase"
                      id="tiempoI"
                      value={tiempoClase}
                      onChange={handleTiempoChange}
                    />
                    <input
                      className="border border-black w-full placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                      type="text"
                      placeholder="Link de clase"
                      id="tiempoI"
                      value={linkClase}
                      onChange={(e) => {
                        setLinkClase(e.target.value)
                      }}
                    />

                    <button
                      type="button"
                      onClick={agregarContenido}
                      className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Agregar
                    </button>
                    {contenido.length > 0 && (
                      <button
                        type="button"
                        className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                        onClick={eliminarContenidos}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                    )
                  : tipo == 'Tarea'
                    ? (
                  <>
                    <div className="flex w-full items-center gap-6">
                      <input
                        className="border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                        type="text"
                        placeholder="Nombre de la tarea"
                        id="textI"
                        value={contenidoValue}
                        onChange={handleContenidoChange}
                      />
                      <input
                        className="border border-black w-1/2 placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                        type="text"
                        placeholder="Duracion estimada"
                        id="tiempoI"
                        value={tiempoClase}
                        onChange={handleTiempoChange}
                      />
                    </div>
                    <div className="flex w-full flex-col items-center gap-6">
                      <Editor2 content={linkClase} setContent={setLinkClase} />
                      <button
                        type="button"
                        onClick={agregarContenido}
                        className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                      >
                        Agregar
                      </button>
                      {contenido.length > 0 && (
                        <button
                          type="button"
                          className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                          onClick={eliminarContenidos}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </>
                      )
                    : tipo == 'Examen'
                      ? (
                  <>
                    <div className="flex w-full items-center gap-6">
                      <select
                        name=""
                        id=""
                        value={linkClase}
                        onChange={(e) => {
                          setLinkClase(e.target.value)
                        }}
                        className="border border-black w-full  placeholder-gray-400 outline-none focus:outline-none focus:border-black pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all"
                      >
                        <option value="">Seleccionar examen</option>
                        {examenes.map(
                          (examen: { id: number, titulo: string }, index) => (
                            <option
                              value={JSON.stringify(examen)}
                              className=""
                              key={index}
                            >
                              {examen.titulo}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="flex w-full flex-col items-center gap-6">
                      <button
                        type="button"
                        onClick={agregarExamen}
                        className="w-0.5/5 bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                      >
                        Agregar
                      </button>
                      {contenido.length > 0 && (
                        <button
                          type="button"
                          className="w-0.5/5 bg-red-500 px-4 py-2 rounded-md text-white"
                          onClick={eliminarContenidos}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </>
                        )
                      : null}
              </section>
            </div>

            <div>
              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ul>
                  {contenido.map((elemento, index) => (
                    <li
                      key={index}
                      className="flex items-center space-between w-full gap-4 mb-2"
                    >
                      {tipos[index] == 'Clase' || tipos[index] == 'Tarea'
                        ? (
                        <div>
                          <span className="mr-2 text-gray-500">
                            {tipos[index]}
                          </span>
                          <span>{elemento}</span>
                          <span className="ml-2 text-gray-500">
                            {tiemposClase[index]}
                          </span>
                          {tipos[index] == 'Clase'
                            ? (
                            <span className="ml-2 text-gray-500">
                              {linkClases[index]}
                            </span>
                              )
                            : (
                            <span
                              className="ml-2 text-white hover:text-gray-400 transition-colors cursor-pointer"
                              onClick={() => {
                                setContenidoseleccionado(linkClases[index])
                                setOpenContenido(true)
                              }}
                            >
                              VER CONTENIDO
                            </span>
                              )}
                        </div>
                          )
                        : (
                        <div>
                          <span className="mr-2 text-gray-500">
                            {tipos[index]}
                          </span>
                          <span>{elemento}</span>
                        </div>
                          )}
                      <button
                        type="button"
                        onClick={() => {
                          eliminarContenido(index)
                        }}
                      >
                        <BsXLg className="delete_icon" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                agregarClase()
              }}
              className="w-0.5/5 text-center text-white bg-green-500  hover:bg-green-600 flex justify-center items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Agregar todo
            </button>
          </div>
          <div className="w-full lg:relative mt-10 mb-5 flex flex-col justify-between gap-2">
            <div className="flex items-center gap-6 justify-center">
              <h2 className="font-medium text-white text-center">Temario</h2>
              <button
                type="button"
                onClick={eliminarTodoElTemario}
                className="bg-red-500 px-4 py-2 rounded-md text-white"
              >
                Eliminar Todo el Temario
              </button>
            </div>
            <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
              <ul>
                {clases.map((clase, claseIndex) => (
                  <li key={claseIndex} className="flex gap-3 w-full">
                    <div className="flex flex-col items-center gap-2 ">
                      <button
                        type="button"
                        onClick={() => {
                          moverBloqueArriba(claseIndex)
                        }}
                      >
                        <FaChevronUp className=" text-gray-400 text-lg" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          moverBloqueAbajo(claseIndex)
                        }}
                      >
                        <FaChevronUp className=" text-gray-400 text-lg rotate-180" />
                      </button>
                    </div>
                    <div className="w-full">
                      <div className="flex gap-6 items-center mb-2 justify-between">
                        <h3 className="font-bold uppercase">{clase.titulo}</h3>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(true)
                              setPased(clase)
                            }}
                            className="text-green-600 underline"
                          >
                            Editar titulo
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              eliminarBloque(claseIndex)
                            }}
                            className="text-red-500 underline"
                          >
                            Eliminar Bloque
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenAddItem(true)
                              setNewItemToBloque(claseIndex)
                            }}
                            className="text-white underline text-xl"
                          >
                            <IoAddCircle />
                          </button>
                        </div>
                      </div>
                      <ul className="mb-5 pl-5">
                        {clase.contenido.map((elemento, itemIndex: number) => (
                          <li
                            key={itemIndex}
                            className="flex items-center gap-6 mb-1"
                          >
                            -
                            {clase.tipos && (
                              <span className="ml-2 text-gray-500">
                                {clase.tipos[itemIndex]}
                              </span>
                            )}
                            {elemento}
                            <span className="ml-2 text-gray-500">
                              {clase.tiemposClase?.[itemIndex]}
                            </span>
                            {clase.tipos?.[itemIndex] == 'Clase'
                              ? (
                              <span className="ml-2 text-gray-500">
                                {clase.linkClases?.[itemIndex]}
                              </span>
                                )
                              : clase.tipos?.[itemIndex] == 'Tarea'
                                ? (
                              <span
                                className="ml-2 text-white hover:text-gray-400 transition-colors cursor-pointer"
                                onClick={() => {
                                  setContenidoseleccionado(
                                    clase.linkClases?.[itemIndex]
                                  )
                                  setOpenContenido(true)
                                }}
                              >
                                VER CONTENIDO
                              </span>
                                  )
                                : null}
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  moverItemArriba(claseIndex, itemIndex)
                                }}
                              >
                                <FaChevronUp className=" text-gray-400 text-xl" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  moverItemAbajo(claseIndex, itemIndex)
                                }}
                              >
                                <FaChevronUp className=" text-gray-400 text-xl rotate-180" />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenItem(true)
                                  abrirModalEdicionItem(
                                    clase,
                                    claseIndex,
                                    itemIndex
                                  )
                                }}
                              >
                                <BsPencilSquare className=" text-green-600 text-xl" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  eliminarItemDeClase(claseIndex, itemIndex)
                                }}
                              >
                                <BsFillTrash2Fill className=" text-red-500 text-xl" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full lg:w-full mb-10 flex gap-5">
            <div className='relative w-1/2'>
              <TitleBriefs titulo="Nombre clase grautita" />
              <InputsBriefs
                name="nombreintroduccion"
                type="text"
                value={values.nombreintroduccion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.nombreintroduccion}
                touched={touched.nombreintroduccion}
              />
            </div>
            <div className='relative w-1/2 '>
              <TitleBriefs titulo="Enlace de de youtube para clase" />
              <InputsBriefs
                name="videointroduccion"
                type="text"
                value={values.videointroduccion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.videointroduccion}
                touched={touched.videointroduccion}
              />
            </div>
            <div className='relative w-1/2 '>
              <TitleBriefs titulo="Tiempo de video" />
              <InputsBriefs
                name="tiempointroduccion"
                type="text"
                value={values.tiempointroduccion}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors
                errors={errors.tiempointroduccion}
                touched={touched.tiempointroduccion}
              />
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end pt-6">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/productos"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Editar"
            />
          </div>
        </form>
          )}
      <EditarBloque
        open={open}
        setOpen={setOpen}
        pased={pased}
        setClases={setClases}
        clases={clases}
      />
      <EditarItem
        open={openItem}
        setOpen={setOpenItem}
        pased={itemSeleccionado}
        setClases={setClases}
        clases={clases}
        examenes={examenes}
      />
      <AgregarNewItems
        open={openAddItem}
        setOpen={setOpenAddItem}
        newItemToBloque={newItemToBloque}
        setClases={setClases}
        clases={clases}
        examenes={examenes}
      />
      <MostrarContenido
        open={openContenido}
        setOpen={setOpenContenido}
        contenido={contenidoseleccionado}
      />
    </>
  )
}
