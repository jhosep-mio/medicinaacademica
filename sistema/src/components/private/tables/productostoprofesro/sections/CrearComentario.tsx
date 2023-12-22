import { useState, type Dispatch, type SetStateAction } from 'react'
import { Global } from '../../../../../helper/Global'
import useAuth from '../../../../../hooks/useAuth'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoIosSend } from 'react-icons/io'
import Swal from 'sweetalert2'
import { type comentariosValues } from '../../../../shared/Interfaces'
import axios from 'axios'
import { defaultperfil } from '../../../../shared/Images'

interface valuesProps {
  comentarios: comentariosValues[]
  claseId: string | undefined
  cursoId: string | undefined
  getComentarios: () => Promise<void>
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
}

export const CrearComentario = ({
  claseId,
  cursoId,
  getComentarios,
  setComentarios
}: valuesProps): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const handleClose = (): void => {
    setOpen(false)
  }
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
      const nuevoResumen = {
        id: Date.now(),
        texto,
        fecha: obtenerFecha(),
        foto: auth.foto,
        hora: obtenerHora(),
        clase: claseId,
        user: auth.name,
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

  return (
    <>
      <div className="w-full bg-[#24385B] p-4 rounded-xl mb-6">
        <p className="w-full h-24 rounded-xl bg-primary border border-gray-400 p-8 text-gray-300 flex items-center gap-4">
          <img
            src={
              auth.foto
                ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                : defaultperfil
            }
            alt=""
            className="w-12 h-12 object-contain rounded-full"
          />
          <span
            className="cursor-pointer"
            onClick={() => {
              setOpen(true)
            }}
          >
            Escribe tu aporte o pregunta
          </span>
        </p>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className='modal_index'
      >
        <DialogContent>
          <section className='flex flex-col gap-10 w-[500px]'>
            <h2 className='text-2xl font-bold text-black w-full text-center'>Escribe tu aporte o comentario</h2>
            <div className="h-fit w-full flex items-end justify-center border border-gray-400 relative">
              <textarea
                placeholder="Escribir comentario"
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
