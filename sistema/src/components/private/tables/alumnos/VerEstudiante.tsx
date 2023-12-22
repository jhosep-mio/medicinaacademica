import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import { type estudiantesValues } from '../../../shared/Interfaces'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ReactCountryFlag from 'react-country-flag'
import countryList from 'react-select-country-list'
import { format } from 'date-fns'
import Swal from 'sweetalert2'

export const VerEstudiante = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [estudiante, setEstudiante] = useState<estudiantesValues | null>(null)
  const [countryVal, setcountryVal] = useState({ value: '', label: '' })
  const [, setOptions] = useState([])
  const [creacion, setCreacion] = useState('')
  const [cursos, setCursos] = useState([])
  const [estado, setEstado] = useState('0')

  const getBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getEstudiante/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setEstudiante(request.data)
    setEstado(request.data.estado)
    if (request.data.ubicacion) {
      setcountryVal(JSON.parse(request.data.ubicacion))
    }
    setCreacion(format(new Date(request.data.created_at), 'dd/MM/yyyy'))
    setLoadingComponents(false)
  }

  const generarNombreDeUsuario = (nombreCompleto: string): string => {
    const partes = nombreCompleto.trim().split(/\s+/) // Dividir por uno o más espacios
    const iniciales = partes.map((nombre) => nombre[0]).join('')
    return `${iniciales.toLowerCase()}`
  }

  const getcursos = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/cursesToCompras/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setCursos(request.data)
  }

  useEffect(() => {
    setOptions(countryList().getData())
  }, [])

  useEffect(() => {
    setTitle('')
    getcursos()
    getBanner()
  }, [])

  const updateEstado = async (estate: string): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('estado', estate)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateEstado/${id ?? ''}`,
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
        Swal.fire('Estado cambiado', '', 'success')
        getBanner()
      } else {
        Swal.fire('Error al cambiar', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al cambiar', '', 'error')
    }
    setLoadingComponents(false)
  }

  return (
    <>
      {loadingComponents
        ? <Loading />
        : (
            estudiante != null && (
          <form className="bg-secondary-100 p-8 rounded-xl">
            <div className="mb-4 flex justify-end">
              {estado == '0'
                ? <button
                  className="bg-red-600 py-4 w-fit px-6 rounded-xl"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    await updateEstado('1')
                  }}
                >
                  Desactivar cuenta
                </button>
                : (
                <button
                  className="bg-green-600 py-4 w-fit px-6 rounded-xl"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    await updateEstado('0')
                  }}
                >
                  Activar Cuenta
                </button>
                  )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-3">
              <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Nombres" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={estudiante.nombres}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Apellidos" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={estudiante.apellidos}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Usuario" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={generarNombreDeUsuario(
                      `${estudiante.nombres} ${estudiante.apellidos}`
                    )}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Email" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={estudiante.email}
                    autoComplete="off"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-0">
              <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                  <div className="w-full lg:w-full">
                    <TitleBriefs titulo="Telefono movil" />
                    <div className="w-full h-full flex gap-4 input_numeros">
                      <PhoneInput
                        disableCountryCode
                        disabled
                        country={'pe'}
                        value={estudiante.celular}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-full">
                    <TitleBriefs titulo="Edad" />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={estudiante.edad}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="w-full lg:w-full">
                    <TitleBriefs titulo="Especialidad" />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={estudiante.especialidad}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="w-full lg:w-full">
                    <TitleBriefs titulo="Ubicación" />
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
                      <input
                        className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                        rounded-md transition-all"
                        disabled
                        value={countryVal.label}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-3">
              <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                  <div className="w-full lg:w-2/3">
                    <TitleBriefs titulo="Inscrito desde: " />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={creacion}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="w-full lg:w-2/3">
                    <TitleBriefs titulo="Genero" />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={
                        estudiante.genero == '1'
                          ? 'Masculino'
                          : estudiante.genero == '2'
                            ? 'Femenino'
                            : 'Otro'
                      }
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="w-full lg:w-2/3">
                    <TitleBriefs titulo="Cumpleaños" />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={estudiante.cumpleaños}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">LISTA DE CURSOS ADQUIRIDOS</h2>
              <div className="mt-6">
                <ol className="px-10">
                  {(() => {
                    const cursoIds = new Set() // Coloca el Set fuera del map para mantener el estado
                    return cursos.flatMap((curso: any) => {
                      if (curso.array_productos) {
                        return JSON.parse(curso.array_productos).flatMap(
                          (pro: any, proIndex: number) => {
                            if (!cursoIds.has(pro.id)) {
                              cursoIds.add(pro.id) // Agrega el ID del curso al Set
                              return (
                                <li key={proIndex} className="py-2">
                                  - {pro.nombre}
                                </li>
                              )
                            }
                            return []
                          }
                        )
                      }
                      return []
                    })
                  })()}
                </ol>
              </div>
            </div>

            <div className="flex gap-2 w-full justify-end">
              <input type="hidden" name="oculto" value="1" />
              <Link
                to="/admin/alumnos"
                className="bg-red-500 px-4 py-2 rounded-md text-white"
              >
                Regresar
              </Link>
            </div>
          </form>
            )
          )}
    </>
  )
}

export default VerEstudiante
