import { useState, type Dispatch, type SetStateAction } from 'react'
import * as Yup from 'yup'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { Errors } from '../../shared/Errors'

interface Values {
  codigo: string
}

interface ValuesProps {
  setEstado: Dispatch<SetStateAction<number>>
  email: string
}

const Schema = Yup.object().shape({
  codigo: Yup.string()
    .required('Este campo es requerido')
})

export const FormCodigoRecuperacion = ({ setEstado, email }: ValuesProps): JSX.Element => {
  const [loadingComponents, setLoadingComponents] = useState(false)

  const validar = async (values: Values): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('codigo', values.codigo)
    data.append('email', email)
    data.append('_method', 'POST')
    try {
      const respuesta = await axios.post(`${Global.url}/validarCodigoRecuperacion`, data)
      if (respuesta.data.status === 'success') {
        setEstado(2)
        Swal.fire('Se valido tu codigo correctamente', '', 'success')
      }
    } catch (error) {
      Swal.fire('Código inválido', '', 'warning')
    }
    setLoadingComponents(false)
  }

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        codigo: ''
      },
      validationSchema: Schema,
      onSubmit: validar
    })

  return (
    <section className="h-fit py-10 w-full lg:px-10 inset-0 lg:inset-[inherit] lg:right-0 lg:top-0 bg-white flex flex-col justify-center items-center content_blur shadow-black shadow-xl">
          <h1 className=" w-full text-center text-2xl lg:text-5xl text-primary font-bold uppercase">
            CÓDIGO DE RESTABLECIMIENTO
          </h1>
          <span className='text-center text-2xl pt-4'>Coloca el codigo que se adjunto a tu correo de registro.</span>
          <form
            className="w-full mt-10 flex flex-col gap-10"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col w-full gap-4">
              <div className="input-container w-full relative py-3">
              <label
                  className="label px-[0.4rem] text-black text-2xl"
                  style={{ top: `${values.codigo.length > 0 ? '-12px' : ''}` }}
                >
                  Codigo
                </label>
                <input
                  type="text"
                  id="input"
                  name="codigo"
                  value={values.codigo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-black text-2xl"
                />
                <Errors errors={errors.codigo} touched={touched.codigo} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {!loadingComponents
                ? (
                <button
                  type="submit"
                  className="bg-primary px-4 py-3 text-2xl text-white rounded-sm"
                >
                  Validar
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
