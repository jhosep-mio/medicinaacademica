import { useEffect } from 'react'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { SchemaConfiguracion } from '../../../shared/Schemas'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { TitleBriefs } from '../../../shared/TitleBriefs'

export const EditarContacto = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const { setTitle, loadingComponents, setLoadingComponents } = useAuth()

  useEffect(() => {
    setTitle('CONTACTO')
    getBanner()
  }, [])

  const upadateBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('dolar', values.dolar)
    data.append('celular1', values.celular1)
    data.append('celular2', values.celular2)
    data.append('correo1', values.correo1)
    data.append('correo2', values.correo2)
    data.append('direccion1', values.direccion1)
    data.append('direccion2', values.direccion2)
    data.append('direccion3', values.direccion3)
    data.append('horario', values.horario)
    data.append('facebook', values.facebook)
    data.append('instagram', values.instagram)
    data.append('twiter', values.twiter)
    data.append('linkedin', values.linkedin)
    data.append('youtube', values.youtube)
    data.append('whatsapp', values.whatsapp)
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateConfiguracion/1`,
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
      } else {
        Swal.fire('Error al realizar la edicion', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  const getBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/oneConfi/1`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      celular1: request.data.celular1,
      celular2: request.data.celular2,
      correo1: request.data.correo1,
      correo2: request.data.correo2,
      direccion1: request.data.direccion1,
      direccion2: request.data.direccion2,
      direccion3: request.data.direccion3,
      horario: request.data.horario,
      facebook: request.data.facebook,
      instagram: request.data.instagram,
      twiter: request.data.twiter,
      linkedin: request.data.linkedin,
      youtube: request.data.youtube,
      whatsapp: request.data.whatsapp,
      dolar: request.data.dolar
    })
    setLoadingComponents(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    setValues,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      celular1: '',
      celular2: '',
      correo1: '',
      correo2: '',
      direccion1: '',
      direccion2: '',
      direccion3: '',
      horario: '',
      facebook: '',
      instagram: '',
      twiter: '',
      linkedin: '',
      youtube: '',
      whatsapp: '',
      dolar: ''
    },
    validationSchema: SchemaConfiguracion,
    onSubmit: upadateBanner
  })

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
          <h2 className="text-main text-2xl font-bold text-center mb-10">
            Datos de Contacto
          </h2>
          <section className="w-full flex flex-col lg:flex-row gap-2">
            <div className="w-full lg:w-1/3 lg:relative mb-5">
              <TitleBriefs titulo="Precio Dolar" />
              <InputsBriefs
                name="dolar"
                type="number"
                value={values.dolar}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.dolar} touched={touched.dolar} />
            </div>
            <div className="w-full lg:w-1/3 lg:relative mb-5">
              <TitleBriefs titulo="Celular" />
              <InputsBriefs
                name="celular1"
                type="number"
                value={values.celular1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.celular1} touched={touched.celular1} />
            </div>
            <div className="w-full lg:w-1/3 lg:relative mb-5">
              <TitleBriefs titulo="Correo electronico" />
              <InputsBriefs
                name="correo1"
                type="email"
                value={values.correo1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.correo1} touched={touched.correo1} />
            </div>
          </section>

          <h2 className="text-main text-2xl font-bold text-center mb-10">
            Url Redes
          </h2>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Facebook" />
            <InputsBriefs
              name="facebook"
              type="text"
              value={values.facebook}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.facebook} touched={touched.facebook} />
          </div>
          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Instagram" />
            <InputsBriefs
              name="instagram"
              type="text"
              value={values.instagram}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.instagram} touched={touched.instagram} />
          </div>

          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="LinkedIn" />
            <InputsBriefs
              name="linkedin"
              type="text"
              value={values.linkedin}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.linkedin} touched={touched.linkedin} />
          </div>

          <div className="w-full lg:relative mb-5">
            <TitleBriefs titulo="Whatsapp" />
            <InputsBriefs
              name="whatsapp"
              type="text"
              value={values.whatsapp}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Errors errors={errors.whatsapp} touched={touched.whatsapp} />
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />

            <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Actualizar"
            />
          </div>
        </form>
          )}
    </>
  )
}
