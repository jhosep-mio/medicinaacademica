import axios from 'axios'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Global } from '../../../helper/Global'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Errors } from '../../shared/Errors'
import Swal from 'sweetalert2'
import { type valuesRegistro } from '../../shared/Interfaces'

const Schema = Yup.object().shape({
  codigo: Yup.string()
    .required('Este campo es requerido')
    .min(6, 'Ingrese un codigo valido')
    .max(6, 'Ingrese un codigo valido')
})

interface valuesProp {
  datos: valuesRegistro
}

interface Values {
  codigo: string
}

export const FormCodigo = ({ datos }: valuesProp): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [validacon, setValidacion] = useState(0)
  const navigate = useNavigate()

  const validarCodigo = async (values: Values): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('codigo', values.codigo)
    data.append('email', datos.email)
    data.append('nombres', datos.nombres)
    data.append('apellidos', datos.apellidos)
    data.append('celular', datos.celular)
    data.append('password', datos.password)
    try {
      const respuesta = await axios.post(`${Global.url}/validarCodigo`, data)
      if (respuesta.data.status === 'success') {
        Swal.fire('Cuenta verificada correctamente', 'Se envio un correo con tus accesos', 'success')
        navigate('/login')
      } else {
        setValidacion(1)
      }
    } catch (error) {
      setValidacion(2)
    }
    setLoading(false)
  }

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        codigo: ''
      },
      validationSchema: Schema,
      onSubmit: validarCodigo
    })
  return (
    <>
      <h1 className=" w-full text-center text-2xl lg:text-5xl text-primary font-bold uppercase">
        Validación
      </h1>
      <form
        className="w-full mt-10 lg:mt-20 flex flex-col gap-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full gap-4">
          <div className="input-container w-full relative">
            <div className="relative py-3">
              <input
                type="number"
                id="input"
                name="codigo"
                value={values.codigo}
                onBlur={handleBlur}
                onChange={handleChange}
                className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-2xl"
              />
              <label
                className="label px-[0.4rem] text-black text-2xl"
                style={{
                  top: `${values.codigo ? '-12px' : ''}`
                }}
              >
                Codigo de validación
              </label>
            </div>
            <Errors errors={errors.codigo} touched={touched.codigo} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="my-0">
            {validacon == 1
              ? (
              <p className="text-main">Código inválido</p>
                )
              : validacon == 2
                ? (
              <p className="text-main">Código inválido</p>
                  )
                : null}
          </div>
          {!loading
            ? (
            <button
              type="submit"
              className="bg-primary px-4 py-3 text-2xl text-white rounded-sm"
            >
              Verificar
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

          <div className="flex justify-between">
            <span className="text-black/70 text-sm lg:text-base">
              ¿Tienes una cuenta?
            </span>
            <Link
              to="/login"
              className="text-primary font-bold cursor-pointer text-sm lg:text-base"
            >
              Entrar
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}
