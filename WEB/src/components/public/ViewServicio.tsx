import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/grid'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { BsChatText } from 'react-icons/bs'

import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Global } from '../../helper/Global'
import {
  type serviciosValues,
  type testimoniosValues
} from '../shared/Interfaces'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { SchemaContacto } from '../shared/Schemas'
import { Errors } from '../shared/Errors'

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

const ViewServicio = (): JSX.Element => {
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const handleChange2 =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      event.preventDefault()
      setExpanded(newExpanded ? panel : false)
    }

  const { id } = useParams()

  const [servicio, setServicio] = useState<serviciosValues>({
    id: 0,
    nombre: '',
    caracteristicas: '',
    imagen1: '',
    imagen2: '',
    titulo1: '',
    seccion1: '',
    seccion2: '',
    seccion3: '',
    seccion4: ''
  })

  const getOneData = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneServicio/${id ?? ''}`)
    const responseData: serviciosValues = request.data[0] // Replace "YourResponseType" with the actual type of the response data
    setServicio(responseData)
  }

  const [testimonios, setTestimonios] = useState([])

  const getTestimonios = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/testimoniosFrom/${id ?? ''}`
    )
    setTestimonios(request.data)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getOneData()
    getTestimonios()
  }, [])

  const [loadingCorreo, setLoadingCorreo] = useState<boolean>(false)
  const enviarCorreo = async (): Promise<void> => {
    setLoadingCorreo(true)
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('email', values.email)
    data.append('celular', values.celular)
    data.append('mensaje', values.mensaje)
    try {
      const respuesta = await axios.post(`${Global.url}/enviarServicio`, data)

      if (respuesta.data.status === 'success') {
        Swal.fire('Correo enviado', '', 'success')
        resetForm()
      } else {
        Swal.fire('Error al enviar el correo', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error al enviar el correo', '', 'error')
    }
    setLoadingCorreo(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    resetForm
  } = useFormik({
    initialValues: {
      nombres: '',
      celular: '',
      email: '',
      asunto: '',
      mensaje: ''
    },
    validationSchema: SchemaContacto,
    onSubmit: enviarCorreo
  })

  return (
    <>
      <section className="viewServicio">
        <div className="viewServicio__banner">
          <div className="viewServicio__banner__info">
            <h1>{servicio.nombre}</h1>
            <div
              className="contentM"
              dangerouslySetInnerHTML={{ __html: servicio.caracteristicas }}
            ></div>
            <a href="#asesor">Solicitar un asesor</a>
          </div>
          <div
            className="viewServicio__banner__img"
            style={{
              backgroundImage: `url(${Global.urlImages}/servicios/${servicio.imagen1})`
            }}
          ></div>
        </div>

        <div className="viewServicio__seccion1">
          <div className="viewServicio__seccion1__title">
            {/* <h2>Introducción al servicio</h2> */}
            <p>{servicio.titulo1}</p>
          </div>

          <div className="viewServicio__seccion1__info">
            <div
              className="contentM"
              dangerouslySetInnerHTML={{ __html: servicio.seccion1 }}
            ></div>
          </div>
        </div>

        <div className="viewServicio__seccion2">
          {/* <div className="viewServicio__seccion2__title">
                    <h2>Destacar problemas comunes</h2>
                </div>
                <div className="viewServicio__seccion2__info">
                    <p>Enumerar los problemas o desafíos comunes que los estudiantes enfrentan al trabajar en tesis e investigaciones en salud:</p>
                    <ul>
                        <li>La tesis puede ser un proceso largo </li>
                        <li>Requiere mucho esfuerzo mental </li>
                        <li>Capacidad crítica </li>
                        <li>Hay evaluadores que lo hacen difícil </li>
                        <li>La mayoría de las asesorías vende tesis que son copiadas, que te causarán problemas en el futuro </li>
                    </ul>
                    <p>Hacer que los visitantes se identifiquen con estos problemas. </p>
                </div> */}

          <div
            className="content_1"
            dangerouslySetInnerHTML={{ __html: servicio.seccion2 }}
          ></div>
        </div>

        <div className="viewServicio__seccion3">
          <div className="svg"></div>
          {/* <div className="viewServicio__seccion3__title">
                    <h2>Solución ofrecida</h2>
                </div>
                <div className="viewServicio__seccion3__info">
                    <div className="">
                        <h5>Descripción detallada de cómo tu servicio aborda y resuelve los problemas mencionados</h5>
                        <ul>
                            <li>Con la ayuda de nuestros asesores no solo terminarás y sustentarás tu tesis en poco tiempo, sino que harás un trabajo en investigación relevante y acabarás siendo un experto en el área.</li>
                        </ul>
                    </div>
                    <div className="">
                        <h5>Destacar la experiencia y habilidades de tu equipo</h5>
                        <ul>
                            <li>Asesores con experiencia en el área </li>
                            <li>Acompañamiento continuo de inicio a fin </li>
                            <li>Preguntas y resolución de dudas 24/ por WhatsApp</li>
                            <li>Precios accesibles </li>
                            <li>Resolución de observaciones </li>
                            <li>Metodologías válidas internacionalmente </li>
                            <li>Acceso a la formación paralela en investigación </li>
                        </ul>
                    </div>
                </div> */}

          <div
            className="content_2"
            dangerouslySetInnerHTML={{ __html: servicio.seccion3 }}
          ></div>
        </div>

        <section
          className="resenas resenas mt-[160px]"
        //   style={{ padding: '10px 160px 50px 160px', marginTop: '160px' }}
        >
          <div className="resenas__title">
            <h2>Testimonios y casos de éxito</h2>
          </div>
          <div className="resenas__main">
            <Swiper
              slidesPerView={3}
              loop={true}
              spaceBetween={30}
              modules={[Autoplay, Pagination]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false
              }}
              pagination={{
                dynamicBullets: true
              }}
              className="swp_testimonios py-10"
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
                  slidesPerView: 3
                }
              }}
            >
              {testimonios.map((testimonio: testimoniosValues) => (
                <SwiperSlide key={testimonio.id} className='my-auto'>
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
              ))}
            </Swiper>
          </div>
        </section>

        <section className="linea">
          <img
            src={`${Global.urlImages}/servicios/${servicio.imagen2}`}
            alt=""
          />
        </section>

        <div className="viewServicio__seccion5" id="asesor">
          {/* <div className="viewServicio__seccion5__title">
                    <h2>Proceso de Trabajo</h2>
                </div>
                <div className="viewServicio__seccion5__info">
                    <div className="viewServicio__seccion5__info__main">
                        <div className="viewServicio__seccion5__info__main__item">
                            <p>Un asesor se pondrá en contacto contigo para evaluar tu situación </p>
                        </div>
                        <div className="viewServicio__seccion5__info__main__item">
                            <p>Armarán un plan de trabajo </p>
                        </div>
                        <div className="viewServicio__seccion5__info__main__item">
                            <p>El asesor te guiará durante todo el proceso </p>
                        </div>
                        <div className="viewServicio__seccion5__info__main__item">
                            <p>Se corregirán las observaciones de evaluadores o dictaminadores</p>
                        </div>
                        <div className="viewServicio__seccion5__info__main__item">
                            <p>También te preparemos para la sustentación </p>
                        </div>
                    </div>
                </div> */}

          <div
            className="content_3"
            dangerouslySetInnerHTML={{ __html: servicio.seccion4 }}
          ></div>
        </div>

        <div className="viewServicio__seccion6">
          <div className="viewServicio__seccion6__main">
            <div className="viewServicio__seccion6__main__item">
              <h3>{
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               // @ts-expect-error
              servicio.titulo2}</h3>
              <p>
               {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               // @ts-expect-error
               servicio.contenido2}
              </p>
            </div>
            <div className="viewServicio__seccion6__main__item">
              <div className="col-md-12">
                <h4>Consulta sobre nuestro servicio, te contactaremos en la brevedad posible.</h4>
                <form
                  className="bform formulario hmfrmcontac vbfsg1fgorm1"
                  name=""
                  onSubmit={handleSubmit}
                >
                  <span className="response"></span>
                  <div className="row">
                    <div className="form-group col-sm-12 col-md-6">
                      <div className="e2e-frmCnt">
                        <input
                          className="form-control e2e-inpfrm"
                          type="text"
                          placeholder="Nombres"
                          name="nombres"
                          value={values.nombres}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        <Errors
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                      </div>
                    </div>

                    <div className="form-group col-sm-12 col-md-6">
                      <div className="e2e-frmCnt">
                        <input
                          className="form-control e2e-inpfrm"
                          id=""
                          type="text"
                          placeholder="Teléfono"
                          name="celular"
                          value={values.celular}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        <Errors
                          errors={errors.celular}
                          touched={touched.celular}
                        />
                      </div>
                    </div>

                    <div className="form-group col-sm-12 col-md-6">
                      <div className="e2e-frmCnt">
                        <input
                          className="form-control e2e-inpfrm"
                          id=""
                          type="email"
                          placeholder="E-mail"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        <Errors errors={errors.email} touched={touched.email} />
                      </div>
                    </div>

                    <div className="form-group col-sm-12 col-md-6">
                      <div className="e2e-frmCnt">
                        <input
                          className="form-control e2e-inpfrm"
                          id=""
                          type="text"
                          placeholder="Asunto"
                          name="asunto"
                          value={values.asunto}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                        <Errors
                          errors={errors.asunto}
                          touched={touched.asunto}
                        />
                      </div>
                    </div>

                    <div className="form-group col-sm-12 col-md-12">
                      <div className="e2e-frmCnt">
                        <textarea
                          className="form-control e2e-txtareafrm"
                          id="mensaje"
                          rows={7}
                          style={{ resize: 'vertical' }}
                          placeholder="Mensaje"
                          name="mensaje"
                          value={values.mensaje}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        ></textarea>
                        <Errors
                          errors={errors.mensaje}
                          touched={touched.mensaje}
                        />
                      </div>
                    </div>

                    <div className="form-group col-sm-12 col-md-12">
                      {!loadingCorreo
                        ? (
                        <input
                          type="submit"
                          className="save btn btn_frmcontact"
                          value="Enviar"
                        />
                          )
                        : (
                        <input
                          type="submit"
                          className="save btn btn_frmcontact"
                          value="Enviando..."
                        />
                          )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="viewServicio__seccion7">
          <div className="viewServicio__seccion7__title">
            <h2>Preguntas frecuentes</h2>
          </div>
          <div className="viewServicio__seccion7__main">
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleChange2('panel1')}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>¿Cuánto es el costo de la asesoría? </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p>
                  En una primera reunión el asesor evaluará exactamente en qué
                  etapa te encuentras y que servicios necesitas para hacer una
                  cotización a tu medida y explicarte en qué consistirá.{' '}
                </p>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleChange2('panel2')}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>
                  ¿Por qué medio tendré contacto con el asesor?{' '}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p>
                  Crearemos un grupo privado con el asesor por donde podrás
                  realizar tus consultas y mantener comunicación directa en
                  cualquier momento durante el periodo de la asesoría{' '}
                </p>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === 'panel3'}
              onChange={handleChange2('panel3')}
            >
              <AccordionSummary
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Typography>
                  ¿En cuánto tiempo puedo terminar mi tesis?{' '}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p>
                  El tiempo puede variar desde pocos meses hasta poco más de un
                  año dependiendo de la etapa en la que te encuentres y el
                  empeño que le pongas. Nuestros asesores están disponibles para
                  terminarlo en el tiempo más corto posible si te lo propones.{' '}
                </p>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default ViewServicio
