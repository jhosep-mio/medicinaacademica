import { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ReactCountryFlag from 'react-country-flag'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { RiImageAddFill } from 'react-icons/ri'
import { Header } from '../../../public/estructura/Header'
import { FooterTwo } from '../../../public/estructura/FooterTwo'
import useAuth from '../../../../hooks/useAuth'
import { defaultperfil, portada } from '../../../shared/images'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { useFormik } from 'formik'
import { SchemaPerfil } from '../../../shared/Schemas'
import { type perfilValues } from '../../../shared/Interfaces'
import Swal from 'sweetalert2'
import { Errors } from '../../../shared/Errors'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Skeleton } from '@mui/material'
import Stack from '@mui/material/Stack'
import { FormCambiarContraseña } from './forms/FormCambiarContraseña'
import enLocale from 'i18n-iso-countries/langs/en.json'
import esLocale from 'i18n-iso-countries/langs/es.json'
import i18nIsoCountries from 'i18n-iso-countries'
// Registra los idiomas
i18nIsoCountries.registerLocale(enLocale)
i18nIsoCountries.registerLocale(esLocale)

export const EditarPerfil = (): JSX.Element => {
  const { auth, setAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [countryVal, setcountryVal] = useState({ value: '', label: '' })
  const [option, setOptions] = useState([])
  const [completedData, setCompletedData] = useState(0)
  const [fotoPerfil, setfotoPerfil] = useState('')
  const [fotoPortada, setfotoPortada] = useState('')
  const token = localStorage.getItem('tokenUser')
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !auth.id) {
      // Cambio a !auth.id para cubrir null, undefined, y ''
      navigate('/', { replace: true })
    }
  }, [auth.id, loading])

  const generarNombreDeUsuario = (nombreCompleto: string): string => {
    const partes = nombreCompleto.trim().split(/\s+/) // Dividir por uno o más espacios
    const iniciales = partes.map((nombre) => nombre[0]).join('')
    return `${iniciales.toLowerCase()}`
  }
  const [genero, setGenero] = useState(0)

  useEffect(() => {
    // Obtén la lista de países en inglés
    const countriesInEnglish = countryList().getData()
    // Traduce los nombres de los países al español
    const countriesInSpanish = countriesInEnglish.map((country: any) => ({
      value: country.value,
      label: i18nIsoCountries.getName(country.value, 'es') // Traduce al español
    }))
    // Establece la lista de países traducida
    setOptions(countriesInSpanish)
  }, [])

  const savePreventa = async (values: perfilValues): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('apellidos', values.apellidos)
    if (phone.length > 3) {
      data.append('celular', phone)
    }
    data.append('edad', values.edad)
    data.append('especialidad', values.especialidad)
    data.append('ubicacion', JSON.stringify(values.ubicacion))
    data.append('genero', values.genero)
    data.append('cumpleaños', values.cumpleaños)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateData/${auth.id ?? ''}`,
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
        Swal.fire('Información actualizada', '', 'success')
        getOneBrief()
      } else {
        Swal.fire('Error al actualizar tu información', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error al actualizar tu información', '', 'error')
    }
    setLoading(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting,
    setValues
  } = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      celular: '',
      edad: '',
      especialidad: '',
      ubicacion: '',
      genero: '',
      cumpleaños: '',
      creacion: ''
    },
    validationSchema: SchemaPerfil,
    onSubmit: savePreventa
  })

  const getOneBrief = async (): Promise<void> => {
    let camposLlenos = 0
    const tokenUser = localStorage.getItem('tokenUser')
    const request = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setfotoPerfil(request.data.user.imagen1)
    setfotoPortada(request.data.user.imagen2)
    setValues({
      ...values,
      nombres: request.data.user.nombres,
      apellidos: request.data.user.apellidos,
      edad: request.data.user.edad,
      especialidad: request.data.user.especialidad,
      cumpleaños: request.data.user.cumpleaños,
      genero: request.data.user.genero,
      ubicacion: JSON.parse(request.data.user.ubicacion),
      creacion: format(new Date(request.data.user.created_at), 'dd/MM/yyyy')
    })
    if (request.data.user.celular) {
      setPhone(request.data.user.celular)
    }
    if (request.data.user.ubicacion) {
      setcountryVal(JSON.parse(request.data.user.ubicacion))
    }
    if (request.data.user.genero) {
      setGenero(request.data.user.genero)
    }
    setAuth({
      id: request.data.user.id,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      name: `${request.data.user.nombres} ${request.data.user.apellidos}`,
      onlyname: request.data.user.nombres,
      lastname: request.data.user.apellidos,
      email: request.data.user.email,
      idRol: request.data.user.id_rol,
      foto: request.data.user.imagen1,
      portada: request.data.user.imagen2
    })
    if (request.data.user.nombres) camposLlenos++
    if (request.data.user.apellidos) camposLlenos++
    if (request.data.user.edad) camposLlenos++
    if (request.data.user.especialidad) camposLlenos++
    if (request.data.user.cumpleaños) camposLlenos++
    if (request.data.user.celular) camposLlenos++
    if (request.data.user.ubicacion) camposLlenos++
    if (request.data.user.genero) camposLlenos++
    if (request.data.user.id) camposLlenos++
    if (request.data.user.email) camposLlenos++
    if (request.data.user.id_rol) camposLlenos++
    // Calcular el porcentaje
    const porcentajeLlenado = Math.round((camposLlenos / 11) * 100)
    setCompletedData(porcentajeLlenado)
    setLoading(false)
  }

  useEffect(() => {
    getOneBrief()
  }, [auth.id])

  useEffect(() => {
    setValues({
      ...values,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ubicacion: countryVal
    })
  }, [countryVal])

  useEffect(() => {
    setValues({
      ...values,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      genero
    })
  }, [genero])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  const handleChangeFotoPerfil = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true)
      guardarFotoPerfil(file)
      setLoading(false)
    }
    e.target.value = ''
  }

  const guardarFotoPerfil = async (file: File): Promise<void> => {
    const data = new FormData()
    data.append('imagen1', file)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateFotoPerfil/${auth.id ?? ''}`,
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
        // Swal.fire('Foto de perfil actualizada', '', 'success')
        getOneBrief()
      } else {
        Swal.fire('Error al actualizar tu foto', '', 'warning')
      }
    } catch (error) {
      Swal.fire('Error al actualizar tu foto', '', 'warning')
    }
  }

  const handleChangeFotoPortada = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true)
      guardarFotoPortada(file)
      setLoading(false)
    }
    e.target.value = ''
  }

  const guardarFotoPortada = async (file: File): Promise<void> => {
    const data = new FormData()
    data.append('imagen2', file)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateFotoPortada/${auth.id ?? ''}`,
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
        Swal.fire('Foto de portada actualizada', '', 'success')
        getOneBrief()
      } else {
        Swal.fire('Error al actualizar tu foto', '', 'warning')
      }
    } catch (error) {
      Swal.fire('Error al actualizar tu foto', '', 'warning')
    }
  }

  return (
    <>
      <Header />
      <section className="font_baloo py-20 bg-primary pb-52">
        <div className="max-w-[1450px] px-10 mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold">Editar perfil</h1>
          <section className="w-full flex flex-col lg:flex-row mt-10 lg:mt-20 gap-28 lg:gap-52">
            <div className="w-full lg:w-[25%] h-fit flex flex-col gap-5 mt-3">
              <div className="w-full border-dashed border-2 border-gray-300/50 px-4 py-8 flex flex-col gap-6 justify-center items-center h-[300px]">
                <span>Recomendación: 200 x 200</span>
                <div className="w-60 h-60 rounded-full overflow-hidden ">
                  {!loading
                    ? (
                    <img
                      src={
                        fotoPerfil
                          ? `${Global.urlImages}/fotoperfil/${fotoPerfil}`
                          : defaultperfil
                      }
                      alt=""
                      className="w-full h-full object-cover bg-center"
                    />
                      )
                    : (
                    <Stack spacing={1} className="w-full h-full">
                      <Skeleton
                        animation="wave"
                        variant="circular"
                        className="w-full h-fit object-contain"
                      />
                    </Stack>
                      )}
                </div>
                <div>
                  <p className="text-3xl text-center w-full">
                    Para cambiar tu foto de perfil{' '}
                  </p>
                  <div className="w-fit relative mx-auto overflow-hidden cursor-pointer">
                    <input
                      type="file"
                      className="absolute w-fit h-full opacity-0 cursor-pointer file:hidden"
                      onChange={handleChangeFotoPerfil}
                    />
                    <span className="text-secondary-200 cursor-pointer text-3xl text-center block w-full">
                      sube una foto
                    </span>
                  </div>
                </div>
              </div>
              {/* <h1 className="w-full text-5xl mt-12 font-bold">
                Iniciar Sesión
              </h1> */}
              <span className="text-gray-300 text-3xl mt-12 text-center">
                Cambia tu contraseña cuando lo necesites.
              </span>
              <FormCambiarContraseña />
            </div>
            <div className="w-full flex-1 mt-0 lg:mt-0">
              <div className="w-full h-[300px]">
                <div className="w-full h-[90%]  relative overflow-hidden ">
                  <span>Recomendación: 1000 x 270</span>
                  {loading
                    ? (
                    <Stack spacing={1} className="w-full h-full">
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        className="w-full h-full object-cover"
                      />
                    </Stack>
                      )
                    : fotoPortada
                      ? (
                    <img
                      src={`${Global.urlImages}/fotoportada/${fotoPortada}`}
                      alt=""
                      className="w-full h-full object-cover "
                    />
                        )
                      : (
                    <img
                      src={portada}
                      alt=""
                      className="w-full h-full object-cover "
                    />
                        )}
                  <div className="absolute transition-all overflow-hidden cursor-pointer glaass duration-500  right-0 bottom-0 rounded-full h-32 w-32 flex items-center justify-center">
                    <RiImageAddFill className="text-6xl" />
                    <input
                      type="file"
                      className="absolute w-fit h-full opacity-0 cursor-pointer file:hidden"
                      onChange={handleChangeFotoPortada}
                    />
                  </div>
                </div>
                <div className="w-full h-[10%] mt-5">
                  <p className="w-full text-2xl text-right px-3 text-gray-300 ">
                    Completa tu perfil{' '}
                    <span className="text-secondary-200 font-bold text-3xl ">
                      {completedData}%
                    </span>
                  </p>
                  <div className="relative w-full">
                    <span className="w-full h-2 rounded-xl bg-gray-400 block relative before:w-1/2 before:absolute before:h-full before:left-0 before:top-0 before:bg-secondary-200"></span>
                    <span
                      className="absolute h-full left-0 top-0 bg-secondary-200"
                      style={{ width: `${completedData}%` }}
                    ></span>
                  </div>
                </div>
              </div>
              <h2 className="text-5xl font-bold text-secondary-150 mt-20">
                Sobre mí
              </h2>
              <form
                action=""
                className="w-full mt-20 flex flex-col gap-10"
                onSubmit={handleSubmit}
              >
                <div className="w-full flex flex-col lg:flex-row gap-10 justify-between">
                  <div className="w-full flex gap-3 flex-col relative">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Nombres
                    </label>
                    <input
                      type="text"
                      className="border border-gray-400 outline-none bg-white px-6 py-3 rounded-xl text-black/70 text-4xl "
                      name="nombres"
                      value={values.nombres}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors errors={errors.nombres} touched={touched.nombres} />
                  </div>
                  <div className="w-full flex gap-3 flex-col relative">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Apellidos
                    </label>
                    <input
                      type="text"
                      className="border border-gray-400 outline-none bg-white px-6 py-3 rounded-xl text-black/70 text-4xl "
                      name="apellidos"
                      value={values.apellidos}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors
                      errors={errors.apellidos}
                      touched={touched.apellidos}
                    />
                  </div>
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Usuario
                    </label>
                    <input
                      type="text"
                      disabled
                      className="border border-gray-400 outline-none bg-gray-300 px-6 py-3 rounded-xl text-black/70 text-4xl "
                      value={generarNombreDeUsuario(auth.name)}
                    />
                  </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-10 justify-between">
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      disabled
                      className="border border-gray-400 outline-none bg-gray-300 px-6 py-3 rounded-xl text-black/70 text-4xl "
                      value={auth.email}
                    />
                  </div>
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Telefono Movil
                    </label>
                    <div className="w-full h-full flex gap-4 input_numeros">
                      <PhoneInput
                        country={'pe'}
                        value={phone}
                        onChange={(phone) => {
                          setPhone(phone)
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Edad
                    </label>
                    <input
                      type="text"
                      className="border border-gray-400 outline-none bg-white px-6 py-3 rounded-xl text-black/70 text-4xl "
                      name="edad"
                      value={values.edad}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors errors={errors.edad} touched={touched.edad} />
                  </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-10 justify-between">
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Especialidad
                    </label>
                    <input
                      type="text"
                      className="border border-gray-400 outline-none bg-white px-6 py-3 rounded-xl text-black/70 text-4xl "
                      name="especialidad"
                      value={values.especialidad}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors
                      errors={errors.especialidad}
                      touched={touched.especialidad}
                    />
                  </div>
                  <div className="w-full flex gap-3 flex-col input_numeros pl-1">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Ubicación
                    </label>
                    <div className="w-full flex items-center gap-6">
                      {countryVal.value && (
                        <ReactCountryFlag
                          countryCode={countryVal.value || ''}
                          svg
                          cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                          cdnSuffix="svg"
                          className="w-full"
                          title={countryVal.value || ''}
                        />
                      )}
                      <Select
                        className="w-full"
                        isSearchable={true}
                        options={option}
                        value={countryVal}
                        onChange={(selectedOption) => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          setcountryVal(selectedOption)
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Inscrito desde
                    </label>
                    <input
                      type="text"
                      disabled
                      className="border border-gray-400 outline-none bg-gray-300 px-6 py-3 rounded-xl text-black/70 text-4xl "
                      value={values.creacion}
                    />
                  </div>
                </div>
                <div className="w-full flex gap-10 flex-col lg:flex-row justify-between">
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Genero
                    </label>
                    <div className="flex flex-col lg:flex-row gap-10 lg:items-center w-full h-full">
                      <div className="flex items-center gap-3">
                        <div className="">
                          <span
                            className={`cursor-pointer w-8 h-8 relative rounded-full bg-transparent border border-gray-300 block ${
                              genero == 1
                                ? 'before:rounded-full before:bg-white before:absolute before:w-4 before:h-4 before:inset-0 before:m-auto'
                                : ''
                            }`}
                            onClick={() => {
                              setGenero(1)
                            }}
                          ></span>
                        </div>
                        <span className="text-4xl mt-2">Masculino</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="">
                          <span
                            className={`cursor-pointer w-8 h-8 relative rounded-full bg-transparent border border-gray-300 block ${
                              genero == 2
                                ? 'before:rounded-full before:bg-white before:absolute before:w-4 before:h-4 before:inset-0 before:m-auto'
                                : ''
                            }`}
                            onClick={() => {
                              setGenero(2)
                            }}
                          ></span>
                        </div>
                        <span className="text-4xl mt-2">Femenino</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="">
                          <span
                            className={`cursor-pointer w-8 h-8 relative rounded-full bg-transparent border border-gray-300 block ${
                              genero == 3
                                ? 'before:rounded-full before:bg-white before:absolute before:w-4 before:h-4 before:inset-0 before:m-auto'
                                : ''
                            }`}
                            onClick={() => {
                              setGenero(3)
                            }}
                          ></span>
                        </div>
                        <span className="text-4xl mt-2">Otro</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex gap-3 flex-col ">
                    <label
                      htmlFor=""
                      className="text-4xl font-bold text-gray-300"
                    >
                      Cumpleaños
                    </label>
                    <input
                      type="date"
                      className="border border-gray-400 outline-none bg-transparent px-6 py-3 rounded-xl text-gray-300 text-4xl "
                      name="cumpleaños"
                      value={values.cumpleaños}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors
                      errors={errors.cumpleaños}
                      touched={touched.cumpleaños}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center lg:justify-end pt-10">
                  {!loading
                    ? (
                    <input
                      type="submit"
                      value="Grabar"
                      className="bg-secondary-200 text-white w-[200px] px-4 py-3 text-4xl rounded-xl text-center outline-none cursor-pointer transition-colors hover:bg-secondary-200/70"
                    />
                      )
                    : (
                    <input
                      type="button"
                      disabled
                      value="Guardando..."
                      className="bg-secondary-200/70 text-white w-[200px] px-4 py-3 text-4xl rounded-xl text-center outline-none cursor-pointer transition-colors "
                    />
                      )}
                </div>
              </form>
              {/* <h2 className="text-5xl font-bold text-secondary-150 mt-20">
                Mis habilidades
              </h2> */}
            </div>
          </section>
        </div>
      </section>
      <FooterTwo />
    </>
  )
}
