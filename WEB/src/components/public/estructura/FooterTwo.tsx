import { Link } from 'react-router-dom'
import { logo_white } from '../../shared/images'
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsWhatsapp
} from 'react-icons/bs'
import { useEffect, useState } from 'react'
import {
  type ConfiguracionValues
} from '../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { SchemaBoletin } from '../../shared/Schemas'

export const FooterTwo = (): JSX.Element => {
  useEffect(() => {
    getData2()
    window.scrollTo(0, 0)
  }, [])

  const [data, setData] = useState<ConfiguracionValues>({
    id: null,
    celular1: '',
    celular2: '',
    correo1: '',
    correo2: '',
    direccion1: '',
    direccion2: '',
    direccion3: '',
    facebook: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    whatsapp: '',
    horario: ''
  })

  const getData2 = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/oneConfi/1`)
      setData(request.data)
    } catch (error) {}
  }

  const [, setLoadingCorreo] = useState<boolean>(false)
  const enviarCorreo = async (): Promise<void> => {
    setLoadingCorreo(true)
    const data = new FormData()
    data.append('email', values.email)
    try {
      const respuesta = await axios.post(`${Global.url}/enviarBoletin`, data)

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

  const { values, resetForm } = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: SchemaBoletin,
    onSubmit: enviarCorreo
  })

  return (
    <>
      <footer>
        <section className="foot_main">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-4">
                <Link to="/">
                  <img className="logo_foot" src={logo_white} width="100%" />
                </Link>
              </div>

              <div className="col-sm-12 col-md-8">
                <div className="row">
                  <div className="col-sm-4 col-md-4">
                    <div className="account">
                      <div className="info_head">
                        <h3 className="h3_infohead">Servicios</h3>
                        <hr className="hr_line" />
                      </div>
                      <ul className="list_account">
                        <li>
                          <Link to="/viewservicio/17">
                            <span className="fa fa-angle-double-right"></span>
                            Asesoria de tesis
                          </Link>
                        </li>
                        <li>
                          <Link to="/formacionacademica">
                            <span className="fa fa-angle-double-right"></span>
                            Cursos
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-sm-4 col-md-4">
                    <div className="enlaces">
                      <div className="info_head">
                        <h3 className="h3_infohead">ENLACES</h3>
                        <hr className="hr_line" />
                      </div>

                      <div className="info_body">
                        <ul className="info_enlaces">
                          <li>
                            <Link to="/politicas">
                              <span className="fa fa-angle-double-right"></span>
                              Política de privacidad
                            </Link>
                          </li>
                          <li>
                            <Link to="/preguntas">
                              <span className="fa fa-angle-double-right"></span>
                              Preguntas frecuentes
                            </Link>
                          </li>
                          <li>
                            <Link to="/nosotros">
                              <span className="fa fa-angle-double-right"></span>{' '}
                              Nosotros
                            </Link>
                          </li>
                          <li>
                            <Link to="/contacto">
                              <span className="fa fa-angle-double-right"></span>{' '}
                              Contacto
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-4 col-md-4">
                    <div className="info">
                      <div className="info_head">
                        <h3 className="h3_infohead">CONTACTO</h3>
                        <hr className="hr_line" />
                      </div>

                      <div className="info_body">
                        <ul className="info_list">
                          <li className="phone">
                            <i className="fa fa-phone"></i> Celular:{' '}
                            <a href={`tel:+51${data.celular1}`}>
                              {' '}
                              (+51) {data.celular1}
                            </a>
                          </li>
                          <li className="email">
                            <i className="fa fa-envelope-o"></i> Email:{' '}
                            <a href={`mailto:${data.correo1}`}>
                              {data.correo1}
                            </a>
                          </li>
                        </ul>
                      </div>

                      <div className="info_foot">
                        <ul className="list_social">
                          {data.facebook && (
                            <li>
                              <a
                                href={`${data.facebook}`}
                                target="_blank"
                                className="tooltipped"
                                data-position="top"
                                data-delay="50"
                                data-tooltip="Facebook"
                                rel="noreferrer"
                              >
                                <BsFacebook />
                              </a>
                            </li>
                          )}
                          {data.instagram && (
                            <li>
                              <a
                                href={`${data.instagram}`}
                                target="_blank"
                                className="tooltipped"
                                data-position="top"
                                data-delay="50"
                                data-tooltip="Instagram"
                                rel="noreferrer"
                              >
                                <BsInstagram />
                              </a>
                            </li>
                          )}
                          {data.linkedin && (
                            <li>
                              <a
                                href={`${data.linkedin}`}
                                target="_blank"
                                className="tooltipped"
                                data-position="top"
                                data-delay="50"
                                data-tooltip="LinkedIn"
                                rel="noreferrer"
                              >
                                <BsLinkedin />
                              </a>
                            </li>
                          )}
                          {data.whatsapp && (
                            <li>
                              <a
                                href={`${data.whatsapp}`}
                                target="_blank"
                                className="tooltipped"
                                data-position="top"
                                data-delay="50"
                                data-tooltip="WhatsApp"
                                rel="noreferrer"
                              >
                                <BsWhatsapp />
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="foot_arriba">
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <p>
                  © 2023{' '}
                  <a href="#" className="name_empresa">
                    Medicina Académica
                  </a>{' '}
                  - Todos los derechos reservados
                </p>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </>
  )
}
