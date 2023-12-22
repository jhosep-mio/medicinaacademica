import { useState, type Dispatch, type SetStateAction } from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { Errors } from '../../shared/Errors'

interface Values {
  password: string
  password2: string
}

const Schema = Yup.object().shape({
  password: Yup.string()
    .required('Este campo es requerido'),
  password2: Yup.string()
    .required('Este campo es requerido')
})

export const FormContraseñaDoble = ({ setOpen, setEstado, email }: { setOpen: Dispatch<SetStateAction<boolean>>, setEstado: Dispatch<SetStateAction<number>>, email: string }): JSX.Element => {
  const [loadingComponents, setLoadingComponents] = useState(false)

  const validar = async (values: Values): Promise<void> => {
    if (values.password == values.password2) {
      setLoadingComponents(true)
      const data = new FormData()
      data.append('password', values.password)
      data.append('email', email)
      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(`${Global.url}/updatePassword`, data)
        if (respuesta.data.status === 'success') {
          Swal.fire('Se realizo el cambio de tu contraseña correctamente', '', 'success')
          setOpen(false)
          setEstado(0)
        }
      } catch (error) {
        Swal.fire('Error al cambiar la contraseña', '', 'error')
      }
      setLoadingComponents(false)
    } else {
      Swal.fire('Las contraseñas no coinciden', '', 'warning')
    }
  }

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        password: '',
        password2: ''
      },
      validationSchema: Schema,
      onSubmit: validar
    })

  return (
    <section className="h-fit py-10 w-full lg:px-10 inset-0 lg:inset-[inherit] lg:right-0 lg:top-0 bg-white flex flex-col justify-center items-center content_blur shadow-black shadow-xl">
          <h1 className=" w-full text-center text-2xl lg:text-5xl text-primary font-bold uppercase">
            Nueva contraseña
          </h1>
          <span className='text-center pt-4 text-2xl'>Coloca tu nueva contraseña.</span>
          <form
            className="w-full mt-10 flex flex-col gap-10"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col w-full gap-4">
              <div className="input-container w-full relative py-3">
                <input
                  type="password"
                  id="input"
                  autoComplete='off'
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-black text-2xl"
                />
                <label
                  className="label px-[0.4rem] text-black text-2xl"
                  style={{ top: `${values.password.length > 0 ? '-12px' : ''}` }}
                >
                  Contraseña
                </label>
                <Errors errors={errors.password} touched={touched.password} />
              </div>
              <div className="input-container w-full relative py-3">
                <input
                  type="password"
                  id="input"
                  autoComplete='off'
                  name="password2"
                  value={values.password2}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-black text-2xl"
                />
                <label
                  className="label px-[0.4rem] text-black text-2xl"
                  style={{ top: `${values.password2.length > 0 ? '-12px' : ''}` }}
                >
                  Vuelve a digitar tu constraseña
                </label>
                <Errors errors={errors.password2} touched={touched.password2} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {!loadingComponents
                ? (
                <button
                  type="submit"
                  className="bg-primary px-4 py-3 text-2xl text-white rounded-sm"
                >
                  Cambiar
                </button>
                  )
                : (
                <button
                  type="button"
                  disabled
                  className="bg-primary px-4 py-3 text-2xl text-white rounded-sm"
                >
                  Validando...
                </button>
                  )}
            </div>
          </form>
        </section>
  )
}
