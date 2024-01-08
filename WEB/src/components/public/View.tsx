import React, { useEffect, useState } from 'react'
import {
  BsChatText,
  BsClock,
  BsFillHouseDoorFill,
  BsYoutube
} from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { CgLoadbarSound } from 'react-icons/cg'
import {
  PiGraduationCapLight,
  PiCertificateLight,
  PiLockOpenThin
} from 'react-icons/pi'
import { Autoplay } from 'swiper'
import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'

import { CiLock } from 'react-icons/ci'
import {
  type comentariosValues,
  type productosValues,
  type profesorValues,
  type testimoniosValues
} from '../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../helper/Global'
import Loading from '../shared/Loading'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/grid'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { ModalPago } from '../shared/modals/ModalPago'
import { ModalVideoYOu } from '../shared/modals/ModalVideoYOu'
import { defaultperfil } from '../shared/images'
import { ModalVideoYOu2 } from '../shared/modals/ModalVideoYOu2'

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

const View = (): JSX.Element => {
  const [expanded, setExpanded] = React.useState<string | false>('panel1')

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      event.preventDefault()
      setExpanded(newExpanded ? panel : false)
    }

  const { id } = useParams()
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [producto, setProducto] = useState<productosValues | null>(null)
  const [materiales, setMateriales] = useState<string[]>([])
  const [requisitos, setRequisitos] = useState<string[]>([])
  const [openVideo, setOpenVideo] = useState(false)
  const [publicos, setPublico] = useState<string[]>([])
  const [, setPrecio] = useState('')
  const [media, setMedia] = useState(0)
  const [aprenderas, setAprenderas] = useState<string[]>([])
  const [contenidos, setContenidos] = useState<string[]>([])
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    dolar: ''
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const getOneData = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneProducto/${id ?? ''}`)
    const responseData: productosValues = request.data[0] // Replace "YourResponseType" with the actual type of the response data
    setProducto(responseData)
    if (request.data[0].comentariosfinales) {
      setComentarios(request.data[0].comentariosfinales ? JSON.parse(request.data[0].comentariosfinales) : []
      )
    }

    if (responseData.id_categoria) {
      setMateriales(JSON.parse(request.data[0].materiales))
      setAprenderas(JSON.parse(request.data[0].aprenderas))
      setRequisitos(JSON.parse(request.data[0].requisitos))
      setPublico(JSON.parse(request.data[0].publico))
      setContenidos(JSON.parse(request.data[0].contenido))
      setPrecio(request.data[0].precio1)
      const request2 = await axios.get(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${Global.url}/oneProfesor2/${request.data[0].id_profesor}`
      )
      setProfesor(request2.data[0])
    }

    if (request.data[0].comentariosfinales && JSON.parse(request.data[0].comentariosfinales).length > 0) {
      const comentarios: comentariosValues[] = JSON.parse(request.data[0].comentariosfinales)
      const sumaClases = comentarios.reduce((acumulador, comentario) => {
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
    setLoadingComponents(false)
  }

  const [testimonios, setTestimonios] = useState([])

  const getTestimonios = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/testimoniosFrom2/${id ?? ''}`
    )
    setTestimonios(request.data)
  }

  const [profesor, setProfesor] = useState<profesorValues | null>(null)

  const formatearFecha = (fechaString: string | null): string => {
    if (!fechaString) {
      return ''
    }
    const fecha = new Date(fechaString)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const año = fecha.getFullYear()
    return `${dia}-${mes}-${año}`
  }

  const getData2 = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/oneConfi/1`)
      setData(request.data)
    } catch (error) {}
  }

  const descargarArchivo = async (nombre: string): Promise<void> => {
    try {
      const response = await axios.get(
        `${Global.url}/descargarTemario/${nombre ?? ''}`,
        { responseType: 'arraybuffer' }
      )

      const contentType = response.headers['content-type']
      const blob = new Blob([response.data], { type: contentType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', nombre)

      link.addEventListener('load', () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
      })
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error('Error al descargar el archivo:', error)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getTestimonios()
    getData2()
    getOneData()
  }, [])

  //   useEffect(() => {
  //     const iframeContainer = document.getElementById('iframeContainer')
  //     const handleContainerClick = (): void => {
  //       openModal()
  //     }
  //     iframeContainer.addEventListener('click', handleContainerClick)
  //     return () => {
  //       iframeContainer.removeEventListener('click', handleContainerClick)
  //     }
  //   }, [])

  return (
    <>
      {loadingComponents && <Loading />}
      {producto != null && profesor != null && (
        <>
          <section className="sl_curso">
            <div className="breadcrumbs">
              <ul>
                <li>
                  <BsFillHouseDoorFill />
                  <Link to="/">Home</Link>
                </li>
                <li>Cursos</li>
                <li>{producto.categoria}</li>
              </ul>
            </div>

            <div className="sl_curso__content">
              <div className="sl_curso__content__info">
                <h1>{producto.nombre}</h1>
                <p className="descripcion">
                  <div
                    className=""
                    dangerouslySetInnerHTML={{ __html: producto.resumen }}
                  ></div>
                </p>
                <Rating
                    name="read-only"
                    className="text-4xl"
                    value={!loadingComponents ? media : 0}
                    precision={0.5}
                    readOnly
                />
                <p className="create">
                  Creado por: <a href="#profesor">{producto.profesor}</a>
                </p>
                <p className="fecha">
                  Fecha de última actualización:{' '}
                  {formatearFecha(producto.updated_at)}
                </p>
                {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                producto.temario &&
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    <a href="#" className="temario" onClick={
                        async () => {
                          await descargarArchivo(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            producto.temario)
                        }}>
                    Descargar temario
                    </a>
                }
              </div>

              <div className="sl_curso__content__img">
                <div className={'cardView'}>
                  {producto.enlaceVideo
                    ? (
                      <div className='relative w-full h-[220px] ' id='iframeContainer' >
                            <iframe
                                src={producto.enlaceVideo}
                                title="YouTube video player"
                                frameBorder="0"
                                className='absolute w-full h-full inset-0'
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                            <div className='w-full h-full absolute inset-0 bg-black/10' onClick={() => { setModalIsOpen(true) }}>

                            </div>
                      </div>
                      )
                    : (
                    <img
                      src={`${Global.urlImages}/productos/${producto.imagen1}`}
                      alt=""
                    />
                      )}

                  <div className="cardView__info ">
                    <p className="flex items-center justify-between w-full">
                      S/. {producto.precio2}{' '}
                      <span className="pl-10 text-3xl text-gray-600 mt-1">
                        {' '}
                        $USD{' '}
                        {(producto.precio2 / Number(data.dolar)).toFixed(1)}
                      </span>
                    </p>
                    <button
                      className="btn-carrito"
                      onClick={() => {
                        setOpen(true)
                      }}
                    >
                      Comprar ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="curso">
            <div className="curso__content">
              <div className="curso__content__general">
                <h4>Descripción del curso</h4>
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: producto.caracteristicas }}
                ></div>
              </div>

              <div className="curso__content__descripcion">
                <h4>Lo que aprenderás</h4>

                <ul>
                  {aprenderas.map((aprendera, index) => (
                    <li key={index}>{aprendera}</li>
                  ))}
                </ul>
              </div>

              <div className="curso__content__contenido hidden md:block">
                <div className="curso__content__contenido__title">
                  <h5>Contenido del curso</h5>
                </div>
                <div className="curso__content__contenido__items">
                  <div>
                    {contenidos.map((conte: any, index: number) => (
                      <Accordion
                        key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
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
                                <>
                                  {itemIndex == 0 &&
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    producto.nombreintroduccion &&
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    producto.videointroduccion && (
                                      <li
                                        key={itemIndex}
                                        onClick={() => {
                                          setOpenVideo(true)
                                        }}
                                        className="cursor-pointer hover:bg-gray-200 transition-colors py-1"
                                      >
                                        <div className="itemsCurso__name">
                                          <p>
                                            <BsYoutube />
                                            {
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-expect-error
                                              producto.nombreintroduccion
                                            }
                                          </p>
                                        </div>
                                        <div className="itemsCurso__time">
                                          <span className="ml-2 text-gray-500">
                                            {
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-expect-error
                                              producto.tiempointroduccion
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-expect-error
                                                ? producto.tiempointroduccion
                                                : ''
                                            }
                                          </span>
                                          <PiLockOpenThin />
                                        </div>
                                      </li>
                                  )}
                                  <li key={itemIndex}>
                                    <div className="itemsCurso__name">
                                      <p>
                                        <BsYoutube />
                                        {i}
                                      </p>
                                    </div>
                                    <div className="itemsCurso__time">
                                      <span className="ml-2 text-gray-500">
                                        {conte.tiemposClase?.[itemIndex] != 0 ? conte.tiemposClase?.[itemIndex] : ''}
                                      </span>
                                      <CiLock />
                                    </div>
                                  </li>
                                </>
                              )
                            )}
                          </ul>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                </div>
              </div>

              <div className="curso__content__contenido hidden md:block" id="profesor">
                <div className="cardProfesor">
                  <div className="cardProfesor__img">
                    <img
                      src={`${Global.urlImages}/fotoperfil/${profesor.imagen1}`}
                      alt=""
                      className='w-[100px] h-[100px] object-cover object-top'
                    />

                    <h5>{profesor.nombre}</h5>
                  </div>
                  <div className="cardProfesor__descripcion">
                    <div
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: profesor.caracteristicas
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <section className="resenas hidden" style={{ padding: '0' }}>
                <div className="resenas__title" style={{ padding: '40px 0' }}>
                  <h2>Reseñas del curso</h2>
                </div>
                <div className="resenas__main">
                  <Swiper
                    slidesPerView={2}
                    loop={true}
                    spaceBetween={30}
                    className="swp_testimonios"
                    modules={[Autoplay]}
                    autoplay={{
                      delay: 2500
                    }}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                        spaceBetween: 20
                      },
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 20
                      },
                      768: {
                        slidesPerView: 2
                      },
                      1024: {
                        slidesPerView: 2
                      }
                    }}
                  >
                    {testimonios.length > 0 &&
                      (
                        testimonios.map(
                          (testimonio: testimoniosValues, index: number) =>
                            testimonio.tipoComentario == 'Facebook'
                              ? (
                            <div
                              key={index}
                              className="cardResenas2"
                              dangerouslySetInnerHTML={{
                                __html: testimonio.comentario
                              }}
                            ></div>
                                )
                              : (
                            <SwiperSlide key={testimonio.id}>
                              <div className="cardResenas">
                                <div className="cardResenas__img">
                                  <img
                                    src={`${Global.urlImages}/testimonios/${testimonio.imagen1}`}
                                    alt=""
                                  />
                                  <h5>{testimonio.nombre}</h5>
                                </div>
                                <div className="cardResenas__content">
                                  <div
                                    className=""
                                    dangerouslySetInnerHTML={{
                                      __html: testimonio.caracteristicas
                                    }}
                                  ></div>
                                </div>

                                <span>
                                  <BsChatText />
                                </span>
                              </div>
                            </SwiperSlide>
                                )
                        )
                      )
                    }
                    {
                     comentarios?.map((comentario, indexcoment: number) => (
                        <SwiperSlide key={indexcoment}>
                        <div className="cardResenas">
                          <div className="cardResenas__img">
                            <img
                              src={
                                comentario.foto
                                  ? `${Global.urlImages}/fotoperfil/${
                                        comentario.foto ?? ''
                                    }`
                                  : defaultperfil
                                }
                              alt=""
                            />
                            <h5>{comentario.user}</h5>
                            <div className='mx-auto w-full flex justify-center cardResenas__img__span'>
                                <Rating
                                    name="read-only"
                                    className="text-5xl text-center pb-4"
                                    value={Number(comentario.clase)}
                                    precision={0.5}
                                    readOnly
                                />
                            </div>
                          </div>
                          <div className="cardResenas__content">
                            <p className="text-[1.4rem] break-words">{comentario.texto}</p>
                          </div>

                          <span className='cardResenas__span'>
                            <BsChatText />
                          </span>
                        </div>
                      </SwiperSlide>
                     ))
                    }
                  </Swiper>
                </div>
              </section>

            </div>

            <div className="curso__items">
              <div className="curso__items__info">
                <h4>Información</h4>

                <ul>
                  <li>
                    <span>
                      <CgLoadbarSound />
                      <p>Nivel</p>
                    </span>
                    <span>
                      <p>{producto.nivel}</p>
                    </span>
                  </li>

                  <li>
                    <span>
                      <PiGraduationCapLight />
                      <p>Total inscritos</p>
                    </span>
                    <span>
                      <p>{producto.inscritos}</p>
                    </span>
                  </li>

                  <li>
                    <span>
                      <BsClock />
                      <p>Duración</p>
                    </span>
                    <span>
                      <p>{producto.duracion}</p>
                    </span>
                  </li>

                  <li>
                    <span>
                      <PiCertificateLight />
                      <p>Certificado</p>
                    </span>
                    <span>
                      <p>{producto.certificado}</p>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="curso__items__varios">
                <div className="curso__items__varios__card">
                  <h4>Materiales incluidos</h4>
                  <ul>
                    {materiales.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>

                  <h4>Requisitos</h4>
                  <ul>
                    {requisitos.map((requisito, index) => (
                      <li key={index}>{requisito}</li>
                    ))}
                  </ul>

                  <h4>Público objetivo</h4>
                  <ul>
                    {publicos.map((publico, index) => (
                      <li key={index}>{publico}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="curso__content__contenido md:hidden">
                <div className="curso__content__contenido__title">
                  <h5>Contenido del curso</h5>
                </div>
                <div className="curso__content__contenido__items">
                  <div>
                    {contenidos.map((conte: any, index: number) => (
                      <Accordion
                        key={index}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
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
                                <>
                                  {itemIndex == 0 &&
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    producto.nombreintroduccion &&
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    producto.videointroduccion && (
                                      <li
                                        key={itemIndex}
                                        onClick={() => {
                                          setOpenVideo(true)
                                        }}
                                        className="cursor-pointer hover:bg-gray-200 transition-colors py-1"
                                      >
                                        <div className="itemsCurso__name">
                                          <p>
                                            <BsYoutube />
                                            {
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-expect-error
                                              producto.nombreintroduccion
                                            }
                                          </p>
                                        </div>
                                        <div className="itemsCurso__time">
                                          <span className="ml-2 text-gray-500">
                                            {
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-expect-error
                                              producto.tiempointroduccion
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-expect-error
                                                ? producto.tiempointroduccion
                                                : ''
                                            }
                                          </span>
                                          <PiLockOpenThin />
                                        </div>
                                      </li>
                                  )}
                                  <li key={itemIndex}>
                                    <div className="itemsCurso__name">
                                      <p>
                                        <BsYoutube />
                                        {i}
                                      </p>
                                    </div>
                                    <div className="itemsCurso__time">
                                      <span className="ml-2 text-gray-500">
                                        {conte.tiemposClase?.[itemIndex] != 0 ? conte.tiemposClase?.[itemIndex] : ''}
                                      </span>
                                      <CiLock />
                                    </div>
                                  </li>
                                </>
                              )
                            )}
                          </ul>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </div>
                </div>
              </div>

              <div className="curso__content__contenido md:hidden" id="profesor">
                <div className="cardProfesor">
                  <div className="cardProfesor__img">
                    <img
                      src={`${Global.urlImages}/fotoperfil/${profesor.imagen1}`}
                      alt=""
                      className='w-[100px] h-[100px] object-cover object-top'
                    />

                    <h5>{profesor.nombre}</h5>
                  </div>
                  <div className="cardProfesor__descripcion">
                    <div
                      className=""
                      dangerouslySetInnerHTML={{
                        __html: profesor.caracteristicas
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <section className="resenas md:hidden" style={{ padding: '0' }}>
                <div className="resenas__title" style={{ padding: '40px 0' }}>
                  <h2>Reseñas del curso</h2>
                </div>
                <div className="resenas__main">
                  <Swiper
                    slidesPerView={2}
                    loop={true}
                    spaceBetween={30}
                    className="swp_testimonios"
                    modules={[Autoplay]}
                    autoplay={{
                      delay: 2500
                    }}
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                        spaceBetween: 20
                      },
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 20
                      },
                      768: {
                        slidesPerView: 2
                      },
                      1024: {
                        slidesPerView: 2
                      }
                    }}
                  >
                    {testimonios.length > 0 &&
                      (
                        testimonios.map(
                          (testimonio: testimoniosValues, index: number) =>
                            testimonio.tipoComentario == 'Facebook'
                              ? (
                            <div
                              key={index}
                              className="cardResenas2"
                              dangerouslySetInnerHTML={{
                                __html: testimonio.comentario
                              }}
                            ></div>
                                )
                              : (
                            <SwiperSlide key={testimonio.id}>
                              <div className="cardResenas">
                                <div className="cardResenas__img">
                                  <img
                                    src={`${Global.urlImages}/testimonios/${testimonio.imagen1}`}
                                    alt=""
                                  />
                                  <h5>{testimonio.nombre}</h5>
                                </div>
                                <div className="cardResenas__content">
                                  <div
                                    className=""
                                    dangerouslySetInnerHTML={{
                                      __html: testimonio.caracteristicas
                                    }}
                                  ></div>
                                </div>

                                <span>
                                  <BsChatText />
                                </span>
                              </div>
                            </SwiperSlide>
                                )
                        )
                      )
                    }
                    {
                     comentarios?.map((comentario, indexcoment: number) => (
                        <SwiperSlide key={indexcoment}>
                        <div className="cardResenas">
                          <div className="cardResenas__img">
                            <img
                              src={
                                comentario.foto
                                  ? `${Global.urlImages}/fotoperfil/${
                                        comentario.foto ?? ''
                                    }`
                                  : defaultperfil
                                }
                              alt=""
                            />
                            <h5>{comentario.user}</h5>
                            <div className='mx-auto w-full flex justify-center cardResenas__img__span'>
                                <Rating
                                    name="read-only"
                                    className="text-5xl text-center pb-4"
                                    value={Number(comentario.clase)}
                                    precision={0.5}
                                    readOnly
                                />
                            </div>
                          </div>
                          <div className="cardResenas__content">
                            <p className="text-[1.4rem] break-words">{comentario.texto}</p>
                          </div>

                          <span className='cardResenas__span'>
                            <BsChatText />
                          </span>
                        </div>
                      </SwiperSlide>
                     ))
                    }
                  </Swiper>
                </div>
              </section>

          </div>
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            producto.videointroduccion != null && producto.videointroduccion
              ? <ModalVideoYOu
                open={openVideo}
                setOpen={setOpenVideo}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                video={producto.videointroduccion}
              />
              : null
          }
          {
            producto.enlaceVideo != null && producto.enlaceVideo
              ? <ModalVideoYOu2
                open={modalIsOpen}
                setOpen={setModalIsOpen}
                video={producto.enlaceVideo}
              />
              : null
          }
        </>
      )}
      <ModalPago
        open={open}
        setOpen={setOpen}
        curso={producto}
        loadingComponents={loadingComponents}
      />
    </>
  )
}

export default View
