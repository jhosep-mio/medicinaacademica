import { useState, type Dispatch, type SetStateAction, useEffect } from 'react'
import { Global } from '../../../../../helper/Global'
import useAuth from '../../../../../hooks/useAuth'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoIosSend } from 'react-icons/io'
import Swal from 'sweetalert2'
import { type comentariosValues } from '../../../../shared/Interfaces'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

interface valuesProps {
  comentarios: comentariosValues[]
  claseId: string | undefined
  cursoId: string | undefined
  getComentarios: () => Promise<void>
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
  archivos: comentariosValues[]
  setArchivos: Dispatch<SetStateAction<comentariosValues[]>>
  setProgresoClases: Dispatch<SetStateAction<Record<string, Record<string, boolean>>>>
  getApuntes: () => Promise<void>
}
interface verificacionI {
  verificacion: boolean
  objeto: comentariosValues
}

export const EnviarContenido = ({
  claseId,
  cursoId,
  getComentarios,
  setComentarios,
  archivos,
  setArchivos,
  setProgresoClases,
  getApuntes
}: valuesProps): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const handleClose = (): void => {
    setOpen(false)
  }
  const [verifiacion, setVerificacion] = useState<verificacionI | null>(null)
  const token = localStorage.getItem('tokenUser')
  const tokenUser = localStorage.getItem('tokenUser')

  const handleTextChange = (e: any): void => {
    setTexto(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  const obtenerFecha = (): string => {
    const fecha = new Date()
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
  }

  const obtenerHora = (): string => {
    const fecha = new Date()
    return `${fecha.getHours()}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const agregarResumen = async (): Promise<void> => {
    if (texto) {
      setLoading(true)
      const nuevoResumen = {
        id: Date.now(),
        texto,
        fecha: obtenerFecha(),
        foto: auth.foto,
        hora: obtenerHora(),
        clase: claseId,
        user: auth.name,
        idUser: auth.id,
        respuestas: ''
      }
      setComentarios(
        (resumenesPrevios: comentariosValues[]): comentariosValues[] => {
          const nuevosResumenes = [...resumenesPrevios, nuevoResumen]
          const enviarDatos = async (): Promise<void> => {
            const data = new FormData()
            data.append('comentarios', JSON.stringify(nuevosResumenes))
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                `${Global.url}/saveComentario/${cursoId ?? ''}`,
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
                Swal.fire('Comentario enviado', '', 'success')
                setTexto('')
                setOpen(false)
                getComentarios()
              } else {
                Swal.fire('Error al subir', '', 'error')
              }
            } catch (error: unknown) {
              Swal.fire('Error al subir', '', 'error')
            }
          }
          enviarDatos()
          return nuevosResumenes
        }
      )
      setTexto('')
      setLoading(false)
    } else {
      Swal.fire('Ingrese su comentario', '', 'warning')
    }
  }

  const enviarArchivo = async (): Promise<void> => {
    if (texto) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const nombreunico = file ? `${uuidv4()}_${file.name}` : ''
      setLoading(true)
      const nuevoResumen = {
        id: Date.now(),
        texto,
        fecha: obtenerFecha(),
        foto: auth.foto,
        hora: obtenerHora(),
        clase: claseId,
        user: auth.id,
        idUser: auth.id,
        respuestas: file ? nombreunico : ''
      }
      setArchivos(
        (resumenesPrevios: comentariosValues[]): comentariosValues[] => {
          const nuevosResumenes = [...resumenesPrevios || [], nuevoResumen]
          const enviarDatos = async (): Promise<void> => {
            const data = new FormData()
            data.append('archivos', JSON.stringify(nuevosResumenes))
            if (file) {
              data.append('file', file)
              data.append('namefile', nombreunico)
            }
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                `${Global.url}/saveArchivo/${cursoId ?? ''}`,
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
                Swal.fire('Archivo enviado', '', 'success')
                setTexto('')
                setOpen(false)
                setFile(null)
                getComentarios()
              } else {
                Swal.fire('Error al subir', '', 'error')
              }
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error al subir', '', 'error')
            }
          }
          enviarDatos()
          actualizarProgresoClase()
          return nuevosResumenes
        }
      )
      setTexto('')
      setLoading(false)
    } else {
      Swal.fire('Ingrese contenido', '', 'warning')
    }
  }

  const actualizarProgresoClase = (): void => {
    setProgresoClases((prevProgreso) => {
      const nuevoProgreso = { ...prevProgreso }
      nuevoProgreso[cursoId ?? ''] = nuevoProgreso[cursoId ?? ''] || {}
      nuevoProgreso[cursoId ?? ''][claseId ?? ''] = true
      const actualizarProgreso = async (): Promise<void> => {
        const data = new FormData()
        data.append('progreso', JSON.stringify(nuevoProgreso))
        data.append('_method', 'PUT')
        try {
          const resultado = await axios.post(
            `${Global.url}/saveProgreso/${auth.id ?? ''}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${
                  tokenUser !== null && tokenUser !== '' ? tokenUser : ''
                }`
              }
            }
          )
          if (resultado.data.status == 'success') {
            getApuntes()
          }
        } catch (error: unknown) {
          console.log(error)
        }
      }
      actualizarProgreso()
      return nuevoProgreso
    })
  }

  useEffect(() => {
    if (claseId && archivos) {
      const verificarClaseId = (
        array: comentariosValues[],
        claseId: string
      ): { encontrado: boolean, objeto?: comentariosValues } => {
        const objetoEncontrado = array.find(
          (item: comentariosValues) => item.clase == claseId && item.user == auth.id
        )
        return {
          encontrado: objetoEncontrado !== undefined,
          objeto: objetoEncontrado
        }
      }
      const resultado = verificarClaseId(archivos, claseId ?? '')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setVerificacion(resultado)
      setLoading(false)
    }
  }, [archivos, claseId])

  const descargarArchivo = async (nombre: string): Promise<void> => {
    const response = await axios.get(
      `${Global.url}/descargarRecurso/${nombre ?? ''}`,
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

  return (
    <>
      {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      verifiacion?.encontrado == false
        ? <>
          <h2 className="w-full text-3xl font-bold text-white uppercase text-center mb-6">
            ADJUNTAR CONTENIDO Y ARCHIVOS
          </h2>
          <div className="w-full bg-[#24385B] p-4 rounded-xl mb-6">
            <p className="w-full rounded-xl bg-primary border border-gray-400  text-gray-300 flex items-center gap-4 p-4">
              <textarea
                className="outline-none h-96 w-full resize-y"
                rows={10}
                placeholder="Adjuntar texto"
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value)
                }}
              ></textarea>
            </p>
            <div className="relative mt-6 flex gap-3 items-center">
              <div className="w-[350px] h-fit relative group">
                <input
                  type="file"
                  className="file:hidden w-full h-full absolute inset-0 outline-none opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files != null) {
                      const selectedFile = e.target.files[0]
                      setFile(selectedFile)
                    }
                  }}
                />
                <button className="px-4 bg-red-600 py-2 text-2xl group-hover:bg-red-700 transition-colors">
                  ADJUNTAR ARCHIVO
                </button>
              </div>
              {file && <p className="w-full line-clamp-1">{file.name}</p>}
            </div>
          </div>
          <button
            type="button"
            className="mt-6 px-4 bg-green-600 py-4 text-2xl transition-colors hover:bg-green-700"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              await enviarArchivo()
            }}
          >
            ENVIAR
          </button>
        </>
        : (
            !loading &&
        verifiacion?.objeto && (
          <div>
            <h2 className="w-full text-3xl font-bold text-white uppercase text-center mb-6">
              YA SE ENVIO TU RESPUESTA
            </h2>
            {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            verifiacion?.objeto.nota &&
            <h2 className="w-full text-3xl font-bold text-gray-300 uppercase text-center mb-6 underline">
              CALIFICACIÓN: <span className='font-bold text-4xl'>{
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
              verifiacion?.objeto.nota}</span>
            </h2>}
            <div className="w-full bg-[#24385B] p-4 rounded-xl mb-6">
              <p className="w-full rounded-xl bg-primary border border-gray-400  text-gray-300 flex items-center gap-4 p-4">
                <textarea
                  className="outline-none h-96 w-full resize-y"
                  rows={10}
                  placeholder="Adjuntar texto"
                  value={verifiacion?.objeto.texto}
                ></textarea>
              </p>

              <div
                className="relative mt-6 flex gap-3 items-center text-blue-600 cursor-pointer"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  await descargarArchivo(verifiacion?.objeto.respuestas)
                }}
              >
                {verifiacion?.objeto.respuestas && (
                  <p className="w-full line-clamp-1 text-2xl">
                    {verifiacion?.objeto.respuestas}
                  </p>
                )}
              </div>
            </div>
          </div>
            )
          )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog_comentarios"
      >
        <DialogContent>
          <section className="flex flex-col gap-10 w-[500px]">
            <h2 className="text-4xl font-bold text-black w-full text-center">
              Escribe tu aporte o comentario
            </h2>
            <div className="h-fit w-full flex items-end justify-center border border-t-gray-300 relative">
              <textarea
                placeholder="Escribir comentario"
                className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-2xl"
                disabled={loading}
                rows={1}
                value={texto}
                onChange={handleTextChange}
              ></textarea>
              {!loading
                ? (
                <IoIosSend
                  className="absolute bottom-2 right-5 z-10 text-5xl text-main rounded-full p-1 cursor-pointer"
                  onClick={() => {
                    agregarResumen()
                  }}
                />
                  )
                : (
                <IoIosSend className="absolute bottom-2 right-5 z-10 text-5xl text-main/60 rounded-full p-1 cursor-pointer" />
                  )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
