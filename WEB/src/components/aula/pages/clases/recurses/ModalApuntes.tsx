import { type Dispatch, type SetStateAction, useState } from 'react'
import { RiEditLine } from 'react-icons/ri'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import { type apuntesValues } from '../../../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import useAuth from '../../../../../hooks/useAuth'
interface valuesProps {
  tiempo: string
  cursoId: string | undefined
  claseId: string | undefined
  setApuntes: Dispatch<SetStateAction<apuntesValues[]>>
  getApuntes: () => Promise<void>
  setOpen: Dispatch<SetStateAction<boolean>>
  setEstado: Dispatch<SetStateAction<number>>
}

export const ModalApuntes = ({ tiempo, cursoId, claseId, setApuntes, getApuntes, setOpen, setEstado }: valuesProps): JSX.Element => {
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('tokenUser')
  const { auth } = useAuth()

  const handleTextChange = (e: any): void => {
    setTexto(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  const agregarApunte = async (): Promise<void> => {
    if (texto) {
      setLoading(true)
      const nuevoResumen = {
        id: uuidv4(),
        tiempo,
        texto,
        claseId,
        cursoId
      }
      setApuntes(
        (resumenesPrevios: apuntesValues[] | undefined): apuntesValues[] => {
          const nuevosResumenes = [...(resumenesPrevios ?? []), nuevoResumen]
          const enviarDatos = async (): Promise<void> => {
            const data = new FormData()
            data.append('apuntes', JSON.stringify(nuevosResumenes))
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                `${Global.url}/saveApunte/${auth.id ?? ''}`,
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
                Swal.fire('Apunte guardado', '', 'success')
                setOpen(false)
                getApuntes()
                setTexto('')
                setEstado(1)
              } else {
                Swal.fire('Error al guardar', '', 'error')
              }
            } catch (error: unknown) {
              Swal.fire('Error al guardar', '', 'error')
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
    <section className="absolute inset-0 ">
      <div className="bg-[#121f3d] w-[95%] min-h-[200px] mx-auto mt-10 border-2 border-[#24385b] rounded-xl p-6 relative">
        <span className="absolute top-4 right-12 text-4xl text-secondary-70 cursor-pointer" onClick={() => { setOpen(false) }}>
          x
        </span>
        <div className="flex items-center gap-4 w-full">
          <RiEditLine className="bg-secondary-50 rounded-xl p-3 w-14 h-14 text-4xl" />
          <h2 className="text-4xl">Guardar tus apuntes de clase</h2>
        </div>
        <div className="w-full rounded-xl my-10">
          <div className="w-full rounded-xl bg-primary border border-secondary-70 p-8 text-2xl text-gray-300 flex items-center gap-4">
            <div className="cursor-pointer flex items-start w-full max-h-[200px] overflow-y-auto">
              <span className="text-secondary-70 font-bold w-fit py-4">
                {tiempo} -
              </span>
              <textarea
                placeholder="Escribir apunte"
                className="w-full flex-1 h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-2xl"
                disabled={loading}
                rows={3}
                value={texto}
                onChange={handleTextChange}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex gap-10 justify-end">
          <button className="text-[1.6rem] text-secondary-70 " onClick={() => { setOpen(false) }}>Cancelar</button>
          {!loading
            ? (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <button type='button' className="text-[1.6rem] bg-secondary-70 text-black px-5 py-3 rounded-xl" onClick={async () => { await agregarApunte() }}>
              Guardar
            </button>
              )
            : (
            <button type='button' className="text-[1.6rem] bg-secondary-70/60 text-black px-5 py-3 rounded-xl">
              Guardar
            </button>
              )}
        </div>
      </div>
    </section>
  )
}
