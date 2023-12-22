import { HeaderTwo } from '../../../public/estructura/HeaderTwo'
import { Global } from '../../../../helper/Global'
import { useEffect, useState } from 'react'
import { YoutubeVideo } from './YoutubeVideo'
import axios from 'axios'
import {
  type profesorValues,
  type productosValues,
  type contenidosValues,
  type comentariosValues,
  type valuesSecciones,
  type apuntesValues
} from '../../../shared/Interfaces'
import { GiNextButton } from 'react-icons/gi'
import { FiEdit3 } from 'react-icons/fi'
import { Nav } from './navbar/Nav'
import { useNavigate, useParams } from 'react-router-dom'
import { CantidadClases } from './recurses/CantidadClases'
import { CrearComentario } from './recurses/CrearComentario'
import { ListaComentarios } from './recurses/ListaComentarios'
import { ResponderComentario } from './recurses/ResponderComentario'
import { ModalApuntes } from './recurses/ModalApuntes'
import { Secciones } from './recurses/Secciones'
import { Apuntes } from './recurses/Apuntes'
import useAuth from '../../../../hooks/useAuth'
import { convertFormattedTimeToSeconds } from '../../../shared/funtions/functions'
import { EnviarContenido } from './tareas/EnviarContenido'
import { Examen } from './examen/Examen'
import { TbListDetails } from 'react-icons/tb'
import Loading from '../../../shared/Loading'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'

export const Clase = (): JSX.Element => {
  const { cursoId, claseId } = useParams()
  const [, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingDescarga, setLoadingDescarga] = useState(false)
  const [open, setOpen] = useState(false)
  const [idComentario, setIdComentario] = useState<string | undefined>('')
  const [texto, setTexto] = useState<string | undefined>('')
  const [apuntes, setApuntes] = useState<apuntesValues[]>([])
  const [openApunte, setOpenApunte] = useState(false)
  const [openNav, setOpenNav] = useState(false)
  const [tiempo, setTiempo] = useState('')
  const [player, setPlayer] = useState<string | null>(null)
  const [curso, setCurso] = useState<productosValues>({
    id: 0,
    nombre: '',
    id_categoria: '',
    id_profesor: '',
    categoria: '',
    profesor: '',
    nivel: '',
    duracionFiltro: '',
    duracion: '',
    inscritos: '',
    resumen: '',
    certificado: '',
    caracteristicas: '',
    contenido: '',
    precio1: 0,
    precio2: 0,
    imagen1: '',
    enlaceVideo: '',
    imagen2: '',
    imagen3: '',
    pdf: '',
    created_at: null,
    updated_at: null
  })
  const [secciones, setSecciones] = useState<valuesSecciones[]>([])
  const [profesor, setProfesor] = useState<profesorValues>({
    id: 0,
    nombre: '',
    imagen1: '',
    especialidad: '',
    caracteristicas: ''
  })
  const [estado, setEstado] = useState(0)
  const [contenidos, setContenidos] = useState<contenidosValues[]>([])
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])

  const [progresoClases, setProgresoClases] = useState<
  Record<string, Record<string, boolean>>
  >({})

  const [archivos, setArchivos] = useState<comentariosValues[]>([])

  const tokenUser = localStorage.getItem('tokenUser')
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [tarea, setTarea] = useState(2)

  const getOneData = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/showClase/${cursoId ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    const responseData: productosValues = request.data[0]
    setCurso(responseData)
    const request2 = await axios.get(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${Global.url}/oneProfesor2/${request.data[0].id_profesor}`
    )
    setProfesor(request2.data[0])
    setContenidos(JSON.parse(request.data[0].contenido))
    if (request.data[0].recursos) {
      setSecciones(JSON.parse(request.data[0].recursos))
    } else {
      setSecciones([])
    }
    // TRAER PROGRESO
    const requestProgreso = await axios.get(
      `${Global.url}/getApuntes/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    setApuntes(JSON.parse(requestProgreso.data[0].apuntes))
    setProgresoClases(
      requestProgreso.data[0].progreso
        ? JSON.parse(requestProgreso.data[0].progreso)
        : {}
    )
    const data = new FormData()
    data.append('id_curso', request.data[0].id ?? '')
    data.append('id_estudiante', auth.id)
    const response = await axios.post(`${Global.url}/showCertificado`, data, {
      headers: {
        Authorization: `Bearer ${
            tokenUser !== null && tokenUser !== '' ? tokenUser : ''
          }`
      }
    })
    // Devolver true si hay resultados, false si no hay resultados
    const verificacion = (!!response.data)
    // DETERMINAR CERTIFICADO
    const todosLosIDs = request.data.flatMap((item: any) => {
      if (item.contenido) {
        const bloques = JSON.parse(item.contenido)
        return bloques.flatMap((bloque: any) => bloque.codClases || [])
      }
      return []
    })
    const contenidoArray = requestProgreso.data[0].progreso ? JSON.parse(requestProgreso.data[0].progreso)[cursoId ?? ''] : []
    if (contenidoArray) {
      const todosCompletados = todosLosIDs.every(
        (id: any) => contenidoArray[id] == true
      )
      if (todosCompletados && !verificacion) {
        GenerarCertificado(
          request.data[0].nombre,
          request.data[0].duracion,
          request.data[0].id,
          request2.data[0].firma,
          request2.data[0].nombre
        )
      }
    }
    // const todosCompletados = todosLosIDs.every(id => contenidoArray.includes(id))
  }

  const getComentarios = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getComentarios/${cursoId ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )

    const request2 = await axios.get(
      `${Global.url}/getArchivos/${cursoId ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    setComentarios(
      request.data[0].comentarios ? JSON.parse(request.data[0].comentarios) : []
    )

    setArchivos(
      request2.data[0].archivos ? JSON.parse(request2.data[0].archivos) : []
    )
    setLoading(false)
  }

  const handleTimeClick = (formattedTime: string): void => {
    const timeInSeconds = convertFormattedTimeToSeconds(formattedTime)
    if (player) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      player.seekTo(timeInSeconds)
    }
  }

  const getApuntes = async (): Promise<void> => {}

  const getValidacion = async (): Promise<boolean> => {
    const request = await axios.get(
      `${Global.url}/cursesToCompras2/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            tokenUser !== null && tokenUser !== '' ? `Bearer ${tokenUser}` : ''
          }`
        }
      }
    )
    const numericId = cursoId?.split('-')[0]
    const isIdPresent = request.data.some((curso: any) =>
      JSON.parse(curso.array_productos).some((pro: any) => pro.id == numericId)
    )

    return isIdPresent
  }

  const GenerarCertificado = async (
    nombrecurso: string,
    duracioncurso: string,
    idCurso: string | undefined,
    firma: string,
    nameprofe: string
  ): Promise<void> => {
    const data = new FormData()

    data.append('nombres', auth.name.toUpperCase())
    data.append('nombre_profesor', nameprofe.toUpperCase())
    data.append('identificador', uuidv4())
    data.append('curso', nombrecurso)
    data.append('horas', duracioncurso)
    data.append('id_curso', idCurso ?? '')
    data.append('id_estudiante', auth.id)
    data.append('fecha', obtenerFechaFormateada().toLowerCase())
    data.append('firma', firma)
    try {
      const response = await axios.post(
        `${Global.url}/generarCertificado`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              tokenUser !== null && tokenUser !== '' ? tokenUser : ''
            }`
          }
        }
      )
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
      if (pdfBlob) {
        Swal.fire('Felicidades,culminaste el curso con exito, puedes visualizar tu certificado obtenido en tu lista de certificados.', '', 'success')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerNombreMes = (mes: any): string => {
    const nombresMeses = [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SEPTIEMBRE',
      'OCTUBRE',
      'NOVIEMBRE',
      'DICIEMBRE'
    ]

    return nombresMeses[mes]
  }

  const obtenerFechaFormateada = (): string => {
    const fecha = new Date()
    const dia = fecha.getDate()
    const mes = obtenerNombreMes(fecha.getMonth())
    const año = fecha.getFullYear()

    const fechaFormateada = `${dia} / ${mes} / ${año}`

    return fechaFormateada
  }

  useEffect(() => {
    let mounted = true // Para controlar la actualización del estado después de las operaciones asíncronas
    const validarYCargarDatos = async (): Promise<void> => {
      try {
        // Primero, validar el acceso al curso
        const tieneAcceso = await getValidacion()
        if (!tieneAcceso) {
          // Si no tiene acceso, redirigir o manejar según corresponda
          navigate(`/mis_cursos/curso/${cursoId ?? ''}`)
          return
        }

        // Si tiene acceso, continuar con la carga de otros datos
        if (mounted) {
          await getOneData()
          await getComentarios()
        }
      } catch (error) {
        console.error('Error en la carga de datos: ', error)
        // Manejar errores según corresponda
      }
    }
    if (auth.id && mounted) {
      validarYCargarDatos()
    }
    return () => {
      mounted = false // Evitar actualizaciones del estado en un componente desmontado
    }
  }, [auth.id])

  useEffect(() => {
    const verificarSiEsTarea = (): void => {
      contenidos.forEach((bloque) => {
        bloque.contenido.forEach((_conte: any, index: number) => {
          if (bloque.codClases && bloque.codClases[index] == claseId) {
            setTarea(
              bloque.tipos[index] == 'Tarea'
                ? 1
                : bloque.tipos[index] == 'Examen'
                  ? 2
                  : 0
            )
          }
        })
      })
    }
    verificarSiEsTarea()
  }, [contenidos, claseId])

  const actualizarProgresoClase = (
    cursoId: string | undefined,
    claseId: string | undefined
  ): void => {
    setProgresoClases((prevProgreso) => {
      const nuevoProgreso = { ...prevProgreso }
      nuevoProgreso[cursoId ?? ''] = nuevoProgreso[cursoId ?? ''] || {}
      nuevoProgreso[cursoId ?? ''][claseId ?? ''] = true

      const actualizarProgreso = async (): Promise<void> => {
        const data = new FormData()
        data.append('progreso', JSON.stringify(nuevoProgreso))
        data.append('_method', 'PUT')
        try {
          const resultado = await axios.post(
            `${Global.url}/saveProgreso/${auth.id ?? ''}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${
                  tokenUser !== null && tokenUser !== '' ? tokenUser : ''
                }`
              }
            }
          )
          if (resultado.data.status == 'success') {
            getApuntes()
            getOneData()
          }
        } catch (error: unknown) {
          console.log(error)
        }
      }
      actualizarProgreso()
      return nuevoProgreso
    })
  }

  const handleVideoProgress = (
    percent: number,
    formattedTime: string
  ): void => {
    setProgress(percent)
    setTiempo(formattedTime)
    if (percent >= 80) {
      const yaCompletada = progresoClases[cursoId ?? '']?.[claseId ?? '']
      if (!yaCompletada) {
        actualizarProgresoClase(cursoId, claseId)
      }
    }
  }

  return (
    <>
      {loading && <Loading />}
      <HeaderTwo />
      <section className="bg-primary font_baloo fondo_screen2">
        {tarea == 0
          ? <section className="w-full h-full relative">
            <Nav
              curso={curso}
              contenidos={contenidos}
              cursoId={cursoId}
              claseId={claseId}
              setOpenApunte={setOpenApunte}
              openNav={openNav}
              setOpenNav={setOpenNav}
              progresoClases={progresoClases}
            />
            <div className="w-full h-full lg:pl-[32px] flex flex-col lg:flex-row">
              <div className="w-full lg:w-[75%] bg-primary h-full lg:overflow-y-scroll scroll_2 pb-10">
                  {contenidos.map((bloque) =>
                    bloque.contenido.map((_conte: any, index: number) => {
                      if (
                        bloque.codClases &&
                        Array.isArray(bloque.codClases) &&
                        bloque.codClases.length > index &&
                        bloque.codClases[index] == claseId
                      ) {
                        if (bloque.linkClases[index] == 'notiene') {
                          return null
                        } else {
                          return (
                            <div className="w-full h-[250px] lg:h-[80%]" key={bloque.codClases[index]}>
                              <YoutubeVideo
                                player={player}
                                setPlayer={setPlayer}
                                videoId={bloque.linkClases[index]}
                                onVideoProgress={handleVideoProgress}
                              />
                            </div>
                          )
                        }
                      } else {
                        return null
                      }
                    })
                  )}
                <div className="w-full px-10 py-8 lg:max-w-[80%] mx-auto relative">
                  <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex gap-3 items-center mb-6">
                      <img
                        src={`${Global.urlImages}/productos/${curso.imagen1}`}
                        alt=""
                        className="w-20 h-20 object-cover rounded-full"
                      />
                      <div>
                        <h2 className="text-gray-200 font-semibold text-2xl">
                          {curso.nombre}
                        </h2>
                        <span className="text-gray-400">
                          Por {profesor.nombre}
                        </span>
                      </div>
                    </div>
                    <div className="w-full lg:w-fit h-full flex gap-4">
                      <button
                        className="bg-secondary-50 text-black flex gap-3 items-center text-[1.7rem] px-4 py-2 rounded-xl hover: hover:bg-secondary-50/70 transition-colors"
                        onClick={() => {
                          setOpenApunte(true)
                        }}
                      >
                        <FiEdit3 />
                        Crear apuntes
                      </button>
                      {contenidos[0] && (
                        <div className="flex h-full items-center gap-4">
                          <button
                            className={`h-full flex items-center border px-6 p-4 rounded-xl rotate-180
                                ${
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    contenidos[0].codClases.findIndex(
                                    (contenido: any) =>
                                      contenido.includes(claseId ?? '')
                                  ) == 0
                                    ? 'border-gray-400 bg-gray-400 cursor-default opacity-60'
                                    : 'border-secondary-50 bg-transparent hover:bg-secondary-50 transition-colors '
                                }`}
                            onClick={() => {
                              const currentIndex =
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                contenidos[0].codClases.findIndex((contenido) =>
                                  contenido.includes(claseId ?? '')
                                )
                              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                              const prevIndex = currentIndex - 1
                              if (prevIndex >= 0) {
                                const prevClassId =
                                  contenidos[0].codClases[prevIndex]
                                navigate(
                                  `/mis_cursos/curso/clase/${
                                    cursoId ?? ''
                                  }/tema/${prevClassId ?? ''}`
                                )
                                setOpen(false)
                                setOpenApunte(false)
                              }
                            }}
                          >
                            <GiNextButton className="text-3xl" />
                          </button>
                          <button
                            className={`h-full flex items-center border  px-6 p-4 rounded-xl ${
                              progresoClases[cursoId ?? '']?.[claseId ?? '']
                                ? 'border-secondary-50 bg-transparent hover:bg-secondary-50 transition-colors'
                                : 'border-gray-400 bg-gray-400 cursor-default opacity-60'
                            }`}
                            onClick={() => {
                              if (
                                progresoClases[cursoId ?? '']?.[claseId ?? '']
                              ) {
                                const currentIndex =
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-expect-error
                                  contenidos[0].codClases.findIndex(
                                    (contenido: any) =>
                                      contenido.includes(claseId ?? '')
                                  )
                                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                                const nextIndex = currentIndex + 1
                                const lastLength =
                                  contenidos[0].codClases.length
                                if (nextIndex < lastLength) {
                                  const nextClassId =
                                    contenidos[0].codClases[nextIndex]
                                  navigate(
                                    `/mis_cursos/curso/clase/${
                                      cursoId ?? ''
                                    }/tema/${nextClassId ?? ''}`
                                  )
                                  setOpen(false)
                                  setOpenApunte(false)
                                }
                              }
                            }}
                          >
                            <GiNextButton className="text-3xl" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 lg:items-center mt-10 lg:mt-0 mb-10">
                    {!loading
                      ? (
                      <h1 className="text-[2.7rem] font-bold">
                        {contenidos.map((bloque) =>
                          bloque.contenido.map((conte: any, index: number) => {
                            if (
                              bloque.codClases &&
                              Array.isArray(bloque.codClases) &&
                              bloque.codClases.length > index &&
                              bloque.codClases[index] == claseId
                            ) {
                              return (
                                <div key={bloque.codClases[index]}>
                                  <p>{conte}</p>{' '}
                                </div>
                              )
                            } else {
                              return null
                            }
                          })
                        )}
                      </h1>
                        )
                      : null}
                    <CantidadClases contenidos={contenidos} claseId={claseId} />
                  </div>

                  <div className="flex w-full lg:w-[500px] gap-10 border-b border-secondary-10 h-fit">
                    <h3
                      className={`uppercase cursor-pointer ${
                        estado == 0
                          ? 'text-secondary-70 border-secondary-70 border-b-2'
                          : 'text-secondary-10 hover:text-secondary-70/60'
                      } transition-colors text-2xl w-full font-bold text-center py-2 `}
                      onClick={() => {
                        setEstado(0)
                      }}
                    >
                      Recursos
                    </h3>
                    <h3
                      className={`uppercase cursor-pointer ${
                        estado == 1
                          ? 'text-secondary-70 border-secondary-70 border-b-2'
                          : 'text-secondary-10 hover:text-secondary-70/60'
                      } transition-colors text-2xl w-full font-bold text-center py-2 `}
                      onClick={() => {
                        setEstado(1)
                      }}
                    >
                      Apuntes
                    </h3>
                  </div>
                  {estado == 0
                    ? (
                    <Secciones
                      secciones={secciones}
                      claseId={claseId}
                      tokenUser={tokenUser}
                      setLoadingDescarga={setLoadingDescarga}
                      loadingDescarga={loadingDescarga}
                    />
                      )
                    : (
                    <Apuntes
                      apuntes={apuntes}
                      claseId={claseId}
                      handleTimeClick={handleTimeClick}
                    />
                      )}

                  {openApunte && (
                    <ModalApuntes
                      setEstado={setEstado}
                      tiempo={tiempo}
                      setOpen={setOpenApunte}
                      setApuntes={setApuntes}
                      claseId={claseId}
                      cursoId={cursoId}
                      getApuntes={getApuntes}
                    />
                  )}
                </div>
              </div>
              <div className="w-full lg:w-[25%] bg-primary h-full p-6 flex flex-col overflow-y-scroll scroll_2">
                <CrearComentario
                  comentarios={comentarios}
                  setComentarios={setComentarios}
                  cursoId={cursoId}
                  claseId={claseId}
                  getComentarios={getComentarios}
                />
                <ResponderComentario
                  textoComentario={texto}
                  open={open}
                  setOpen={setOpen}
                  setIdComentario={setIdComentario}
                  idComentario={idComentario}
                  comentarios={comentarios}
                  setComentarios={setComentarios}
                  cursoId={cursoId}
                  claseId={claseId}
                  getComentarios={getComentarios}
                />
                <ListaComentarios
                  setComentarios={setComentarios}
                  comentarios={comentarios}
                  claseId={claseId}
                  setOpen={setOpen}
                  setIdComentario={setIdComentario}
                  setTexto={setTexto}
                  cursoId={cursoId}
                  getComentarios={getComentarios}
                />
              </div>
            </div>
          </section>
          : tarea == 1
            ? <section className="w-full h-full relative">
            <Nav
              curso={curso}
              contenidos={contenidos}
              cursoId={cursoId}
              claseId={claseId}
              setOpenApunte={setOpenApunte}
              openNav={openNav}
              setOpenNav={setOpenNav}
              progresoClases={progresoClases}
            />
            <div className="w-full h-full lg:pl-[32px] flex flex-col lg:flex-row">
              <div className="w-full lg:w-[75%] bg-primary h-full overflow-y-scroll scroll_2 pb-10">
                <div className="w-full px-10 py-8 lg:max-w-[80%] mx-auto relative">
                  <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex gap-3 items-center mb-6">
                      <img
                        src={`${Global.urlImages}/productos/${curso.imagen1}`}
                        alt=""
                        className="w-20 h-20 object-cover rounded-full"
                      />
                      <div>
                        <h2 className="text-gray-200 font-semibold text-2xl">
                          {curso.nombre}
                        </h2>
                        <span className="text-gray-400">
                          Por {profesor.nombre}
                        </span>
                      </div>
                    </div>
                    {contenidos[0] && (
                      <div className="flex h-full items-center gap-4">
                        <button
                          className={`h-full flex items-center border px-6 p-4 rounded-xl rotate-180
                            ${
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              contenidos[0].codClases.findIndex((contenido) =>
                                contenido.includes(claseId ?? '')
                              ) == 0
                                ? 'border-gray-400 bg-gray-400 cursor-default opacity-60'
                                : 'border-secondary-50 bg-transparent hover:bg-secondary-50 transition-colors '
                            }`}
                          onClick={() => {
                            const currentIndex =
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              contenidos[0].codClases.findIndex((contenido) =>
                                contenido.includes(claseId ?? '')
                              )
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            const prevIndex = currentIndex - 1
                            if (prevIndex >= 0) {
                              const prevClassId =
                                contenidos[0].codClases[prevIndex]
                              navigate(
                                `/mis_cursos/curso/clase/${
                                  cursoId ?? ''
                                }/tema/${prevClassId ?? ''}`
                              )
                              setOpen(false)
                              setOpenApunte(false)
                            }
                          }}
                        >
                          <GiNextButton className="text-3xl" />
                        </button>
                        <button
                          className={`h-full flex items-center border  px-6 p-4 rounded-xl ${
                            progresoClases[cursoId ?? '']?.[claseId ?? '']
                              ? 'border-secondary-50 bg-transparent hover:bg-secondary-50 transition-colors'
                              : 'border-gray-400 bg-gray-400 cursor-default opacity-60'
                          }`}
                          onClick={() => {
                            if (
                              progresoClases[cursoId ?? '']?.[claseId ?? '']
                            ) {
                              const currentIndex =
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                contenidos[0].codClases.findIndex((contenido) =>
                                  contenido.includes(claseId ?? '')
                                )
                              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                              const nextIndex = currentIndex + 1
                              const lastLength = contenidos[0].codClases.length
                              if (nextIndex < lastLength) {
                                const nextClassId =
                                  contenidos[0].codClases[nextIndex]
                                navigate(
                                  `/mis_cursos/curso/clase/${
                                    cursoId ?? ''
                                  }/tema/${nextClassId ?? ''}`
                                )
                                setOpen(false)
                                setOpenApunte(false)
                              }
                            }
                          }}
                        >
                          <GiNextButton className="text-3xl" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col lg:flew-row gap-4 lg:gap-10  mt-10 mb-10">
                    {!loading
                      ? (
                      <h1 className="text-[2.7rem] font-bold">
                        {contenidos.map((bloque) =>
                          bloque.contenido.map((conte: any, index: number) => {
                            if (
                              bloque.codClases &&
                              Array.isArray(bloque.codClases) &&
                              bloque.codClases.length > index &&
                              bloque.codClases[index] == claseId
                            ) {
                              return (
                                <div key={bloque.codClases[index]}>
                                  <p>{conte}</p>{' '}
                                </div>
                              )
                            } else {
                              return null
                            }
                          })
                        )}
                      </h1>
                        )
                      : null}
                    <CantidadClases contenidos={contenidos} claseId={claseId} />
                  </div>

                  <div className="flex flex-col lg:flex-row lg:justify-between w-full">
                    <div className="flex w-full lg:w-[500px] gap-10 border-b border-secondary-10 h-fit mb-10">
                      <h3
                        className={`uppercase cursor-pointer ${
                          estado == 0
                            ? 'text-secondary-70 border-secondary-70 border-b-2'
                            : 'text-secondary-10 hover:text-secondary-70/60'
                        } transition-colors text-2xl w-full font-bold text-center py-2 `}
                        onClick={() => {
                          setEstado(0)
                        }}
                      >
                        Tarea
                      </h3>
                      <h3
                        className={`uppercase cursor-pointer ${
                          estado == 1
                            ? 'text-secondary-70 border-secondary-70 border-b-2'
                            : 'text-secondary-10 hover:text-secondary-70/60'
                        } transition-colors text-2xl w-full font-bold text-center py-2 `}
                        onClick={() => {
                          setEstado(1)
                        }}
                      >
                        Recursos
                      </h3>
                    </div>
                    <div>
                      <h3
                        className={
                          'uppercase cursor-pointer text-secondary-10 transition-colors text-2xl w-full font-bold text-center py-2 flex items-center gap-3'
                        }
                      >
                        Tiempo estimado:{' '}
                        <span className="text-secondary-70 text-3xl -mt-1">
                          {contenidos.map((bloque) =>
                            bloque.contenido.map(
                              (_conte: any, index: number) => {
                                if (
                                  bloque.codClases &&
                                  Array.isArray(bloque.codClases) &&
                                  bloque.codClases.length > index &&
                                  bloque.codClases[index] == claseId
                                ) {
                                  return bloque.tiemposClase[index]
                                } else {
                                  return null
                                }
                              }
                            )
                          )}
                        </span>
                      </h3>
                    </div>
                  </div>
                  {estado == 0
                    ? (
                    <div className="w-full mt-20 lg:mt-0 ">
                      {contenidos.map((bloque) =>
                        bloque.contenido.map((_conte: any, index: number) => {
                          if (
                            bloque.codClases &&
                            Array.isArray(bloque.codClases) &&
                            bloque.codClases.length > index &&
                            bloque.codClases[index] == claseId
                          ) {
                            return (
                              <div
                                style={{
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word'
                                }}
                                key={bloque.codClases[index]}
                                dangerouslySetInnerHTML={{
                                  __html: bloque.linkClases[index]
                                }}
                                className="w-full text-2xl limpiar_estilos"
                              />
                            )
                          } else {
                            return null
                          }
                        })
                      )}
                    </div>
                      )
                    : (
                    <Secciones
                      secciones={secciones}
                      claseId={claseId}
                      tokenUser={tokenUser}
                      setLoadingDescarga={setLoadingDescarga}
                      loadingDescarga={loadingDescarga}
                    />
                      )}
                </div>
              </div>
              <div className="w-full lg:w-[25%] bg-primary h-full p-6 flex flex-col overflow-y-scroll scroll_2">
                <EnviarContenido
                  comentarios={comentarios}
                  setComentarios={setComentarios}
                  cursoId={cursoId}
                  claseId={claseId}
                  getComentarios={getComentarios}
                  setArchivos={setArchivos}
                  archivos={archivos}
                  setProgresoClases={setProgresoClases}
                  getApuntes={getApuntes}
                />
              </div>
            </div>
          </section>
            : tarea == 2
              ? <section className="w-full h-full relative min-h-screen lg:min-h-full">
            <Nav
              curso={curso}
              contenidos={contenidos}
              cursoId={cursoId}
              claseId={claseId}
              setOpenApunte={setOpenApunte}
              openNav={openNav}
              setOpenNav={setOpenNav}
              progresoClases={progresoClases}
            />
            <div className="w-full h-full lg:pl-[32px] flex">
              <div className="w-full bg-primary h-full overflow-y-scroll scroll_2 pb-10">
                <div className="w-full px-10 py-8 lg:max-w-[80%] mx-auto relative">
                  <div className="flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex gap-3 items-center mb-6">
                      <img
                        src={`${Global.urlImages}/productos/${curso.imagen1}`}
                        alt=""
                        className="w-20 h-20 object-cover rounded-full"
                      />
                      <div>
                        <h2 className="text-gray-200 font-semibold text-2xl">
                          {curso.nombre}
                        </h2>
                        <span className="text-gray-400">
                          Por {profesor.nombre}
                        </span>
                      </div>
                    </div>
                    {contenidos[0] && (
                      <div className="flex h-full items-center gap-4">
                        <button
                          className={`h-full flex items-center border px-6 p-4 rounded-xl rotate-180
                                ${
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-expect-error
                                  contenidos[0].codClases.findIndex(
                                    (contenido: any) =>
                                      contenido.includes(claseId ?? '')
                                  ) == 0
                                    ? 'border-gray-400 bg-gray-400 cursor-default opacity-60'
                                    : 'border-secondary-50 bg-transparent hover:bg-secondary-50 transition-colors '
                                }`}
                          onClick={() => {
                            const currentIndex =
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              contenidos[0].codClases.findIndex((contenido) =>
                                contenido.includes(claseId ?? '')
                              )
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            const prevIndex = currentIndex - 1
                            if (prevIndex >= 0) {
                              const prevClassId =
                                contenidos[0].codClases[prevIndex]
                              navigate(
                                `/mis_cursos/curso/clase/${
                                  cursoId ?? ''
                                }/tema/${prevClassId ?? ''}`
                              )
                              setOpen(false)
                              setOpenApunte(false)
                            }
                          }}
                        >
                          <GiNextButton className="text-3xl" />
                        </button>
                        <button
                          className={`h-full flex items-center border  px-6 p-4 rounded-xl ${
                            progresoClases[cursoId ?? '']?.[claseId ?? '']
                              ? 'border-secondary-50 bg-transparent hover:bg-secondary-50 transition-colors'
                              : 'border-gray-400 bg-gray-400 cursor-default opacity-60'
                          }`}
                          onClick={() => {
                            if (
                              progresoClases[cursoId ?? '']?.[claseId ?? '']
                            ) {
                              const currentIndex =
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                contenidos[0].codClases.findIndex((contenido) =>
                                  contenido.includes(claseId ?? '')
                                )
                              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                              const nextIndex = currentIndex + 1
                              const lastLength = contenidos[0].codClases.length
                              if (nextIndex < lastLength) {
                                const nextClassId =
                                  contenidos[0].codClases[nextIndex]
                                navigate(
                                  `/mis_cursos/curso/clase/${
                                    cursoId ?? ''
                                  }/tema/${nextClassId ?? ''}`
                                )
                                setOpen(false)
                                setOpenApunte(false)
                              }
                            }
                          }}
                        >
                          <GiNextButton className="text-3xl" />
                        </button>
                      </div>
                    )}
                  </div>
                  <Examen
                    contenido={contenidos}
                    claseId={claseId}
                    setProgresoClases={setProgresoClases}
                    progresoClases={progresoClases}
                    cursoId={cursoId}
                    getApuntes={getApuntes}
                  />
                </div>
              </div>
            </div>
          </section>
              : null}
      </section>
      <button
        id=""
        className="fixed right-6 bottom-6 rounded-full bg-white w-16 h-16 z-20 md:hidden flex items-center justify-center"
        onClick={() => {
          setOpenNav(!openNav)
        }}
      >
        <TbListDetails className="text-primary text-[2.4rem] " />
      </button>
    </>
  )
}
