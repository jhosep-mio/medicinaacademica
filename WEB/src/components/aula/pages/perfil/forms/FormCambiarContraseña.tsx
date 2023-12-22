import { useFormik } from 'formik'
import useAuth from '../../../../../hooks/useAuth'
import * as Yup from 'yup'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import Swal from 'sweetalert2'
import { useState } from 'react'
import { Errors } from '../../../../shared/Errors'

interface Values {
  password: string
  password2: string
}

const Schema = Yup.object().shape({
  password: Yup.string().required('Este campo es requerido'),
  password2: Yup.string().required('Este campo es requerido')
})

export const FormCambiarContraseña = (): JSX.Element => {
  const { auth } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(false)

  const validar = async (values: Values): Promise<void> => {
    if (values.password == values.password2) {
      setLoadingComponents(true)
      const data = new FormData()
      data.append('password', values.password)
      data.append('email', auth.email)
      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(
          `${Global.url}/updatePassword`,
          data
        )
        if (respuesta.data.status === 'success') {
          Swal.fire(
            'Se realizo el cambio de tu contraseña correctamente',
            '',
            'success'
          )
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
    <form
      className="mt-5 bg-secondary-150/30 p-8 rounded-md"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex gap-0 flex-col ">
          <label htmlFor="" className="text-[2rem] font-bold text-white ">
            Email
          </label>
          <input
            type="text"
            className="text-gray-300/90 outline-none bg-transparent  py-2 rounded-xl  text-3xl "
            value={auth.email}
          />
        </div>
        <div className="w-full flex gap-3 flex-col relative">
          <label htmlFor="" className="text-[2rem] font-bold text-gray-300 ">
            Cambiar contraseña
          </label>
          <input
            type="password"
            className="outline-none bg-gray-300 px-3 py-2 rounded-xl text-black/70 text-3xl "
            name="password"
            value={values.password}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <Errors errors={errors.password} touched={touched.password} />
        </div>
        <div className="w-full flex gap-3 flex-col relative">
          <label htmlFor="" className="text-[2rem] font-bold text-gray-300 ">
            Confirmar contraseña
          </label>
          <input
            type="password"
            className="outline-none bg-gray-300 px-3 py-2 rounded-xl text-black/70 text-3xl "
            name="password2"
            value={values.password2}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <Errors errors={errors.password2} touched={touched.password2} />
        </div>
        <div className="mt-6">
          {!loadingComponents
            ? <button
            type="submit"
            className="px-4 py-3 bg-secondary-200 hover:bg-secondary-200/80 text-3xl rounded-xl"
          >
            Cambiar
          </button>
            : <button
            type="button"
            className="px-4 py-3 bg-secondary-200/80 text-3xl rounded-xl"
          >
            Validando...
          </button>
          }
        </div>
      </div>
    </form>
  )
}
