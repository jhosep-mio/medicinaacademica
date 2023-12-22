import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { type comentariosValues } from '../../../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import Swal from 'sweetalert2'
import Rating from '@mui/material/Rating'

interface valuesProps {
  openComentario: boolean
  setOpenComentario: Dispatch<SetStateAction<boolean>>
  cursoId: string | undefined
  getComentarios: () => Promise<void>
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
}

export const AgregarReseña = ({
  openComentario,
  setOpenComentario,
  cursoId,
  getComentarios,
  setComentarios
}: valuesProps): JSX.Element => {
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [nombres, setNombres] = useState('')
  const token = localStorage.getItem('token')
  const [value, setValue] = useState(5)
  const handleClose = (): void => {
    setOpenComentario(false)
  }

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
        foto: '',
        hora: obtenerHora(),
        clase: String(value),
        user: nombres,
        idUser: '',
        respuestas: ''
      }
      setComentarios(
        (resumenesPrevios: comentariosValues[]): comentariosValues[] => {
          const nuevosResumenes = [...resumenesPrevios, nuevoResumen]
          const enviarDatos = async (): Promise<void> => {
            const data = new FormData()
            data.append('comentariosfinales', JSON.stringify(nuevosResumenes))
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                `${Global.url}/saveComentariofinal2/${cursoId ?? ''}`,
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
                setNombres('')
                setOpenComentario(false)
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
    <Dialog
      open={openComentario}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_comentarios"
    >
      <DialogContent>
        <section className="w-[500px] ">
          <div className="bg-[#121f3d] w-full h-full mx-auto border-2 border-[#24385b] p-6 relative">
            <span
              className="absolute top-4 right-12 text-4xl text-secondary-70 cursor-pointer"
              onClick={() => {
                setOpenComentario(false)
              }}
            >
              x
            </span>
            <div className="flex items-center gap-4 w-full">
              <h2 className="text-4xl text-white">DEJA TU COMENTARIO</h2>
            </div>
            <div className="w-full rounded-xl my-10">
              <div className="w-full rounded-xl p-0 text-2xl text-gray-300  items-center gap-4 flex flex-col">
                <input type="text" className='w-full text-black text-xl px-4 py-3' placeholder='Nombre del estudiante '
                value={nombres} onChange={(e) => { setNombres(e.target.value) }}/>
                <div className="cursor-pointer flex items-start w-full max-h-[200px] overflow-y-auto">
                  <textarea
                    placeholder="Escribir comentario"
                    disabled={loading}
                    rows={1}
                    value={texto}
                    onChange={handleTextChange}
                    className="w-full flex-1 h-full pl-4 outline-none py-4 resize-none overflow-hidden text-xl text-black"
                  ></textarea>
                </div>
              </div>
              <div className="w-full flex justify-center font-zzz">
                <Rating
                  className="text-[10rem] mx-auto pt-6 text-center block"
                  value={value}
                  precision={0.5}
                  onChange={(_e, newValue: any) => {
                    setValue(newValue)
                  }}
                />
              </div>
            </div>
            <div className="flex gap-10 justify-end">
              <button
                className="text-[1.6rem] text-secondary-70 "
                onClick={() => {
                  setOpenComentario(false)
                }}
              >
                Cancelar
              </button>
              {!loading
                ? <button
                  type="button"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    await agregarResumen()
                  }}
                  className="text-[1.6rem] bg-secondary-70 text-black px-5 py-3 rounded-xl hover:bg-secondary-70/70 transition-colors"
                >
                  Guardar
                </button>
                : (
                <button
                  type="button"
                  className="text-[1.6rem] bg-secondary-70/70 text-black px-5 py-3 rounded-xl "
                >
                  Enviando...
                </button>
                  )}
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}
