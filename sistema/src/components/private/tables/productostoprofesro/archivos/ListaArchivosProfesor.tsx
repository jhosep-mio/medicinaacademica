import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useParams } from 'react-router-dom'
import {
  type productosValues,
  type comentariosValues,
  type apuntesValues,
  type estudiantesValues
} from '../../../../shared/Interfaces'
import { Fragment, useEffect, useState } from 'react'
import {
  RiArrowRightSLine,
  RiBookmark2Line,
  RiFolderZipLine
} from 'react-icons/ri'
import { defaultperfil } from '../../../../shared/Images'
import { ModalCalificacion } from './ModalCalificacion'
import Swal from 'sweetalert2'

export const ListaArchivosProfesor = (): JSX.Element => {
  const { id, claseId } = useParams()
  const tokenUser = localStorage.getItem('tokenProfesor')
  const [open, setOpen] = useState(false)
  const [, setComentarios] = useState<comentariosValues[]>([])
  const [, setCurso] = useState<productosValues | null>(null)
  const [contenidos, setContenidos2] = useState<string[]>([])
  const [apuntes, setApuntes] = useState<apuntesValues[]>([])
  const getOneData = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/showAdmin2/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setComentarios(
      request.data[0].comentariosfinales
        ? JSON.parse(request.data[0].comentariosfinales)
        : []
    )
    const responseData: productosValues = request.data[0]
    setContenidos2(JSON.parse(responseData.contenido))
    setCurso(responseData)
  }
  const [nota, setNota] = useState<string>('')
  const [IdArchivo, setIdArchivo] = useState<string>('')
  const [estudiantes, setProductos] = useState<estudiantesValues[]>([])

  const getEstudiantes = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getEstudiantes2`, {
      headers: {
        Authorization: `Bearer ${
          tokenUser !== null && tokenUser !== '' ? tokenUser : ''
        }`
      }
    })
    setProductos(request.data)
  }

  const getApuntes = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getArchivoss98/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    setApuntes(request.data)
  }

  const descargarArchivo = async (nombre: string): Promise<void> => {
    const response = await axios.get(
      `${Global.url}/descargarRecurso98/${nombre ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        },
        responseType: 'blob'
      }
    )
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', nombre) // Asigna el nombre al archivo descargado
    document.body.appendChild(link)
    link.click()

    // Limpieza después de la descarga
    if (link.parentNode) {
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }

  const handleCalificar = async (): Promise<void> => {
    if (nota) {
      const notaNumerica = Number(nota)
      // Actualizar el estado apuntes con la nueva nota
      setApuntes((prevApuntes) => {
        const nuevosApuntes = prevApuntes.map((apunte) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const archivos = apunte.archivos && JSON.parse(apunte.archivos)
          if (archivos) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const archivosActualizados = archivos.map((archivo) => {
              if (archivo.id == IdArchivo) {
                return {
                  ...archivo,
                  nota: notaNumerica
                }
              }
              return archivo
            })
            return {
              ...apunte,
              archivos: JSON.stringify(archivosActualizados)
            }
          }
          return apunte
        })

        // Llama a enviarArchivo después de actualizar el estado
        enviarArchivo(nuevosApuntes)
        return nuevosApuntes
      })
    } else {
      Swal.fire('Debe colocar un nota', '', 'warning')
    }
  }

  const enviarArchivo = async (nuevosApuntes: apuntesValues[]): Promise<void> => {
    const data = new FormData()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('archivos', nuevosApuntes[0].archivos)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/saveArchivo98/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              tokenUser !== null && tokenUser !== '' ? tokenUser : ''
            }`
          }
        }
      )
      if (respuesta.data.status == 'success') {
        Swal.fire('Calificación enviada', '', 'success')
        setNota('')
        setOpen(false)
      } else {
        Swal.fire('Error al subir', '', 'error')
      }
    } catch (error: unknown) {
      console.log(error)
      Swal.fire('Error al subir', '', 'error')
    }
  }

  useEffect(() => {
    getOneData()
    getApuntes()
    getEstudiantes()
  }, [])

  return (
    <div className="w-full gap-10 max-w-[1450px] lg:px-20 mx-auto justify-start mt-32 grid grid-cols-1 lg:grid-cols-3 ">
      {contenidos.map((conten: any) =>
        conten.codClases.map((cod: any) =>
          apuntes.map((apunte, index: number) => {
            const archivosFiltrados =
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              apunte.archivos &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              JSON.parse(apunte.archivos).filter(
                (archivo: any) =>
                  archivo.clase == cod && archivo.clase == claseId
              )
            if (archivosFiltrados && archivosFiltrados.length > 0) {
              return (
                <Fragment key={index}>
                  {archivosFiltrados.map((archivo: any, indexa: number) => {
                    const indiceCodClases = conten.codClases.findIndex(
                      (clase: any) => clase == archivo.clase
                    )
                    return (
                      <div
                        className="rounded-xl overflow-hidden shadow-md relative"
                        key={indexa}
                      >
                        <div className='absolute top-2 right-4 cursor-pointer flex flex-col gap-0 items-center justify-center'>
                            <span
                            className="text-base underline text-black "
                            onClick={() => {
                              setOpen(true)
                              setIdArchivo(archivo.id)
                            }}
                            >
                            Calificar
                            </span>
                            <span className='text-2xl text-black'>{archivo.nota ? archivo.nota : ''}</span>
                        </div>
                        <div className="bg-white rounded-3xl p-2 shadow-xl">
                          <div className="flex flex-row items-center gap-4 mb-6 p-4">
                            <div className="bg-primary/20 flex items-center justify-center rounded-full w-20 h-20 min-w-[5rem]">
                              <RiFolderZipLine className="text-3xl text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-primary text-2xl">
                                {conten.contenido[indiceCodClases]}
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-8 mb-2 px-4">
                            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                              <div className="w-12 h-12 relative flex items-center">
                                <img
                                  src={defaultperfil}
                                  alt="Hombre"
                                  loading="lazy"
                                  className="rounded-full object-cover m-auto"
                                />
                              </div>
                              {estudiantes
                                .filter((estu) => estu.id == archivo.user)
                                .map((estu) => (
                                  <h5
                                    className="text-neutral-500 "
                                    key={estu.id}
                                  >
                                    {estu.nombres} {estu.apellidos}
                                  </h5>
                                ))}
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2 text-neutral-600 w-full justify-end">
                              <RiBookmark2Line />
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-2xl">
                            <button
                              // onClick={() => { console.log() }}
                              // eslint-disable-next-line @typescript-eslint/no-misused-promises
                              onClick={async () => {
                                await descargarArchivo(archivo.respuestas)
                              }}
                              type="button"
                              className="flex items-center text-[1.3rem] mt-1 p-2 text-black rounded-lg hover:bg-white transition-colors duration-300"
                            >
                              Descargar Proyecto <RiArrowRightSLine />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </Fragment>
              )
            } else {
              return null // No hay archivos para este código de clase
            }
          })
        )
      )}
      <ModalCalificacion
        open={open}
        setOpen={setOpen}
        nota={nota}
        setNota={setNota}
        handleCalificar={handleCalificar}
      />
    </div>
  )
}
