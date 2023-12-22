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
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Errors } from '../shared/Errors'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { FormCodigo } from './Registro/FormCodigo'
import { type valuesRegistro } from '../shared/Interfaces'
import Swal from 'sweetalert2'
import { logo_white } from '../shared/images'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  password: Yup.string()
    .required('Este campo es requerido')
    .min(5, 'Debe tener al menos 5 digitos'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(7, 'Ingrese un celular valido'),
  nombres: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Ingrese un nombre valido'),
  apellidos: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Ingrese un apellido valido')
})

export const Registro = (): JSX.Element | undefined => {
  const { auth } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [estado, setEstado] = useState(1)
  const [phone, setPhone] = useState('')

  if (auth.id !== '') {
    navigate('/', { replace: true })
  } else {
    const enviarCodigo = async (values: valuesRegistro): Promise<void> => {
      setLoadingComponents(true)
      const data = new FormData()
      data.append('correo', values.email)
      try {
        const respuesta = await axios.post(
          `${Global.url}/codigoVerificacion`,
          data
        )
        if (respuesta.data.status === 'success') {
          Swal.fire(
            'Se envio un codigo de verificación a su correo',
            'Revise su bandeja de entrada',
            'success'
          )
          setEstado(1)
        } else if (respuesta.data.status === 'correo') {
          Swal.fire(
            'Ya existe una cuenta asociada a este correo',
            '',
            'warning'
          )
        }
      } catch (error) {
        Swal.fire(
          'Se genero un error al intentar registrar la cuenta',
          '',
          'error'
        )
      }
      setLoadingComponents(false)
    }

    const {
      handleSubmit,
      handleChange,
      errors,
      values,
      touched,
      handleBlur,
      setValues
    } = useFormik({
      initialValues: {
        email: '',
        password: '',
        celular: '',
        nombres: '',
        apellidos: ''
      },
      validationSchema: Schema,
      onSubmit: enviarCodigo
    })

    useEffect(() => {
      setEstado(0)
    }, [])

    useEffect(() => {
      setValues({
        ...values,
        celular: phone
      })
    }, [phone])

    return (
      <section className="min-h-screen w-full h-screen relative fondo_general">
        <div className="w-full relative h-full">
          <section className="hidden lg:w-[63%] h-full lg:flex absolute right-0 items-center justify-center">
            <div className="h-[70%] w-[70%] lg:px-10 xl:px-40 flex flex-col justify-between items-left m-auto">
              <img src={logo_white} alt="" className="w-full cursor-pointer" onClick={() => { navigate('/') }}/>
              <div className="flex flex-col gap-20">
                <h3 className="text-gray-300 text-4xl text-center">
                  Una plataforma hecha por y para <br /> profesionales de la
                  salud.
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
            className="h-32 px-4 object-contain hidden mx-auto"
          />
          <section className="h-fit py-10 lg:h-full m-auto w-[90%] rounded-xl lg:rounded-none lg:w-[37%] absolute px-4 lg:px-24 inset-0 lg:inset-[inherit] lg:left-0 lg:top-0 lg:bottom-0 bg-white/70 flex flex-col justify-center items-center content_blur shadow-black shadow-xl">
            {estado == 0
              ? <>
                <h1 className="w-full text-center text-4xl lg:text-5xl text-primary font-bold uppercase">
                  Regístrate
                </h1>
                <form
                  className="w-full mt-16 lg:mt-32 flex flex-col gap-10"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-col w-full gap-4">
                    {/* NOMBRES Y APELLIDOS */}
                    <div className="w-full flex gap-4">
                      <div className="input-container w-full relative py-5">
                        <input
                          type="text"
                          id="input"
                          name="nombres"
                          value={values.nombres}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-black text-[1.7rem] font-light mb-[10px]"
                        />
                        <label
                          className="label2 px-[0.4rem] text-black text-[1.7rem] font-normal"
                          style={{
                            top: `${values.nombres.length > 0 ? '-12px' : ''}`
                          }}
                        >
                          Nombres
                        </label>
                        <Errors
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                      </div>
                      <div className="input-container w-full relative py-5">
                        <input
                          type="text"
                          id="input"
                          name="apellidos"
                          value={values.apellidos}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          className="px-2 w-full border-b border-gray-500 bg-transparent outline-none text-black text-[1.7rem] font-light mb-[10px]"
                        />
                        <label
                          className="label2 px-[0.4rem] text-black text-[1.7rem] font-normal"
                          style={{
                            top: `${
                              values.apellidos.length > 0 ? '-12px' : ''
                            }`
                          }}
                        >
                          Apellidos
                        </label>
                        <Errors
                          errors={errors.apellidos}
                          touched={touched.nombres}
                        />
                      </div>
                    </div>
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
                      <div className="relative py-7">
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
                    <div className="input-container w-full relative pt-4">
                      <div className="relative py-7 numero_input">
                        <PhoneInput
                          country={'pe'}
                          value={phone}
                          onChange={(phone) => {
                            setPhone(phone)
                          }}
                        />
                        <label
                          className="label2 px-[0.4rem] text-black text-[1.7rem] font-normal "
                          style={{
                            top: '-12px'
                          }}
                        >
                          Número de celular
                        </label>
                      </div>
                      <Errors
                        errors={errors.celular}
                        touched={touched.celular}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {!loadingComponents
                      ? (
                      <button
                        type="submit"
                        className="bg-primary transition-colors hover:bg-primary/90 px-4 py-4 text-white rounded-xl font-semibold text-[1.7rem]"
                      >
                        Registrate
                      </button>
                        )
                      : (
                      <button
                        type="button"
                        disabled
                        className="bg-primary transition-colors hover:bg-primary/90 px-4 py-4 text-white rounded-xl font-semibold text-[1.7rem]"
                      >
                        Validando...
                      </button>
                        )}

                    <div className="flex gap-6 items-center my-6">
                      <span className="block w-full h-1 bg-gray-400"></span>
                      <span className="text-3xl mt-2 text-black/70"> O </span>
                      <span className="block w-full h-1 bg-gray-400"></span>
                    </div>
                      <Link
                        to="/login"
                        type="button"
                        className="border-primary border-2 text-center px-4 py-4 text-primary text-[1.7rem] w-full rounded-xl font-semibold"
                      >
                        Inicia Sesión
                      </Link>
                  </div>
                </form>
              </>
              : (
              <>
                <FormCodigo datos={values} />
              </>
                )}
          </section>
        </div>
      </section>
    )
  }
}
