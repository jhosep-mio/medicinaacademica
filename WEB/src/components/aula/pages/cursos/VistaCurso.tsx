import { BsArrowLeftShort, BsClock, BsPlay, BsYoutube } from 'react-icons/bs'
import {
  IoFilter,
  IoChatbubbleEllipsesOutline,
  IoImageOutline,
  IoInformationCircleOutline,
  IoPlayCircleOutline,
  IoPlaySharp,
  IoStarSharp
} from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Rating from '@mui/material/Rating'
import { defaultperfil } from '../../../shared/images'
import { Header } from '../../../public/estructura/Header'
import { FooterTwo } from '../../../public/estructura/FooterTwo'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import {
  type profesorValues,
  type productosValues,
  type apuntesValues,
  type comentariosValues
} from '../../../shared/Interfaces'
import { Fragment, useEffect, useState } from 'react'
import { Skeleton, Stack } from '@mui/material'
import { ModalVideo } from './modal/ModalVideo'
import { formatearURL } from '../../../shared/funtions/functions'
import { PiCertificateFill, PiCertificateLight, PiGraduationCapLight } from 'react-icons/pi'
import { MdOutlineAudiotrack } from 'react-icons/md'
import useAuth from '../../../../hooks/useAuth'
import { TbLock } from 'react-icons/tb'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {
  RiArrowRightSLine,
  RiBookmark2Line,
  RiFolderZipLine
} from 'react-icons/ri'
import { ModalComentario } from './modal/ModalComentario'
import { ListaComentarios } from './modal/ListaComentarios'
import Swal from 'sweetalert2'
import { ListaToValoracion } from './modal/ListaToValoracion'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))

export const VistaCurso = (): JSX.Element => {
  const { id } = useParams()
  const tokenUser = localStorage.getItem('tokenUser')
  const [curso, setCurso] = useState<productosValues | null>(null)
  const { auth } = useAuth()
  const [valido, setValido] = useState(false)
  const [primerclase, setPrimeraClase] = useState('')
  const [codClase, setCodclase] = useState<string | null>(null)
  const [openComentario, setOpenComentario] = useState(false)
  const [ultimaClase, setUltimaClase] = useState('')
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const [profesor, setProfesor] = useState<profesorValues>({
    id: 0,
    nombre: '',
    imagen1: '',
    caracteristicas: '',
    especialidad: ''
  })
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | false>('panel0')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [avance, setAvance] = useState('0')
  const [media, setMedia] = useState(0)
  const [estado, setEstado] = useState(0)
  const [contenidos, setContenidos2] = useState<string[]>([])
  const getOneData = async (): Promise<void> => {
    // TRAER CURSO
    const request = await axios.get(`${Global.url}/showCurso/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setComentarios(request.data[0].comentariosfinales ? JSON.parse(request.data[0].comentariosfinales) : [])

    const responseData: productosValues = request.data[0]
    setCurso(responseData)
    const contenidos = JSON.parse(responseData.contenido)
    setContenidos2(JSON.parse(responseData.contenido))
    // TRAER PROGRESO
    const requestprogreso = await axios.get(
      `${Global.url}/getApuntes/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    if (contenidos) {
      setCodclase(contenidos[0].codClases[0])
      setPrimeraClase(contenidos[0].contenido[0])
      if (requestprogreso.data[0].progreso) {
        const progresoCurso = JSON.parse(requestprogreso.data[0].progreso)[
          id ?? ''
        ]
        if (progresoCurso) {
          const clasesConProgreso = contenidos.map((clase: any) =>
            clase.codClases.filter((claseId: any) => progresoCurso[claseId])
          )
          const todasLasClases = [].concat(...clasesConProgreso)
          const totalprogreso = todasLasClases.length
          const ultimoResultado = clasesConProgreso[totalprogreso - 1]
          setUltimaClase(ultimoResultado)
          const todosLosIDs = contenidos.flatMap((item: any) => item.codClases || [])
          const porcentajeAvance =
          (totalprogreso / todosLosIDs.length) * 100
          setAvance(porcentajeAvance.toFixed(0))
        }
      }
    }
    // TRAER PROFESOR
    const request2 = await axios.get(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${Global.url}/oneProfesor2/${request.data[0].id_profesor}`
    )
    setProfesor(request2.data[0])
  }
  const [apuntes, setApuntes] = useState<apuntesValues[]>([])

  const getcursos = async (): Promise<void> => {
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
    const numericId = id?.split('-')[0]
    const isIdPresent = request.data.some((curso: any) =>
      JSON.parse(curso.array_productos).some((pro: any) => pro.id == numericId)
    )
    setValido(isIdPresent)
  }

  const getApuntes = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getArchivoss`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setApuntes(request.data)
  }

  useEffect(() => {
    if (comentarios.length > 0) {
      const sumaClases = comentarios.reduce((acumulador, comentario) => {
        // Verifica si el valor de clase es un número antes de sumarlo
        const valorClase = Number(comentario.clase)

        if (!isNaN(valorClase)) {
          return acumulador + valorClase
        } else {
          console.warn(`Valor de clase no válido en el comentario con ID ${comentario.id}. Se omitirá en el cálculo.`)
          return acumulador
        }
      }, 0)
      const mediaClase = comentarios.length > 0 ? sumaClases / comentarios.length : 0
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setMedia((mediaClase).toFixed(1))
    }
  }, [comentarios])

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([getcursos(), getApuntes(), getOneData()]).then(() => {
      setLoading(false)
    })
  }, [auth.id])

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      event.preventDefault()
      setExpanded(newExpanded ? panel : false)
    }

  const dejarComentario = (): void => {
    // Verificar si el usuario ya dejó un comentario
    const usuarioYaComento = comentarios.some((comentario) => comentario.idUser == auth.id)
    if (usuarioYaComento) {
      // Mostrar alerta con SweetAlert2
      Swal.fire({
        icon: 'warning',
        title: 'Ya has dejado un comentario',
        text: 'Solo puedes dejar un comentario por curso.',
        confirmButtonText: 'Aceptar'
      })
    } else {
      // Permitir al usuario dejar un nuevo comentario
      setOpenComentario(true)
    }
  }

  return (
    <>
      <Header />
      <section className="bg-primary py-10 lg:py-20 px-6 lg:px-24 font_baloo min-h-screen">
        {valido
          ? <>
            <div className="w-full flex flex-col lg:flex-row gap-10 max-w-[1450px] lg:px-20 mx-auto">
              <div className="w-full flex flex-col gap-12">
                <Link
                  to="/mis_cursos"
                  className="flex gap-0 items-center w-full"
                >
                  <BsArrowLeftShort className="text-4xl text-secondary-200" />
                  <span className="w-full text-secondary-200 text-xl mt-1 font-bold">
                    REGRESAR A MIS CURSOS
                  </span>
                </Link>
                <div className="flex flex-col gap-3">
                  {!loading
                    ? (
                    <h1 className="text-white font-semibold text-5xl">
                      {curso?.nombre}
                    </h1>
                      )
                    : (
                    <Stack spacing={1} className="w-full h-[60px]">
                      <Skeleton
                        animation="wave"
                        variant="text"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                      )}
                  <span className="text-gray-300 text-[1.8rem] font-medium">
                    {!loading
                      ? (
                      <em>Por {profesor.nombre}</em>
                        )
                      : (
                      <Stack spacing={1} className="w-[300px] h-[23px]">
                        <Skeleton
                          animation="wave"
                          variant="text"
                          className="w-full h-full object-cover"
                        />
                      </Stack>
                        )}
                  </span>
                </div>
                <div className="flex gap-2 items-center text-gray-300">
                  <BsPlay className="text-5xl text-white" />
                  <span className="w-full mt-1 text-[2rem]">
                    M1 - Clase 1: {primerclase}
                  </span>
                </div>
                <button
                  className="bg-secondary-50 text-white w-fit px-12 py-4 text-[2rem] rounded-xl"
                  onClick={() => {
                    navigate(
                      `/mis_cursos/curso/clase/${
                        curso?.id ?? ''
                      }-${formatearURL(curso?.nombre ?? '')}/tema/${
                        codClase ?? ''
                      }`
                    )
                  }}
                >
                  !Empezar curso!
                </button>
              </div>
              <div className="w-full">
                <div className="w-full lg:w-[80%] mx-auto relative rounded-lg overflow-hidden">
                  <span className="absolute w-full h-10 block bottom-0 left-0 right-0 blur-md bg-primary/60 shadow-xl shadow-black "></span>
                  <div className="w-full absolute inset-0 h-full z-10">
                    <span
                      className="bg-black/50 rounded-full p-2 w-20 h-20 flex items-center justify-center absolute inset-0 m-auto cursor-pointer"
                      onClick={() => {
                        navigate(
                            `/mis_cursos/curso/clase/${
                              curso?.id ?? ''
                            }-${formatearURL(curso?.nombre ?? '')}/tema/${
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                ultimaClase || codClase
                            }`
                        )
                      }}
                    >
                      <IoPlaySharp className="text-white text-[2rem]" />
                    </span>
                    <div className="w-full absolute left-0 right-0 bottom-0">
                      <p className="text-[2rem] text-white px-4 font-bold">
                        {avance}% completado
                      </p>
                      <div className="w-full h-3 bg-gray-400 block relative">
                        <span
                          className="bg-secondary-50 absolute inset-0 h-full "
                          style={{ width: `${Number(avance)}%` }}
                        ></span>
                      </div>
                    </div>
                  </div>
                  {!loading
                    ? (
                    <img
                      src={`${Global.urlImages}/productos/${
                        curso?.imagen1 ?? ''
                      }`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                      )
                    : (
                    <Stack spacing={1} className="w-full h-[328px]">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                      )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:flex w-full gap-4 max-w-[1450px] lg:px-20 mx-auto justify-start mt-32">
              <div
                onClick={() => {
                  setEstado(0)
                }}
                className={`flex py-3 gap-4 items-center ${
                  estado == 0
                    ? 'text-secondary-200 border-secondary-200'
                    : 'text-gray-300 border-transparent'
                } hover:text-secondary-200 hover:border-secondary-200 py-4 text-4xl border-b-4 rounded-sm px-8`}
              >
                <IoInformationCircleOutline />
                <Link to="" className="mt-1 hover:text-secondary-200">
                  Sobre el curso
                </Link>
              </div>
              <div
                onClick={() => {
                  setEstado(1)
                }}
                className={`flex py-3 gap-4 items-center ${
                  estado == 1
                    ? 'text-secondary-200 border-secondary-200'
                    : 'text-gray-300 border-transparent'
                } hover:text-secondary-200 hover:border-secondary-200 py-4 text-4xl border-b-4 rounded-sm px-8`}
              >
                <IoPlayCircleOutline />
                <Link to="" className="mt-1 hover:text-secondary-200">
                  Clases y adjuntos
                </Link>
              </div>
              <div
                onClick={() => {
                  setEstado(2)
                }}
                className={`flex py-3 gap-4 items-center ${
                  estado == 2
                    ? 'text-secondary-200 border-secondary-200'
                    : 'text-gray-300 border-transparent'
                } hover:text-secondary-200 hover:border-secondary-200 py-4 text-4xl border-b-4 rounded-sm px-8`}
              >
                <IoChatbubbleEllipsesOutline />
                <Link to="" className="mt-1 hover:text-secondary-200">
                  Comentarios
                </Link>
              </div>
              <div
                onClick={() => {
                  setEstado(4)
                }}
                className={`flex py-3 gap-4 items-center ${
                  estado == 4
                    ? 'text-secondary-200 border-secondary-200'
                    : 'text-gray-300 border-transparent'
                } hover:text-secondary-200 hover:border-secondary-200 py-4 text-4xl border-b-4 rounded-sm px-8`}
              >
                <IoImageOutline />
                <Link to="" className="mt-1 hover:text-secondary-200">
                  Mis proyectos
                </Link>
              </div>
              <div
                onClick={() => {
                  navigate('/mis_constancias')
                }}
                className={'flex py-3 gap-4 items-center text-gray-300 hover:text-secondary-200 border-transparent hover:border-secondary-200 text-4xl border-b-4 rounded-sm px-8'}
              >
                <PiCertificateFill />
                <Link to="" className="mt-1 hover:text-secondary-200">
                  Mis constancias
                </Link>
              </div>
            </div>

            {estado == 0
              ? <div className="flex flex-col w-full gap-10 max-w-[1450px] lg:px-20 mx-auto justify-start mt-32">
                <h2 className="text-[2.5rem] text-white font-semibold">
                  Te damos la bienvenida al curso
                </h2>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="bg-secondary-150/30 rounded-md p-10">
                    <h2 className="text-secondary-150 text-[2.5rem] font-semibold">
                      Sobre este curso
                    </h2>
                    <div className="w-full flex justify-between items-center mt-20">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <IoFilter className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">Nivel</p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>{curso?.nivel}</span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <PiGraduationCapLight className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">
                          Total inscritos
                        </p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>{curso?.inscritos}</span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <BsClock className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">
                          Duración
                        </p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>{curso?.duracion}</span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold flex-1">
                        <PiCertificateLight className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">
                          Certificado
                        </p>
                      </div>
                      <div className="text-white text-3xl w-auto">
                        <span className="block w-full text-right">
                          {curso?.certificado}
                        </span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <MdOutlineAudiotrack className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">Audio</p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>Español</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-secondary-150/30 rounded-md p-12">
                    <h2 className="text-secondary-150 text-[2.5rem] font-semibold">
                      Acerca del profesor
                    </h2>
                    <div className="w-full flex justify-between items-center mt-20 gap-4">
                      <div className="w-32 h-32">
                        <img
                          src={
                            profesor.imagen1
                              ? `${Global.urlImages}/fotoperfil/${profesor.imagen1}`
                              : defaultperfil
                          }
                          alt=""
                          className="object-cover object-center rounded-full w-full h-full m-auto"
                        />
                      </div>
                      <div className="w-fit flex-1 gap-2 flex flex-col">
                        <h2 className="text-white text-[2rem] font-bold">
                          {profesor.nombre}
                        </h2>
                        <p className="text-gray-400 text-2xl">
                          {profesor.especialidad}
                        </p>
                        <span className="mt-2 text-secondary-50 text-2xl font-bold">
                          Profesor
                        </span>
                      </div>
                    </div>
                    <div className="mt-20 text-gray-300 text-2xl">
                      <div
                        className=""
                        dangerouslySetInnerHTML={{
                          __html: profesor.caracteristicas
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-secondary-150/30 rounded-md p-12 valoracion">
                    <h2 className="text-secondary-150 text-[2.5rem] font-semibold">
                      Valoración del curso
                    </h2>
                    <div className="w-full flex justify-center items-center mt-20 gap-6">
                      <div className="h-full flex items-center">
                        <span className="text-8xl text-white">{!loading ? media : 0}</span>
                      </div>
                      <div className="w-fit flex-1 gap-2 flex flex-col">
                        <Rating
                          name="read-only"
                          className="text-4xl"
                          value={!loading ? media : 0}
                          precision={0.5}
                          readOnly
                        />
                        <p className="text-gray-400 text-3xl">Media total</p>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-center mt-6">
                      <button className="border-secondary-50 border-2 px-8 py-4 mx-auto font-bold text-secondary-50 text-3xl"
                      onClick={() => { setEstado(2) }}
                      >
                        !Quiero valorar este curso!
                      </button>
                    </div>
                    <ListaToValoracion comentarios={comentarios}/>
                  </div>
                </section>
              </div>
              : estado == 1
                ? <div className="flex flex-col w-full gap-10 max-w-[1450px] lg:px-20 mx-auto justify-start mt-32">
                <h2 className="text-[2.5rem] text-white font-semibold">
                  Contenido del curso
                </h2>
                <div className="mui_vistacurso">
                  {contenidos.map((conte: any, index: number) => (
                    <Accordion
                      key={index}
                      expanded={expanded == `panel${index}`}
                      onChange={handleChange(`panel${index}`)}
                      className='mb-4'
                    >
                      <AccordionSummary
                        aria-controls={`panel${index}d-content`}
                        id={`panel${index}d-header`}
                      >
                        <Typography>{conte.titulo}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul className="itemsCurso">
                          {conte.contenido.map(
                            (i: string, itemIndex: number) => (
                              <li
                                key={itemIndex}
                                className="hover:bg-gray-200 transition-colors cursor-pointer p-2 rounded-xl "
                                onClick={() => {
                                  navigate(
                                    `/mis_cursos/curso/clase/${id ?? ''}/tema/${
                                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                      conte.codClases[itemIndex]
                                    }`
                                  )
                                }}
                              >
                                <div className="itemsCurso__name">
                                  <p>
                                    <BsYoutube />
                                    {i}
                                  </p>
                                </div>
                                <div className="itemsCurso__time">
                                  <span className="ml-2 text-gray-500">
                                    {conte.tiemposClase?.[itemIndex]}
                                  </span>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              </div>
                : estado == 3
                  ? <div className="flex flex-col w-full gap-10 max-w-[1450px] lg:px-20 mx-auto justify-start mt-32">

                        {apuntes
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                          .filter(apunte => apunte.archivos != null)
                          .map((apunte, index: number) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            const archivosParseados = JSON.parse(apunte.archivos)
                            const ultimoElemento = archivosParseados[archivosParseados.length - 1]
                            return (
                            <div
                                className="rounded-xl overflow-hidden shadow-md"
                                key={index}
                              >
                                <div className="bg-white rounded-3xl p-2 shadow-xl">
                                  <div className="flex flex-row items-center justify-between gap-8 mb-2 px-4 pt-4">
                                    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                                      <div className="w-12 h-12 relative flex items-center">
                                        <img
                                          src={defaultperfil}
                                          alt="Hombre"
                                          loading="lazy"
                                          className="rounded-full object-cover m-auto"
                                        />
                                      </div>
                                      <h5 className="text-neutral-500 ">
                                        {auth.name}
                                      </h5>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-2 text-neutral-600 w-full justify-end">
                                      <RiBookmark2Line />
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
                                    <button
                                      onClick={() => {
                                        navigate(
                                          `/mis_cursos/curso/clase/${
                                            curso?.id ?? ''
                                          }-${formatearURL(
                                            curso?.nombre ?? ''
                                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                          )}/tema/${ultimoElemento.clase}`
                                        )
                                      }}
                                      type="button"
                                      className="flex items-center text-[1.3rem] mt-1 p-2 text-black rounded-lg hover:bg-white transition-colors duration-300"
                                    >
                                      Ver proyecto <RiArrowRightSLine />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                    </div>
                  : estado == 4
                    ? <div className="w-full gap-10 max-w-[1450px] lg:px-20 mx-auto justify-start mt-32 grid grid-cols-1 lg:grid-cols-3 ">
                {contenidos.map((conten: any) =>
                  conten.codClases.map((cod: any) =>
                    apuntes.map((apunte, index: number) => {
                      const archivosFiltrados =
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        apunte.archivos &&
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        JSON.parse(apunte.archivos).filter(
                          (archivo: any) => archivo.clase === cod
                        )
                      if (archivosFiltrados && archivosFiltrados.length > 0) {
                        return (
                          <Fragment key={index}>
                            {archivosFiltrados
                              .filter((archivo: any) => archivo.user == auth.id)
                              .map((archivo: any, indexa: number) => {
                                const indiceCodClases =
                                  conten.codClases.findIndex(
                                    (clase: any) => clase == archivo.clase
                                  )
                                return (
                                  <div
                                    className="rounded-xl overflow-hidden shadow-md"
                                    key={indexa}
                                  >
                                    <div className="bg-white rounded-3xl p-2 shadow-xl">
                                      <div className="flex flex-row items-center gap-4 mb-6 p-4">
                                        <div className="bg-primary/20 flex items-center justify-center rounded-full w-20 h-20 min-w-[5rem]">
                                          <RiFolderZipLine className="text-3xl text-primary" />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-primary text-2xl">
                                            {conten.contenido[indiceCodClases]}
                                          </h3>
                                        </div>
                                      </div>
                                      <div className="flex flex-row items-center justify-between gap-8 mb-2 px-4">
                                        <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                                          <div className="w-12 h-12 relative flex items-center">
                                            <img
                                              src={defaultperfil}
                                              alt="Hombre"
                                              loading="lazy"
                                              className="rounded-full object-cover m-auto"
                                            />
                                          </div>
                                          <h5 className="text-neutral-500 ">
                                            {auth.name}
                                          </h5>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center gap-2 text-neutral-600 w-full justify-end">
                                          <RiBookmark2Line />
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
                                        <button
                                          onClick={() => {
                                            navigate(
                                              `/mis_cursos/curso/clase/${
                                                curso?.id ?? ''
                                              }-${formatearURL(
                                                curso?.nombre ?? ''
                                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                              )}/tema/${archivo.clase}`
                                            )
                                          }}
                                          type="button"
                                          className="flex items-center text-[1.3rem] mt-1 p-2 text-black rounded-lg hover:bg-white transition-colors duration-300"
                                        >
                                          Ver proyecto <RiArrowRightSLine />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                          </Fragment>
                        )
                      } else {
                        return null // No hay archivos para este código de clase
                      }
                    })
                  )
                )}
              </div>
                    : estado == 2
                      ? <div className="flex flex-col w-full gap-10 max-w-[1450px] lg:px-20 mx-auto justify-start mt-10">
                        <div className='w-full flex justify-end'>
                            <button
                            onClick={() => { dejarComentario() }}
                            className='bg-secondary-50 text-white font-bold w-fit px-6 py-4 rounded-xl text-2xl'>Dejar tu comentario</button>
                        </div>
                        <ListaComentarios comentarios={comentarios}/>
                        <ModalComentario setOpenComentario={setOpenComentario} openComentario={openComentario} setComentarios={setComentarios} getComentarios={getOneData} cursoId={id}/>
                        </div>
                      : null}
          </>

          : (
              !valido && (
            <>
              <div className="w-full flex gap-10 max-w-[1450px] px-20 mx-auto min-h-[298px]">
                <div className="w-full flex flex-col gap-12">
                  <Link
                    to="/mis_cursos"
                    className="flex gap-0 items-center w-full"
                  >
                    <BsArrowLeftShort className="text-4xl text-secondary-200" />
                    <span className="w-full text-secondary-200 text-xl mt-1 font-bold">
                      REGRESAR A MIS CURSOS
                    </span>
                  </Link>
                  <div className="flex flex-col gap-3">
                    {!loading
                      ? (
                      <h1 className="text-white font-semibold text-5xl">
                        {curso?.nombre}
                      </h1>
                        )
                      : (
                      <Stack spacing={1} className="w-full h-[60px]">
                        <Skeleton
                          animation="wave"
                          variant="text"
                          className="w-full h-full object-cover"
                        />
                      </Stack>
                        )}
                    <span className="text-gray-300 text-[1.8rem] font-medium">
                      {!loading
                        ? (
                        <em>Por {profesor.nombre}</em>
                          )
                        : (
                        <Stack spacing={1} className="w-[300px] h-[23px]">
                          <Skeleton
                            animation="wave"
                            variant="text"
                            className="w-full h-full object-cover"
                          />
                        </Stack>
                          )}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center text-gray-300">
                    <BsPlay className="text-5xl text-white" />
                    {!loading
                      ? (
                      <span className="w-full mt-1 text-[2rem]">
                        M1 - Clase 1: {primerclase}
                      </span>
                        )
                      : (
                      <Stack spacing={1} className="w-[350px] h-[30px]">
                        <Skeleton
                          animation="wave"
                          variant="rectangular"
                          className="w-full h-full object-cover"
                        />
                      </Stack>
                        )}
                  </div>
                  {!loading
                    ? (
                    <button className="bg-secondary-50 text-white w-fit px-12 py-4 text-[2rem] rounded-xl">
                      Comprar curso
                    </button>
                      )
                    : (
                    <Stack spacing={1} className="w-[213px] h-[50px]">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                      )}
                </div>
                <div className="w-full">
                  {!loading
                    ? (
                    <div className="mx-auto w-[80%] relative rounded-lg overflow-hidden before:absolute before:inset-0 before:bg-black/80 before:w-full bofere:h-full">
                      <span className="absolute w-full h-10 block bottom-0 left-0 right-0 blur-md bg-primary/60 shadow-xl shadow-black "></span>
                      <div className="w-full absolute inset-0 h-full z-10 flex justify-center items-center flex-col">
                        <span className="rounded-full p-2 w-20 h-20 flex items-center justify-center ">
                          <TbLock className="text-white text-[4rem]" />
                        </span>
                        <span className="text-3xl uppercase">
                          Necesita comprar el curso
                        </span>
                      </div>
                      <img
                        src={`${Global.urlImages}/productos/${
                          curso?.imagen1 ?? ''
                        }`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                      )
                    : (
                    <Stack spacing={1} className="w-[80%] h-full mx-auto">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                      )}
                </div>
              </div>
              <div className="flex w-full gap-4 max-w-[1450px] px-20 mx-auto justify-start mt-32">
                {!loading
                  ? (
                  <>
                    <div className="flex gap-4 items-center text-secondary-200 text-4xl border-b-4 rounded-sm border-secondary-200 px-8">
                      <IoInformationCircleOutline />
                      <Link to="" className="mt-1 hover:text-secondary-200">
                        Sobre el curso
                      </Link>
                    </div>
                    <div className="flex py-3 gap-4 items-center text-gray-300 text-4xl border-b-4 border-transparent transition-colors cursor-pointer hover:text-secondary-200 hover:border-secondary-200 rounded-sm px-8">
                      <IoChatbubbleEllipsesOutline />
                      <Link to="" className="mt-1 hover:text-secondary-200">
                        Comentarios
                      </Link>
                    </div>
                  </>
                    )
                  : (
                  <>
                    <Stack spacing={1} className="w-full h-[47px]">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                    <Stack spacing={1} className="w-full h-[47px]">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                    <Stack spacing={1} className="w-full h-[47px]">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                    <Stack spacing={1} className="w-full h-[47px]">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                  </>
                    )}
              </div>
              <div className="flex flex-col w-full gap-10 max-w-[1450px] px-20 mx-auto justify-start mt-32">
                <h2 className="text-[2.5rem] text-white font-semibold">
                  Te damos la bienvenida al curso
                </h2>
                <section className="grid grid-cols-3 gap-16">
                  <div className="bg-secondary-150/30 rounded-md p-10">
                    <h2 className="text-secondary-150 text-[2.5rem] font-semibold">
                      Sobre este curso
                    </h2>
                    <div className="w-full flex justify-between items-center mt-20">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <IoFilter className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">Nivel</p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>{curso?.nivel}</span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <PiGraduationCapLight className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">
                          Total inscritos
                        </p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>{curso?.inscritos}</span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <BsClock className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">
                          Duración
                        </p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>{curso?.duracion}</span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold flex-1">
                        <PiCertificateLight className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">
                          Certificado
                        </p>
                      </div>
                      <div className="text-white text-3xl w-auto">
                        <span className="block w-full text-right">
                          {curso?.certificado}
                        </span>
                      </div>
                    </div>
                    <hr className="my-8" />
                    <div className="w-full flex justify-between items-center mt-10">
                      <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                        <MdOutlineAudiotrack className="text-3xl" />
                        <p className="mt-1 hover:text-secondary-200">Audio</p>
                      </div>
                      <div className="text-white text-3xl">
                        <span>Español</span>
                      </div>
                    </div>
                    {/* <hr className="my-8" />
              <div className="w-full flex justify-between items-center mt-10">
                <div className="text-white text-3xl flex gap-4 items-center font-semibold">
                  <IoFilter className="text-3xl" />
                  <p className="mt-1 hover:text-secondary-200">Nivel</p>
                </div>
                <div className="text-white text-3xl">
                  <span>Intermedio</span>
                </div>
              </div> */}
                  </div>
                  <div className="bg-secondary-150/30 rounded-md p-12">
                    <h2 className="text-secondary-150 text-[2.5rem] font-semibold">
                      Acerca del profesor
                    </h2>
                    <div className="w-full flex justify-between items-center mt-20 gap-4">
                      <div className="w-32 h-32">
                        <img
                          src={
                            profesor.imagen1
                              ? `${Global.urlImages}/fotoperfil/${profesor.imagen1}`
                              : defaultperfil
                          }
                          alt=""
                          className="object-cover object-center rounded-full w-full h-full m-auto"
                        />
                      </div>
                      <div className="w-fit flex-1 gap-2 flex flex-col">
                        <h2 className="text-white text-[2rem] font-bold">
                          {profesor.nombre}
                        </h2>
                        <p className="text-gray-400 text-2xl">
                          {profesor.especialidad}
                        </p>
                        <span className="mt-2 text-secondary-50 text-2xl font-bold">
                          Profesor
                        </span>
                      </div>
                    </div>
                    <div className="mt-20 text-gray-300 text-2xl">
                      <div
                        className=""
                        dangerouslySetInnerHTML={{
                          __html: profesor.caracteristicas
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-secondary-150/30 rounded-md p-12 valoracion">
                    <h2 className="text-secondary-150 text-[2.5rem] font-semibold">
                      Valoración del curso
                    </h2>
                    <div className="w-full flex justify-center items-center mt-20 gap-6">
                      <div className="h-full flex items-center">
                        <span className="text-8xl text-white">4.9</span>
                      </div>
                      <div className="w-fit flex-1 gap-2 flex flex-col">
                        <Rating
                          name="read-only"
                          className="text-4xl"
                          value={!loading ? media : 0}
                          precision={0.5}
                          readOnly
                        />
                        <p className="text-gray-400 text-3xl">Media total</p>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-center mt-6">
                      <button className="border-secondary-50 border-2 px-8 py-4 mx-auto font-bold text-secondary-50 text-3xl">
                        !Quiero valorar este curso!
                      </button>
                    </div>
                    <div className="mt-10 text-gray-300">
                      <div className="w-full flex gap-3 justify-between items-center">
                        <div className="w-fit flex gap-3 items-center">
                          <p className="bg-green-700 text-white text-3xl rounded-full p-2 w-16 h-16 flex items-center justify-center ">
                            J
                          </p>
                          <span className="text-3xl">@jhmio2002</span>
                        </div>
                        <div className="flex gap-3 items-center">
                          <IoStarSharp className="text-4xl text-gray-400" />
                          <span className="mt-2 text-5xl">5</span>
                        </div>
                      </div>
                    </div>
                    <hr className="my-6" />
                    <div className="mt-10 text-gray-300">
                      <div className="w-full flex gap-3 justify-between items-center">
                        <div className="w-fit flex gap-3 items-center">
                          <p className="bg-green-700 text-white text-3xl rounded-full p-2 w-16 h-16 flex items-center justify-center ">
                            J
                          </p>
                          <span className="text-3xl">@jhmio2002</span>
                        </div>
                        <div className="flex gap-3 items-center">
                          <IoStarSharp className="text-4xl text-gray-400" />
                          <span className="mt-2 text-5xl">5</span>
                        </div>
                      </div>
                    </div>
                    <hr className="my-3" />
                    <div className="mt-10 text-gray-300">
                      <div className="w-full flex gap-3 justify-between items-center">
                        <div className="w-fit flex gap-3 items-center">
                          <p className="bg-green-700 text-white text-3xl rounded-full p-2 w-16 h-16 flex items-center justify-center ">
                            J
                          </p>
                          <span className="text-3xl">@jhmio2002</span>
                        </div>
                        <div className="flex gap-3 items-center">
                          <IoStarSharp className="text-4xl text-gray-400" />
                          <span className="mt-2 text-5xl">5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
              )
            )}
      </section>
      <FooterTwo />
      <ModalVideo open={open} setOpen={setOpen} />
    </>
  )
}
