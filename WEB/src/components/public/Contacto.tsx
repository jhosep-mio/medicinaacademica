import { useEffect, useState } from 'react'
import { BsFillEnvelopeAtFill, BsFillTelephoneInboundFill, BsWhatsapp } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { type ConfiguracionValues } from '../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../helper/Global'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import { SchemaContacto } from '../shared/Schemas'
import { Errors } from '../shared/Errors'

const Contacto = (): JSX.Element => {
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
    } catch (error) {
    }
  }

  const [loadingCorreo, setLoadingCorreo] = useState<boolean>(false)
  const enviarCorreo = async (): Promise<void> => {
    setLoadingCorreo(true)
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('email', values.email)
    data.append('celular', values.celular)
    data.append('mensaje', values.mensaje)
    try {
      const respuesta = await axios.post(
            `${Global.url}/enviarCorreo`,
            data
      )

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

  useEffect(() => {
    window.scrollTo(0, 0)
    getData2()
  }, [])
  return (
    <>
        <section className="sect_frmcontact">
            <div className="banner_contacto">
                <h1>Contáctanos</h1>
                <p>{'>'}<Link to="/"> Home</Link> | Contacto</p>
            </div>
            <div className="datos">
                <div className="datos__title">
                    <h2>Estamos dispuestos a ayudarte</h2>
                    <p>Un asesor se contactará contigo para resolver todas tus dudas que tengas acerca de nuestra tienda 😀.</p>
                </div>
                <div className="datos__main">
                    <div className="datos__main__item">
                        <BsFillTelephoneInboundFill/>
                        <p>Celular</p>
                        <a href={`tel:+51${data.celular1}`}>+51 {data.celular1}</a>
                    </div>

                    <div className="datos__main__item">
                        <BsFillEnvelopeAtFill/>
                        <p>E-mail</p>
                        <a href={`mailto:${data.correo1}`}>{data.correo1}</a>
                    </div>

                    <div className="datos__main__item">
                        <BsWhatsapp/>
                        <p>WhatsApp</p>
                        <a href={`https://wa.me//+51${data.celular1}`}>+51 {data.celular1}</a>
                    </div>
                </div>
            </div>

            <div className="container formu">
                    <div className="col-md-8">
                        <div className="titlefrm_contact">
                            <h3>ESTÁMOS EN CONTACTO</h3>
                            <p>Déjanos tu consulta y nos estaremos comunicando contigo</p>
                        </div>

                        <form className="bform formulario hmfrmcontac vbfsg1fgorm1" name="" onSubmit={handleSubmit}>
                            <span className="response"></span>
                            <div className="row">

                                <div className="form-group col-sm-12 col-md-6">
                                    <div className="e2e-frmCnt">
                                        <input className="form-control e2e-inpfrm" type="text" placeholder="Nombres"
                                            name='nombres'
                                            value={values.nombres}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete='off'
                                        />
                                        <Errors errors={errors.nombres} touched={touched.nombres}/>
                                    </div>
                                </div>

                                <div className="form-group col-sm-12 col-md-6">
                                    <div className="e2e-frmCnt">
                                        <input className="form-control e2e-inpfrm" id="" type="text" placeholder="Teléfono"
                                            name='celular'
                                            value={values.celular}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete='off'
                                        />
                                        <Errors errors={errors.celular} touched={touched.celular}/>

                                    </div>
                                </div>

                                <div className="form-group col-sm-12 col-md-6">
                                    <div className="e2e-frmCnt">
                                        <input className="form-control e2e-inpfrm" id="" type="email" placeholder="E-mail"
                                            name='email'
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete='off'
                                        />
                                        <Errors errors={errors.email} touched={touched.email}/>

                                    </div>
                                </div>

                                <div className="form-group col-sm-12 col-md-6">
                                    <div className="e2e-frmCnt">
                                        <input className="form-control e2e-inpfrm" id="" type="text" placeholder="Asunto"
                                         name='asunto'
                                         value={values.asunto}
                                         onChange={handleChange}
                                         onBlur={handleBlur}
                                         autoComplete='off'
                                        />
                                        <Errors errors={errors.asunto} touched={touched.asunto}/>

                                    </div>
                                </div>

                                <div className="form-group col-sm-12 col-md-12">
                                    <div className="e2e-frmCnt">
                                        <textarea className="form-control e2e-txtareafrm" id="mensaje" rows={7} style={{ resize: 'vertical' }} placeholder="Mensaje"
                                            name='mensaje'
                                            value={values.mensaje}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            autoComplete='off'
                                        ></textarea>
                                        <Errors errors={errors.mensaje} touched={touched.mensaje}/>

                                    </div>
                                </div>

                                <div className="form-group col-sm-12 col-md-12">

                                    {!loadingCorreo
                                      ? (
                                        <input type="submit" className="save btn btn_frmcontact" value="Enviar"/>

                                        )
                                      : (
                                        <input type="submit" className="save btn btn_frmcontact" value="Enviando..."/>

                                        )}
                                </div>

                            </div>
                        </form>
                    </div>

            </div>
        </section>
    </>
  )
}

export default Contacto
