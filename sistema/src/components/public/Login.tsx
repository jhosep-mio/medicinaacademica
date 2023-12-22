import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiUser3Line
} from 'react-icons/ri'
import useAuth from '../../hooks/useAuth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Global } from '../../helper/Global'
import { bg, logo_white } from '../shared/Images'
import { Errors } from '../shared/Errors'
import { LoadingSmall } from '../shared/LoadingSmall'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  password: Yup.string().required('Este campo es requerido').min(1)
})

interface Values {
  email: string
  password: string
}

export const Login = (): JSX.Element | undefined => {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loged, setLoged] = useState('')
  const { auth, setAuth, loadingComponents, setLoadingComponents } = useAuth()

  if (auth.id !== '') {
    navigate('/admin', { replace: true })
  } else {
    const validar = async (values: Values): Promise<void> => {
      setLoadingComponents(true)
      const data = new FormData()
      const email = values.email
      const password = values.password
      data.append('email', email)
      data.append('password', password)
      data.append('_method', 'POST')

      try {
        const respuesta = await axios.post(`${Global.url}/login`, data)
        if (respuesta.data.status == 'success') {
          setLoged('login')
          if (respuesta.data.user.id_rol == 99) {
            localStorage.setItem('token', respuesta.data.acces_token)
            localStorage.removeItem('tokenProfesor')
            setAuth({
              id: respuesta.data.user.id,
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              name: `${respuesta.data.user.name} `,
              email: respuesta.data.user.email,
              idRol: respuesta.data.user.id_rol,
              foto: respuesta.data.user.foto
            })
          } else {
            localStorage.setItem('tokenProfesor', respuesta.data.acces_token)
            localStorage.removeItem('token')
            setAuth({
              id: respuesta.data.user.id,
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              name: `${respuesta.data.user.nombre}`,
              email: respuesta.data.user.email,
              idRol: respuesta.data.user.id_rol,
              foto: respuesta.data.user.imagen1
            })
          }
          localStorage.setItem('user', JSON.stringify(respuesta.data.user))
          navigate('/admin', { replace: true })
        } else if (respuesta.data.status == 'invalid') {
          console.log('contraseña incorrecta')
          setLoged('invalid')
        } else {
          console.log(respuesta.data)
          setLoged('noexiste')
        }
      } catch (error) {
        console.log(error)
        setLoged('noexiste')
      }
      setLoadingComponents(false)
    }

    const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
      useFormik({
        initialValues: {
          email: '',
          password: ''
        },
        validationSchema: Schema,
        onSubmit: validar
      })

    return (
      <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="bg-secondary-100  p-8 md:px-20  shadow-2xl w-screen lg:w-2/5 h-screen flex flex-col justify-center">
          <button className="flex items-center justify-center w-full rounded-full mb-8 text-gray-100">
            <img src={logo_white} className="w-full h-40 object-contain" />
          </button>
          <h1 className="text-3xl text-center uppercase font-bold tracking-[5px] text-white mb-8">
            Iniciar <span className="text-main">sesión</span>
          </h1>
          <form className="mb-8 " onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-2 relative ">
              <div className="w-full relative">
                <input
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg  border  ${
                    errors.email !== null &&
                    errors.email !== undefined &&
                    errors.email !== '' &&
                    touched.email !== null &&
                    touched.email !== undefined
                      ? ' border-red-500'
                      : 'border-transparent'
                  }`}
                  placeholder="Usuario"
                />
                <RiUser3Line className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
              </div>
              <Errors errors={errors.email} touched={touched.email} />
            </div>

            <div className="flex flex-col w-full gap-2 relative mb-3 mt-3">
              <div className="w-full relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`py-3 px-8 bg-secondary-900 w-full outline-none rounded-lg  border  
                  ${
                    errors.password !== null &&
                    errors.password !== undefined &&
                    errors.password !== '' &&
                    touched.password !== null &&
                    touched.password !== undefined
                      ? ' border-red-500'
                      : 'border-transparent'
                  }`}
                  placeholder="Contraseña"
                  name="password"
                  onBlur={handleBlur}
                  value={values.password}
                  onChange={handleChange}
                />
                {showPassword
                  ? (
                  <RiEyeOffLine
                    onClick={() => {
                      setShowPassword(!showPassword)
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-main"
                  />
                    )
                  : (
                  <RiEyeLine
                    onClick={() => {
                      setShowPassword(!showPassword)
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer text-main"
                    name="password"
                  />
                    )}
                <RiLockLine className="absolute right-0 top-1/2 -translate-y-1/2 left-2 text-main" />
              </div>
              <Errors errors={errors.password} touched={touched.password} />
            </div>

            <div className="mt-3 mb-8">
              {loged == 'invalid'
                ? (
                <p className="text-main">Contraseña incorrecta</p>
                  )
                : loged == 'noexiste'
                  ? (
                <p className="text-main">El usuario no existe</p>
                    )
                  : loged == 'login'
                    ? (
                <p className="text-green-500">
                  Usuario identificado correctamente
                </p>
                      )
                    : (
                        ''
                      )}
            </div>

            <div className="w-full flex">
              {loadingComponents
                ? (
                <div className="bg-main text-white uppercase font-bold text-sm py-2 px-4 rounded-lg w-80 m-auto">
                  <LoadingSmall />
                </div>
                  )
                : (
                <button
                  type="submit"
                  className="bg-main text-white uppercase font-bold text-sm  py-3 px-4 rounded-lg w-80 m-auto"
                >
                  Ingresar
                </button>
                  )}
            </div>
          </form>
          <div className="flex flex-col items-center gap-4">
            <Link to="/password" className="hover:text-main transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
            <span className="flex items-center gap-2">
              ¿No tienes cuenta?{' '}
              <Link
                to="/registro"
                className="text-main hover:text-gray-100 transition-colors"
              >
                Registrate
              </Link>
            </span>
          </div>
        </div>
        <div className="w-screen md:w-3/5  md:h-screen hidden lg:block">
          <img src={bg} alt="" className="w-full h-full object-cover" />

        </div>
      </div>
    )
  }
}
