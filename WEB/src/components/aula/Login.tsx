import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp
} from 'react-icons/fa'
import useAuth from '../../hooks/useAuth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Global } from '../../helper/Global'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Errors } from '../shared/Errors'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { ModalRecuperacion } from './Registro/ModalRecuperacion'
import { logo_white } from '../shared/images'

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
  const { auth, setAuth } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loged, setLoged] = useState('')
  const [recordar, setRecordar] = useState(false)
  const [open, setOpen] = useState(false)
  if (auth.id !== '') {
    navigate('/', { replace: true })
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
        const respuesta = await axios.post(`${Global.url}/loginEstudiantes`, data)
        if (respuesta.data.status == 'success') {
          setLoged('login')
          localStorage.setItem('tokenUser', respuesta.data.acces_token)
          localStorage.setItem(
            'estudiante',
            JSON.stringify({
              id: respuesta.data.user.id,
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
              onlyname: respuesta.data.user.nombres,
              lastname: respuesta.data.user.apellidos,
              email: respuesta.data.user.email,
              idRol: null,
              foto: respuesta.data.user.imagen1,
              portada: respuesta.data.user.imagen2
            })
          )
          setAuth({
            id: respuesta.data.user.id,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
            onlyname: respuesta.data.user.nombres,
            lastname: respuesta.data.user.apellidos,
            email: respuesta.data.user.email,
            idRol: null,
            foto: respuesta.data.user.imagen1,
            portada: respuesta.data.user.imagen2
          })
          setTimeout(() => {
            navigate('/', { replace: true })
            // window.location.reload()
          }, 800)
        } else if (respuesta.data.status == 'invalid') {
          setLoged('noexiste')
        } else {
          setLoged('noexiste')
        }
      } catch (error) {
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
      <>
        <section className="min-h-screen w-full h-screen relative fondo_general">
          <div className="w-full relative h-full">
            <section className="hidden xl:w-[63%] lg:w-[50%] h-full lg:flex items-center justify-center">
              <div className="h-[70%] w-[70%] lg:px-10 xl:px-40 flex flex-col justify-between items-left m-auto">
                <img src={logo_white} alt="" className="w-full cursor-pointer" onClick={() => { navigate('/') }}/>
                <div className="flex flex-col gap-20">
                  <h3 className="text-gray-300 text-4xl text-center">
                    Una plataforma hecha por y para <br />{' '}
                    profesionales de la salud.
                  </h3>
                  <div className="w-full flex gap-4 items-center justify-center">
                    <FaFacebookF className="text-gray-300 text-4xl" />
                    <FaInstagram className="text-gray-300 text-4xl" />
                    <FaLinkedinIn className="text-gray-300 text-4xl" />
                    <FaWhatsapp className="text-gray-300 text-4xl" />
                  </div>
                </div>
              </div>
            </section>
            <img
              src={logo_white}
              alt=""
              className="h-32 px-4 object-contain lg:hidden mx-auto hidden"
            />
            <section className="h-fit py-10 lg:h-full m-auto w-[90%] rounded-xl lg:rounded-none xl:w-[37%] lg:w-[50%] absolute px-4 lg:px-40 inset-0 lg:inset-[inherit] lg:right-0 lg:top-0 bg-white/70 flex flex-col justify-center items-center content_blur shadow-black shadow-xl">
              <h1 className=" w-full text-center text-4xl lg:text-5xl text-primary font-bold uppercase">
                Iniciar Sesión
              </h1>
              <form
                className="w-full mt-16 lg:mt-32 flex flex-col gap-10"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col w-full gap-4">
                  <div className="input-container w-full relative py-5">
                    <input
                      type="email"
                      id="input"
                      name="email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-black text-[1.7rem] font-light mb-[10px]"
                    />
                    <label
                      className="label2 px-[0.4rem] text-black text-[1.7rem] font-normal"
                      style={{
                        top: `${values.email.length > 0 ? '-12px' : ''}`
                      }}
                    >
                      Email
                    </label>
                    <Errors errors={errors.email} touched={touched.email} />
                  </div>
                  <div className="input-container w-full relative">
                    <div className="relative py-5">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="input"
                        name="password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        className="px-2 w-full border-b border-gray-500 bg-transparent outline-none"
                      />
                      {showPassword
                        ? (
                        <RiEyeOffLine
                          onClick={() => {
                            setShowPassword(!showPassword)
                          }}
                          className="absolute top-[40%] -translate-y-1/2 right-2 hover:cursor-pointer text-primary text-3xl"
                        />
                          )
                        : (
                        <RiEyeLine
                          onClick={() => {
                            setShowPassword(!showPassword)
                          }}
                          className="absolute top-[40%] -translate-y-1/2 right-2 hover:cursor-pointer text-primary text-3xl"
                          name="password"
                        />
                          )}
                      <label
                        className="label2 px-[0.4rem] text-black text-[1.7rem] font-normal"
                        style={{
                          top: `${values.password.length > 0 ? '-12px' : ''}`
                        }}
                      >
                        Contraseña
                      </label>
                    </div>
                    <Errors
                      errors={errors.password}
                      touched={touched.password}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-0">
                    <div className="flex gap-3 items-center lg:px-2">
                      <div
                        className="w-[12px] lg:w-[15px] h-[12px] lg:h-[15px] relative flex items-center"
                        onClick={() => {
                          setRecordar(!recordar)
                        }}
                      >
                        <div className="w-full h-full bg-transparent border border-gray-500"></div>
                        <input
                          type="checkbox"
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          value={recordar}
                          checked={recordar}
                          className={`absolute inset-0 checked_boc ${
                            !recordar ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                      </div>
                      <label className="text-black/50 text-2xl mt-[5px] lg:mt-5px">
                        Recordar contraseña
                      </label>
                    </div>
                    <span
                      className="text-primary underline text-2xl hover:text-primary/70 transition-colors cursor-pointer"
                      onClick={() => {
                        setOpen(true)
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-10 lg:mt-0 w-full">
                  <div className="my-0">
                    {loged === 'invalid'
                      ? (
                      <p className="text-main">Contraseña incorrecta</p>
                        )
                      : loged === 'noexiste'
                        ? (
                      <p className="text-main">Datos incorrectos o Cuenta desactivada</p>
                          )
                        : loged === 'login'
                          ? (
                      <p className="text-green-500">
                        Usuario identificado correctamente
                      </p>
                            )
                          : (
                              ''
                            )}
                  </div>
                  {!loadingComponents
                    ? (
                    <button
                      type="submit"
                      className="bg-primary transition-colors hover:bg-primary/90 px-4 py-4 text-white rounded-xl font-semibold text-[1.7rem]"
                    >
                      Iniciar Sesión
                    </button>
                      )
                    : (
                    <button
                      type="button"
                      disabled
                      className="bg-primary/90 px-4 py-4 text-white rounded-xl font-semibold text-[1.7rem]"
                    >
                      Validando...
                    </button>
                      )}

                  <div className='flex gap-6 items-center my-6'>
                    <span className='block w-full h-1 bg-gray-400'></span>
                    <span className='text-3xl mt-2 text-black/70'> O </span>
                    <span className='block w-full h-1 bg-gray-400'></span>
                  </div>
                    <Link
                      to="/registro"
                      type="button"
                      className="border-primary border-2 text-center px-4 py-4 text-primary transition-colors text-[1.7rem] w-full rounded-xl font-semibold mx-auto"
                    >
                      Registrate
                    </Link>
                  </div>
              </form>
            </section>
          </div>
        </section>
        <ModalRecuperacion open={open} setOpen={setOpen} />
      </>
    )
  }
}
