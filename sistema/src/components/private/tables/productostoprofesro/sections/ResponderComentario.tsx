import { useState, type Dispatch, type SetStateAction } from 'react'
import { Global } from '../../../../../helper/Global'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoIosSend } from 'react-icons/io'
import Swal from 'sweetalert2'
import { type comentariosValues } from '../../../../shared/Interfaces'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'

interface valuesProps {
  comentarios: comentariosValues[]
  claseId: string | undefined
  cursoId: string | undefined
  getComentarios: () => Promise<void>
  open: boolean
  idComentario: string | undefined
  setIdComentario: Dispatch<SetStateAction<string | undefined>>
  setOpen: Dispatch<SetStateAction<boolean>>
  textoComentario: string | undefined
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
}

export const ResponderComentario = ({
  cursoId,
  getComentarios,
  open,
  setOpen,
  textoComentario,
  setComentarios,
  idComentario
}: valuesProps): JSX.Element => {
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const handleClose = (): void => {
    setOpen(false)
  }
  const { auth } = useAuth()
  const token = localStorage.getItem('tokenProfesor')

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
      setComentarios((resumenesPrevios) => {
        const nuevosResumenes = resumenesPrevios.map((resu) => {
          if (String(resu.id) == idComentario) {
            const nuevaRespuesta = {
              id: Date.now(),
              texto,
              fecha: obtenerFecha(),
              foto: auth.foto,
              hora: obtenerHora(),
              user: auth.name
            }
            // Asegurarse de que 'respuestas' sea un array
            const respuestasActualizadas = resu.respuestas
              ? [...resu.respuestas, nuevaRespuesta]
              : [nuevaRespuesta]
            return {
              ...resu,
              respuestas: respuestasActualizadas
            }
          }
          return resu
        })
        const enviarDatos = async (): Promise<void> => {
          const data = new FormData()
          data.append('comentarios', JSON.stringify(nuevosResumenes))
          data.append('_method', 'PUT')
          try {
            const respuesta = await axios.post(
              `${Global.url}/saveComentario2/${cursoId ?? ''}`,
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
              setTexto('')
              Swal.fire('Respuesta enviada', '', 'success')
              setOpen(false)
              getComentarios()
            } else {
              Swal.fire('Error al agregar respuesta', '', 'error')
            }
          } catch (error: unknown) {
            Swal.fire('Error al agregar respuesta', '', 'error')
          }
        }
        enviarDatos()
        return nuevosResumenes
      })
      setTexto('')
      setLoading(false)
    } else {
      Swal.fire('Ingrese su comentario', '', 'warning')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog_comentarios"
      >
        <DialogContent>
          <section className="flex flex-col gap-10 w-[500px]">
            <h2 className="text-2xl font-bold text-black w-full text-center">
              Escribe tu respuesta
            </h2>
            <div className="border-2 rounded-xl py-2 px-2">
              <p className="text-black text-xl break-words text-center line-clamp-6">
                {textoComentario}
              </p>
            </div>
            <div className="h-fit w-full flex items-end justify-center border border-gray-300 relative">
              <textarea
                placeholder="Respuesta..."
                className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-xl"
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
